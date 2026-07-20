import { buildLovablePrompt } from '../utils/promptBuilder';

const GEMINI_MODEL = "gemini-3.5-flash";

const ANALYZE_PROMPT = `Você é um especialista em pesquisa de negócios locais, análise de concorrência e extração de perfis do Instagram com foco em CRO (Otimização de Conversão).
Sua missão é analisar TODAS as informações disponíveis sobre o perfil do Instagram fornecido abaixo (incluindo dados de scrape reais que você recebeu) e estruturá-las em um JSON rico e preciso de 10 blocos.

PERFIL DO INSTAGRAM:
- Handle/Link: "{{instagramHandle}}"

DADOS BRUTOS COLETADOS VIA SCRAPING PÚBLICO:
{{scrapedData}}

INSTRUÇÕES:
1. Baseie-se PRINCIPALMENTE nos dados scrapados acima; complemente com pesquisa web se necessário.
2. Extraia apenas dados reais e visíveis. NUNCA invente informações factuais (nomes, endereços, telefones, prêmios). Se não houver dado, use \`null\` ou \`[]\`.
3. Identifique cores predominantes visuais do feed se possível.
4. Extraia depoimentos reais de comentários/posts se encontrar.
5. Calcule \`dataConfidence\` (high|medium|low) por bloco.

RETORNE EXCLUSIVAMENTE ESTE JSON (sem markdown, sem tags):

ATENÇÃO CRÍTICA PARA A FORMATAÇÃO JSON:
- Você DEVE retornar APENAS o JSON válido.
- ESCAPE corretamente todas as aspas duplas internas dentro das strings usando \\" (exemplo: "Ele disse \\"olá\\"").
- ESCAPE todas as quebras de linha dentro das strings usando \\n (nunca use quebras de linha reais dentro do valor JSON).

{
  "identity": {
    "businessName": "string | null",
    "segment": "string | null",
    "segmentKeywords": ["string"],
    "bio": "string | null",
    "foundingStory": "string | null",
    "ownerName": "string | null",
    "neighborhood": "string | null",
    "city": "string | null",
    "state": "string | null",
    "address": "string | null",
    "yearsInBusiness": "number | null",
    "teamSize": "number | null",
    "certifications": ["string"],
    "awards": ["string"]
  },
  "targetAudience": {
    "idealClient": "string | null",
    "primaryPain": "string | null",
    "secondaryPains": ["string"],
    "mainObjection": "string | null",
    "desiredTransformation": "string | null"
  },
  "services": [
    { "name": "string", "description": "string | null", "targetResult": "string | null", "priceRange": "string | null", "duration": "string | null", "featured": "boolean" }
  ],
  "differentials": [ { "title": "string", "description": "string | null" } ],
  "process": { "steps": [ { "order": 1, "title": "string", "description": "string" } ] },
  "testimonials": [
    { "name": "string", "role": "string | null", "rating": "number (1-5)", "text": "string", "source": "Google | Instagram | WhatsApp | null", "isPlaceholder": "boolean" }
  ],
  "faq": [ { "question": "string", "answer": "string | null" } ],
  "contacts": {
    "whatsapp": "string | null",
    "instagram": "string | null",
    "email": "string | null",
    "website": "string | null",
    "googleMapsUrl": "string | null",
    "openingHours": "string | null",
    "paymentMethods": ["string"]
  },
  "branding": {
    "preferredColors": ["#hex"] ,
    "extractedColorsFromInstagram": ["#hex"] ,
    "logoUrl": "string | null",
    "existingBrandPersonality": "string | null",
    "preferredTone": "persuasivo | profissional | descontraido | emocional | null",
    "preferredDesignStyle": "minimalist | bold | elegant | friendly | null"
  },
  "aiContext": {
    "dataCompleteness": "high | medium | low",
    "missingCriticalData": ["string"],
    "dataConfidence": {
      "identity": "high | medium | low",
      "targetAudience": "high | medium | low",
      "services": "high | medium | low",
      "differentials": "high | medium | low",
      "testimonials": "high | medium | low",
      "faq": "high | medium | low"
    }
  }
}`;

/**
 * Gera o prompt de estratégia dinamicamente baseado no tipo de projeto.
 * - landing_page:     foco em CRO, conversão, neuromarketing, CTA único.
 * - site_institucional: foco em branding, posicionamento, história, equipe, conquistas.
 */
function buildGenerateStrategyPrompt(generationType = 'landing_page') {
  const isSite = generationType === 'site_institucional';

  const intro = isSite
    ? `Você é um Consultor Estratégico de Branding e Posicionamento Institucional Sênior.
Sua missão é analisar TODAS as informações fornecidas sobre a empresa e criar um briefing institucional extremamente completo para que possamos alimentar um construtor de Sites Institucionais Premium (nível Awwwards / Apple).`
    : `Você é um Consultor Estratégico de Conversão (CRO) Sênior e Copywriter Especialista.
Sua missão é analisar TODAS as informações fornecidas sobre um negócio local e criar um briefing estruturado extremamente completo para que possamos alimentar um construtor de Landing Pages.`;

  const auditTitle = isSite
    ? '# Auditoria de Branding e Posicionamento Institucional'
    : '# Auditoria Completa do Negócio';

  const auditHint = isSite
    ? '(analise identidade visual, posicionamento de marca, autoridade percebida, presença digital, diferenciais institucionais, pontos de melhoria na comunicação)'
    : '(escreva a auditoria em markdown aqui, detalhando posicionamento, clareza da oferta, instagram, etc)';

  const briefingTitle = isSite
    ? '# Briefing Institucional Premium'
    : '# Briefing Estratégico';

  const briefingHint = isSite
    ? '(escreva o briefing macro do site institucional: narrativa da marca, pilares de comunicação, arquitetura de conteúdo, direção criativa, elementos de storytelling)'
    : '(escreva o briefing macro da Landing Page em markdown aqui)';

  const jsonSchema = isSite
    ? `{
  "nome": "string",
  "nicho": "string",
  "localizacao": "string",
  "publico": "string",
  "objetivo": "string — posicionamento institucional e objetivo de comunicação da marca",
  "canal": "string — WhatsApp, e-mail, formulário de contato, telefone",
  "oferta": "string — principais serviços/soluções da empresa",
  "promessa": "string — headline institucional que comunica o posicionamento da marca",
  "historia": "string — história e fundação da empresa (storytelling institucional)",
  "missao": "string — missão da empresa",
  "visao": "string — visão da empresa",
  "valores": [ "string" ],
  "equipe": [ {"name": "string", "role": "string", "description": "string | null"} ],
  "conquistas": [ {"numero": "string", "label": "string"} ],
  "paginas": [ "string" ],
  "diferenciais": [ {"title": "...", "description": "..."} ],
  "servicos": [ {"title": "...", "description": "..."} ],
  "tom_marca": "string",
  "identidade_visual": "string — descrição detalhada da identidade visual desejada",
  "estilo_visual": "string — escolha entre: Minimalismo Luxo | Dark Premium | Moderno Tech | Editorial Clássico | Vibrante Contemporâneo",
  "atmosfera": "string",
  "fotografia": "string",
  "paleta": "string — paleta de cores com hex codes se disponível",
  "tipografia": "string — sugestão de par tipográfico editorial premium",
  "espacamento": "string",
  "componentes": "string",
  "objetivo_emocional": "string — emoção que o site deve despertar no visitante",
  "hero_layout": "string — escolha: 1. 'Fullscreen Vídeo Imersivo' | 2. 'Parallax Editorial' | 3. 'Split-Screen Institucional' | 4. 'Bento Grid Premium' | 5. 'Reveal Tipográfico'",
  "cta": "string — CTA principal do site (contato, proposta, agendamento)",
  "redes_sociais": "string",
  "provas_sociais": [ {"name": "...", "description": "..."} ],
  "beneficios": [ {"title": "...", "description": "..."} ],
  "faq": [ {"question": "...", "answer": "..."} ],
  "regras_nicho": "string"
}`
    : `{
  "nome": "string",
  "nicho": "string",
  "localizacao": "string",
  "publico": "string",
  "objetivo": "string",
  "canal": "string",
  "oferta": "string",
  "promessa": "string",
  "diferenciais": [ {"title": "...", "description": "..."} ],
  "servicos": [ {"title": "...", "description": "..."} ],
  "produtos": [ {"title": "...", "description": "..."} ],
  "tom_marca": "string",
  "identidade_visual": "string",
  "estilo_visual": "string",
  "atmosfera": "string",
  "fotografia": "string",
  "paleta": "string",
  "tipografia": "string",
  "espacamento": "string",
  "componentes": "string",
  "objetivo_emocional": "string",
  "hero_layout": "string (Escolha UMA variação exata e descreva: 1. 'Cinematic Background Imersivo' | 2. 'Editorial Apple Minimalista' | 3. 'Split-Screen de Alta Conversão' | 4. 'Social-Proof First' | 5. 'Bento Grid Moderno')",
  "cta": "string",
  "redes_sociais": "string",
  "provas_sociais": [ {"name": "...", "description": "..."} ],
  "objecoes": [ {"title": "...", "description": "..."} ],
  "beneficios": [ {"title": "...", "description": "..."} ],
  "faq": [ {"question": "...", "answer": "..."} ],
  "regras_nicho": "string"
}`;

  return `${intro}

INPUT (JSON Rico do Cliente):
{{clientDataJson}}

INSTRUÇÕES DE SAÍDA:
Você DEVE retornar a resposta EXATAMENTE no formato abaixo, separando as seções pelos marcadores exatos (===NOME===).
Use linguagem em Português do Brasil.
${isSite
  ? 'Seja detalhista, focado em posicionamento de marca, storytelling institucional, identidade visual e arquitetura de conteúdo.'
  : 'Seja detalhista, focado em neuromarketing, persuasão e conversão.'
}

RETORNE EXATAMENTE NESTA ESTRUTURA:

===AUDITORIA===
${auditTitle}
${auditHint}

===PROBLEMAS===
# Problemas e Oportunidades
(escreva os problemas críticos priorizados e oportunidades de melhoria em markdown aqui)

===BRIEFING===
${briefingTitle}
${briefingHint}

===JSON_ESTRATEGIA===
${jsonSchema}
`;
}

const SEGMENT_FALLBACK_IMAGES = {
  estetica: [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80",
  ],
  barbearia: [
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1593702295094-aea22597af65?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1503951458645-643d53efd90f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1532710093739-9470acff878f?auto=format&fit=crop&w=800&q=80",
  ],
  hamburgueria: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80",
  ],
  pet: [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80",
  ],
  clinica: [
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1504813184591-01552ff7c780?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
  ],
  geral: [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1542744173-8e0853c0374a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
  ],
};

function pickFallbackKey(seg) {
  const s = (seg || "").toLowerCase();
  if (/estetica|spa|beleza|maquiagem|unha|sobrancelha|salao|cabelo|hair/.test(s)) return "estetica";
  if (/barbearia|barber|barba/.test(s)) return "barbearia";
  if (/hamburguer|burger|doce|bolo|comida|restaurante|pizza|gastronomia|buffet/.test(s)) return "hamburgueria";
  if (/pet|dog|veterin|gato/.test(s)) return "pet";
  if (/medic|clinic|odonto|dentista|psicolog|terapia|fisio|saude/.test(s)) return "clinica";
  return "geral";
}

export function parseJsonFromAI(text) {
  if (typeof text === 'object' && text !== null) return text;
  const cleanText = text.replace(/<analise>[\s\S]*?<\/analise>/gi, "").trim();
  try { return JSON.parse(cleanText); } catch {}
  try {
    const cleaned = cleanText.replace(/^```json\s*/im, "").replace(/^```\s*/im, "").replace(/```\s*$/m, "").trim();
    return JSON.parse(cleaned);
  } catch {}
  try {
    const a = cleanText.indexOf("{");
    const b = cleanText.lastIndexOf("}");
    if (a !== -1 && b > a) return JSON.parse(cleanText.slice(a, b + 1));
  } catch {}
  throw new Error(`Não foi possível extrair JSON válido da IA.`);
}

export async function callGemini(apiKeyParam, prompt, opts = {}, retries = 3) {
  const p1 = import.meta.env.VITE_GEMINI_API_KEY_P1 || "";
  const p2 = import.meta.env.VITE_GEMINI_API_KEY_P2 || "";
  const apiKey = apiKeyParam || import.meta.env.VITE_GEMINI_API_KEY || (p1 && p2 ? p1 + p2 : undefined);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const isJsonResponse = opts.jsonMode === true;

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
      ...(isJsonResponse && { responseMimeType: "application/json" }),
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
    ]
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 503) {
          throw new Error(`Gemini API 503: Model overloaded. Attempt ${attempt}`);
        }
        throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('A API do Gemini retornou uma resposta vazia.');
      }

      const text = data.candidates[0].content.parts.map(p => p.text).join("");
      
      if (isJsonResponse) {
        try {
          return JSON.parse(text);
        } catch (e) {
          // Fallback parsing case
          try {
            return parseJsonFromAI(text);
          } catch(err2) {
            console.error("Falha ao fazer o parse do JSON da Gemini:", text);
            throw new Error("A IA não retornou um JSON válido.");
          }
        }
      }
      
      return text;
    } catch (err) {
      if (attempt === retries) throw err;
      let delayMs = attempt * 2000;
      if (err.message.includes("429")) {
        console.warn(`[callGemini] Limite de cota atingido (429). Aguardando 65 segundos antes de tentar novamente...`);
        delayMs = 65000;
      } else {
        console.warn(`[callGemini] Falha na tentativa ${attempt}. Retentando em ${delayMs/1000}s... Detalhes: ${err.message}`);
      }
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

export async function apifyScrapeProfile(username) {
  const token = import.meta.env.VITE_APIFY_API_TOKEN;
  if (!token) throw new Error("VITE_APIFY_API_TOKEN não configurada no .env");

  // Inicia o processo de extração (run)
  const runRes = await fetch(`https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernames: [username] })
  });
  
  if (!runRes.ok) throw new Error("Erro ao iniciar Apify Actor: " + await runRes.text());
  const runData = await runRes.json();
  const runId = runData.data.id;

  // Fica checando (polling) até o scraper terminar
  let status = "RUNNING";
  while (status !== "SUCCEEDED" && status !== "FAILED" && status !== "ABORTED" && status !== "TIMED-OUT") {
    await new Promise(r => setTimeout(r, 2000));
    const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
    const statusData = await statusRes.json();
    status = statusData.data.status;
  }

  if (status !== "SUCCEEDED") {
    throw new Error(`Apify falhou com status: ${status}`);
  }

  // Pega os resultados do dataset
  const itemsRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${token}`);
  const items = await itemsRes.json();

  if (!items || items.length === 0) {
      throw new Error("Perfil não encontrado ou vazio na Apify");
  }

  return items[0];
}

export function normalizeHandle(raw) {
  if (!raw) return "";
  const cleaned = raw.trim().replace(/https?:\/\/(www\.)?instagram\.com\//i, "").replace(/\/$/, "").replace(/^@/, "");
  return `@${cleaned}`;
}

/**
 * Analisa um perfil do Instagram via Apify + Gemini e retorna JSON rico.
 */
export async function analyzeInstagramProfile(instagramHandle, _customApiKey = '') {
    const p1 = import.meta.env.VITE_GEMINI_API_KEY_P1 || "";
    const p2 = import.meta.env.VITE_GEMINI_API_KEY_P2 || "";
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (p1 && p2 ? p1 + p2 : undefined);
    if (!apiKey) throw new Error("VITE_GEMINI_API_KEY não configurada. (Crie a variável no .env)");

    const handle = normalizeHandle(instagramHandle);
    const clean = handle.replace(/^@/, "");
    
    let scrapedText = "";
    let extractedImages = [];
    try {
      const apifyData = await apifyScrapeProfile(clean);
      
      scrapedText = `
        Nome: ${apifyData.fullName || ""}
        Bio: ${apifyData.biography || ""}
        Seguidores: ${apifyData.followersCount || 0}
        Site: ${apifyData.externalUrl || ""}
        Posts Recentes:
        ${(apifyData.latestPosts || []).slice(0, 15).map((p) => `- Legenda: ${p.caption || ""}`).join('\n')}
      `;
      
      const proxify = (url) => `https://wsrv.nl/?url=${encodeURIComponent(url)}`;
      
      if (apifyData.profilePicUrlHD) extractedImages.push(proxify(apifyData.profilePicUrlHD));
      const postImages = (apifyData.latestPosts || []).map((p) => p.displayUrl ? proxify(p.displayUrl) : null).filter(Boolean);
      extractedImages = [...extractedImages, ...postImages].slice(0, 10);
    } catch (e) {
      console.warn("Apify falhou:", e.message);
      scrapedText = "(Scraping público indisponível — use apenas conhecimento web sobre o perfil.)";
    }

    const prompt = ANALYZE_PROMPT
      .replace(/{{instagramHandle}}/g, handle)
      .replace("{{scrapedData}}", scrapedText || "(vazio)");

    const raw = await callGemini(apiKey, prompt, { jsonMode: true });
    const profile = parseJsonFromAI(raw);

    const segment = profile?.identity?.segment || "";
    if (extractedImages.length < 8) {
      const fallback = SEGMENT_FALLBACK_IMAGES[pickFallbackKey(segment)] || SEGMENT_FALLBACK_IMAGES.geral;
      extractedImages = [...extractedImages, ...fallback].slice(0, 10);
    }
    profile.instagramImages = extractedImages;

    return profile;
}

export async function fetchInstagramImagesOnly(instagramHandle, segment) {
    const handle = normalizeHandle(instagramHandle);
    const clean = handle.replace(/^@/, "");
    
    let extractedImages = [];
    try {
      const apifyData = await apifyScrapeProfile(clean);
      const proxify = (url) => `https://wsrv.nl/?url=${encodeURIComponent(url)}`;
      if (apifyData.profilePicUrlHD) extractedImages.push(proxify(apifyData.profilePicUrlHD));
      const postImages = (apifyData.latestPosts || []).map((p) => p.displayUrl ? proxify(p.displayUrl) : null).filter(Boolean);
      extractedImages = [...extractedImages, ...postImages].slice(0, 10);
    } catch (e) {
      console.warn("Apify falhou:", e.message);
    }

    if (extractedImages.length < 8) {
      const fallback = SEGMENT_FALLBACK_IMAGES[pickFallbackKey(segment)] || SEGMENT_FALLBACK_IMAGES.geral;
      extractedImages = [...extractedImages, ...fallback].slice(0, 10);
    }
    return extractedImages;
}

/**
 * Gera a estratégia completa via IA retornando os 4 documentos.
 * O tipo de projeto (landing_page | site_institucional) é lido de clientData.generationType.
 */
export async function generateStrategy(clientData, _customApiKey = '') {
    const p1 = import.meta.env.VITE_GEMINI_API_KEY_P1 || "";
    const p2 = import.meta.env.VITE_GEMINI_API_KEY_P2 || "";
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (p1 && p2 ? p1 + p2 : undefined);
    if (!apiKey) throw new Error("VITE_GEMINI_API_KEY não configurada. (Crie a variável no .env)");

    // Determinar tipo de projeto
    const generationType = clientData?.generationType || 'landing_page';

    // Construir prompt de estratégia de acordo com o tipo de projeto
    const strategyPromptTemplate = buildGenerateStrategyPrompt(generationType);
    const prompt = strategyPromptTemplate.replace("{{clientDataJson}}", JSON.stringify(clientData, null, 2));

    const raw = await callGemini(apiKey, prompt, { jsonMode: false });
    
    const extractSection = (text, startMarker, endMarker) => {
      const start = text.indexOf(startMarker);
      if (start === -1) return "";
      const contentStart = start + startMarker.length;
      let end = text.length;
      if (endMarker) {
        const nextMarker = text.indexOf(endMarker, contentStart);
        if (nextMarker !== -1) end = nextMarker;
      }
      return text.slice(contentStart, end).trim();
    };

    const audit = extractSection(raw, "===AUDITORIA===", "===PROBLEMAS===") || "Auditoria não gerada.";
    const problems = extractSection(raw, "===PROBLEMAS===", "===BRIEFING===") || "Problemas não gerados.";
    const briefing = extractSection(raw, "===BRIEFING===", "===JSON_ESTRATEGIA===") || "Briefing não gerado.";
    const jsonString = extractSection(raw, "===JSON_ESTRATEGIA===", null);
    
    let structuredStrategy = {};
    try {
      structuredStrategy = parseJsonFromAI(jsonString || raw);
    } catch (e) {
      console.warn("Falha ao fazer parse do JSON_ESTRATEGIA, usando fallback vazio", e);
    }

    const strategyData = {
      generationType,
      audit,
      problems,
      briefing,
      structuredStrategy
    };

    // Constrói o prompt usando o template correto (LP ou Site Institucional)
    if (strategyData && strategyData.structuredStrategy && Object.keys(strategyData.structuredStrategy).length > 0) {
      // Injeta as imagens extraídas para que o prompt builder as inclua no template
      if (clientData && clientData.instagramImages) {
        strategyData.structuredStrategy.imagens = clientData.instagramImages;
      }
      // Injetar CATEGORIA_ID a partir do clientData para que o promptBuilder possa buscar as seções da categoria
      if (clientData?.businessCategory && !strategyData.structuredStrategy.CATEGORIA_ID) {
        strategyData.structuredStrategy.CATEGORIA_ID = clientData.businessCategory;
      }
      strategyData.lovablePrompt = buildLovablePrompt(strategyData.structuredStrategy, generationType);
    } else {
      console.warn("A IA não retornou o objeto structuredStrategy esperado. Usando prompt genérico.");
      strategyData.lovablePrompt = buildLovablePrompt({}, generationType);
    }

    return strategyData;
}

export async function generateApproachMessages(prospectData, freelancerProfile, hasPrototype, _customApiKey = '') {
  const p1 = import.meta.env.VITE_GEMINI_API_KEY_P1 || "";
  const p2 = import.meta.env.VITE_GEMINI_API_KEY_P2 || "";
  const apiKey = _customApiKey || import.meta.env.VITE_GEMINI_API_KEY || (p1 && p2 ? p1 + p2 : undefined);
  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY não configurada. (Crie a variável no .env)");

  const prompt = `Você é um especialista em vendas de serviços digitais para pequenas empresas.

MEU PERFIL (freelancer):
- Nome: ${freelancerProfile.name || 'Especialista'}
- Serviço: ${freelancerProfile.service || 'Soluções Web'}
- Diferenciais: ${(freelancerProfile.differentials || []).join(', ')}
- Tom de voz: ${freelancerProfile.tone || 'Profissional'}
- Cases: ${freelancerProfile.cases || 'Nenhum informado'}

PROSPECT ANALISADO:
- Negócio: ${prospectData.profile.identity?.businessName || prospectData.profile.identity?.handle || 'Desconhecido'} (${prospectData.profile.identity?.segment || 'Geral'})
- Localização: ${prospectData.profile.identity?.city || 'Não informada'}
- Problemas encontrados: ${prospectData.analysis.problems.join(', ')}
- Estratégia: ${prospectData.analysis.strategy}
- Já tem protótipo pronto: ${hasPrototype ? 'Sim, mencionar que já desenhei algo para eles' : 'Não'}

TAREFA:
Gere 3 mensagens de abordagem via WhatsApp/DM para este prospect.
Cada mensagem deve mencionar um problema ESPECÍFICO encontrado no perfil.
Use o tom de voz do freelancer.
Seja direto, empático e focado no benefício para o cliente — não em "eu faço sites".

FORMATO DE SAÍDA — EXCLUSIVAMENTE JSON:
{
  "anguloDor": "mensagem focada no problema específico encontrado",
  "anguloResultado": "mensagem focada no que o cliente vai ganhar",
  "anguloCuriosidade": "mensagem curta que desperta interesse sem revelar tudo",
  "followUp": {
    "dia1": "mensagem de acompanhamento leve para enviar no dia seguinte",
    "dia3": "mensagem com ângulo diferente para enviar no terceiro dia",
    "dia7": "mensagem de encerramento provocando resposta para o sétimo dia"
  }
}`;

  const raw = await callGemini(apiKey, prompt, { jsonMode: true });
  return parseJsonFromAI(raw);
}

export async function generateObjectionResponse(clientMessage, freelancerProfile, _customApiKey = '') {
  const p1 = import.meta.env.VITE_GEMINI_API_KEY_P1 || "";
  const p2 = import.meta.env.VITE_GEMINI_API_KEY_P2 || "";
  const apiKey = _customApiKey || import.meta.env.VITE_GEMINI_API_KEY || (p1 && p2 ? p1 + p2 : undefined);
  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY não configurada. (Crie a variável no .env)");

  const prompt = `Você é um especialista em vendas B2B e tratamento de objeções.
Um cliente (prospect) respondeu à nossa abordagem de vendas de Landing Pages/Sites com a seguinte mensagem/objeção:

MENSAGEM DO CLIENTE:
"${clientMessage}"

MEU PERFIL (freelancer):
- Diferenciais: ${(freelancerProfile.differentials || []).join(', ')}
- Tom de voz: ${freelancerProfile.tone || 'Profissional'}

TAREFA:
Gere UMA resposta de WhatsApp curta, empática e persuasiva para lidar com essa objeção e manter a conversa viva.
Não pareça um robô. Pareça um parceiro de negócios estratégico.
Apenas retorne o texto da resposta. NÃO inclua aspas no começo ou no fim, retorne o texto limpo e direto ao ponto.`;

  const raw = await callGemini(apiKey, prompt, { jsonMode: false });
  return raw.replace(/^["']|["']$/g, '').trim();
}
