import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import type { WorkspaceEntity } from '../../domain/entities/workspace.entity';
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  WorkspaceRepositoryPort,
} from '../../application/ports/workspace.repository.port';

@Injectable()
export class WorkspaceRepository implements WorkspaceRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<WorkspaceEntity[]> {
    const memberships = await this.prisma.workspaceMember.findMany({
      where: { userId },
      include: { workspace: true },
      orderBy: { createdAt: 'desc' },
    });
    return memberships.map((m) => m.workspace);
  }

  findById(id: string): Promise<WorkspaceEntity | null> {
    return this.prisma.workspace.findUnique({ where: { id } });
  }

  findBySlug(organizationId: string, slug: string): Promise<WorkspaceEntity | null> {
    return this.prisma.workspace.findUnique({
      where: { organizationId_slug: { organizationId, slug } },
    });
  }

  create(input: CreateWorkspaceInput): Promise<WorkspaceEntity> {
    return this.prisma.workspace.create({ data: input });
  }

  update(id: string, input: UpdateWorkspaceInput): Promise<WorkspaceEntity> {
    return this.prisma.workspace.update({ where: { id }, data: input });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.workspace.delete({ where: { id } });
  }
}
