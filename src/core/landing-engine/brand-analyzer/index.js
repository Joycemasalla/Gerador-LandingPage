import { BrandProfileSchema } from '../schemas/brandProfile';
import { BRAND_ANALYZER_SYSTEM_PROMPT } from './prompt';

export class BrandAnalyzer {
  /**
   * Analisa os dados crus do usuário e devolve o Perfil da Marca (Brand Profile).
   * Esta etapa depende de processamento de IA (LLM).
   * 
   * @param {string} userPrompt O texto cru ou respostas do formulário fornecidas pelo usuário
   * @param {Object} aiOrchestrator Instância do orquestrador de IA que faz a ponte com o Gemini/OpenAI
   * @returns {Promise<Object>} Objeto validado pelo BrandProfileSchema
   */
  async analyze(userPrompt, aiOrchestrator) {
    // 2. Chamar a IA solicitando JSON baseado no schema e com o prompt enriquecido
    const rawAiResponse = await aiOrchestrator.generateJson(BRAND_ANALYZER_SYSTEM_PROMPT, userPrompt, BrandProfileSchema);
    
    // 3. Validar estritamente o retorno
    const validatedProfile = BrandProfileSchema.parse(rawAiResponse);
    return validatedProfile;
  }
}
