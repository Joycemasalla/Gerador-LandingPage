import { BlueprintEngine } from '../src/core/landing-engine/blueprint-engine/index.js';
import { CompositionEngine } from '../src/core/landing-engine/composition-engine/index.js';

console.log("=====================================");
console.log("  INICIANDO DEBUG DA PIPELINE REAL   ");
console.log("=====================================\n");

const blueprintEngine = new BlueprintEngine();
const compositionEngine = new CompositionEngine();

// MOCK: Perfil SaaS com algumas objeções, para ativar HeroSaaS e FeatureGridSaaS
const brandProfile = {
  businessType: 'SaaS',
  sophisticationLevel: 'Padrão',
  targetAudience: { painPoints: ['x', 'y'], objections: ['z'] },
  mentalTriggers: ['Prova Social'],
  landingObjectives: ['Comprar']
};

// MOCK: Estratégia Visual que manda Split 50/50 e Dense
const visualStrategy = {
  heroStyle: 'Split 50/50',
  visualDensity: 'Dense'
};

try {
  console.log("1. RODANDO: blueprintEngine.generateStructure(brandProfile)");
  const partialBlueprint = blueprintEngine.generateStructure(brandProfile);
  
  const heroBefore = partialBlueprint.structure.find(s => s.componentType === 'Hero');
  const featureBefore = partialBlueprint.structure.find(s => s.componentType === 'FeatureGrid');
  
  console.log("  => Variante Hero gerada:", heroBefore.variant);
  console.log("  => Variante Feature gerada:", featureBefore.variant);
  console.log("  => Blueprint tem layout config?", featureBefore.layout ? "SIM" : "NÃO");

  console.log("\n2. RODANDO: compositionEngine.compose(partialBlueprint, visualStrategy)");
  const finalBlueprint = compositionEngine.compose(partialBlueprint, visualStrategy);
  
  const heroAfter = finalBlueprint.structure.find(s => s.componentType === 'Hero');
  const featureAfter = finalBlueprint.structure.find(s => s.componentType === 'FeatureGrid');

  console.log("  => Variante Hero após Composition:", heroAfter.variant);
  console.log("  => O que aconteceu com a variante do Hero?", heroAfter.variant !== heroBefore.variant ? "SOBRESCRITA!" : "INTACTA.");
  
  console.log("  => Variante Feature após Composition:", featureAfter.variant);
  console.log("  => Novas props injetadas na Feature:", "layout=" + JSON.stringify(featureAfter.layout), "| itemsCount=" + featureAfter.itemsCount);
  
  console.log("  => Novas props injetadas no Hero:", "hasCta=" + heroAfter.hasCta, "| requiredAssets=" + JSON.stringify(heroAfter.requiredAssets));

} catch (e) {
  console.error("Erro no teste:", e);
}
