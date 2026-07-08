import { z } from 'zod';

export const CopyModelSchema = z.object({
  seo: z.object({
    title: z.string(),
    metaDescription: z.string()
  }),
  global: z.object({
    primaryCtaText: z.string()
  }),
  sectionsData: z.record(z.string(), z.object({
    headline: z.string().optional(),
    subheadline: z.string().optional(),
    body: z.string().optional(),
    ctaText: z.string().optional(),
    items: z.array(z.object({
      title: z.string().optional(),
      description: z.string().optional()
    })).optional()
  }))
});
