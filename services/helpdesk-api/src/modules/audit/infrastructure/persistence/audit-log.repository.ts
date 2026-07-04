import { Injectable } from '@nestjs/common';
import type { AuditLog } from '../../domain/entities/audit-log.entity';
import type { AuditLogRepositoryPort } from '../../application/ports/audit-log.repository.port';

@Injectable()
export class AuditLogRepository implements AuditLogRepositoryPort {
  findById(_id: string): Promise<AuditLog | null> {
    return Promise.resolve(null);
  }
}
