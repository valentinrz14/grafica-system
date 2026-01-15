import { Controller, Get, Param } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('promotions')
@Public()
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  async findAll() {
    return this.promotionsService.findAllActive();
  }

  @Get('category/:categoryId')
  async findByCategoryId(@Param('categoryId') categoryId: string) {
    return this.promotionsService.findByCategoryId(categoryId);
  }

  @Get('product/:productId')
  async findByProductId(@Param('productId') productId: string) {
    return this.promotionsService.findByProductId(productId);
  }
}
