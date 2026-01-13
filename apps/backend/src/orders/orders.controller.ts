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

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) createOrderDto: CreateOrderDto,
  ) {
    const order = await this.ordersService.create(createOrderDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Order created successfully',
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: order,
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

  @Post('calculate-price')
  async calculatePrice(
    @Body(new ValidationPipe())
    body: { files: { pages: number }[]; options: any },
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
