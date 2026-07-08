import React from 'react';
import BoldTemplate from './templates/BoldTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import FriendlyTemplate from './templates/FriendlyTemplate';

const TEMPLATES = {
  bold: BoldTemplate,
  minimalist: MinimalistTemplate,
  elegant: ElegantTemplate,
  friendly: FriendlyTemplate,
};

export default function DynamicTemplate({ data, images = [] }) {
  if (!data) return null;

  const themeName = data.theme?.themeName || 'minimalist';
  const TemplateComponent = TEMPLATES[themeName] || MinimalistTemplate;

  return <TemplateComponent data={data} images={images} />;
}
