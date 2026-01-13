import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PricingModule } from './pricing/pricing.module';
import { FilesModule } from './files/files.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [PrismaModule, PricingModule, FilesModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
