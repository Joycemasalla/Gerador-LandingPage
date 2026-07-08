import { z } from 'zod';

export const ValidationModelSchema = z.object({
  isValid: z.boolean(),
  checks: z.object({
    cro: z.boolean(),
    designSystem: z.boolean(),
    accessibility: z.boolean(),
    dataIntegrity: z.boolean()
  }),
  errors: z.array(z.object({
    code: z.string(),
    message: z.string(),
    layer: z.enum(['Blueprint', 'Theme', 'Copy', 'Asset'])
  })).default([])
});
