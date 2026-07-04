import type { Role } from '../../domain/entities/role.entity';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface RoleRepositoryPort {
  findById(id: string): Promise<Role | null>;
}
