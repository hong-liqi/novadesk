import type { UserEntity, UserWithMemberships } from '../../domain/entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  name?: string;
  tenantId?: string;
  role?: string;
}

export interface UserRepositoryPort {
  findByEmail(email: string): Promise<(UserEntity & { passwordHash: string }) | null>;
  findById(id: string): Promise<UserWithMemberships | null>;
  create(input: CreateUserInput): Promise<UserWithMemberships>;
  emailExists(email: string): Promise<boolean>;
  count(): Promise<number>;
}
