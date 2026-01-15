import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PromotionType } from '@prisma/client';

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all active promotions
   */
  async findAllActive() {
    const now = new Date();

    const promotions = await this.prisma.promotion.findMany({
      where: {
        active: true,
        startDate: {
          lte: now,
        },
        endDate: {
          gte: now,
        },
      },
      orderBy: {
        priority: 'desc',
      },
    });

    // Filter out promotions that have reached their max uses
    return promotions.filter((promo) => {
      if (promo.maxUses === null) return true;
      return promo.currentUses < promo.maxUses;
    });
  }

  /**
   * Get active promotions for a specific category
   */
  async findByCategoryId(categoryId: string) {
    const now = new Date();

    return this.prisma.promotion.findMany({
      where: {
        active: true,
        startDate: {
          lte: now,
        },
        endDate: {
          gte: now,
        },
        categoryIds: {
          has: categoryId,
        },
      },
      orderBy: {
        priority: 'desc',
      },
    });
  }

  /**
   * Get active promotions for a specific product
   */
  async findByProductId(productId: string) {
    const now = new Date();

    return this.prisma.promotion.findMany({
      where: {
        active: true,
        startDate: {
          lte: now,
        },
        endDate: {
          gte: now,
        },
        productIds: {
          has: productId,
        },
      },
      orderBy: {
        priority: 'desc',
      },
    });
  }

  /**
   * Calculate discount for a given price and promotion
   */
  calculateDiscount(
    originalPrice: number,
    promotion: {
      type: PromotionType;
      discountValue: number;
      minPurchase?: number | null;
    },
  ): { discountAmount: number; finalPrice: number } {
    // Check minimum purchase requirement
    if (promotion.minPurchase && originalPrice < promotion.minPurchase) {
      return {
        discountAmount: 0,
        finalPrice: originalPrice,
      };
    }

    let discountAmount = 0;

    switch (promotion.type) {
      case 'PERCENTAGE':
        discountAmount = (originalPrice * promotion.discountValue) / 100;
        break;

      case 'FIXED_AMOUNT':
        discountAmount = promotion.discountValue;
        break;

      case 'BUNDLE':
        // Bundle logic can be customized (e.g., 2x1, 3x2, etc.)
        // For now, treat it like a fixed discount
        discountAmount = promotion.discountValue;
        break;

      default:
        discountAmount = 0;
    }

    // Ensure discount doesn't exceed original price
    discountAmount = Math.min(discountAmount, originalPrice);

    const finalPrice = Math.max(0, originalPrice - discountAmount);

    return {
      discountAmount,
      finalPrice,
    };
  }

  /**
   * Get best promotion for a product
   */
  async getBestPromotionForProduct(
    productId: string,
    categoryId: string,
    price: number,
  ) {
    const now = new Date();

    const promotions = await this.prisma.promotion.findMany({
      where: {
        active: true,
        startDate: {
          lte: now,
        },
        endDate: {
          gte: now,
        },
        OR: [
          { productIds: { has: productId } },
          { categoryIds: { has: categoryId } },
        ],
      },
      orderBy: {
        priority: 'desc',
      },
    });

    // Filter promotions where maxUses hasn't been exceeded
    const availablePromotions = promotions.filter((promo) => {
      if (promo.maxUses === null) return true;
      return promo.currentUses < promo.maxUses;
    });

    if (availablePromotions.length === 0) {
      return null;
    }

    // Find the promotion that gives the best discount
    type PromotionType = (typeof availablePromotions)[number] | null;
    let bestPromotion: PromotionType = null;
    let bestDiscount = 0;

    for (const promotion of availablePromotions) {
      const { discountAmount } = this.calculateDiscount(price, promotion);

      if (discountAmount > bestDiscount) {
        bestDiscount = discountAmount;
        bestPromotion = promotion;
      }
    }

    return bestPromotion;
  }

  /**
   * Increment usage count for a promotion
   */
  async incrementUsage(promotionId: string) {
    return this.prisma.promotion.update({
      where: { id: promotionId },
      data: {
        currentUses: {
          increment: 1,
        },
      },
    });
  }
}
