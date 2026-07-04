import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  authConfigSchema,
  baseConfigSchema,
  gatewayEnvSchema,
  observabilityConfigSchema,
  redisConfigSchema,
  validateConfig,
} from '@novadesk/config';
import { JwtAuthGuard } from '@novadesk/auth';
import { LoggerModule } from '@novadesk/logger';
import { ProxyInfrastructureModule } from '@infrastructure/proxy/proxy-infrastructure.module';
import { ObservabilityModule } from '@infrastructure/observability/observability.module';
import { HealthModule } from '@presentation/health/health.module';
import { MetricsModule } from '@presentation/metrics/metrics.module';
import { ProxyModule } from '@presentation/proxy/proxy.module';

const configSchema = baseConfigSchema
  .merge(redisConfigSchema)
  .merge(observabilityConfigSchema)
  .merge(authConfigSchema)
  .merge(gatewayEnvSchema);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => validateConfig(configSchema, env),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL', 60_000),
          limit: configService.get<number>('THROTTLE_LIMIT', 100),
        },
      ],
    }),
    LoggerModule,
    ObservabilityModule,
    ProxyInfrastructureModule,
    HealthModule,
    MetricsModule,
    ProxyModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
