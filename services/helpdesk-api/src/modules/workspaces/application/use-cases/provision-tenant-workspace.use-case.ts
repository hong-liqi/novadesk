import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import type { WorkspaceEntity } from '../../domain/entities/workspace.entity';

export interface ProvisionTenantWorkspaceInput {
  userId: string;
  tenantId: string;
  email: string;
  name?: string;
}

@Injectable()
export class ProvisionTenantWorkspaceUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: ProvisionTenantWorkspaceInput): Promise<WorkspaceEntity> {
    const emailLocalPart = input.email.split('@')[0] ?? 'user';
    const trimmedName = input.name?.trim();
    const displayName = trimmedName?.length ? trimmedName : emailLocalPart;
    const orgSlug = `org-${input.tenantId}`;

    return this.prisma.$transaction(async (tx) => {
      await tx.user.upsert({
        where: { id: input.userId },
        create: {
          id: input.userId,
          email: input.email.toLowerCase(),
          name: input.name,
        },
        update: {
          email: input.email.toLowerCase(),
          ...(input.name ? { name: input.name } : {}),
        },
      });

      await tx.organization.upsert({
        where: { id: input.tenantId },
        create: {
          id: input.tenantId,
          name: `${displayName}'s Organization`,
          slug: orgSlug,
        },
        update: {},
      });

      const workspace = await tx.workspace.upsert({
        where: { id: input.tenantId },
        create: {
          id: input.tenantId,
          organizationId: input.tenantId,
          name: `${displayName}'s Workspace`,
          slug: 'default',
        },
        update: {},
      });

      await tx.workspaceMember.upsert({
        where: {
          workspaceId_userId: {
            workspaceId: workspace.id,
            userId: input.userId,
          },
        },
        create: {
          workspaceId: workspace.id,
          userId: input.userId,
        },
        update: {},
      });

      return workspace;
    });
  }
}
