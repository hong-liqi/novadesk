import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import {
  baseConfigSchema,
  observabilityConfigSchema,
  redisConfigSchema,
  validateConfig,
} from '@portfolio/config';
import { JwtAuthGuard } from '@portfolio/auth';
import { LoggerModule } from '@portfolio/logger';
import { ObservabilityModule } from '@infrastructure/observability/observability.module';
import { HealthModule } from '@presentation/health/health.module';
import { MetricsModule } from '@presentation/metrics/metrics.module';
import { ProxyModule } from '@presentation/proxy/proxy.module';

const configSchema = baseConfigSchema
  .merge(redisConfigSchema)
  .merge(observabilityConfigSchema);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => validateConfig(configSchema, env),
    }),
    LoggerModule,
    ObservabilityModule,
    HealthModule,
    MetricsModule,
    ProxyModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
