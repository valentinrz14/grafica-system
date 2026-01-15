/**
 * Design System - Typography
 * Sistema tipográfico
 */

export const typography = {
  // Font families
  fontFamily: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },

  // Font sizes (rem/px)
  fontSize: {
    xs: {
      size: '0.75rem', // 12px
      lineHeight: '1rem', // 16px
    },
    sm: {
      size: '0.875rem', // 14px
      lineHeight: '1.25rem', // 20px
    },
    base: {
      size: '1rem', // 16px
      lineHeight: '1.5rem', // 24px
    },
    lg: {
      size: '1.125rem', // 18px
      lineHeight: '1.75rem', // 28px
    },
    xl: {
      size: '1.25rem', // 20px
      lineHeight: '1.75rem', // 28px
    },
    '2xl': {
      size: '1.5rem', // 24px
      lineHeight: '2rem', // 32px
    },
    '3xl': {
      size: '1.875rem', // 30px
      lineHeight: '2.25rem', // 36px
    },
    '4xl': {
      size: '2.25rem', // 36px
      lineHeight: '2.5rem', // 40px
    },
    '5xl': {
      size: '3rem', // 48px
      lineHeight: '1',
    },
  },

  // Font weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
} as const;

/**
 * Text styles - Estilos de texto predefinidos
 */
export const textStyles = {
  // Headings
  h1: {
    fontSize: typography.fontSize['5xl'].size,
    lineHeight: typography.fontSize['5xl'].lineHeight,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  h2: {
    fontSize: typography.fontSize['4xl'].size,
    lineHeight: typography.fontSize['4xl'].lineHeight,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  h3: {
    fontSize: typography.fontSize['3xl'].size,
    lineHeight: typography.fontSize['3xl'].lineHeight,
    fontWeight: typography.fontWeight.semibold,
  },
  h4: {
    fontSize: typography.fontSize['2xl'].size,
    lineHeight: typography.fontSize['2xl'].lineHeight,
    fontWeight: typography.fontWeight.semibold,
  },
  h5: {
    fontSize: typography.fontSize.xl.size,
    lineHeight: typography.fontSize.xl.lineHeight,
    fontWeight: typography.fontWeight.semibold,
  },
  h6: {
    fontSize: typography.fontSize.lg.size,
    lineHeight: typography.fontSize.lg.lineHeight,
    fontWeight: typography.fontWeight.semibold,
  },

  // Body text
  bodyLarge: {
    fontSize: typography.fontSize.lg.size,
    lineHeight: typography.fontSize.lg.lineHeight,
    fontWeight: typography.fontWeight.normal,
  },
  body: {
    fontSize: typography.fontSize.base.size,
    lineHeight: typography.fontSize.base.lineHeight,
    fontWeight: typography.fontWeight.normal,
  },
  bodySmall: {
    fontSize: typography.fontSize.sm.size,
    lineHeight: typography.fontSize.sm.lineHeight,
    fontWeight: typography.fontWeight.normal,
  },

  // Special
  caption: {
    fontSize: typography.fontSize.xs.size,
    lineHeight: typography.fontSize.xs.lineHeight,
    fontWeight: typography.fontWeight.normal,
  },
  overline: {
    fontSize: typography.fontSize.xs.size,
    lineHeight: typography.fontSize.xs.lineHeight,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontSize: typography.fontSize.sm.size,
    lineHeight: typography.fontSize.sm.lineHeight,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.wide,
  },
  code: {
    fontSize: typography.fontSize.sm.size,
    lineHeight: typography.fontSize.sm.lineHeight,
    fontFamily: typography.fontFamily.mono,
  },
} as const;

export type TextStyle = keyof typeof textStyles;
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
