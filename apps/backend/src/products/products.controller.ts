import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Public } from '../auth/decorators/public.decorator';
import type { CalculatePriceDto } from './products.interface';

@Controller('products')
@Public()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Post('calculate-price')
  async calculatePrice(@Body() dto: CalculatePriceDto) {
    return this.productsService.calculatePrice(dto);
  }
}
