'use client';

import { OrderOptions, PriceBreakdown } from '@/lib/api-client';

interface PriceCalculatorProps {
  options: OrderOptions;
  onOptionsChange: (options: OrderOptions) => void;
  priceBreakdown: PriceBreakdown | null;
  isCalculating: boolean;
}

export function PriceCalculator({
  options,
  onOptionsChange,
  priceBreakdown,
  isCalculating,
}: PriceCalculatorProps) {
  const handleChange = (field: keyof OrderOptions, value: any) => {
    onOptionsChange({ ...options, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tamaño */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tamaño del papel
          </label>
          <select
            value={options.size}
            onChange={(e) => handleChange('size', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
          >
            <option value="A4">A4 (21 x 29.7 cm)</option>
            <option value="A3">A3 (29.7 x 42 cm)</option>
            <option value="CARTA">Carta (21.6 x 27.9 cm)</option>
          </select>
        </div>

        {/* Cantidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad de copias
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={options.quantity}
            onChange={(e) =>
              handleChange('quantity', parseInt(e.target.value) || 1)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Impresión
          </label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                checked={!options.isColor}
                onChange={() => handleChange('isColor', false)}
                className="mr-2 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">
                Blanco y Negro
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                checked={options.isColor}
                onChange={() => handleChange('isColor', true)}
                className="mr-2 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">Color</span>
            </label>
          </div>
        </div>

        {/* Doble faz */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cara de impresión
          </label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                checked={!options.isDuplex}
                onChange={() => handleChange('isDuplex', false)}
                className="mr-2 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">
                Simple faz
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                checked={options.isDuplex}
                onChange={() => handleChange('isDuplex', true)}
                className="mr-2 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">
                Doble faz
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Price Display */}
      {priceBreakdown && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen del presupuesto
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">
                Precio base por página: ${priceBreakdown.basePrice}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                Total de páginas: {priceBreakdown.pages}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                Cantidad de copias: {priceBreakdown.quantity}
              </span>
            </div>
            {priceBreakdown.colorMultiplier > 1 && (
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Multiplicador color: {priceBreakdown.colorMultiplier}x
                </span>
              </div>
            )}
            {priceBreakdown.duplexMultiplier < 1 && (
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Descuento doble faz: {priceBreakdown.duplexMultiplier}x
                </span>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-300">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">
                Total estimado:
              </span>
              <span className="text-2xl font-bold text-blue-600">
                ${priceBreakdown.total.toFixed(2)}
              </span>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            * Los precios son estimados y pueden variar según disponibilidad
          </p>
        </div>
      )}

      {isCalculating && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-600">Calculando precio...</p>
        </div>
      )}
    </div>
  );
}
