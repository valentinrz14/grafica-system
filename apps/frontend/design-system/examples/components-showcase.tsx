'use client';

import React, { useState } from 'react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
} from '../components';
import { colors, semanticColors } from '../foundations/colors';

/**
 * Components Showcase
 *
 * Este archivo demuestra todos los componentes del Design System
 * con ejemplos de uso y variantes disponibles.
 */

export default function ComponentsShowcase() {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900">
            Design System Components
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Biblioteca de componentes reutilizables con variantes y ejemplos
          </p>
        </div>

        {/* Colors Section */}
        <section>
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Paleta de Colores
          </h2>

          <div className="space-y-6">
            {/* Primary Colors */}
            <div>
              <h3 className="mb-3 text-xl font-semibold">Primary (Azul)</h3>
              <div className="grid grid-cols-10 gap-2">
                {Object.entries(colors.primary).map(([shade, color]) => (
                  <div key={shade} className="text-center">
                    <div
                      className="h-16 w-full rounded-lg shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <p className="mt-1 text-xs text-gray-600">{shade}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Colors */}
            <div>
              <h3 className="mb-3 text-xl font-semibold">
                Secondary (Púrpura)
              </h3>
              <div className="grid grid-cols-10 gap-2">
                {Object.entries(colors.secondary).map(([shade, color]) => (
                  <div key={shade} className="text-center">
                    <div
                      className="h-16 w-full rounded-lg shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <p className="mt-1 text-xs text-gray-600">{shade}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Colors */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="mb-3 text-xl font-semibold">Success</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[400, 500, 600].map((shade) => (
                    <div key={shade}>
                      <div
                        className="h-12 w-full rounded-lg shadow-sm"
                        style={{
                          backgroundColor:
                            colors.success[
                              shade as keyof typeof colors.success
                            ],
                        }}
                      />
                      <p className="mt-1 text-center text-xs text-gray-600">
                        {shade}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-xl font-semibold">Warning</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[400, 500, 600].map((shade) => (
                    <div key={shade}>
                      <div
                        className="h-12 w-full rounded-lg shadow-sm"
                        style={{
                          backgroundColor:
                            colors.warning[
                              shade as keyof typeof colors.warning
                            ],
                        }}
                      />
                      <p className="mt-1 text-center text-xs text-gray-600">
                        {shade}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-xl font-semibold">Error</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[400, 500, 600].map((shade) => (
                    <div key={shade}>
                      <div
                        className="h-12 w-full rounded-lg shadow-sm"
                        style={{
                          backgroundColor:
                            colors.error[shade as keyof typeof colors.error],
                        }}
                      />
                      <p className="mt-1 text-center text-xs text-gray-600">
                        {shade}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section>
          <h2 className="mb-6 text-3xl font-bold text-gray-900">Botones</h2>

          <Card>
            <CardHeader>
              <CardTitle>Variantes</CardTitle>
              <CardDescription>
                Diferentes estilos de botones para distintos contextos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Variants */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Variantes</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="outline">Outline</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Tamaños</h3>
                <div className="flex items-end gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </div>

              {/* States */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Estados</h3>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={handleButtonClick} loading={loading}>
                    {loading ? 'Loading...' : 'Click me'}
                  </Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>

              {/* With Icons */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Con Iconos</h3>
                <div className="flex flex-wrap gap-4">
                  <Button leftIcon={<span>←</span>}>Con icono izquierdo</Button>
                  <Button rightIcon={<span>→</span>}>Con icono derecho</Button>
                </div>
              </div>

              {/* Full Width */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Full Width</h3>
                <Button fullWidth>Botón de ancho completo</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Inputs Section */}
        <section>
          <h2 className="mb-6 text-3xl font-bold text-gray-900">Inputs</h2>

          <Card>
            <CardHeader>
              <CardTitle>Campos de Entrada</CardTitle>
              <CardDescription>
                Inputs con validación, iconos y mensajes de ayuda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Input */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Input Básico</h3>
                <Input
                  label="Email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  helperText="Ingresá tu dirección de correo electrónico"
                />
              </div>

              {/* With Icons */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Con Iconos</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Buscar"
                    placeholder="Buscar..."
                    leftIcon={<span>🔍</span>}
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    rightIcon={<span>👁</span>}
                  />
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Tamaños</h3>
                <div className="space-y-4">
                  <Input size="sm" placeholder="Small input" />
                  <Input size="md" placeholder="Medium input" />
                  <Input size="lg" placeholder="Large input" />
                </div>
              </div>

              {/* States */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Estados</h3>
                <div className="space-y-4">
                  <Input
                    label="Campo con error"
                    placeholder="Ingresá tu nombre"
                    error="Este campo es requerido"
                    required
                  />
                  <Input
                    label="Campo exitoso"
                    placeholder="nombre@correo.com"
                    variant="success"
                    helperText="Email válido"
                  />
                  <Input
                    label="Campo deshabilitado"
                    placeholder="No editable"
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="mb-6 text-3xl font-bold text-gray-900">Cards</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Default Card */}
            <Card>
              <CardHeader>
                <CardTitle>Card por Defecto</CardTitle>
                <CardDescription>Card básica con sombra sutil</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Contenido de la card. Ideal para agrupar información
                  relacionada.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Ver más</Button>
              </CardFooter>
            </Card>

            {/* Elevated Card */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Card Elevada</CardTitle>
                <CardDescription>Con más sombra para destacar</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Esta card tiene una sombra más pronunciada.
                </p>
              </CardContent>
            </Card>

            {/* Outlined Card */}
            <Card variant="outlined">
              <CardHeader>
                <CardTitle>Card con Borde</CardTitle>
                <CardDescription>Estilo minimalista con borde</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sin fondo, solo con borde visible.
                </p>
              </CardContent>
            </Card>

            {/* Ghost Card */}
            <Card variant="ghost">
              <CardHeader>
                <CardTitle>Card Ghost</CardTitle>
                <CardDescription>Fondo sutil sin borde</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Con fondo gris claro, ideal para secciones.
                </p>
              </CardContent>
            </Card>

            {/* Hoverable Card */}
            <Card hoverable>
              <CardHeader>
                <CardTitle>Card Interactiva</CardTitle>
                <CardDescription>Hover para ver efecto</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Esta card se eleva al hacer hover.
                </p>
              </CardContent>
            </Card>

            {/* Card with different padding */}
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Padding Grande</CardTitle>
                <CardDescription>Más espacio interno</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Con padding=&quot;lg&quot; para más espacio.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badges Section */}
        <section>
          <h2 className="mb-6 text-3xl font-bold text-gray-900">Badges</h2>

          <Card>
            <CardHeader>
              <CardTitle>Etiquetas y Estados</CardTitle>
              <CardDescription>
                Badges para indicar estados, categorías o información destacada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Variants */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Variantes</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Tamaños</h3>
                <div className="flex items-center gap-2">
                  <Badge size="sm" variant="primary">
                    Small
                  </Badge>
                  <Badge size="md" variant="primary">
                    Medium
                  </Badge>
                  <Badge size="lg" variant="primary">
                    Large
                  </Badge>
                </div>
              </div>

              {/* With Dot */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Con Punto</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success" dot>
                    Online
                  </Badge>
                  <Badge variant="warning" dot>
                    Pendiente
                  </Badge>
                  <Badge variant="error" dot>
                    Offline
                  </Badge>
                  <Badge variant="primary" dot>
                    Activo
                  </Badge>
                </div>
              </div>

              {/* With Icons */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Con Iconos</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success" leftIcon={<span>✓</span>}>
                    Completado
                  </Badge>
                  <Badge variant="warning" leftIcon={<span>⚠</span>}>
                    Advertencia
                  </Badge>
                  <Badge variant="error" leftIcon={<span>✕</span>}>
                    Error
                  </Badge>
                  <Badge variant="primary" rightIcon={<span>→</span>}>
                    Ver más
                  </Badge>
                </div>
              </div>

              {/* Use Cases */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Casos de Uso</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">Estado del pedido:</span>
                    <Badge variant="warning" dot>
                      En progreso
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">Categoría:</span>
                    <Badge variant="secondary">Diseño</Badge>
                    <Badge variant="secondary">Impresión</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">Prioridad:</span>
                    <Badge variant="error">Alta</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Typography Section */}
        <section>
          <h2 className="mb-6 text-3xl font-bold text-gray-900">Tipografía</h2>

          <Card>
            <CardHeader>
              <CardTitle>Escalas de Texto</CardTitle>
              <CardDescription>
                Sistema tipográfico con jerarquía visual clara
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h1 className="text-5xl font-bold">Heading 1 - 48px</h1>
              <h2 className="text-4xl font-bold">Heading 2 - 36px</h2>
              <h3 className="text-3xl font-semibold">Heading 3 - 30px</h3>
              <h4 className="text-2xl font-semibold">Heading 4 - 24px</h4>
              <h5 className="text-xl font-semibold">Heading 5 - 20px</h5>
              <h6 className="text-lg font-semibold">Heading 6 - 18px</h6>
              <p className="text-lg">Body Large - 18px</p>
              <p className="text-base">Body - 16px (default)</p>
              <p className="text-sm">Body Small - 14px</p>
              <p className="text-xs">Caption - 12px</p>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="border-t pt-8 text-center text-gray-600">
          <p>Design System - Gráfica System</p>
          <p className="text-sm">
            Componentes reutilizables construidos con React, TypeScript y
            Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
}
