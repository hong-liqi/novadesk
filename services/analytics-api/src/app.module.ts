import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  baseEnvSchema,
  createConfig,
  databaseEnvSchema,
  observabilityEnvSchema,
  redisEnvSchema,
} from '@portfolio/config';
import { LoggerModule } from '@portfolio/logger';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { ObservabilityModule } from '@infrastructure/observability/observability.module';
import { HealthModule } from '@presentation/health/health.module';
import { MetricsModule } from '@presentation/metrics/metrics.module';
import { AnalyticsModule } from '@modules/analytics/analytics.module';

const configSchema = baseEnvSchema
  .merge(redisEnvSchema)
  .merge(databaseEnvSchema)
  .merge(observabilityEnvSchema);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => createConfig(configSchema, env),
    }),
    LoggerModule,
    ObservabilityModule,
    DatabaseModule,
    HealthModule,
    MetricsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
