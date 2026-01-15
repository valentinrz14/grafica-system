/**
 * Design System - Color Palette
 * Paleta de colores del sistema basada en Tailwind CSS
 */

export const colors = {
  // Primary - Blue (Azul para acciones principales)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main blue
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Secondary - Purple (Púrpura para promociones y destacados)
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Main purple
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Success - Green (Verde para éxito)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main green
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Warning - Yellow (Amarillo para advertencias)
  warning: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308', // Main yellow
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },

  // Error - Red (Rojo para errores)
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main red
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Neutral - Gray (Gris para texto, fondos, bordes)
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // White & Black
  white: '#ffffff',
  black: '#000000',
} as const;

/**
 * Semantic colors - Colores semánticos para uso específico
 */
export const semanticColors = {
  // Text colors
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    tertiary: colors.neutral[500],
    inverse: colors.white,
    disabled: colors.neutral[400],
  },

  // Background colors
  background: {
    primary: colors.white,
    secondary: colors.neutral[50],
    tertiary: colors.neutral[100],
    disabled: colors.neutral[100],
  },

  // Border colors
  border: {
    default: colors.neutral[300],
    light: colors.neutral[200],
    dark: colors.neutral[400],
    focus: colors.primary[500],
    error: colors.error[500],
  },

  // Status colors
  status: {
    info: colors.primary[500],
    success: colors.success[500],
    warning: colors.warning[500],
    error: colors.error[500],
  },

  // Interactive elements
  interactive: {
    primary: colors.primary[600],
    primaryHover: colors.primary[700],
    primaryActive: colors.primary[800],
    secondary: colors.neutral[600],
    secondaryHover: colors.neutral[700],
    secondaryActive: colors.neutral[800],
  },
} as const;

/**
 * Gradient combinations - Combinaciones de degradados
 */
export const gradients = {
  primary: 'from-blue-500 to-blue-600',
  secondary: 'from-purple-500 to-purple-600',
  success: 'from-green-500 to-green-600',
  sunset: 'from-orange-500 to-pink-500',
  ocean: 'from-blue-500 to-teal-500',
  purple: 'from-purple-600 to-pink-600',
} as const;

/**
 * Shadow colors - Colores de sombras
 */
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;

export type ColorScale = keyof typeof colors.primary;
export type ColorName = keyof typeof colors;
export type SemanticColorCategory = keyof typeof semanticColors;
