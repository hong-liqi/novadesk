import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  authConfigSchema,
  baseConfigSchema,
  databaseConfigSchema,
  observabilityConfigSchema,
  redisConfigSchema,
  validateConfig,
} from '@novadesk/config';
import { LoggerModule } from '@novadesk/logger';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { ObservabilityModule } from '@infrastructure/observability/observability.module';
import { ChatModule } from '@modules/chat/chat.module';
import { HealthModule } from '@presentation/health/health.module';
import { MetricsModule } from '@presentation/metrics/metrics.module';

const configSchema = baseConfigSchema
  .merge(redisConfigSchema)
  .merge(databaseConfigSchema)
  .merge(observabilityConfigSchema)
  .merge(authConfigSchema);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => validateConfig(configSchema, env),
    }),
    LoggerModule,
    ObservabilityModule,
    DatabaseModule,
    HealthModule,
    MetricsModule,
    ChatModule,
  ],
})
export class AppModule {}
