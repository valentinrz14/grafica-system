import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CalculatePriceOptions {
  pages: number;
  isColor: boolean;
  isDuplex: boolean;
  quantity: number;
}

export interface PriceBreakdown {
  basePrice: number;
  pages: number;
  quantity: number;
  colorMultiplier: number;
  duplexMultiplier: number;
  subtotal: number;
  total: number;
}

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  async calculatePrice(
    options: CalculatePriceOptions,
  ): Promise<PriceBreakdown> {
    // Get pricing config from database
    const config = await this.prisma.pricingConfig.findFirst({
      where: { id: 'default' },
    });

    if (!config) {
      throw new NotFoundException('Pricing configuration not found');
    }

    const { basePrice, colorMultiplier, duplexMultiplier } = config;
    const { pages, isColor, isDuplex, quantity } = options;

    // Calculate subtotal: base * pages * quantity
    let subtotal = basePrice * pages * quantity;

    // Apply color multiplier if needed
    const actualColorMultiplier = isColor ? colorMultiplier : 1;
    subtotal *= actualColorMultiplier;

    // Apply duplex multiplier if needed
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
