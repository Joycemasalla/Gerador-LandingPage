import { BrandAnalyzer } from './brand-analyzer';
import { VisualStrategyEngine } from './visual-strategy';
import { ThemeEngine } from './theme-engine';
import { BlueprintEngine } from './blueprint-engine';
import { CompositionEngine } from './composition-engine';
import { AiOrchestrator } from './ai-orchestrator';
import { ValidationEngine } from './validation-engine';

export class LandingEngine {
  constructor(apiClient, customApiKey = '') {
    // Inicializa todas as engines
    this.aiOrchestrator = new AiOrchestrator(apiClient, customApiKey);
    this.brandAnalyzer = new BrandAnalyzer();
    this.visualStrategy = new VisualStrategyEngine();
    this.themeEngine = new ThemeEngine();
    this.blueprintEngine = new BlueprintEngine();
    this.compositionEngine = new CompositionEngine();
    this.validationEngine = new ValidationEngine();
  }

  /**
   * Fluxo mestre de geração da Landing Page.
   * 
   * @param {string} userPrompt O pedido cru ou dados extraídos via scraping
   * @returns {Promise<Object>} Objeto final contendo Blueprint, Theme, Copy e Assets.
   */
  async generate(userPrompt) {
    try {
      console.log('[LandingEngine] 1. Analisando perfil da marca...');
      const brandProfile = await this.brandAnalyzer.analyze(userPrompt, this.aiOrchestrator);

      console.log('[LandingEngine] 2. Definindo estratégia visual...');
      const visualStrategy = await this.visualStrategy.generateStrategy(brandProfile, this.aiOrchestrator);

      console.log('[LandingEngine] 3. Gerando tokens de design...');
      const themeTokens = this.themeEngine.generateTokens(visualStrategy, brandProfile);

      console.log('[LandingEngine] 4. Montando o esqueleto (Blueprint)...');
      const partialBlueprint = this.blueprintEngine.generateStructure(brandProfile);

      console.log('[LandingEngine] 5. Aplicando composição visual ao Blueprint...');
      const finalBlueprint = this.compositionEngine.compose(partialBlueprint, visualStrategy);

      console.log('[LandingEngine] 6. Redigindo o Copy (IA foca apenas em texto)...');
      const copyModel = await this.aiOrchestrator.generateCopy(finalBlueprint, brandProfile);

      // Assumimos que as imagens scrapadas possam vir no context.
      const assetModel = { assets: [] }; 

      console.log('[LandingEngine] 7. Validando integridade...');
      const validationReport = this.validationEngine.validate(finalBlueprint, copyModel, themeTokens);

      if (!validationReport.isValid) {
        console.error('[LandingEngine] A validação falhou:', validationReport.errors);
        // Num cenário real, poderíamos acionar retry ou fallback
        throw new Error('Falha na validação do sistema.');
      }

      console.log('[LandingEngine] Página gerada com sucesso!');

      // O payload final que o frontend React vai consumir para renderizar:
      return {
        brandProfile,
        visualStrategy,
        themeTokens,
        blueprint: finalBlueprint,
        copy: copyModel,
        assets: assetModel,
        validation: validationReport
      };

    } catch (error) {
      console.error('[LandingEngine] Erro crítico no fluxo de geração:', error);
      throw error;
    }
  }
}
