import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

// Load environment variables before bootstrapping
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Log all incoming requests
  app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url} from ${req.ip}`);
    next();
  });

  // Security headers with helmet
  app.use(helmet());

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const port = process.env.PORT || 4000;
  console.log(`📍 PORT environment variable: ${process.env.PORT || 'NOT SET'}`);
  console.log(`📍 Will listen on port: ${port}`);

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend running on port ${port}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(
    `   Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`,
  );
  console.log(`   Listening on: http://0.0.0.0:${port}`);

  // Log uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
}
void bootstrap();
