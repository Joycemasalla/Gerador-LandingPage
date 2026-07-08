import React from 'react';
import { GridFeatures } from '../layouts/FeatureLayouts/GridFeatures';

export function FeatureRenderer({ section, copyData, assets, metadata }) {
  // Poderíamos checar variants aqui (ex: 'List', 'Carousel')
  return <GridFeatures data={copyData} />;
}
