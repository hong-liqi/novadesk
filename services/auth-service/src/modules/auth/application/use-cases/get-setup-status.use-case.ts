import { Inject, Injectable } from '@nestjs/common';
import type { SetupStatusResponse } from '../dto/auth.dto';
import { USER_REPOSITORY, type UserRepositoryPort } from '../ports/user.repository.port';

@Injectable()
export class GetSetupStatusUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly users: UserRepositoryPort) {}

  async execute(): Promise<SetupStatusResponse> {
    return {
      needsBootstrap: (await this.users.count()) === 0,
    };
  }
}
