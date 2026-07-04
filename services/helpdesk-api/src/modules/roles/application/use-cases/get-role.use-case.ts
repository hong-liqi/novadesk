import { Inject, Injectable } from '@nestjs/common';
import type { Role } from '../../domain/entities/role.entity';
import { ROLE_REPOSITORY, type RoleRepositoryPort } from '../ports/role.repository.port';

@Injectable()
export class GetRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly repository: RoleRepositoryPort,
  ) {}

  execute(id: string): Promise<Role | null> {
    return this.repository.findById(id);
  }
}
