import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

export enum PromotionStatus {
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PAUSED = 'paused',
}

@Injectable()
export class AdminPromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all promotions with status
   */
  async findAll() {
    const promotions = await this.prisma.promotion.findMany({
      orderBy: [{ priority: 'desc' }, { startDate: 'desc' }],
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    const now = new Date();

    return promotions.map((promo) => ({
      ...promo,
      status: this.getPromotionStatus(promo, now),
      usagePercentage:
        promo.maxUses !== null
          ? Math.round((promo.currentUses / promo.maxUses) * 100)
          : null,
    }));
  }

  /**
   * Get promotion by ID
   */
  async findById(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID "${id}" not found`);
    }

    const now = new Date();

    return {
      ...promotion,
      status: this.getPromotionStatus(promotion, now),
      usagePercentage:
        promotion.maxUses !== null
          ? Math.round((promotion.currentUses / promotion.maxUses) * 100)
          : null,
    };
  }

  /**
   * Create new promotion
   */
  async create(dto: CreatePromotionDto) {
    return this.prisma.promotion.create({
      data: {
        name: dto.name,
        title: dto.title,
        subtitle: dto.subtitle,
        description: dto.description,
        imageUrl: dto.imageUrl,
        badgeText: dto.badgeText,
        badgeColor: dto.badgeColor,
        type: dto.type,
        discountValue: dto.discountValue,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        maxUses: dto.maxUses,
        active: dto.active ?? true,
        priority: dto.priority ?? 0,
        categoryIds: dto.categoryIds ?? [],
        productIds: dto.productIds ?? [],
        minPurchase: dto.minPurchase,
      },
    });
  }

  /**
   * Update promotion
   */
  async update(id: string, dto: UpdatePromotionDto) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID "${id}" not found`);
    }

    return this.prisma.promotion.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.subtitle !== undefined && { subtitle: dto.subtitle }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.badgeText !== undefined && { badgeText: dto.badgeText }),
        ...(dto.badgeColor !== undefined && { badgeColor: dto.badgeColor }),
        ...(dto.type && { type: dto.type }),
        ...(dto.discountValue !== undefined && {
          discountValue: dto.discountValue,
        }),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
        ...(dto.maxUses !== undefined && { maxUses: dto.maxUses }),
        ...(dto.active !== undefined && { active: dto.active }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.categoryIds !== undefined && { categoryIds: dto.categoryIds }),
        ...(dto.productIds !== undefined && { productIds: dto.productIds }),
        ...(dto.minPurchase !== undefined && { minPurchase: dto.minPurchase }),
      },
    });
  }

  /**
   * Delete promotion
   */
  async delete(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID "${id}" not found`);
    }

    return this.prisma.promotion.delete({
      where: { id },
    });
  }

  /**
   * Toggle promotion active status
   */
  async toggleActive(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID "${id}" not found`);
    }

    return this.prisma.promotion.update({
      where: { id },
      data: {
        active: !promotion.active,
      },
    });
  }

  /**
   * Renew promotion (extend end date)
   */
  async renew(id: string, daysToExtend: number) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID "${id}" not found`);
    }

    const newEndDate = new Date(promotion.endDate);
    newEndDate.setDate(newEndDate.getDate() + daysToExtend);

    return this.prisma.promotion.update({
      where: { id },
      data: {
        endDate: newEndDate,
        active: true, // Reactivate when renewing
      },
    });
  }

  /**
   * Reset promotion usage count
   */
  async resetUsage(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID "${id}" not found`);
    }

    return this.prisma.promotion.update({
      where: { id },
      data: {
        currentUses: 0,
      },
    });
  }

  /**
   * Get promotion statistics
   */
  async getStatistics() {
    const now = new Date();

    const [total, active, scheduled, expired, paused] = await Promise.all([
      this.prisma.promotion.count(),
      this.prisma.promotion.count({
        where: {
          active: true,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      }),
      this.prisma.promotion.count({
        where: {
          active: true,
          startDate: { gt: now },
        },
      }),
      this.prisma.promotion.count({
        where: {
          endDate: { lt: now },
        },
      }),
      this.prisma.promotion.count({
        where: {
          active: false,
        },
      }),
    ]);

    return {
      total,
      active,
      scheduled,
      expired,
      paused,
    };
  }

  /**
   * Get promotion status
   */
  private getPromotionStatus(
    promotion: { active: boolean; startDate: Date; endDate: Date },
    now: Date,
  ): PromotionStatus {
    if (!promotion.active) {
      return PromotionStatus.PAUSED;
    }

    if (now < promotion.startDate) {
      return PromotionStatus.SCHEDULED;
    }

    if (now > promotion.endDate) {
      return PromotionStatus.EXPIRED;
    }

    return PromotionStatus.ACTIVE;
  }
}
