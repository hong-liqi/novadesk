import type { INestApplication } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';

const LOCAL_FRONTEND_ORIGINS = [
  'http://localhost:3010',
  'http://localhost:3011',
  'http://localhost:3012',
  'http://localhost:3013',
  'http://localhost:3014',
] as const;

export function resolveCorsOrigins(configService: ConfigService): string[] {
  const configured = configService.get<string[]>('CORS_ORIGINS', []);
  if (configured.length > 0) {
    return configured;
  }

  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  if (nodeEnv === 'development' || nodeEnv === 'test') {
    return [...LOCAL_FRONTEND_ORIGINS];
  }

  return [];
}

export function configureGatewayCors(app: INestApplication, configService: ConfigService): void {
  const origins = resolveCorsOrigins(configService);
  if (origins.length === 0) {
    return;
  }

  app.enableCors({
    origin: origins,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Request-Id', 'X-Requested-With'],
    exposedHeaders: ['X-Request-Id'],
    maxAge: 86_400,
  });
}
