'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, Clock, ArrowLeft, Sparkles } from 'lucide-react';
import { CompactCountdownTimer } from '@/components/CountdownTimer/CountdownTimer.component';

interface Promotion {
  id: string;
  name: string;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  badgeText?: string | null;
  badgeColor?: string | null;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUNDLE';
  discountValue: number;
  startDate: string;
  endDate: string;
  priority: number;
}

export default function PromotionsPage() {
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/promotions');
      const data = await response.json();
      setPromotions(data || []);
    } catch (error) {
      console.error('Error loading promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDiscountText = (promo: Promotion) => {
    if (promo.type === 'PERCENTAGE') {
      return `${promo.discountValue}% OFF`;
    } else if (promo.type === 'FIXED_AMOUNT') {
      return `$${promo.discountValue} OFF`;
    }
    return 'Oferta Especial';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <Sparkles className="h-16 w-16 text-purple-600 animate-pulse mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Cargando promociones
            </h3>
            <p className="text-gray-500 text-sm">
              Por favor espera un momento...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver al inicio</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <div className="flex items-center gap-3 mb-6">
          <Tag className="h-7 w-7 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Promociones</h1>
        </div>
        {promotions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="bg-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Tag className="h-12 w-12 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No hay promociones activas en este momento
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Volvé pronto para ver nuestras ofertas y descuentos especiales
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Ir a Cotizar
            </button>
          </div>
        ) : (
          <>
            {/* Promotions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  {promo.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={promo.imageUrl}
                        alt={promo.title || promo.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Discount Badge */}
                      <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
                        {getDiscountText(promo)}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {promo.title || promo.name}
                    </h3>

                    {promo.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {promo.description}
                      </p>
                    )}

                    {/* Countdown Timer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">Termina en:</span>
                      <CompactCountdownTimer endDate={promo.endDate} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Footer */}
            <div className="mt-12 bg-purple-600 rounded-xl p-6 text-center text-white">
              <p className="text-sm mb-3">
                Los descuentos se aplican automáticamente al cotizar
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Ir a Cotizar
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
