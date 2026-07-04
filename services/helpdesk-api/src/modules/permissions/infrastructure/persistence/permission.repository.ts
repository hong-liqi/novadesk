import { Injectable } from '@nestjs/common';
import type { Permission } from '../../domain/entities/permission.entity';
import type { PermissionRepositoryPort } from '../../application/ports/permission.repository.port';

@Injectable()
export class PermissionRepository implements PermissionRepositoryPort {
  findById(_id: string): Promise<Permission | null> {
    return Promise.resolve(null);
  }
}
