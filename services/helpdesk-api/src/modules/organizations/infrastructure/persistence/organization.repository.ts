import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import type { OrganizationEntity } from '../../domain/entities/organization.entity';
import type {
  CreateOrganizationInput,
  OrganizationRepositoryPort,
  UpdateOrganizationInput,
} from '../../application/ports/organization.repository.port';

@Injectable()
export class OrganizationRepository implements OrganizationRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<OrganizationEntity[]> {
    return this.prisma.organization.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findById(id: string): Promise<OrganizationEntity | null> {
    return this.prisma.organization.findUnique({ where: { id } });
  }

  findBySlug(slug: string): Promise<OrganizationEntity | null> {
    return this.prisma.organization.findUnique({ where: { slug } });
  }

  create(input: CreateOrganizationInput): Promise<OrganizationEntity> {
    return this.prisma.organization.create({ data: input });
  }

  update(id: string, input: UpdateOrganizationInput): Promise<OrganizationEntity> {
    return this.prisma.organization.update({ where: { id }, data: input });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.organization.delete({ where: { id } });
  }
}
