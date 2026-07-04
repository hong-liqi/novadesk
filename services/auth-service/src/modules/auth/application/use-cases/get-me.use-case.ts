import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { MeResponse } from '../dto/auth.dto';
import { USER_REPOSITORY, type UserRepositoryPort } from '../ports/user.repository.port';

@Injectable()
export class GetMeUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly users: UserRepositoryPort) {}

  async execute(userId: string): Promise<MeResponse> {
    const user = await this.users.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      tenants: user.memberships.map((membership) => ({
        id: membership.tenantId,
        name: membership.tenantName,
        slug: membership.tenantSlug,
        role: membership.role,
      })),
    };
  }
}
