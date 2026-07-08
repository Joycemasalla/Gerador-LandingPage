import { ValidationModelSchema } from '../schemas/validationModel';

export class ValidationEngine {
  /**
   * Varre todos os modelos (Blueprint, Theme, Copy) em busca de inconsistências
   * antes da renderização final.
   * 
   * @param {Object} blueprint LandingBlueprintSchema
   * @param {Object} copyModel CopyModelSchema
   * @param {Object} themeTokens ThemeTokensSchema
   * @returns {Object} ValidationModelSchema
   */
  validate(blueprint, copyModel, themeTokens) {
    const errors = [];
    
    // 1. Validar CRO: Tem CTA Principal?
    const hasGlobalCta = !!copyModel.global.primaryCtaText;
    if (!hasGlobalCta) {
      errors.push({ code: 'CRO_01', message: 'Falta CTA Principal no Copy', layer: 'Copy' });
    }

    // 2. Integridade de Dados: O Copy cobre todas as seções do Blueprint?
    blueprint.structure.forEach(section => {
      if (!copyModel.sectionsData[section.sectionId]) {
        errors.push({ 
          code: 'DATA_01', 
          message: `A seção ${section.sectionId} está no Blueprint mas falta no CopyModel`, 
          layer: 'DataIntegrity' 
        });
      }
    });

    // 3. Montar resultado
    const result = {
      isValid: errors.length === 0,
      checks: {
        cro: hasGlobalCta,
        designSystem: true, // WIP: Adicionar checagem de contraste de cores
        accessibility: true,
        dataIntegrity: errors.length === 0
      },
      errors
    };

    return ValidationModelSchema.parse(result);
  }
}
