# Design System - Gráfica System

Sistema de diseño completo para la aplicación Gráfica System.

## 📁 Estructura

```
design-system/
├── foundations/          # Fundamentos del diseño
│   ├── colors.ts        # Paleta de colores
│   ├── typography.ts    # Fuentes y escalas tipográficas
│   ├── spacing.ts       # Sistema de espaciado
│   └── animations.ts    # Animaciones y transiciones
├── components/          # Componentes base
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   ├── Badge/
│   └── ...
├── patterns/            # Patrones de diseño
│   └── ...
└── README.md           # Este archivo
```

## 🎨 Fundamentos

### Colores

La paleta de colores está definida en `foundations/colors.ts` y sigue el sistema de Tailwind CSS.

**Colores Principales:**

- **Primary (Blue)**: Acciones principales, enlaces
- **Secondary (Purple)**: Promociones, destacados
- **Success (Green)**: Estados exitosos, confirmaciones
- **Warning (Yellow)**: Advertencias, alertas
- **Error (Red)**: Errores, estados fallidos
- **Neutral (Gray)**: Texto, fondos, bordes

### Tipografía

**Fuente Sistema:**

- system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif

**Escalas:**

- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875rem (14px)
- `text-base`: 1rem (16px)
- `text-lg`: 1.125rem (18px)
- `text-xl`: 1.25rem (20px)
- `text-2xl`: 1.5rem (24px)
- `text-3xl`: 1.875rem (30px)

### Espaciado

Basado en el sistema de Tailwind (múltiplos de 0.25rem):

- `1`: 0.25rem (4px)
- `2`: 0.5rem (8px)
- `3`: 0.75rem (12px)
- `4`: 1rem (16px)
- `6`: 1.5rem (24px)
- `8`: 2rem (32px)
- `12`: 3rem (48px)

### Animaciones

**Transiciones:**

- `transition-colors`: Cambios de color
- `transition-all`: Cambios generales
- `transition-transform`: Transformaciones

**Duraciones:**

- Rápida: 150ms
- Normal: 200ms
- Lenta: 300ms

## 🧩 Componentes Base

### Button

Botón reutilizable con variantes y tamaños.

**Variantes:**

- `primary`: Azul, para acciones principales
- `secondary`: Gris, para acciones secundarias
- `danger`: Rojo, para acciones destructivas
- `ghost`: Transparente, para acciones sutiles

**Tamaños:**

- `sm`: Pequeño
- `md`: Mediano (default)
- `lg`: Grande

### Input

Campo de entrada con estados y validación.

### Card

Contenedor con sombra y padding para agrupar contenido.

### Badge

Etiqueta pequeña para estados, categorías, etc.

## 🎯 Patrones de Uso

### Formularios

Los formularios deben usar el componente `Input` con labels apropiadas y mensajes de error.

### Botones

Los botones primarios deben usarse para la acción principal de cada pantalla.
Los botones secundarios para acciones alternativas.

### Feedback

Usar `Toast` para notificaciones temporales.
Usar `Badge` para estados persistentes.

## 📚 Ejemplos

Ver la carpeta `components/` para ejemplos completos de cada componente.

## 🚀 Uso

### Importación Rápida

```tsx
// Importar todo desde el índice principal
import {
  Button,
  Input,
  Card,
  Badge,
  colors,
  typography,
} from '@/design-system';

// O importar componentes individuales
import { Button } from '@/design-system/components/Button';
import { colors } from '@/design-system/foundations/colors';
```

### Ejemplos de Uso

#### Button

```tsx
import { Button } from '@/design-system';

function MyComponent() {
  return (
    <>
      {/* Botón básico */}
      <Button variant="primary">Click me</Button>

      {/* Con estado de carga */}
      <Button loading={true}>Guardando...</Button>

      {/* Con iconos */}
      <Button leftIcon={<SaveIcon />}>Guardar</Button>

      {/* Full width */}
      <Button fullWidth>Enviar formulario</Button>
    </>
  );
}
```

#### Input

```tsx
import { Input } from '@/design-system';

function LoginForm() {
  return (
    <>
      {/* Input con label y validación */}
      <Input
        label="Email"
        type="email"
        placeholder="tu@email.com"
        required
        error="Este campo es requerido"
      />

      {/* Input con icono */}
      <Input label="Buscar" placeholder="Buscar..." leftIcon={<SearchIcon />} />

      {/* Input con helper text */}
      <Input
        label="Teléfono"
        helperText="Incluí el código de área"
        placeholder="+54 11 1234-5678"
      />
    </>
  );
}
```

#### Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
} from '@/design-system';

function ProductCard() {
  return (
    <Card hoverable>
      <CardHeader>
        <CardTitle>Producto Premium</CardTitle>
        <CardDescription>La mejor opción para tu negocio</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Descripción detallada del producto...</p>
      </CardContent>
      <CardFooter>
        <Button variant="primary">Comprar ahora</Button>
      </CardFooter>
    </Card>
  );
}
```

#### Badge

```tsx
import { Badge } from '@/design-system';

function OrderStatus() {
  return (
    <div>
      <Badge variant="success" dot>
        Completado
      </Badge>
      <Badge variant="warning" dot>
        Pendiente
      </Badge>
      <Badge variant="error" leftIcon={<AlertIcon />}>
        Error
      </Badge>
    </div>
  );
}
```

### Usando Design Tokens

```tsx
import { colors, spacing, typography } from '@/design-system';

// Usando colores
<div style={{ backgroundColor: colors.primary[500] }}>
  Fondo azul
</div>

// Usando espaciado
<div style={{ padding: spacing[4], margin: spacing[2] }}>
  Espaciado consistente
</div>

// Usando tipografía
<h1 style={{
  fontSize: typography.fontSize['3xl'].size,
  fontWeight: typography.fontWeight.bold
}}>
  Título Grande
</h1>
```

## 📖 Documentación Completa

Para ver todos los componentes en acción con ejemplos interactivos, consulta:

```bash
# Ver el showcase de componentes
design-system/examples/components-showcase.tsx
```

Este archivo incluye:

- ✅ Paleta de colores completa
- ✅ Todas las variantes de botones
- ✅ Inputs con estados y validación
- ✅ Cards con diferentes estilos
- ✅ Badges con iconos y puntos
- ✅ Escalas tipográficas

## 🎨 Principios de Diseño

1. **Consistencia**: Todos los componentes siguen los mismos patrones de diseño
2. **Accesibilidad**: Componentes accesibles con soporte para screen readers
3. **Responsive**: Diseñados para funcionar en todos los tamaños de pantalla
4. **Tematizable**: Fácil de personalizar usando las variables de diseño
5. **Type-Safe**: Totalmente tipado con TypeScript para mejor DX
