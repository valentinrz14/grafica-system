import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const isProduction = process.env.NODE_ENV === 'production';

    if (!connectionString) {
      throw new Error(
        'DATABASE_URL is not defined. Please check your .env file.',
      );
    }

    super({
      datasources: {
        db: {
          url: connectionString,
        },
      },
      log: isProduction
        ? ['error', 'warn']
        : ['query', 'info', 'warn', 'error'],
      errorFormat: isProduction ? 'minimal' : 'pretty',
    });

    this.logger.log('PrismaService initialized');
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connection established successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database connection closed gracefully');
    } catch (error) {
      this.logger.error('Error closing database connection:', error);
    }
  }

  /**
   * Clean disconnection helper for tests and graceful shutdown
   */
  async cleanupConnection() {
    await this.$disconnect();
  }
}
