import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  authEnvSchema,
  baseEnvSchema,
  createConfig,
  databaseEnvSchema,
  observabilityEnvSchema,
  redisEnvSchema,
} from '@novadesk/config';
import { LoggerModule } from '@novadesk/logger';
import { AuthServicesModule } from '@infrastructure/auth/auth-services.module';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { ObservabilityModule } from '@infrastructure/observability/observability.module';
import { QueueModule } from '@infrastructure/queue/queue.module';
import { RedisModule } from '@infrastructure/redis/redis.module';
import { AuthModule } from '@modules/auth/auth.module';
import { JwksModule } from '@modules/jwks/jwks.module';
import { TenantsModule } from '@modules/tenants/tenants.module';
import { SettingsModule } from '@modules/settings/settings.module';
import { HealthModule } from '@presentation/health/health.module';
import { MetricsModule } from '@presentation/metrics/metrics.module';

const configSchema = baseEnvSchema
  .merge(redisEnvSchema)
  .merge(databaseEnvSchema)
  .merge(observabilityEnvSchema)
  .merge(authEnvSchema);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => createConfig(configSchema, env),
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 60,
      },
      {
        name: 'auth',
        ttl: 900_000,
        limit: 20,
      },
    ]),
    LoggerModule,
    ObservabilityModule,
    RedisModule,
    DatabaseModule,
    AuthServicesModule,
    QueueModule,
    HealthModule,
    MetricsModule,
    AuthModule,
    TenantsModule,
    SettingsModule,
    JwksModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
