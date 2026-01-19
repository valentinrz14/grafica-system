import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CalculatePriceOptions, PriceBreakdown } from './pricing.interface';

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  async calculatePrice(
    options: CalculatePriceOptions,
  ): Promise<PriceBreakdown> {
    const config = await this.prisma.pricingConfig.findFirst({
      where: { id: 'default' },
    });

    if (!config) {
      throw new NotFoundException('Pricing configuration not found');
    }

    const { basePrice, colorMultiplier, duplexMultiplier } = config;
    const { pages, isColor, isDuplex } = options;

    // Calcular subtotal: precio base por hoja * cantidad de hojas
    let subtotal = basePrice * pages;

    // Aplicar multiplicador de color si es a color
    const actualColorMultiplier = isColor ? colorMultiplier : 1;
    subtotal *= actualColorMultiplier;

    // Aplicar multiplicador de duplex (descuento)
    const actualDuplexMultiplier = isDuplex ? duplexMultiplier : 1;
    subtotal *= actualDuplexMultiplier;

    return {
      basePrice,
      pages, // Este es el número de hojas, no páginas
      quantity: 1, // Siempre 1, ya no es configurable
      colorMultiplier: actualColorMultiplier,
      duplexMultiplier: actualDuplexMultiplier,
      subtotal,
      total: subtotal,
    };
  }
}
