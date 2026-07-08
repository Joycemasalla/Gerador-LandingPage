import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper: Normaliza o handle do Instagram recebido
function normalizeHandle(raw) {
  if (!raw) return '';
  // Remove URL prefix se for um link completo
  const cleaned = raw
    .trim()
    .replace(/https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/\/$/, '')
    .replace(/^@/, '');
  return `@${cleaned}`;
}

// Helper: Extrai e limpa JSON da resposta da IA (robusto para respostas com texto extra)
function parseJsonFromAI(text) {
  // Remover a tag <analise>...</analise> se ela existir na resposta
  const cleanText = text.replace(/<analise>[\s\S]*?<\/analise>/gi, '').trim();

  // Tentativa 1: JSON puro
  try {
    return JSON.parse(cleanText);
  } catch { /* tenta próxima */ }

  // Tentativa 2: Remover blocos de markdown ```json ... ```
  try {
    const cleaned = cleanText
      .replace(/^```json\s*/im, '')
      .replace(/^```\s*/im, '')
      .replace(/```\s*$/m, '')
      .trim();
    return JSON.parse(cleaned);
  } catch { /* tenta próxima */ }

  // Tentativa 3: Extrair o maior bloco JSON do texto (quando a IA adiciona texto explicativo)
  try {
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleanText.slice(firstBrace, lastBrace + 1));
    }
  } catch { /* tenta próxima */ }

  // Tentativa 4: Mesma coisa mas com array
  try {
    const firstBracket = cleanText.indexOf('[');
    const lastBracket = cleanText.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      return JSON.parse(cleanText.slice(firstBracket, lastBracket + 1));
    }
  } catch { /* falhou tudo */ }

  throw new Error(`Não foi possível extrair JSON válido da resposta da IA. Início da resposta: ${text.slice(0, 200)}`);
}

// Helper: Calcula a razão de contraste entre duas cores hexadecimais (padrão WCAG)
function contrastRatio(hex1, hex2) {
  const luminance = (hex) => {
    // Normalizar cores de 3 dígitos se necessário (ex: #fff -> #ffffff)
    let cleaned = hex.replace('#', '');
    if (cleaned.length === 3) {
      cleaned = cleaned.split('').map(char => char + char).join('');
    }
    const rgb = parseInt(cleaned, 16);
    const [r, g, b] = [(rgb >> 16) & 255, (rgb >> 8) & 255, rgb & 255].map(c => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const l1 = luminance(hex1), l2 = luminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// Helper: Retorna a cor de texto ideal (clara ou escura) para um dado fundo
function textColorFor(bgHex) {
  const contrastWithWhite = contrastRatio(bgHex, '#ffffff');
  const contrastWithBlack = contrastRatio(bgHex, '#1a1a1a');
  return contrastWithWhite > contrastWithBlack ? '#f8fafc' : '#0f172a';
}

// Imagens premium de fallback por segmento caso a captura falhe
const SEGMENT_FALLBACK_IMAGES = {
  estetica: [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80'
  ],
  salao: [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80'
  ],
  barbearia: [
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593702295094-aea22597af65?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503951458645-643d53efd90f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532710093739-9470acff878f?auto=format&fit=crop&w=800&q=80'
  ],
  hamburgueria: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80'
  ],
  pet: [
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80'
  ],
  clinica: [
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504813184591-01552ff7c780?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80'
  ],
  advogado: [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505664194779-8bebcb95c539?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1423592707957-3b27c867215f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1521791136368-1a9b7d891365?auto=format&fit=crop&w=800&q=80'
  ],
  arquitetura: [
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
  ],
  geral: [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542744173-8e0853c0374a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80'
  ]
};

// Função para pesquisar e baixar imagens de um perfil do Instagram ou usar fallbacks
async function downloadInstagramImages(instagramHandle, segment, apiKey) {
  const handle = normalizeHandle(instagramHandle).replace('@', '');
  const seg = (segment || '').toLowerCase();
  
  // Escolher chave do fallback baseada no segmento
  let fallbackKey = 'geral';
  if (seg.includes('estetica') || seg.includes('spa') || seg.includes('beleza') || seg.includes('maquiagem') || seg.includes('unha') || seg.includes('sobrancelha')) {
    fallbackKey = 'estetica';
  } else if (seg.includes('salao') || seg.includes('cabelo') || seg.includes('hair')) {
    fallbackKey = 'salao';
  } else if (seg.includes('barbearia') || seg.includes('barber') || seg.includes('corte masculino') || seg.includes('barba')) {
    fallbackKey = 'barbearia';
  } else if (seg.includes('hamburguer') || seg.includes('burger') || seg.includes('doce') || seg.includes('bolo') || seg.includes('comida') || seg.includes('restaurante') || seg.includes('gastronomia') || seg.includes('pizza') || seg.includes('buffet')) {
    fallbackKey = 'hamburgueria';
  } else if (seg.includes('pet') || seg.includes('dog') || seg.includes('veterin') || seg.includes('banho e tosa') || seg.includes('gato')) {
    fallbackKey = 'pet';
  } else if (seg.includes('medico') || seg.includes('clinica') || seg.includes('odonto') || seg.includes('dentista') || seg.includes('psicolog') || seg.includes('terapia') || seg.includes('fisiotera') || seg.includes('saude')) {
    fallbackKey = 'clinica';
  } else if (seg.includes('advogad') || seg.includes('consultor') || seg.includes('direito') || seg.includes('juridic') || seg.includes('financa') || seg.includes('contabil')) {
    fallbackKey = 'advogado';
  } else if (seg.includes('arquitet') || seg.includes('decor') || seg.includes('design de interior') || seg.includes('constru')) {
    fallbackKey = 'arquitetura';
  }

  const fallbackUrls = SEGMENT_FALLBACK_IMAGES[fallbackKey] || SEGMENT_FALLBACK_IMAGES['geral'];

  if (!apiKey) {
    console.log(`[Proxy] Sem chave de API para busca de fotos do Instagram. Usando fallbacks: ${fallbackKey}`);
    return fallbackUrls;
  }

  try {
    let urlsFound = [];

  // Tentar primeiro obter raspando o imgsed.com para recuperar imagens reais do Instagram
  try {
    console.log(`[Proxy] Tentando obter imagens reais via scraping do Imgsed para: ${handle}...`);
    const scrapeUrl = `https://imgsed.com/${handle}/`;
    const resScrape = await fetch(scrapeUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(6000)
    });
    
    if (resScrape.status === 200) {
      const htmlScrape = await resScrape.text();
      const imgRegex = /<img[^>]+src="([^"]+)"/g;
      let match;
      while ((match = imgRegex.exec(htmlScrape)) !== null) {
        let imgUrl = match[1];
        imgUrl = imgUrl.replace(/&amp;/g, '&').replace(/&#38;/g, '&');
        
        if (imgUrl.includes('imginn.com') || imgUrl.includes('cdninstagram.com')) {
          if (imgUrl.includes('profile_pic') || imgUrl.includes('150x150') || imgUrl.includes('assets.imginn.com')) {
            continue;
          }
          if (!urlsFound.includes(imgUrl)) {
            urlsFound.push(imgUrl);
          }
        }
      }
      console.log(`[Proxy] Scraping do Imgsed obteve sucesso! Encontrou ${urlsFound.length} URLs de posts.`);
    } else {
      console.warn(`[Proxy] Imgsed retornou status ${resScrape.status}.`);
    }
  } catch (err) {
    console.warn('[Proxy] Scraping do Imgsed falhou:', err.message);
  }

  // Se o scraping direto falhou e temos chave de API, recorrer à IA
  if (urlsFound.length === 0 && apiKey) {
    try {
      console.log(`[Proxy] Recorrendo à busca de imagens via IA para: ${handle} (Segmento: ${fallbackKey})...`);
      const genAI = new GoogleGenerativeAI(apiKey);

      const searchPrompt = `Pesquise imagens públicas do perfil do Instagram "@${handle}" ou de indexadores públicos de fotos do Instagram (ex: Picnob, Dumpoir, Imginn, Greatphone, etc.) associados a este negócio.
Você deve retornar no máximo 6 URLs de fotos reais e funcionais que mostrem o trabalho do negócio, o local ou produtos.
Não invente URLs falsas. Se não achar URLs reais válidas e ativas que possam ser acessadas por um navegador, responda com um array vazio.
Importante: O retorno deve ser EXCLUSIVAMENTE um array JSON contendo strings das URLs, sem formatação markdown ou explicações.
Exemplo de formato: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"]`;

      let result;
      try {
        const model = genAI.getGenerativeModel({
          model: 'gemini-3.5-flash',
          tools: [{ googleSearch: {} }],
        });
        result = await model.generateContent(searchPrompt);
      } catch (e) {
        console.warn(`[Proxy] Falha ao usar googleSearch para fotos (Grounding desativado): ${e.message}. Tentando sem ferramentas...`);
        const model = genAI.getGenerativeModel({
          model: 'gemini-3.5-flash',
        });
        result = await model.generateContent(searchPrompt);
      }
      const response = await result.response;
      const textResponse = response.text();
      
      try {
        const parsedUrls = parseJsonFromAI(textResponse);
        if (Array.isArray(parsedUrls)) {
          urlsFound = parsedUrls.filter(url => url && typeof url === 'string' && url.startsWith('http'));
        }
      } catch (e) {
        console.warn('[Proxy] Erro ao fazer o parsing das URLs encontradas pela IA:', e.message);
      }
    } catch (err) {
      console.error('[Proxy] Erro na busca de imagens via IA:', err.message);
    }
  }

  console.log(`[Proxy] Total de URLs encontradas para download: ${urlsFound.length}`);

  // Se nenhuma URL foi encontrada por nenhum dos meios, usar fallbacks
  if (urlsFound.length === 0) {
    console.log(`[Proxy] Nenhuma URL encontrada. Usando fallbacks do segmento: ${fallbackKey}`);
    return fallbackUrls;
  }

  // Criar pasta de download se não existir
  const downloadDir = path.join(__dirname, 'public', 'downloaded_images');
  await fs.mkdir(downloadDir, { recursive: true });

  const downloadedPaths = [];
  
  // Limitar a no máximo 6 imagens para download
  const urlsToDownload = urlsFound.slice(0, 6);

  // Tentar baixar as imagens
  for (let i = 0; i < urlsToDownload.length; i++) {
    const url = urlsToDownload[i];
    if (!url || typeof url !== 'string' || !url.startsWith('http')) continue;

    try {
      console.log(`[Proxy] Baixando imagem [${i+1}/${urlsToDownload.length}]: ${url.substring(0, 50)}...`);
      const res = await fetch(url, { 
        signal: AbortSignal.timeout(5000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP status ${res.status}`);
      }
        
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.startsWith('image/')) {
          throw new Error(`Tipo de conteúdo inválido: ${contentType}`);
        }

        const extension = contentType.split('/')[1]?.split(';')[0] || 'jpg';
        const fileName = `insta_${handle.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}_${i}.${extension}`;
        const filePath = path.join(downloadDir, fileName);

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(filePath, buffer);

        // Caminho relativo que o frontend consegue ler da pasta public
        downloadedPaths.push(`/downloaded_images/${fileName}`);
        console.log(`[Proxy] Imagem salva com sucesso: /downloaded_images/${fileName}`);
      } catch (err) {
        console.warn(`[Proxy] Falha ao baixar a imagem ${url}:`, err.message);
      }
    }

    // Se conseguimos baixar pelo menos uma imagem, preenchemos o resto com fallback se necessário,
    // ou retornamos apenas as baixadas. Vamos preencher com fallbacks para garantir que sempre tenha pelo menos 4-6 imagens.
    if (downloadedPaths.length > 0) {
      if (downloadedPaths.length < 6) {
        const needed = 6 - downloadedPaths.length;
        const extraFallbacks = fallbackUrls.slice(0, needed);
        return [...downloadedPaths, ...extraFallbacks];
      }
      return downloadedPaths;
    }

    console.log(`[Proxy] Falha no download de todas as URLs. Usando fallbacks: ${fallbackKey}`);
    return fallbackUrls;

  } catch (error) {
    console.error('[Proxy] Erro geral na busca/download de imagens do Instagram:', error.message);
    return fallbackUrls;
  }
}


// Rota de status/healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor Proxy da Landing Page está ativo.' });
});

// ─────────────────────────────────────────────────────────────────────────────
// ROTA: Análise de Perfil do Instagram (Modo de Revisão)
// Extrai dados reais do perfil via Google Search Grounding
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/analyze-profile', async (req, res) => {
  try {
    const { instagramHandle } = req.body;

    if (!instagramHandle) {
      return res.status(400).json({
        error: 'Handle do Instagram não fornecido.',
        message: 'Por favor, forneça o campo instagramHandle.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({
        error: 'Chave de API do Gemini não configurada.',
        message: 'Configure a chave GEMINI_API_KEY no arquivo .env.'
      });
    }

    const handle = normalizeHandle(instagramHandle);
    console.log(`[Proxy] Analisando perfil Instagram: "${handle}"`);

    const genAI = new GoogleGenerativeAI(apiKey);

    // Ler prompt de análise
    const promptPath = path.join(__dirname, 'analyze_prompt.txt');
    const template = await fs.readFile(promptPath, 'utf-8');
    const prompt = template.replace(/{{instagramHandle}}/g, handle);

    let result;
    try {
      // Modelo com Google Search Grounding ativado para pesquisa real
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.5-flash',
        tools: [{ googleSearch: {} }],
      });
      result = await model.generateContent(prompt);
    } catch (e) {
      console.warn(`[Proxy] Falha ao usar googleSearch para análise de perfil (Grounding desativado): ${e.message}. Tentando sem ferramentas...`);
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.5-flash',
      });
      result = await model.generateContent(prompt);
    }
    const response = await result.response;
    const textResponse = response.text();

    const profileData = parseJsonFromAI(textResponse);
    
    // Buscar e baixar imagens do Instagram (reais ou fallbacks)
    const segment = profileData.segment || '';
    console.log(`[Proxy] Iniciando captura de imagens para o segmento: "${segment}"`);
    const instagramImages = await downloadInstagramImages(handle, segment, apiKey);
    profileData.instagramImages = instagramImages;

    res.json(profileData);

  } catch (error) {
    console.error('[Proxy] Erro na rota /api/analyze-profile:', error);

    // Mensagem amigável para erros de Grounding indisponível
    const isGroundingError = error.message?.includes('googleSearch') ||
      error.message?.includes('FEATURE_UNSUPPORTED') ||
      error.message?.includes('tool');

    if (isGroundingError) {
      return res.status(503).json({
        error: 'Google Search Grounding indisponível.',
        message: 'O recurso de pesquisa web não está disponível no seu plano atual da API Gemini. Tente preencher os dados manualmente ou use o Modo Instantâneo.'
      });
    }

    res.status(500).json({
      error: 'Erro ao analisar o perfil do Instagram.',
      message: error.message
    });
  }
});

// Rota de busca rápida de imagens do Instagram sob demanda
app.post('/api/fetch-instagram-images', async (req, res) => {
  const { instagramHandle, segment } = req.body;
  const apiKey = req.headers['x-api-key'] || process.env.GEMINI_API_KEY || '';

  if (!instagramHandle) {
    return res.status(400).json({ error: 'O handle do Instagram é obrigatório.' });
  }

  try {
    const handle = normalizeHandle(instagramHandle);
    console.log(`[Proxy] Buscando imagens sob demanda para: ${handle}`);
    const images = await downloadInstagramImages(handle, segment || '', apiKey);
    res.json({ images });
  } catch (error) {
    console.error('[Proxy] Erro ao buscar imagens do Instagram:', error);
    res.status(500).json({ error: 'Erro ao buscar imagens.', message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ROTA PRINCIPAL: Geração de Landing Page por IA
// Suporta tanto o formulário manual quanto o Modo Instantâneo (link do Instagram)
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/generate', async (req, res) => {
  try {
    const { clientData, images = [] } = req.body;

    if (!clientData) {
      return res.status(400).json({
        error: 'Dados do cliente não fornecidos.',
        message: 'Por favor, forneça o campo clientData no corpo da requisição.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({
        error: 'Chave de API do Gemini não configurada.',
        message: 'Por favor, configure a chave GEMINI_API_KEY no arquivo .env do servidor ou insira uma chave de API nas configurações do painel.'
      });
    }

    console.log(`[Proxy] Geração de landing page iniciada para: "${clientData.identity?.businessName || 'Sem nome'}"`);

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Geração do JSON da Landing Page
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    // Ler o prompt template do arquivo externo
    const promptPath = path.join(__dirname, 'prompt_template.txt');
    let template = await fs.readFile(promptPath, 'utf-8');

    // Substituir o placeholder {{clientDataJson}} pelo JSON rico completo
    const prompt = template.replace('{{clientDataJson}}', JSON.stringify(clientData, null, 2));

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    console.log('[Proxy] IA respondeu com sucesso.');

    const parsedJson = parseJsonFromAI(textResponse);

    // Salvaguarda: mesclar depoimentos manuais e forçar isPlaceholder: true nos gerados pela IA
    const inputTestimonials = clientData.testimonials || [];
    const manualTestimonials = inputTestimonials.filter(t => t && t.isPlaceholder === false);
    
    if (manualTestimonials.length > 0) {
      const aiTestimonials = (parsedJson.testimonials || []).map(t => {
        const isManual = manualTestimonials.some(mt => mt.name === t.name);
        return {
          ...t,
          isPlaceholder: !isManual
        };
      });
      const manualNames = new Set(manualTestimonials.map(mt => mt.name));
      const aiExtras = aiTestimonials.filter(t => !manualNames.has(t.name));
      parsedJson.testimonials = [...manualTestimonials, ...aiExtras].slice(0, 3);
    } else {
      if (parsedJson.testimonials) {
        parsedJson.testimonials = parsedJson.testimonials.map(t => ({
          ...t,
          isPlaceholder: true
        }));
      }
    }

    // Preservar segmento se ausente na resposta da IA
    if (clientData.identity?.segment && !parsedJson.segment) {
      parsedJson.segment = clientData.identity.segment;
    }

    // Rede de Segurança: Forçar themeName correto e alinhado ao segmento do negócio
    if (parsedJson.theme) {
      const theme = parsedJson.theme;
      const seg = (clientData.identity?.segment || parsedJson.segment || '').toLowerCase();

      if (seg.includes('barbearia') || seg.includes('barber') || seg.includes('hamburguer') || seg.includes('burger') || seg.includes('tatuag') || seg.includes('tattoo')) {
        theme.themeName = 'bold';
      } else if (seg.includes('estetica') || seg.includes('spa') || seg.includes('odontolog') || seg.includes('luxo') || seg.includes('clinica vip') || seg.includes('joias')) {
        theme.themeName = 'elegant';
      } else if (seg.includes('pet') || seg.includes('dog') || seg.includes('veterin') || seg.includes('doceria') || seg.includes('bolo') || seg.includes('escola') || seg.includes('infantil')) {
        theme.themeName = 'friendly';
      } else if (seg.includes('medico') || seg.includes('advogad') || seg.includes('consultor') || seg.includes('arquitet') || seg.includes('psicolog')) {
        theme.themeName = 'minimalist';
      }

      // Se a IA esqueceu ou errou as cores do Bold, forçar uma paleta escura brutalista
      if (theme.themeName === 'bold') {
        theme.darkColor = theme.darkColor || '#0a0a0c';
        theme.lightColor = theme.lightColor || '#111827';
        theme.textColor = theme.textColor || '#f3f4f6';
        theme.textColorOnDark = theme.textColorOnDark || '#f3f4f6';
      }

      const lightBg = theme.lightColor || '#F9FAFB';
      const darkBg = theme.darkColor || '#1F2937';

      // 1. Validar contraste no tema claro
      const currentTextColor = theme.textColor || '#334155';
      if (contrastRatio(currentTextColor, lightBg) < 4.5) {
        theme.textColor = textColorFor(lightBg);
      }

      // 2. Validar contraste no tema escuro
      const currentTextColorOnDark = theme.textColorOnDark || '#cbd5e1';
      if (contrastRatio(currentTextColorOnDark, darkBg) < 4.5) {
        theme.textColorOnDark = textColorFor(darkBg);
      }
    }

    // Injeção/download de imagens do Instagram caso não tenham sido passadas
    if (!images || images.length === 0) {
      const handleToUse = clientData.contacts?.instagram || clientData.identity?.businessName;
      if (handleToUse) {
        const seg = clientData.identity?.segment || parsedJson.segment || '';
        console.log(`[Proxy] Sem imagens enviadas. Buscando automaticamente para: ${handleToUse}`);
        const instagramImages = await downloadInstagramImages(handleToUse, seg, apiKey);
        parsedJson.images = instagramImages;
      }
    } else {
      parsedJson.images = images;
    }

    res.json(parsedJson);

  } catch (error) {
    console.error('[Proxy] Erro na rota /api/generate:', error);
    res.status(500).json({
      error: 'Erro interno ao gerar landing page.',
      message: error.message
    });
  }
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`[Server] Servidor rodando na porta ${PORT}`);
  console.log(`[Server] Proxy API ativo em http://localhost:${PORT}/api/generate`);
  console.log(`[Server] Análise de perfil ativa em http://localhost:${PORT}/api/analyze-profile`);
});
