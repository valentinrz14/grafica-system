# Testing Guide - Frontend

Este proyecto utiliza **Jest** y **React Testing Library** para testing.

## Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (útil durante desarrollo)
npm run test:watch

# Ejecutar tests con reporte de coverage
npm run test:coverage
```

## Estructura de Tests

Los tests están organizados en carpetas `__tests__` junto a los archivos que testean:

```
apps/frontend/
├── components/
│   ├── __tests__/
│   │   ├── upload-form.test.tsx
│   │   ├── price-calculator.test.tsx
│   │   └── countdown-timer.test.tsx
│   ├── upload-form.tsx
│   └── price-calculator.tsx
└── lib/
    ├── __tests__/
    │   └── api-client.test.ts
    └── api-client.ts
```

## Tests Implementados

### Componentes

#### UploadForm

- ✅ Renderiza el área de upload correctamente
- ✅ Muestra archivos seleccionados
- ✅ Llama a `onRemoveFile` al clickear eliminar
- ✅ Se deshabilita cuando `isUploading` es true
- ✅ Formatea el tamaño de archivos correctamente

#### PriceCalculator

- ✅ Renderiza todas las opciones de tamaño
- ✅ Renderiza checkboxes de color y duplex
- ✅ Llama a `onOptionsChange` al cambiar opciones
- ✅ Muestra el desglose de precio cuando está disponible
- ✅ Muestra estado de carga al calcular
- ✅ Incrementa/decrementa cantidad correctamente

#### CountdownTimer

- ✅ Muestra tiempo restante cuando la fecha es futura
- ✅ Muestra "Expirado" cuando la fecha es pasada
- ✅ Actualiza el countdown cada segundo

### Utilidades

#### API Client

- ✅ `calculatePrice` llama al endpoint correcto
- ✅ `uploadFile` sube archivos con FormData correcto
- ✅ Incluye token de autenticación en headers cuando está presente
- ✅ Maneja errores correctamente

## Escribir Nuevos Tests

### Ejemplo básico de test para componente

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComponent } from '../my-component';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText(/Hello/i)).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const mockOnClick = jest.fn();
    render(<MyComponent onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(mockOnClick).toHaveBeenCalled();
  });
});
```

## Cobertura de Tests

El objetivo es mantener al menos:

- **80%** de cobertura en componentes críticos
- **70%** de cobertura en utilidades
- **60%** de cobertura general

Puedes ver el reporte de cobertura en:

```bash
npm run test:coverage
# Luego abre: coverage/lcov-report/index.html
```

## CI/CD

Los tests se ejecutan automáticamente en GitHub Actions en cada:

- Push a `main` o `develop`
- Pull Request a `main` o `develop`

El workflow verifica:

1. Tests pasan correctamente
2. Cobertura de código
3. Linting (ESLint)
4. Type checking (TypeScript)
5. Build exitoso

## Troubleshooting

### Tests fallan con "Cannot find module"

```bash
# Limpia cache de Jest
npm test -- --clearCache
```

### Tests muy lentos

```bash
# Ejecuta con menos workers
npm test -- --maxWorkers=2
```

### Error con Next.js imports

Verifica que `jest.config.js` tenga configurado correctamente `moduleNameMapper` para los path aliases (`@/...`).
