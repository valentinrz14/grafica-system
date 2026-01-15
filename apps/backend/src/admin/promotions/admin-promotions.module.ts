import { Module } from '@nestjs/common';
import { AdminPromotionsController } from './admin-promotions.controller';
import { AdminPromotionsService } from './admin-promotions.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminPromotionsController],
  providers: [AdminPromotionsService],
  exports: [AdminPromotionsService],
})
export class AdminPromotionsModule {}
