import type { TenantEntity } from '../../domain/entities/tenant.entity';

export const TENANT_REPOSITORY = Symbol('TENANT_REPOSITORY');

export interface CreateTenantInput {
  name: string;
  slug: string;
}

export interface UpdateTenantInput {
  name?: string;
  slug?: string;
  isActive?: boolean;
}

export interface TenantRepositoryPort {
  findAll(): Promise<TenantEntity[]>;
  findById(id: string): Promise<TenantEntity | null>;
  findBySlug(slug: string): Promise<TenantEntity | null>;
  create(input: CreateTenantInput): Promise<TenantEntity>;
  update(id: string, input: UpdateTenantInput): Promise<TenantEntity>;
  delete(id: string): Promise<void>;
}
