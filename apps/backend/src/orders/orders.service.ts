import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PricingService } from '../pricing/pricing.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private pricingService: PricingService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userEmail, options, files, comment } = createOrderDto;

    const totalPages = files.reduce((sum, file) => sum + file.pages, 0);

    const priceBreakdown = await this.pricingService.calculatePrice({
      pages: totalPages,
      isColor: options.isColor,
      isDuplex: options.isDuplex,
      quantity: options.quantity,
    });

    const order = await this.prisma.order.create({
      data: {
        userEmail,
        status: 'PENDING',
        totalPrice: priceBreakdown.total,
        options: options as unknown as Prisma.JsonObject,
        comment: comment || null,
        files: {
          create: files.map((file) => ({
            fileUrl: file.fileUrl,
            fileName: file.fileName,
            originalName: file.originalName,
            pages: file.pages,
          })),
        },
      },
      include: {
        files: true,
      },
    });

    return {
      ...order,
      priceBreakdown,
    };
  }

  async findAll() {
    const orders = await this.prisma.order.findMany({
      include: {
        files: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders;
  }

  async findByUserEmail(email: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        userEmail: email,
      },
      include: {
        files: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders;
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        files: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    await this.findOne(id);

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderStatusDto.status,
      },
      include: {
        files: true,
      },
    });

    return updatedOrder;
  }

  async calculatePrice(
    files: { pages: number }[],
    options: { isColor: boolean; isDuplex: boolean; quantity: number },
  ) {
    const totalPages = files.reduce((sum, file) => sum + file.pages, 0);

    const priceBreakdown = await this.pricingService.calculatePrice({
      pages: totalPages,
      isColor: options.isColor,
      isDuplex: options.isDuplex,
      quantity: options.quantity,
    });

    return priceBreakdown;
  }
}
