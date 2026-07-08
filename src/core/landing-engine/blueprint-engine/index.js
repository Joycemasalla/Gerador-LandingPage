import { LandingBlueprintSchema } from '../schemas/landingBlueprint';

export class BlueprintEngine {
  /**
   * Monta o esqueleto da Landing Page baseado nas objeções e arquétipo.
   * Regras lógicas definem QUAIS seções entram e EM QUAL ordem. (AIDA)
   * 
   * @param {Object} brandProfile Perfil do negócio
   * @returns {Object} Blueprint parcial
   */
  generateStructure(brandProfile) {
    const structure = [];
    
    // 1. Atenção (Hero sempre obrigatório)
    structure.push({
      sectionId: 'hero',
      componentType: 'Hero',
      purpose: 'Atenção imediata, Promessa Central e CTA principal.'
    });

    // 2. Interesse (Features/Diferenciais - Se existirem dores)
    if (brandProfile.targetAudience.painPoints && brandProfile.targetAudience.painPoints.length > 0) {
      structure.push({
        sectionId: 'features',
        componentType: 'FeatureGrid',
        purpose: 'Conectar dores do público com a solução da empresa.'
      });
    }

    // 3. Desejo / Confiança (Provas Sociais)
    if (brandProfile.mentalTriggers.includes('Prova Social') || brandProfile.mentalTriggers.includes('Autoridade')) {
      structure.push({
        sectionId: 'social-proof',
        componentType: 'SocialProof',
        purpose: 'Validar a promessa e construir confiança.'
      });
    }

    // Sobre/Autoridade extra se for Personal Brand ou Luxo
    if (brandProfile.businessType === 'Personal Brand' || brandProfile.sophisticationLevel === 'Luxo') {
      structure.push({
        sectionId: 'about',
        componentType: 'About',
        purpose: 'Gerar conexão pessoal ou reforçar autoridade exclusiva.'
      });
    }

    // 4. Quebra de Objeções Finas
    if (brandProfile.targetAudience.objections && brandProfile.targetAudience.objections.length > 0) {
      structure.push({
        sectionId: 'faq',
        componentType: 'FAQ',
        purpose: 'Remover as últimas barreiras racionais (objeções mapeadas).'
      });
    }

    // 5. Ação Final
    structure.push({
      sectionId: 'cta-final',
      componentType: 'CTABlock',
      purpose: 'Última janela de conversão forte (Ação).'
    });

    const primaryCtaAction = brandProfile.landingObjectives[0] || 'Ação Principal';

    return {
      metadata: {
        primaryCtaAction,
        conversionPriorities: brandProfile.mentalTriggers || []
      },
      structure
    };
  }
}

