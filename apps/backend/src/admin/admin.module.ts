import { Module } from '@nestjs/common';
import { AdminPromotionsModule } from './promotions/admin-promotions.module';

@Module({
  imports: [AdminPromotionsModule],
})
export class AdminModule {}
