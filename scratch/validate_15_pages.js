import { BlueprintEngine } from '../src/core/landing-engine/blueprint-engine/index.js';
import { CompositionEngine } from '../src/core/landing-engine/composition-engine/index.js';

const blueprintEngine = new BlueprintEngine();
const compositionEngine = new CompositionEngine();

const nichos = [
  { nicho: "Fintech Startup", businessType: "SaaS", sophisticationLevel: "Premium", painPoints: ["x"], triggers: ["Lógica"] },
  { nicho: "Joalheria Fina", businessType: "E-commerce", sophisticationLevel: "Luxo", painPoints: ["y"], triggers: ["Autoridade"] },
  { nicho: "SaaS CRM para Clínicas", businessType: "SaaS", sophisticationLevel: "Padrão", painPoints: ["a"], triggers: ["Prova Social"] },
  { nicho: "Mentoria de Vendas High-Ticket", businessType: "InfoProduto", sophisticationLevel: "Luxo", painPoints: ["b"], triggers: ["Autoridade"] },
  { nicho: "App de Meditação", businessType: "B2C", sophisticationLevel: "Premium", painPoints: ["c"], triggers: [] },
  { nicho: "Consultoria B2B RH", businessType: "B2B", sophisticationLevel: "Padrão", painPoints: ["d"], triggers: ["Lógica"] },
  { nicho: "Contabilidade Online", businessType: "Serviço Produtizado", sophisticationLevel: "Padrão", painPoints: ["e"], triggers: ["Prova Social"] },
  { nicho: "SaaS de Gestão Escolar", businessType: "SaaS", sophisticationLevel: "Padrão", painPoints: ["f"], triggers: ["Lógica"] },
  { nicho: "Loja de Roupas Populares", businessType: "E-commerce", sophisticationLevel: "Popular", painPoints: ["g"], triggers: [] },
  { nicho: "Agência de Marketing Premium", businessType: "B2B", sophisticationLevel: "Luxo", painPoints: ["h"], triggers: ["Prova Social", "Autoridade"] },
  { nicho: "Plataforma de EAD", businessType: "SaaS", sophisticationLevel: "Padrão", painPoints: ["i"], triggers: ["Lógica"] },
  { nicho: "Serviço de Limpeza B2B", businessType: "B2B", sophisticationLevel: "Popular", painPoints: ["j"], triggers: ["Lógica"] },
  { nicho: "SaaS de Inteligência Artificial", businessType: "SaaS", sophisticationLevel: "Premium", painPoints: ["k"], triggers: ["Prova Social"] },
  { nicho: "Curso de Culinária Básica", businessType: "InfoProduto", sophisticationLevel: "Popular", painPoints: ["l"], triggers: [] },
  { nicho: "Design por Assinatura", businessType: "Serviço Produtizado", sophisticationLevel: "Premium", painPoints: ["m"], triggers: ["Autoridade"] }
];

const variantsCount = {};

function trackVariant(componentType, variant) {
  if (!variant) return;
  const key = `${componentType} > ${variant}`;
  variantsCount[key] = (variantsCount[key] || 0) + 1;
}

const report = [];

nichos.forEach(n => {
  const brandProfile = {
    businessType: n.businessType,
    sophisticationLevel: n.sophisticationLevel,
    targetAudience: { painPoints: n.painPoints, objections: ["obj"] },
    mentalTriggers: n.triggers,
    landingObjectives: ["Comprar"]
  };
  
  // Fake visual strategy (pois não interfere nas variants Premium do Blueprint agora)
  const visualStrategy = { heroStyle: "Centered", visualDensity: "Airy" };

  const partialBlueprint = blueprintEngine.generateStructure(brandProfile);
  const finalBlueprint = compositionEngine.compose(partialBlueprint, visualStrategy);
  
  const pageSections = { nicho: n.nicho };
  
  // Trackear componentes
  finalBlueprint.structure.forEach(s => {
    pageSections[s.componentType] = s.variant || "Fallback/None";
    trackVariant(s.componentType, s.variant);
  });
  
  report.push(pageSections);
});

console.log("=== RELATÓRIO DE 15 LANDING PAGES ===");
console.table(report);

console.log("\n=== CONTAGEM DE VARIANTES ===");
Object.keys(variantsCount).sort().forEach(k => {
  console.log(`${k}: ${variantsCount[k]}x`);
});

// Checar Premium Components vs Código
// Variantes que existem no diretório, segundo nossa análise anterior:
const allVariants = [
  "Hero > HeroCenteredGlow",
  "Hero > HeroSplitBrowserMockup",
  "Hero > HeroTypographicVideo",
  "Hero > CenteredHero",
  "FeatureGrid > FeatureBentoGrid",
  "FeatureGrid > FeatureHoverGlassCards",
  "Logos > LogosGridMuted",
  "Stats > StatsBigNumbersAnimated",
  "SocialProof > SocialMarqueeInfinite",
  "SocialProof > SocialGridAvatars",
  "Pricing > PricingTieredGlass",
  "FAQ > FAQMinimalAccordion",
  "CTABlock > CTABigDarkGlow"
];

console.log("\n=== VARIANTES NUNCA RENDERIZADAS (BUGS POTENCIAIS) ===");
allVariants.forEach(v => {
  if (!variantsCount[v]) {
    console.log(`[ZERO USOS] ${v}`);
  }
});

