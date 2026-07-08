import { VisualStrategySchema } from '../schemas/visualStrategy';
import { VISUAL_STRATEGY_SYSTEM_PROMPT } from './prompt';

export class VisualStrategyEngine {
  /**
   * Decide a estratégia visual macro baseada no perfil da marca.
   * Pode ser resolvido por regras lógicas complexas ou, se necessário, por IA.
   * 
   * @param {Object} brandProfile Objeto gerado pelo BrandAnalyzer
   * @param {Object} aiOrchestrator Instância do orquestrador de IA
   * @returns {Promise<Object>} Objeto validado pelo VisualStrategySchema
   */
  async generateStrategy(brandProfile, aiOrchestrator) {
    // Convertemos o brandProfile em string para a IA ler
    const context = JSON.stringify(brandProfile, null, 2);
    
    // 2. Chamar IA com as restrições estritas dos Enums
    const rawAiResponse = await aiOrchestrator.generateJson(VISUAL_STRATEGY_SYSTEM_PROMPT, context, VisualStrategySchema);
    
    // 3. Validar
    return VisualStrategySchema.parse(rawAiResponse);
  }
}
