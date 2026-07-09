import { chromium } from 'playwright';
import { default as AxeBuilder } from '@axe-core/playwright';
import fs from 'fs';
import { BlueprintEngine } from '../src/core/landing-engine/blueprint-engine/index.js';
import { CompositionEngine } from '../src/core/landing-engine/composition-engine/index.js';
import { ThemeEngine } from '../src/core/landing-engine/theme-engine/index.js';

const runTests = async () => {
  console.log("Iniciando geração de 50 perfis mockados...");
  
  const blueprintEngine = new BlueprintEngine();
  const compositionEngine = new CompositionEngine();
  const themeEngine = new ThemeEngine();

  const businessTypes = ['SaaS', 'E-commerce', 'InfoProduto', 'B2B', 'Serviço Produtizado', 'B2C', 'Startup', 'Local Business'];
  const sophisticationLevels = ['Popular', 'Padrão', 'Premium', 'Luxo'];
  
  const profiles = [];
  for (let i = 0; i < 50; i++) {
    profiles.push({
      nicho: `Nicho_${i}`,
      businessType: businessTypes[i % businessTypes.length],
      sophisticationLevel: sophisticationLevels[i % sophisticationLevels.length],
      targetAudience: { painPoints: ['x'], objections: ['y'] },
      mentalTriggers: ['Autoridade', 'Prova Social'],
      landingObjectives: ['Comprar']
    });
  }

  const results = [];
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  if (!fs.existsSync('artifacts/screenshots')) {
    fs.mkdirSync('artifacts/screenshots', { recursive: true });
  }

  for (let i = 0; i < profiles.length; i++) {
    const p = profiles[i];
    
    // 1. Gerar Arquitetura
    const brandProfile = p;
    const partialBlueprint = blueprintEngine.generateStructure(brandProfile);
    
    const visualStrategy = {
      heroStyle: i % 2 === 0 ? "Split 50/50" : "Centered",
      visualDensity: i % 3 === 0 ? "Dense" : "Airy"
    };

    const finalBlueprint = compositionEngine.compose(partialBlueprint, visualStrategy);
    const themeTokens = themeEngine.generateTokens(visualStrategy, brandProfile);

    // 2. Preencher mock do copy
    const sectionsData = {};
    finalBlueprint.structure.forEach(sec => {
      sectionsData[sec.sectionId] = {
        headline: `Headline genérica para ${sec.componentType} - ${p.businessType}`,
        subheadline: "Subheadline descritiva de duas linhas",
        ctaText: "Ação de Conversão",
        items: [
          { title: "Item 1", description: "Descrição do item", iconId: "zap" },
          { title: "Item 2", description: "Descrição do item", iconId: "shield" },
          { title: "Item 3", description: "Descrição do item", iconId: "target" },
          { title: "Item 4", description: "Descrição do item", iconId: "lock" }
        ],
        stats: [
          { value: "99%", label: "Conversão" },
          { value: "50+", label: "Features" }
        ],
        testimonials: [
          { quote: "Excelente", author: "João", role: "CEO" }
        ]
      };
    });

    const mockData = {
      brandProfile,
      visualStrategy,
      themeTokens,
      blueprint: finalBlueprint,
      copyModel: {
        seo: { title: "Mock", metaDescription: "Mock" },
        global: { primaryCtaText: "Mock Action" },
        sectionsData
      },
      assetModel: { assets: [] }
    };

    console.log(`Gerando tela para: Perfil ${i} - ${p.businessType} / ${p.sophisticationLevel}...`);

    await page.goto('http://localhost:5173/tests/runner.html');
    
    // Injetar dados
    await page.evaluate((data) => {
      window.renderLandingPage(data);
    }, mockData);

    // Esperar um pouco pelo load/mount
    await page.waitForTimeout(500);

    // Capturar Screenshot Full Page
    const screenshotPath = `artifacts/screenshots/lp_${i}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });

    // Axe-Core para métricas de acessibilidade
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // Extrair informações de dom / cro (quantas tags a)
    const metrics = await page.evaluate(() => {
      return {
        ctaCount: document.querySelectorAll('button, a').length,
        h1Count: document.querySelectorAll('h1').length
      };
    });

    // Guardar para o sumário
    results.push({
      id: i,
      businessType: p.businessType,
      sophisticationLevel: p.sophisticationLevel,
      screenshot: screenshotPath,
      axeViolations: accessibilityScanResults.violations.length,
      ctaCount: metrics.ctaCount,
      blueprint: finalBlueprint.structure.map(s => ({ type: s.componentType, variant: s.variant || 'Fallback' }))
    });
  }

  await browser.close();

  fs.writeFileSync('artifacts/results.json', JSON.stringify(results, null, 2));
  console.log("Validação E2E concluída. Resultados em artifacts/results.json");
};

runTests().catch(console.error);
