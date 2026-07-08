import { z } from 'zod';

export const VisualStrategySchema = z.object({
  visualStyle: z.enum(['Corporativo', 'Moderno', 'Ousado', 'Minimalista', 'Amigável']),
  mood: z.enum(['Light', 'Dark', 'Pastel', 'Vibrant']),
  minimalismLevel: z.number().int().min(1).max(5),
  visualDensity: z.enum(['Airy', 'Balanced', 'Dense']),
  animationLevel: z.enum(['None', 'Micro-interactions', 'Smooth', 'Dynamic']),
  imageStyle: z.enum(['Real Photos', 'Illustrations 3D', 'Flat Illustrations', 'UI Mockups', 'Textures']),
  iconStyle: z.enum(['Outline', 'Filled', 'Duotone', 'Minimalist']),
  componentStyle: z.enum(['Flat', 'Soft Shadows', 'Neumorphism', 'Sharp Borders']),
  buttonStyle: z.enum(['Pill', 'Rounded', 'Square']),
  cardStyle: z.enum(['Bordered', 'Elevated', 'Flat with Background']),
  heroStyle: z.enum(['Split 50/50', 'Centered Fullscreen', 'Text Heavy', 'Visual Heavy'])
});
