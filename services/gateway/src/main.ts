import 'reflect-metadata';
import type { IncomingMessage } from 'http';
import type { Socket } from 'net';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { LoggerInterceptor, LoggerService, createLogger } from '@novadesk/logger';
import { createSwaggerConfig } from '@infrastructure/swagger/swagger.config';
import { ProxyService } from '@infrastructure/proxy/proxy.service';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.use(helmet());
  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(app.get(LoggerInterceptor));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const loggerService = app.get(LoggerService);
  const proxyService = app.get(ProxyService);

  const document = SwaggerModule.createDocument(
    app,
    createSwaggerConfig('API Gateway', 'Entry point and routing layer for NovaDesk'),
  );
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port, '0.0.0.0');

  const server = app.getHttpServer() as {
    on(
      event: 'upgrade',
      listener: (req: IncomingMessage, socket: Socket, head: Buffer) => void,
    ): void;
  };

  server.on('upgrade', (request, socket, head) => {
    const path = request.url?.split('?')[0] ?? '';
    const route = proxyService.matchRoute(path);
    if (!route?.ws) {
      socket.destroy();
      return;
    }

    proxyService.upgrade(route, request, socket, head);
  });

  loggerService.getLogger().info({ port }, 'gateway started');
}

bootstrap().catch((error: unknown) => {
  createLogger({ service: 'gateway', pretty: false }).fatal(
    { err: error },
    'Failed to start gateway',
  );
  process.exit(1);
});
