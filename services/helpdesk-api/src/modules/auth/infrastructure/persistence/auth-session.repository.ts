import { Injectable } from '@nestjs/common';
import type { AuthSession } from '../../domain/entities/auth-session.entity';
import type { AuthSessionRepositoryPort } from '../../application/ports/auth-session.repository.port';

@Injectable()
export class AuthSessionRepository implements AuthSessionRepositoryPort {
  findById(_id: string): Promise<AuthSession | null> {
    return Promise.resolve(null);
  }
}
