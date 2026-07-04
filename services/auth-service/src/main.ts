import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { LoggerInterceptor, LoggerService, createLogger } from '@portfolio/logger';
import { createSwaggerConfig } from '@infrastructure/swagger/swagger.config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.use(helmet());
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1', {
    exclude: ['.well-known/jwks.json'],
  });
  app.useGlobalInterceptors(app.get(LoggerInterceptor));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);
  const loggerService = app.get(LoggerService);

  const document = SwaggerModule.createDocument(
    app,
    createSwaggerConfig('Auth Service', 'Authentication and identity API for Portfolio OS'),
  );
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  loggerService.getLogger().info({ port }, 'auth-service started');
}

bootstrap().catch((error: unknown) => {
  createLogger({ service: 'auth-service', pretty: false }).fatal(
    { err: error },
    'Failed to start auth-service',
  );
  process.exit(1);
});
