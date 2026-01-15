/**
 * Design System - Gráfica System
 *
 * Sistema de diseño completo con componentes reutilizables,
 * tokens de diseño (colores, tipografía, espaciado) y
 * utilidades para construir interfaces consistentes.
 *
 * @example
 * ```tsx
 * import { Button, Card, colors } from '@/design-system';
 *
 * function MyComponent() {
 *   return (
 *     <Card>
 *       <Button variant="primary">Click me</Button>
 *     </Card>
 *   );
 * }
 * ```
 */

// Foundations (Design Tokens)
export * from './foundations/colors';
export * from './foundations/typography';
export * from './foundations/spacing';
export * from './foundations/animations';

// Components
export * from './components';
