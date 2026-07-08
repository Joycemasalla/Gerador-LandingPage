import React from 'react';
import { SplitHero } from '../layouts/HeroLayouts/SplitHero';
import { CenteredHero } from '../layouts/HeroLayouts/CenteredHero';

export function HeroRenderer({ section, copyData, assets, metadata }) {
  // A variant seria injetada pela CompositionEngine.
  // Fazemos fallback para 'Split' se não existir.
  const variant = section.variant || 'Split';

  if (variant === 'Centered') {
    return <CenteredHero data={copyData} assets={assets} metadata={metadata} />;
  }

  // Fallback padrão
  return <SplitHero data={copyData} assets={assets} metadata={metadata} />;
}
