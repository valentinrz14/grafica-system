# Estructura del Design System

## 📂 Árbol de Archivos Completo

```
design-system/
│
├── 📄 README.md                          # Documentación principal
├── 📄 STRUCTURE.md                       # Este archivo
├── 📄 index.ts                           # Exportaciones principales
│
├── 📁 foundations/                       # Tokens de Diseño
│   ├── colors.ts                        # Paleta de colores completa
│   │   ├── Primary (Blue): 50-900
│   │   ├── Secondary (Purple): 50-900
│   │   ├── Success (Green): 50-900
│   │   ├── Warning (Yellow): 50-900
│   │   ├── Error (Red): 50-900
│   │   ├── Neutral (Gray): 50-900
│   │   ├── Semantic Colors (text, background, border, status)
│   │   ├── Gradients
│   │   └── Shadows
│   │
│   ├── typography.ts                    # Sistema tipográfico
│   │   ├── Font Families (sans, mono)
│   │   ├── Font Sizes (xs → 5xl)
│   │   ├── Font Weights (thin → black)
│   │   ├── Letter Spacing
│   │   ├── Line Heights
│   │   └── Text Styles (h1-h6, body, caption, etc.)
│   │
│   ├── spacing.ts                       # Espaciado y dimensiones
│   │   ├── Spacing Scale (0 → 96)
│   │   ├── Common Spacing (component, layout, form)
│   │   ├── Border Radius (none → full)
│   │   └── Border Width (0 → 8)
│   │
│   ├── animations.ts                    # Animaciones y transiciones
│   │   ├── Easings (linear, easeIn, easeOut, bounce)
│   │   ├── Durations (fast, normal, slow)
│   │   ├── Transitions (colors, transform, fade)
│   │   ├── Keyframes (fadeIn, slideIn, scaleIn, spin, pulse)
│   │   ├── Hover Effects (lift, scale, glow)
│   │   └── Loading States (spinner, pulse, skeleton)
│   │
│   └── index.ts                         # Exporta todas las foundations
│
├── 📁 components/                        # Componentes UI
│   │
│   ├── 📁 Button/
│   │   └── Button.tsx                   # Componente Button
│   │       ├── Variants: primary, secondary, success, danger, warning, ghost, outline
│   │       ├── Sizes: sm, md, lg, xl
│   │       ├── States: loading, disabled
│   │       ├── Props: leftIcon, rightIcon, fullWidth
│   │       └── Fully typed with TypeScript
│   │
│   ├── 📁 Input/
│   │   └── Input.tsx                    # Componente Input
│   │       ├── Variants: default, error, success
│   │       ├── Sizes: sm, md, lg
│   │       ├── Props: label, error, helperText, leftIcon, rightIcon
│   │       └── Validación integrada
│   │
│   ├── 📁 Card/
│   │   └── Card.tsx                     # Componente Card y subcomponentes
│   │       ├── Variants: default, elevated, outlined, ghost
│   │       ├── Padding: none, sm, md, lg
│   │       ├── Props: hoverable
│   │       └── Subcomponents: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
│   │
│   ├── 📁 Badge/
│   │   └── Badge.tsx                    # Componente Badge
│   │       ├── Variants: default, primary, secondary, success, warning, error, info, outline
│   │       ├── Sizes: sm, md, lg
│   │       ├── Props: leftIcon, rightIcon, dot
│   │       └── Estados visuales con puntos de color
│   │
│   └── index.ts                         # Exporta todos los componentes
│
└── 📁 examples/                          # Ejemplos y showcase
    └── components-showcase.tsx          # Showcase interactivo completo
        ├── Paleta de colores visual
        ├── Todas las variantes de botones
        ├── Inputs con estados
        ├── Cards con diferentes estilos
        ├── Badges con iconos
        └── Escalas tipográficas
```

## 🎯 Archivo Principal

**`design-system/index.ts`**

```typescript
// Punto de entrada único para todo el design system
export * from './foundations/colors';
export * from './foundations/typography';
export * from './foundations/spacing';
export * from './foundations/animations';
export * from './components';
```

Esto permite importar todo desde un solo lugar:

```tsx
import {
  Button,
  Input,
  Card,
  Badge,
  colors,
  typography,
} from '@/design-system';
```

## 📊 Resumen de Contenido

### Foundations (Tokens de Diseño)

| Archivo         | Contenido            | Cantidad                                                    |
| --------------- | -------------------- | ----------------------------------------------------------- |
| `colors.ts`     | Paleta de colores    | 6 colores × 10 tonos = 60 colores + semánticos + gradientes |
| `typography.ts` | Escalas tipográficas | 8 tamaños + 9 pesos + estilos predefinidos                  |
| `spacing.ts`    | Sistema de espaciado | 42 valores de espaciado + border radius + widths            |
| `animations.ts` | Animaciones          | 6 easings + 6 duraciones + transiciones + 10 keyframes      |

### Components (Componentes UI)

| Componente | Variantes | Tamaños | Props Especiales                              |
| ---------- | --------- | ------- | --------------------------------------------- |
| **Button** | 7         | 4       | loading, leftIcon, rightIcon, fullWidth       |
| **Input**  | 3         | 3       | label, error, helperText, leftIcon, rightIcon |
| **Card**   | 4         | -       | hoverable, padding, + 5 subcomponentes        |
| **Badge**  | 8         | 3       | dot, leftIcon, rightIcon                      |

### Examples

| Archivo                   | Descripción                                           |
| ------------------------- | ----------------------------------------------------- |
| `components-showcase.tsx` | Showcase completo con todos los componentes en acción |

## 🚀 Cómo Usar

### 1. Importar Componentes

```tsx
// Opción 1: Importar desde el índice principal (recomendado)
import { Button, Input, Card, Badge } from '@/design-system';

// Opción 2: Importar componente específico
import { Button } from '@/design-system/components/Button';
```

### 2. Importar Design Tokens

```tsx
import { colors, typography, spacing, animations } from '@/design-system';

// Usar en componentes
const styles = {
  color: colors.primary[600],
  fontSize: typography.fontSize.lg.size,
  padding: spacing[4],
  transition: animations.transitions.colors,
};
```

### 3. Ver Ejemplos

Para ver todos los componentes en acción:

```bash
# Abrir el archivo de showcase
apps/frontend/design-system/examples/components-showcase.tsx
```

Este archivo incluye ejemplos interactivos de:

- ✅ Todas las variantes de colores
- ✅ Botones con estados y tamaños
- ✅ Inputs con validación
- ✅ Cards con diferentes estilos
- ✅ Badges con iconos y estados
- ✅ Escalas tipográficas completas

## 📝 Notas Importantes

### Type Safety

Todos los componentes están completamente tipados con TypeScript:

- Props con autocompletado
- Variantes type-safe
- Design tokens tipados

### Extensibilidad

Fácil de extender con nuevos componentes:

1. Crear carpeta en `components/`
2. Usar CVA para variantes
3. Exportar desde `components/index.ts`
4. Documentar en README

### Consistencia

Todos los componentes siguen los mismos patrones:

- Uso de `cva` para variantes
- Props `variant`, `size`, `className`
- Support para `forwardRef`
- Consistent naming conventions

### Accesibilidad

Los componentes incluyen:

- Labels semánticos
- ARIA attributes cuando necesario
- Focus states visibles
- Keyboard navigation support
