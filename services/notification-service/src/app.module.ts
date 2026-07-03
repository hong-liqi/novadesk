import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  baseConfigSchema,
  databaseConfigSchema,
  observabilityConfigSchema,
  redisConfigSchema,
  validateConfig,
} from '@portfolio/config';
import { LoggerModule } from '@portfolio/logger';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { ObservabilityModule } from '@infrastructure/observability/observability.module';
import { QueueModule } from '@infrastructure/queue/queue.module';
import { HealthModule } from '@presentation/health/health.module';
import { MetricsModule } from '@presentation/metrics/metrics.module';

const configSchema = baseConfigSchema
  .merge(redisConfigSchema)
  .merge(databaseConfigSchema)
  .merge(observabilityConfigSchema);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => validateConfig(configSchema, env),
    }),
    LoggerModule,
    ObservabilityModule,
    DatabaseModule,
    QueueModule,
    HealthModule,
    MetricsModule,
  ],
})
export class AppModule {}
