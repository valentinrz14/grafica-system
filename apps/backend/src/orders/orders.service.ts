import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PricingService } from '../pricing/pricing.service';
import { MailService } from '../mail/mail.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private pricingService: PricingService,
    private mailService: MailService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userEmail, options, files, comment, pickupDate, pickupTime } =
      createOrderDto;

    // Calcular total de páginas
    const totalPages = files.reduce((sum, file) => sum + file.pages, 0);

    // Calcular hojas necesarias según formato y duplex
    const sheetsNeeded = this.calculateSheets(
      totalPages,
      options.size,
      options.isDuplex,
    );

    const priceBreakdown = await this.pricingService.calculatePrice({
      pages: sheetsNeeded, // Usar hojas en vez de páginas
      isColor: options.isColor,
      isDuplex: options.isDuplex,
    });

    const order = await this.prisma.order.create({
      data: {
        userEmail,
        status: 'PENDING',
        totalPrice: priceBreakdown.total,
        options: options as unknown as Prisma.JsonObject,
        comment: comment || null,
        pickupDate: pickupDate || null,
        pickupTime: pickupTime || null,
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
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Send order confirmation email
    const userName =
      order.user?.firstName && order.user?.lastName
        ? `${order.user.firstName} ${order.user.lastName}`
        : userEmail.split('@')[0];

    const formattedPickupDate = pickupDate
      ? new Date(pickupDate).toLocaleDateString('es-AR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : undefined;

    this.mailService
      .sendOrderConfirmation({
        orderId: order.id,
        userEmail: order.userEmail!,
        userName,
        files: order.files.map((file) => ({
          originalName: file.originalName,
          pages: file.pages,
        })),
        options: {
          size: options.size,
          isColor: options.isColor,
          isDuplex: options.isDuplex,
          quantity: options.quantity,
        },
        totalPrice: order.totalPrice,
        pickupDate: formattedPickupDate,
        pickupTime: pickupTime,
        comment: comment,
      })
      .catch((err) => {
        console.error('Failed to send order confirmation email:', err);
        // Don't throw - email failure shouldn't fail order creation
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
    options: {
      isColor: boolean;
      isDuplex: boolean;
      quantity: number;
      size: string;
    },
  ) {
    const totalPages = files.reduce((sum, file) => sum + file.pages, 0);

    const sheetsNeeded = this.calculateSheets(
      totalPages,
      options.size as 'A4' | 'A3' | 'CARTA',
      options.isDuplex,
    );

    console.log('🔍 Backend - calculatePrice:', {
      files,
      totalPages,
      size: options.size,
      isDuplex: options.isDuplex,
      sheetsNeeded,
    });

    const priceBreakdown = await this.pricingService.calculatePrice({
      pages: sheetsNeeded,
      isColor: options.isColor,
      isDuplex: options.isDuplex,
    });

    console.log('💵 Backend - priceBreakdown:', priceBreakdown);

    return priceBreakdown;
  }

  private calculateSheets(
    totalPages: number,
    paperSize: 'A4' | 'A3' | 'CARTA',
    isDuplex: boolean,
  ): number {
    // A3 puede contener 2 páginas A4, A4 y CARTA contienen 1 página
    const pagesPerSheet = paperSize === 'A3' ? 2 : 1;

    // Duplex permite imprimir en ambos lados de la hoja
    const sidesPerSheet = isDuplex ? 2 : 1;

    // Calcular hojas necesarias y redondear hacia arriba
    const result = Math.ceil(totalPages / pagesPerSheet / sidesPerSheet);

    console.log('📄 Backend - calculateSheets:', {
      totalPages,
      paperSize,
      isDuplex,
      pagesPerSheet,
      sidesPerSheet,
      formula: `Math.ceil(${totalPages} / ${pagesPerSheet} / ${sidesPerSheet})`,
      result,
    });

    return result;
  }
}
