import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import type { Role } from '@novadesk/shared';
import type { TenantRole } from '@generated/prisma';
import type { UserWithMemberships } from '../../domain/entities/user.entity';
import type {
  CreateUserInput,
  UserRepositoryPort,
} from '../../application/ports/user.repository.port';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function toRole(role: TenantRole): Role {
  return role;
}

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<UserWithMemberships | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        tenants: {
          include: { tenant: true },
        },
      },
    });

    if (!user) {
      return null;
    }

    return this.mapUser(user);
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { email } });
    return count > 0;
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  async create(input: CreateUserInput): Promise<UserWithMemberships> {
    const emailLocalPart = input.email.split('@')[0] ?? 'user';
    const tenantSlug = slugify(emailLocalPart) || `tenant-${String(Date.now())}`;

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        name: input.name,
        tenants: {
          create: {
            role: (input.role as TenantRole | undefined) ?? 'user',
            tenant: {
              create: {
                name: input.name ? `${input.name}'s Workspace` : `${emailLocalPart}'s Workspace`,
                slug: tenantSlug,
              },
            },
          },
        },
      },
      include: {
        tenants: {
          include: { tenant: true },
        },
      },
    });

    return this.mapUser(user);
  }

  private mapUser(user: {
    id: string;
    email: string;
    name: string | null;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    tenants: {
      tenantId: string;
      role: TenantRole;
      tenant: { name: string; slug: string };
    }[];
  }): UserWithMemberships {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      memberships: user.tenants.map((membership) => ({
        tenantId: membership.tenantId,
        tenantName: membership.tenant.name,
        tenantSlug: membership.tenant.slug,
        role: toRole(membership.role),
      })),
    };
  }
}
