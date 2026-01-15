/**
 * Design System - Animations
 * Animaciones y transiciones del sistema
 */

/**
 * Timing functions - Funciones de temporización
 */
export const easings = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

/**
 * Duration values - Valores de duración
 */
export const durations = {
  instant: '0ms',
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
  slowest: '1000ms',
} as const;

/**
 * Transitions - Transiciones predefinidas
 */
export const transitions = {
  // Common transitions
  colors: `color ${durations.normal} ${easings.easeInOut}, background-color ${durations.normal} ${easings.easeInOut}, border-color ${durations.normal} ${easings.easeInOut}`,
  opacity: `opacity ${durations.normal} ${easings.easeInOut}`,
  transform: `transform ${durations.normal} ${easings.easeInOut}`,
  all: `all ${durations.normal} ${easings.easeInOut}`,

  // Specific transitions
  fade: `opacity ${durations.normal} ${easings.easeInOut}`,
  scale: `transform ${durations.normal} ${easings.easeOut}`,
  slide: `transform ${durations.normal} ${easings.easeOut}`,
  bounce: `transform ${durations.slow} ${easings.bounce}`,
} as const;

/**
 * Keyframe animations - Animaciones con keyframes
 */
export const keyframes = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  slideInRight: {
    from: { transform: 'translateX(100%)' },
    to: { transform: 'translateX(0)' },
  },
  slideInLeft: {
    from: { transform: 'translateX(-100%)' },
    to: { transform: 'translateX(0)' },
  },
  slideInUp: {
    from: { transform: 'translateY(100%)' },
    to: { transform: 'translateY(0)' },
  },
  slideInDown: {
    from: { transform: 'translateY(-100%)' },
    to: { transform: 'translateY(0)' },
  },
  scaleIn: {
    from: { transform: 'scale(0.9)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
  scaleOut: {
    from: { transform: 'scale(1)', opacity: 1 },
    to: { transform: 'scale(0.9)', opacity: 0 },
  },
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },
  bounce: {
    '0%, 100%': {
      transform: 'translateY(-25%)',
      animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
    },
    '50%': {
      transform: 'translateY(0)',
      animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
    },
  },
  ping: {
    '75%, 100%': {
      transform: 'scale(2)',
      opacity: 0,
    },
  },
} as const;

/**
 * Animation classes - Clases de animación para Tailwind
 */
export const animationClasses = {
  fadeIn: 'animate-fadeIn',
  slideIn: 'animate-slideIn',
  scaleIn: 'animate-scaleIn',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  ping: 'animate-ping',
} as const;

/**
 * Hover effects - Efectos de hover
 */
export const hoverEffects = {
  lift: {
    transform: 'translateY(-2px)',
    boxShadow:
      '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  scale: {
    transform: 'scale(1.05)',
  },
  glow: {
    boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
  },
} as const;

/**
 * Loading states - Estados de carga
 */
export const loadingStates = {
  spinner: {
    animation: `spin ${durations.slowest} ${easings.linear} infinite`,
  },
  pulse: {
    animation: `pulse ${durations.slower} ${easings.easeInOut} infinite`,
  },
  skeleton: {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  },
} as const;

export type Easing = keyof typeof easings;
export type Duration = keyof typeof durations;
export type Transition = keyof typeof transitions;
export type AnimationKeyframe = keyof typeof keyframes;
