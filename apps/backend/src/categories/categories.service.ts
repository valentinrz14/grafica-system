import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all active categories sorted by sortOrder
   */
  async findAll() {
    return this.prisma.category.findMany({
      where: {
        active: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        sortOrder: true,
        _count: {
          select: {
            products: {
              where: {
                active: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get category by slug with its products
   */
  async findBySlug(slug: string) {
    return this.prisma.category.findUnique({
      where: {
        slug,
        active: true,
      },
      include: {
        products: {
          where: {
            active: true,
          },
          orderBy: {
            sortOrder: 'asc',
          },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            basePrice: true,
          },
        },
      },
    });
  }
}
