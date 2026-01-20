import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CalculatePriceDto } from './products.interface';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all active products with basic info
   */
  async findAll() {
    return this.prisma.product.findMany({
      where: {
        active: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  /**
   * Get product by slug with all options
   */
  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        slug,
        active: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        options: {
          orderBy: {
            sortOrder: 'asc',
          },
          include: {
            values: {
              where: {
                available: true,
              },
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    return product;
  }

  /**
   * Get product by ID (for admin)
   */
  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        options: {
          include: {
            values: true,
          },
        },
      },
    });
  }

  /**
   * Calculate product price based on selected options
   */
  async calculatePrice(dto: CalculatePriceDto) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: dto.productId,
      },
      include: {
        options: {
          include: {
            values: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID "${dto.productId}" not found`,
      );
    }

    let totalPrice = product.basePrice;
    const appliedOptions: Array<{
      optionName: string;
      selectedValue: string;
      priceModifier: number;
    }> = [];

    // Apply price modifiers from selected options
    for (const [optionName, selectedValue] of Object.entries(
      dto.selectedOptions,
    )) {
      const option = product.options.find((opt) => opt.name === optionName);

      if (!option) {
        continue; // Skip unknown options
      }

      const optionValue = option.values.find(
        (val) => val.value === selectedValue,
      );

      if (optionValue) {
        // For NUMBER type options (quantity), multiply the modifier by the quantity
        if (option.type === 'NUMBER') {
          const quantity = parseInt(selectedValue, 10);
          if (!isNaN(quantity) && quantity > 0) {
            totalPrice += optionValue.priceModifier * quantity;
          }
        } else {
          totalPrice += optionValue.priceModifier;
        }

        appliedOptions.push({
          optionName: option.label,
          selectedValue: optionValue.label,
          priceModifier: optionValue.priceModifier,
        });
      }
    }

    // Apply quantity multiplier if provided
    const quantity = dto.quantity || 1;
    const finalPrice = totalPrice * quantity;

    return {
      productId: product.id,
      productName: product.name,
      basePrice: product.basePrice,
      appliedOptions,
      quantity,
      unitPrice: totalPrice,
      totalPrice: finalPrice,
    };
  }
}
