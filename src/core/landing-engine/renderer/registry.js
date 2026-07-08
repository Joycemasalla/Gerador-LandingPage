import { HeroRenderer } from './renderers/HeroRenderer';
import { FeatureRenderer } from './renderers/FeatureRenderer';
import { FAQRenderer } from './renderers/FAQRenderer';
import { SocialProofRenderer } from './renderers/SocialProofRenderer';
import { CTARenderer } from './renderers/CTARenderer';

// Mapa que conecta a engine lógica com os componentes visuais.
// Evita switch cases gigantes. Adicionar um novo tipo de seção é só plugar aqui.
export const ComponentRegistry = {
  Hero: HeroRenderer,
  FeatureGrid: FeatureRenderer,
  FAQ: FAQRenderer,
  SocialProof: SocialProofRenderer,
  CTABlock: CTARenderer,
  // Caso venham outros do Blueprint como About, Pricing, etc, registramos aqui
  About: FeatureRenderer // Fallback temporário para About
};
