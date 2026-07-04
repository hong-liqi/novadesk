import { Inject, Injectable } from '@nestjs/common';
import type { AuthSession } from '../../domain/entities/auth-session.entity';
import {
  AUTHSESSION_REPOSITORY,
  type AuthSessionRepositoryPort,
} from '../ports/auth-session.repository.port';

@Injectable()
export class GetAuthSessionUseCase {
  constructor(
    @Inject(AUTHSESSION_REPOSITORY)
    private readonly repository: AuthSessionRepositoryPort,
  ) {}

  execute(id: string): Promise<AuthSession | null> {
    return this.repository.findById(id);
  }
}
