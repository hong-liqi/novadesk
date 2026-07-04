import { Injectable } from '@nestjs/common';
import type { User } from '../../domain/entities/user.entity';
import type { UserRepositoryPort } from '../../application/ports/user.repository.port';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  findById(_id: string): Promise<User | null> {
    return Promise.resolve(null);
  }
}
