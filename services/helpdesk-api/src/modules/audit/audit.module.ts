import { Module } from '@nestjs/common';
import { AuditLogController } from './presentation/controllers/audit-log.controller';
import { AuditLogRepository } from './infrastructure/persistence/audit-log.repository';
import { AUDITLOG_REPOSITORY } from './application/ports/audit-log.repository.port';

@Module({
  controllers: [AuditLogController],
  providers: [
    {
      provide: AUDITLOG_REPOSITORY,
      useClass: AuditLogRepository,
    },
  ],
  exports: [AUDITLOG_REPOSITORY],
})
export class AuditModule {}
