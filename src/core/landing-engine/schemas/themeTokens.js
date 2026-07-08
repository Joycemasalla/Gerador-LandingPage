import { z } from 'zod';

export const ThemeTokensSchema = z.object({
  colors: z.object({
    background: z.string(),
    foreground: z.string(),
    primary: z.string(),
    muted: z.string(),
    feedback: z.object({
      success: z.string(),
      warning: z.string(),
      danger: z.string()
    })
  }),
  typography: z.object({
    displayFont: z.string(),
    bodyFont: z.string(),
    scaleRatio: z.number()
  }),
  spacing: z.object({
    base: z.number().default(8)
  }),
  borders: z.object({
    radius: z.object({
      button: z.string(),
      card: z.string()
    })
  }),
  shadows: z.object({
    card: z.string(),
    dropdown: z.string()
  }),
  animations: z.object({
    easing: z.string(),
    durationBase: z.string()
  })
});
