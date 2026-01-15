'use client';

import { useEffect, useState } from 'react';
import { Tag, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { CompactCountdownTimer } from './CountdownTimer/CountdownTimer.component';

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

export function ActivePromotions() {
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
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4 rounded-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-6 w-6 text-purple-600 animate-pulse" />
            <p className="text-gray-600">Cargando promociones...</p>
          </div>
        </div>
      </div>
    );
  }

  if (promotions.length === 0) {
    return null; // Don't show anything if no active promotions
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 rounded-2xl mb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="h-5 w-5" />
            <span className="font-semibold">Promociones Activas</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Ofertas Especiales
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Aprovechá estos descuentos por tiempo limitado en tus pedidos de
            impresión
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
            >
              {/* Image */}
              {promo.imageUrl && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={promo.imageUrl}
                    alt={promo.title || promo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {promo.badgeText && (
                    <div
                      className="absolute top-4 right-4 px-3 py-1 rounded-full text-white font-bold text-sm shadow-lg"
                      style={{ backgroundColor: promo.badgeColor || '#EF4444' }}
                    >
                      {promo.badgeText}
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {/* Discount Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg mb-4 font-bold text-lg">
                  <Tag className="h-5 w-5" />
                  {getDiscountText(promo)}
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {promo.title || promo.name}
                </h3>
                {promo.subtitle && (
                  <p className="text-gray-600 text-sm mb-3">{promo.subtitle}</p>
                )}

                {/* Description */}
                {promo.description && (
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {promo.description}
                  </p>
                )}

                {/* Countdown Timer */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500 mr-2">
                    Termina en:
                  </span>
                  <CompactCountdownTimer endDate={promo.endDate} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Los descuentos se aplican automáticamente al realizar tu pedido
          </p>
        </div>
      </div>
    </div>
  );
}
