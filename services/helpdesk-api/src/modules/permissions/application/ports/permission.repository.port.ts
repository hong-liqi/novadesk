import type { Permission } from '../../domain/entities/permission.entity';

export const PERMISSION_REPOSITORY = Symbol('PERMISSION_REPOSITORY');

export interface PermissionRepositoryPort {
  findById(id: string): Promise<Permission | null>;
}
