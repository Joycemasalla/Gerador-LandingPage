import { CopyModelSchema } from '../schemas/copyModel';

export class AiOrchestrator {
  constructor(apiClient, customApiKey = '') {
    this.apiClient = apiClient;
    this.customApiKey = customApiKey;
  }

  /**
   * Método utilitário central para pedir JSON tipado à IA via Gemini.
   */
  async generateJson(systemPrompt, userContext, zodSchema, retries = 3) {
    const apiKey = this.customApiKey || import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("API KEY não configurada.");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const prompt = `${systemPrompt}\n\nCONTEXTO:\n${userContext}`;

    const body = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        responseMimeType: "application/json"
      },
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const errText = await res.text();
          if (res.status === 503) {
            throw new Error(`Gemini API 503: Model overloaded. Attempt ${attempt}`);
          }
          throw new Error(`Gemini API ${res.status}: ${errText}`);
        }
        
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
        if (!text) throw new Error("Resposta vazia da Gemini");

        return JSON.parse(text);
      } catch (err) {
        if (attempt === retries) throw err;
        let delayMs = attempt * 2000;
        if (err.message.includes("429")) {
          console.warn(`[AiOrchestrator] Limite de cota atingido (429). Aguardando 65 segundos antes de tentar novamente...`);
          delayMs = 65000;
        } else {
          console.warn(`[AiOrchestrator] Falha na tentativa ${attempt}. Retentando em ${delayMs/1000}s... Detalhes: ${err.message}`);
        }
        await new Promise(r => setTimeout(r, delayMs));
      }
    }
  }

  /**
   * Chama o LLM exclusivamente para preencher os textos da página (Copy),
   * bloqueando a IA de inventar seções novas, pois ela deve seguir o Blueprint.
   * 
   * @param {Object} blueprint Esqueleto logico completo (LandingBlueprintSchema)
   * @param {Object} brandProfile Contexto de Copy, Tom de Voz e Nicho
   * @returns {Promise<Object>} Objeto validado pelo CopyModelSchema
   */
  async generateCopy(blueprint, brandProfile) {
    const systemPrompt = `Você é um Copywriter Sênior especializado em Landing Pages de Alta Conversão.
Eu fornecerei a Estrutura Exata (Blueprint) que a página deve ter.
Você NÃO PODE alterar o número de seções, o número de cards ou a lógica.
Seu trabalho é exclusivamente preencher os textos (headlines, subheadlines, descrições) respeitando o tom de voz e os gatilhos mentais do perfil da marca.
Retorne um JSON seguindo EXATAMENTE este formato:
{
  "seo": { "title": "...", "metaDescription": "..." },
  "global": { "primaryCtaText": "..." },
  "sectionsData": {
    "id-da-secao-1": { "headline": "...", "subheadline": "...", "body": "...", "ctaText": "..." },
    "id-da-secao-2": { "headline": "...", "items": [ { "title": "...", "description": "..." } ] }
  }
}
ATENÇÃO: "sectionsData" DEVE OBRIGATORIAMENTE ser um dicionário (objeto) onde as chaves são os IDs exatos das seções enviadas no Blueprint.`;

    const context = JSON.stringify({ blueprint, brandProfile }, null, 2);
    
    const rawAiResponse = await this.generateJson(systemPrompt, context, CopyModelSchema);
    return CopyModelSchema.parse(rawAiResponse);
  }
}
