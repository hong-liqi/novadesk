import { Inject, Injectable } from '@nestjs/common';
import type { User } from '../../domain/entities/user.entity';
import { USER_REPOSITORY, type UserRepositoryPort } from '../ports/user.repository.port';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly repository: UserRepositoryPort,
  ) {}

  execute(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }
}
