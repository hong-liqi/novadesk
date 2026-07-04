import type { AuditLog } from '../../domain/entities/audit-log.entity';

export const AUDITLOG_REPOSITORY = Symbol('AUDITLOG_REPOSITORY');

export interface AuditLogRepositoryPort {
  findById(id: string): Promise<AuditLog | null>;
}
