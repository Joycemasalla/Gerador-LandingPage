import { ThemeTokensSchema } from '../schemas/themeTokens';

// Dicionários fixos e matemáticos
const PALETTES = {
  Light: {
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f1f5f9',
  },
  Dark: {
    background: '#0a0a0c',
    foreground: '#f8fafc',
    muted: '#1e293b',
  },
  Pastel: {
    background: '#fdfbf7',
    foreground: '#4338ca',
    muted: '#fef3c7',
  },
  Vibrant: {
    background: '#0f172a',
    foreground: '#ffffff',
    muted: '#334155',
  }
};

const FONTS_MAP = {
  'Corporativo': { display: 'Inter', body: 'Roboto' },
  'Moderno': { display: 'Space Grotesk', body: 'Plus Jakarta Sans' },
  'Ousado': { display: 'Oswald', body: 'Inter' },
  'Minimalista': { display: 'Playfair Display', body: 'Inter' },
  'Amigável': { display: 'Poppins', body: 'Quicksand' }
};

const RADIUS_MAP = {
  'Pill': { button: '9999px', card: '24px' },
  'Rounded': { button: '8px', card: '16px' },
  'Square': { button: '0px', card: '0px' }
};

const SHADOW_MAP = {
  'Flat': { card: 'none', dropdown: '0 4px 6px rgba(0,0,0,0.1)' },
  'Soft Shadows': { card: '0 4px 6px rgba(0,0,0,0.05)', dropdown: '0 10px 15px rgba(0,0,0,0.1)' },
  'Neumorphism': { card: '20px 20px 60px #d1d9e6, -20px -20px 60px #ffffff', dropdown: 'none' }, // Simplificado
  'Sharp Borders': { card: '4px 4px 0px #000000', dropdown: '8px 8px 0px #000000' }
};

export class ThemeEngine {
  /**
   * Converte a Estratégia Visual em tokens matemáticos (Design Tokens).
   * Totalmente determinístico. Zero IA.
   * 
   * @param {Object} visualStrategy Objeto validado pelo VisualStrategySchema
   * @param {Object} brandProfile Objeto validado pelo BrandProfileSchema
   * @returns {Object} Objeto validado pelo ThemeTokensSchema
   */
  generateTokens(visualStrategy, brandProfile) {
    const palette = PALETTES[visualStrategy.mood] || PALETTES.Light;
    const fonts = FONTS_MAP[visualStrategy.visualStyle] || FONTS_MAP.Moderno;
    const radius = RADIUS_MAP[visualStrategy.buttonStyle] || RADIUS_MAP.Rounded;
    const shadows = SHADOW_MAP[visualStrategy.componentStyle] || SHADOW_MAP['Soft Shadows'];

    // Lógica para primary color baseada no nicho / business type (mock simples, escalável depois)
    let primaryColor = '#3b82f6'; // Default blue
    if (visualStrategy.mood === 'Pastel') primaryColor = '#ff7a59'; // Coral
    if (brandProfile.sophisticationLevel === 'Luxo') primaryColor = '#c5a880'; // Dourado
    if (brandProfile.sophisticationLevel === 'Premium' && visualStrategy.mood === 'Dark') primaryColor = '#ffffff';

    const tokens = {
      colors: {
        background: palette.background,
        foreground: palette.foreground,
        primary: primaryColor,
        muted: palette.muted,
        feedback: { success: '#10b981', warning: '#f59e0b', danger: '#ef4444' }
      },
      typography: {
        displayFont: fonts.display,
        bodyFont: fonts.body,
        scaleRatio: visualStrategy.visualDensity === 'Airy' ? 1.333 : 1.25
      },
      spacing: { base: visualStrategy.visualDensity === 'Dense' ? 4 : 8 },
      borders: {
        radius: radius
      },
      shadows: shadows,
      animations: { 
        easing: visualStrategy.animationLevel === 'Dynamic' ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'cubic-bezier(0.4, 0, 0.2, 1)', 
        durationBase: visualStrategy.animationLevel === 'None' ? '0ms' : '200ms' 
      }
    };
    
    return ThemeTokensSchema.parse(tokens);
  }
}

