import { Inject, Injectable } from '@nestjs/common';
import type { AuditLog } from '../../domain/entities/audit-log.entity';
import {
  AUDITLOG_REPOSITORY,
  type AuditLogRepositoryPort,
} from '../ports/audit-log.repository.port';

@Injectable()
export class GetAuditLogUseCase {
  constructor(
    @Inject(AUDITLOG_REPOSITORY)
    private readonly repository: AuditLogRepositoryPort,
  ) {}

  execute(id: string): Promise<AuditLog | null> {
    return this.repository.findById(id);
  }
}
