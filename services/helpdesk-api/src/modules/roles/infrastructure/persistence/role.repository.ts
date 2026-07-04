import { Injectable } from '@nestjs/common';
import type { Role } from '../../domain/entities/role.entity';
import type { RoleRepositoryPort } from '../../application/ports/role.repository.port';

@Injectable()
export class RoleRepository implements RoleRepositoryPort {
  findById(_id: string): Promise<Role | null> {
    return Promise.resolve(null);
  }
}
