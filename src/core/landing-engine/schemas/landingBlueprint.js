import { z } from 'zod';

export const LandingBlueprintSchema = z.object({
  metadata: z.object({
    primaryCtaAction: z.string(),
    conversionPriorities: z.array(z.string())
  }),
  structure: z.array(z.object({
    sectionId: z.string(),
    componentType: z.enum(['Hero', 'FeatureGrid', 'SocialProof', 'FAQ', 'Pricing', 'CTABlock', 'About', 'StepList']),
    purpose: z.string(),
    variant: z.string().optional(),
    layout: z.object({
      gridColumns: z.number().int().optional(),
      alignment: z.enum(['Left', 'Center']).optional(),
      backgroundMode: z.enum(['Default', 'Muted', 'Primary']).optional()
    }).optional(),
    requiredAssets: z.array(z.string()).default([]),
    hasCta: z.boolean().default(false),
    itemsCount: z.number().int().optional()
  }))
});
