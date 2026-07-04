import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';
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
import { EmailModule } from '@modules/email/email.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { HealthModule } from '@presentation/health/health.module';
import { MetricsModule } from '@presentation/metrics/metrics.module';

const smtpConfigSchema = z.object({
  SMTP_HOST: z.string().min(1).default('localhost'),
  SMTP_PORT: z.coerce.number().int().positive().default(1025),
  SMTP_FROM: z.string().email().default('noreply@portfolio-os.dev'),
});

const configSchema = baseConfigSchema
  .merge(redisConfigSchema)
  .merge(databaseConfigSchema)
  .merge(observabilityConfigSchema)
  .merge(smtpConfigSchema);

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
    NotificationsModule,
    EmailModule,
  ],
})
export class AppModule {}
