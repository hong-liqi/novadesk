import type { AuthSession } from '../../domain/entities/auth-session.entity';

export const AUTHSESSION_REPOSITORY = Symbol('AUTHSESSION_REPOSITORY');

export interface AuthSessionRepositoryPort {
  findById(id: string): Promise<AuthSession | null>;
}
