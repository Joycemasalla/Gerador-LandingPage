import { z } from 'zod';

export const AssetModelSchema = z.object({
  assets: z.array(z.object({
    assetId: z.string(),
    type: z.enum(['Image', 'Video', 'Icon', 'Illustration']),
    url: z.string().url(),
    altText: z.string(),
    aspectRatio: z.string().optional()
  }))
});
