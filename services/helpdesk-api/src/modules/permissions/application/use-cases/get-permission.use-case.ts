import { Inject, Injectable } from '@nestjs/common';
import type { Permission } from '../../domain/entities/permission.entity';
import {
  PERMISSION_REPOSITORY,
  type PermissionRepositoryPort,
} from '../ports/permission.repository.port';

@Injectable()
export class GetPermissionUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly repository: PermissionRepositoryPort,
  ) {}

  execute(id: string): Promise<Permission | null> {
    return this.repository.findById(id);
  }
}
