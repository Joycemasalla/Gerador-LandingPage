import React from 'react';
import { StandardCTA } from '../layouts/CTALayouts/StandardCTA';

export function CTARenderer({ section, copyData, assets, metadata }) {
  return <StandardCTA data={copyData} metadata={metadata} />;
}
