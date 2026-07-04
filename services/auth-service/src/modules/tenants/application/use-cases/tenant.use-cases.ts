import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { TenantResponse } from '../dto/tenant.dto';
import { TENANT_REPOSITORY, type TenantRepositoryPort } from '../ports/tenant.repository.port';

@Injectable()
export class ListTenantsUseCase {
  constructor(@Inject(TENANT_REPOSITORY) private readonly tenants: TenantRepositoryPort) {}

  async execute(): Promise<TenantResponse[]> {
    const items = await this.tenants.findAll();
    return items.map(mapTenant);
  }
}

@Injectable()
export class GetTenantUseCase {
  constructor(@Inject(TENANT_REPOSITORY) private readonly tenants: TenantRepositoryPort) {}

  async execute(id: string): Promise<TenantResponse> {
    const tenant = await this.tenants.findById(id);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return mapTenant(tenant);
  }
}

@Injectable()
export class CreateTenantUseCase {
  constructor(@Inject(TENANT_REPOSITORY) private readonly tenants: TenantRepositoryPort) {}

  async execute(input: { name: string; slug: string }): Promise<TenantResponse> {
    const existing = await this.tenants.findBySlug(input.slug);
    if (existing) {
      throw new ConflictException('Tenant slug already exists');
    }

    const tenant = await this.tenants.create(input);
    return mapTenant(tenant);
  }
}

@Injectable()
export class UpdateTenantUseCase {
  constructor(@Inject(TENANT_REPOSITORY) private readonly tenants: TenantRepositoryPort) {}

  async execute(id: string, input: { name?: string; slug?: string; isActive?: boolean }) {
    const tenant = await this.tenants.findById(id);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    if (input.slug && input.slug !== tenant.slug) {
      const existing = await this.tenants.findBySlug(input.slug);
      if (existing) {
        throw new ConflictException('Tenant slug already exists');
      }
    }

    const updated = await this.tenants.update(id, input);
    return mapTenant(updated);
  }
}

@Injectable()
export class DeleteTenantUseCase {
  constructor(@Inject(TENANT_REPOSITORY) private readonly tenants: TenantRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const tenant = await this.tenants.findById(id);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    await this.tenants.delete(id);
  }
}

function mapTenant(tenant: {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): TenantResponse {
  return {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    isActive: tenant.isActive,
    createdAt: tenant.createdAt.toISOString(),
    updatedAt: tenant.updatedAt.toISOString(),
  };
}
