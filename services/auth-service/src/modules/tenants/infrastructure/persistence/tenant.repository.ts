import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import type { TenantEntity } from '../../domain/entities/tenant.entity';
import type {
  CreateTenantInput,
  TenantRepositoryPort,
  UpdateTenantInput,
} from '../../application/ports/tenant.repository.port';

@Injectable()
export class TenantRepository implements TenantRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TenantEntity[]> {
    return this.prisma.tenant.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string): Promise<TenantEntity | null> {
    return this.prisma.tenant.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<TenantEntity | null> {
    return this.prisma.tenant.findUnique({ where: { slug } });
  }

  async create(input: CreateTenantInput): Promise<TenantEntity> {
    return this.prisma.tenant.create({ data: input });
  }

  async update(id: string, input: UpdateTenantInput): Promise<TenantEntity> {
    return this.prisma.tenant.update({ where: { id }, data: input });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tenant.delete({ where: { id } });
  }
}
