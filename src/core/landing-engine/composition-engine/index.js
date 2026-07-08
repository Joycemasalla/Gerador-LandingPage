import { LandingBlueprintSchema } from '../schemas/landingBlueprint';

export class CompositionEngine {
  /**
   * Adiciona as decisões de composição visual ao esqueleto (Blueprint).
   * Decide grids, variantes e layouts (ex: Hero Split vs Centered) baseado na Visual Strategy.
   * 
   * @param {Object} partialBlueprint Objeto gerado pelo BlueprintEngine
   * @param {Object} visualStrategy Objeto gerado pelo VisualStrategyEngine
   * @returns {Object} Blueprint Completo validado pelo LandingBlueprintSchema
   */
  compose(partialBlueprint, visualStrategy) {
    // 1. Clonar blueprint parcial
    const blueprint = JSON.parse(JSON.stringify(partialBlueprint));
    
    // 2. Aplicar composição em cada seção
    blueprint.structure = blueprint.structure.map((section, index) => {
      // Exemplo de regra: O Hero assume a variante ditada pelo visualStrategy.heroStyle
      if (section.componentType === 'Hero') {
        section.variant = visualStrategy.heroStyle === 'Split 50/50' ? 'Split' : 'Centered';
        section.hasCta = true;
        section.requiredAssets = ['HeroMainMedia'];
      }
      
      // Exemplo: FeatureGrid com 3 colunas se for minimalista, 4 se for denso
      if (section.componentType === 'FeatureGrid') {
        section.layout = {
          gridColumns: visualStrategy.visualDensity === 'Dense' ? 4 : 3,
          alignment: 'Left'
        };
        section.itemsCount = 3; 
      }
      
      return section;
    });

    // 3. Validação Zod garante que o Blueprint final atende ao contrato
    return LandingBlueprintSchema.parse(blueprint);
  }
}
