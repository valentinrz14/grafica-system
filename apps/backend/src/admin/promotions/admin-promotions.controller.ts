import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminPromotionsService } from './admin-promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin/promotions')
@Roles(UserRole.ADMIN)
export class AdminPromotionsController {
  constructor(
    private readonly adminPromotionsService: AdminPromotionsService,
  ) {}

  @Get()
  async findAll() {
    return this.adminPromotionsService.findAll();
  }

  @Get('statistics')
  async getStatistics() {
    return this.adminPromotionsService.getStatistics();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.adminPromotionsService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreatePromotionDto) {
    return this.adminPromotionsService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePromotionDto) {
    return this.adminPromotionsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.adminPromotionsService.delete(id);
  }

  @Patch(':id/toggle-active')
  async toggleActive(@Param('id') id: string) {
    return this.adminPromotionsService.toggleActive(id);
  }

  @Patch(':id/renew')
  async renew(@Param('id') id: string, @Body('daysToExtend') days: number) {
    return this.adminPromotionsService.renew(id, days);
  }

  @Patch(':id/reset-usage')
  async resetUsage(@Param('id') id: string) {
    return this.adminPromotionsService.resetUsage(id);
  }
}
