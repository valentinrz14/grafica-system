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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 cursor-pointer"
            style={{
              fontSize: '16px',
              height: '52px',
              fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            style={{
              fontSize: '16px',
              height: '52px',
              fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
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

      {/* Price Display con animación */}
      {isCalculating && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-300">
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-300 rounded w-1/3"></div>
              <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Calculando presupuesto...
          </p>
        </div>
      )}

      {priceBreakdown && !isCalculating && (
        <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 shadow-lg animate-slideIn">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-bold text-blue-900">
              Resumen del presupuesto
            </h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1">
              <span className="text-gray-700">Precio base por página:</span>
              <span className="font-semibold text-gray-900">
                ${priceBreakdown.basePrice}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-700">Total de páginas:</span>
              <span className="font-semibold text-gray-900">
                {priceBreakdown.pages}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-700">Cantidad de copias:</span>
              <span className="font-semibold text-gray-900">
                {priceBreakdown.quantity}
              </span>
            </div>
            {priceBreakdown.colorMultiplier > 1 && (
              <div className="flex justify-between py-1">
                <span className="text-gray-700">Multiplicador color:</span>
                <span className="font-semibold text-orange-600">
                  {priceBreakdown.colorMultiplier}x
                </span>
              </div>
            )}
            {priceBreakdown.duplexMultiplier < 1 && (
              <div className="flex justify-between py-1">
                <span className="text-gray-700">Descuento doble faz:</span>
                <span className="font-semibold text-green-600">
                  {priceBreakdown.duplexMultiplier}x
                </span>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t-2 border-blue-300">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">
                Total estimado:
              </span>
              <span className="text-3xl font-bold text-blue-600 animate-pulse">
                ${priceBreakdown.total.toFixed(2)}
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-blue-700 bg-blue-100 rounded p-2 text-center">
            💡 Los precios son estimados y pueden variar según disponibilidad
          </p>
        </div>
      )}
    </div>
  );
}
