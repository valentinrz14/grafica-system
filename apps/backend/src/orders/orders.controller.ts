import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @CurrentUser() user: User & { email: string },
    @Body(new ValidationPipe({ transform: true }))
    createOrderDto: CreateOrderDto,
  ) {
    const orderData = {
      ...createOrderDto,
      userEmail: user.email,
    };
    const order = await this.ordersService.create(orderData);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Order created successfully',
      data: order,
    };
  }

  @Get('my-orders')
  async findMyOrders(@CurrentUser() user: User & { email: string }) {
    const orders = await this.ordersService.findByUserEmail(user.email);
    return {
      statusCode: HttpStatus.OK,
      data: orders,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: order,
    };
  }

  @Get()
  async findAll() {
    const orders = await this.ordersService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: orders,
    };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.ordersService.updateStatus(
      id,
      updateOrderStatusDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Order status updated successfully',
      data: order,
    };
  }

  @Public()
  @Post('calculate-price')
  async calculatePrice(
    @Body(new ValidationPipe())
    body: {
      files: { pages: number }[];
      options: {
        isColor: boolean;
        isDuplex: boolean;
        quantity: number;
        size: string;
      };
    },
  ) {
    const priceBreakdown = await this.ordersService.calculatePrice(
      body.files,
      body.options,
    );
    return {
      statusCode: HttpStatus.OK,
      data: priceBreakdown,
    };
  }
}
