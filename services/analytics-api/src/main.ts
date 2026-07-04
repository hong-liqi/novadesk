import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { LoggerInterceptor, LoggerService, createLogger } from '@novadesk/logger';
import { createSwaggerConfig } from '@infrastructure/swagger/swagger.config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.use(helmet());
  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(app.get(LoggerInterceptor));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3004);
  const loggerService = app.get(LoggerService);

  const document = SwaggerModule.createDocument(
    app,
    createSwaggerConfig(
      'Analytics API',
      'Workspace KPIs, ticket trends, and CSV exports for NovaDesk',
    ),
  );
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  loggerService.getLogger().info({ port }, 'analytics-api started');
}

bootstrap().catch((error: unknown) => {
  createLogger({ service: 'analytics-api', pretty: false }).fatal(
    { err: error },
    'Failed to start analytics-api',
  );
  process.exit(1);
});
