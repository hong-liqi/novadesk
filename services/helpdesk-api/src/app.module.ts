import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { QueueModule } from '@infrastructure/queue/queue.module';
import { HealthModule } from '@presentation/health/health.module';
import { MetricsModule } from '@presentation/metrics/metrics.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { OrganizationsModule } from '@modules/organizations/organizations.module';
import { WorkspacesModule } from '@modules/workspaces/workspaces.module';
import { TeamsModule } from '@modules/teams/teams.module';
import { PermissionsModule } from '@modules/permissions/permissions.module';
import { RolesModule } from '@modules/roles/roles.module';
import { CustomersModule } from '@modules/customers/customers.module';
import { ContactsModule } from '@modules/contacts/contacts.module';
import { TicketsModule } from '@modules/tickets/tickets.module';
import { MessagesModule } from '@modules/messages/messages.module';
import { ChannelsModule } from '@modules/channels/channels.module';
import { AutomationsModule } from '@modules/automations/automations.module';
import { KnowledgeBaseModule } from '@modules/knowledge-base/knowledge-base.module';
import { AiModule } from '@modules/ai/ai.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { SettingsModule } from '@modules/settings/settings.module';
import { AuditModule } from '@modules/audit/audit.module';
import { FilesModule } from '@modules/files/files.module';
import { DashboardModule } from '@modules/dashboard/dashboard.module';
import { AnalyticsModule } from '@modules/analytics/analytics.module';
import { SearchModule } from '@modules/search/search.module';
import { RequestContextMiddleware } from '@presentation/middlewares/request-context.middleware';
import { WorkspaceContextMiddleware } from '@presentation/middlewares/workspace-context.middleware';

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
    QueueModule,
    HealthModule,
    MetricsModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    WorkspacesModule,
    TeamsModule,
    PermissionsModule,
    RolesModule,
    CustomersModule,
    ContactsModule,
    TicketsModule,
    MessagesModule,
    ChannelsModule,
    AutomationsModule,
    KnowledgeBaseModule,
    AiModule,
    NotificationsModule,
    SettingsModule,
    AuditModule,
    FilesModule,
    DashboardModule,
    AnalyticsModule,
    SearchModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestContextMiddleware, WorkspaceContextMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
