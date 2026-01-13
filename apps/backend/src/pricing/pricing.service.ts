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
    const { pages, isColor, isDuplex, quantity } = options;

    let subtotal = basePrice * pages * quantity;

    const actualColorMultiplier = isColor ? colorMultiplier : 1;
    subtotal *= actualColorMultiplier;

    const actualDuplexMultiplier = isDuplex ? duplexMultiplier : 1;
    subtotal *= actualDuplexMultiplier;

    return {
      basePrice,
      pages,
      quantity,
      colorMultiplier: actualColorMultiplier,
      duplexMultiplier: actualDuplexMultiplier,
      subtotal,
      total: subtotal,
    };
  }
}
