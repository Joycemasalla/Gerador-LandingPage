import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rota de status/healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor Proxy da Landing Page está ativo.' });
});

// Rota principal de geração por IA
app.post('/api/generate', async (req, res) => {
  try {
    const { 
      businessName, 
      segment, 
      bio, 
      services, 
      benefits, 
      contacts, 
      colors, 
      tone 
    } = req.body;

    // Verificar chave de API
    // Aceita do arquivo .env ou opcionalmente do header x-api-key enviado pelo frontend
    const apiKey = process.env.GEMINI_API_KEY || req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ 
        error: 'Chave de API do Gemini não configurada.', 
        message: 'Por favor, configure a chave GEMINI_API_KEY no arquivo .env do servidor ou insira uma chave de API nas configurações do painel.' 
      });
    }

    console.log(`[Proxy] Iniciando geração para o negócio: "${businessName}" (Segmento: ${segment})`);

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Usando gemini-2.5-flash que é suportado na conta e excelente para JSON estruturado
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    // Construção do prompt detalhado
    const prompt = `
Você é um copywriter profissional e especialista em conversão (UX/CRO) de Landing Pages de alta performance.
Sua missão é criar o conteúdo completo de uma Landing Page ultra-persuasiva e moderna com base nos dados do perfil do Instagram de um negócio local ou profissional liberal fornecidos abaixo.

DADOS DO CLIENTE:
- Nome do Negócio: "${businessName}"
- Segmento de Atuação: "${segment}"
- Biografia do Instagram: "${bio}"
- Serviços/Produtos oferecidos: ${JSON.stringify(services)}
- Diferenciais/Benefícios: ${JSON.stringify(benefits)}
- Contatos: ${JSON.stringify(contacts)}
- Paleta de Cores sugerida/atual: ${JSON.stringify(colors)}
- Tom de Voz desejado: "${tone || 'profissional e persuasivo'}"

INSTRUÇÕES DE ESCRITA E COPYWRITING:
1. **Headline do Hero (Seção Inicial)**: Deve ser extremamente chamativa, focando no principal benefício ou na solução da maior dor do cliente.
2. **Subheadline do Hero**: Deve complementar a headline, explicando brevemente como o negócio entrega o prometido e gerando desejo imediato.
3. **Seção Sobre**: Reescreva a biografia fornecida em um texto fluido, profissional e emocionante de 2 parágrafos. Use a técnica de Storytelling ou foque na autoridade e foco no cliente.
4. **Seção de Serviços**: Para cada item da lista de serviços inserida pelo usuário, crie um título cativante, uma descrição curta e focada em resultados, e selecione um nome de ícone adequado do pacote 'react-icons/fa' (por exemplo: "FaCheck", "FaStar", "FaHandshake", "FaUserCheck", "FaHeart", "FaSparkles", "FaCog", "FaAward", "FaShieldAlt", "FaCrown", "FaGem", "FaClock", "FaMapMarkerAlt", "FaCalendarCheck").
5. **Seção de Diferenciais/Benefícios**: Crie títulos e descrições curtas para cada diferencial enviado pelo usuário ou sugira diferenciais fortes caso a lista esteja muito curta.
6. **Cores**: Se o usuário não enviou cores, sugira uma paleta de cores harmoniosa em HSL ou Hexadecimal que combine perfeitamente com o segmento do negócio. O objeto theme deve conter cores primária, secundária, de fundo escuro, fundo claro e cor de texto.
7. **CTA (Chamada para Ação)**: O botão principal de CTA deve direcionar para o WhatsApp do cliente com uma mensagem de abertura personalizada criada por você, adaptada ao segmento.

Você deve responder APENAS com um objeto JSON válido. Não inclua nenhuma marcação de markdown (como \`\`\`json ou \`\`\`) fora do JSON ou explicações em texto. A resposta deve seguir estritamente a seguinte estrutura JSON:

{
  "businessName": "Nome do negócio formatado e profissional",
  "tagline": "Frase de impacto curta do negócio",
  "theme": {
    "primaryColor": "Código HEX da cor primária (ex: #3B82F6)",
    "secondaryColor": "Código HEX da cor secundária (ex: #10B981)",
    "darkColor": "Código HEX para seções escuras (ex: #1F2937)",
    "lightColor": "Código HEX para fundo claro (ex: #F9FAFB)",
    "textColor": "Código HEX da cor principal do texto (ex: #374151)",
    "fontFamily": "Nome de fonte do Google Fonts sugerida (ex: 'Inter', 'Outfit', 'Montserrat')"
  },
  "hero": {
    "headline": "A headline ultra-persuasiva criada para o Hero",
    "subheadline": "A subheadline explicativa",
    "ctaText": "Texto de conversão para o botão (ex: 'Agendar Minha Consulta Grátis')"
  },
  "about": {
    "title": "Título para a seção Sobre (ex: 'Quem somos', 'Nossa História')",
    "paragraphs": [
      "Parágrafo 1 de copywriting focado em autoridade e conexão emocional",
      "Parágrafo 2 de copywriting explicando a transformação que o negócio gera"
    ]
  },
  "services": [
    {
      "title": "Título atrativo do Serviço 1",
      "description": "Breve descrição persuasiva focada nos benefícios deste serviço",
      "icon": "Nome do ícone da React Icons (ex: FaGem)"
    }
  ],
  "benefits": [
    {
      "title": "Título do Diferencial 1 (ex: Atendimento Personalizado)",
      "description": "Texto curto descrevendo o benefício real que o cliente ganha com isso"
    }
  ],
  "ctaSection": {
    "title": "Título final de fechamento (ex: Pronto para transformar o seu negócio?)",
    "subtitle": "Breve reforço final de urgência ou escassez",
    "buttonText": "Texto persuasivo de fechamento para o botão"
  },
  "whatsappMessage": "Mensagem de texto completa codificada para o WhatsApp (ex: Olá! Gostaria de agendar uma consulta sobre os serviços.)"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    console.log('[Proxy] IA respondeu com sucesso.');

    // Validar e parsear o JSON para garantir segurança
    let parsedJson;
    try {
      parsedJson = JSON.parse(textResponse);
    } catch (parseError) {
      console.error('[Proxy] Erro ao parsear JSON retornado da IA:', textResponse);
      const cleaned = textResponse
        .replace(/^```json\s*/i, '')
        .replace(/```\s*$/, '')
        .trim();
      parsedJson = JSON.parse(cleaned);
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
});
