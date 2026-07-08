import React from 'react';
import { BasicSocialProof } from '../layouts/SocialProofLayouts/BasicSocialProof';

export function SocialProofRenderer({ section, copyData, assets, metadata }) {
  return <BasicSocialProof data={copyData} />;
}
