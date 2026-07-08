import React from 'react';
import { BasicFAQ } from '../layouts/FAQLayouts/BasicFAQ';

export function FAQRenderer({ section, copyData, assets, metadata }) {
  return <BasicFAQ data={copyData} />;
}
