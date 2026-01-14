import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Cron job que se ejecuta diariamente a las 2:00 AM
   * Borra archivos de más de 7 días
   */
  @Cron('0 2 * * *', {
    name: 'cleanup-old-files',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async cleanupOldFiles() {
    this.logger.log('Iniciando limpieza de archivos viejos...');

    try {
      // Calcular fecha límite (7 días atrás)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Buscar archivos de más de 7 días
      const oldFiles = await this.prisma.orderFile.findMany({
        where: {
          createdAt: {
            lt: sevenDaysAgo,
          },
        },
        include: {
          order: true,
        },
      });

      this.logger.log(`Encontrados ${oldFiles.length} archivos para borrar`);

      let deletedCount = 0;
      let errorCount = 0;

      for (const file of oldFiles) {
        try {
          // Borrar archivo físico del filesystem
          const uploadsDir = path.join(process.cwd(), 'uploads', file.fileName);

          try {
            await fs.unlink(uploadsDir);
            this.logger.log(`Archivo borrado: ${file.fileName}`);
          } catch {
            // Si el archivo no existe en el filesystem, continuar
            this.logger.warn(
              `Archivo no encontrado en filesystem: ${file.fileName}`,
            );
          }

          // Borrar registro de la base de datos
          await this.prisma.orderFile.delete({
            where: { id: file.id },
          });

          deletedCount++;
        } catch (error) {
          errorCount++;
          this.logger.error(
            `Error al borrar archivo ${file.fileName}: ${error}`,
          );
        }
      }

      this.logger.log(
        `Limpieza completada. Archivos borrados: ${deletedCount}, Errores: ${errorCount}`,
      );
    } catch (error) {
      this.logger.error(`Error en limpieza de archivos: ${error}`);
    }
  }

  /**
   * Cron job que se ejecuta diariamente a las 3:00 AM
   * Expira pedidos cuya fecha de retiro ya pasó
   */
  @Cron('0 3 * * *', {
    name: 'expire-old-orders',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async expireOldOrders() {
    this.logger.log('Iniciando expiración de pedidos vencidos...');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Buscar pedidos con fecha de retiro pasada que estén en PENDING
      const ordersToExpire = await this.prisma.order.findMany({
        where: {
          pickupDate: {
            not: null,
            lt: today,
          },
          status: {
            in: [OrderStatus.PENDING, OrderStatus.PRINTING],
          },
        },
      });

      this.logger.log(
        `Encontrados ${ordersToExpire.length} pedidos para expirar`,
      );

      // Actualizar estado a EXPIRED
      const result = await this.prisma.order.updateMany({
        where: {
          id: {
            in: ordersToExpire.map((o) => o.id),
          },
        },
        data: {
          status: OrderStatus.EXPIRED,
        },
      });

      this.logger.log(`Pedidos expirados: ${result.count}`);
    } catch (error) {
      this.logger.error(`Error al expirar pedidos: ${error}`);
    }
  }

  /**
   * Método manual para ejecutar limpieza (útil para testing)
   */
  async manualCleanup() {
    this.logger.log('Ejecutando limpieza manual...');
    await this.cleanupOldFiles();
    await this.expireOldOrders();
  }
}
