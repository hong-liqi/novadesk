import type { OrganizationEntity } from '../../domain/entities/organization.entity';

export const ORGANIZATION_REPOSITORY = Symbol('ORGANIZATION_REPOSITORY');

export interface CreateOrganizationInput {
  name: string;
  slug: string;
}

export interface UpdateOrganizationInput {
  name?: string;
  slug?: string;
}

export interface OrganizationRepositoryPort {
  findAll(): Promise<OrganizationEntity[]>;
  findById(id: string): Promise<OrganizationEntity | null>;
  findBySlug(slug: string): Promise<OrganizationEntity | null>;
  create(input: CreateOrganizationInput): Promise<OrganizationEntity>;
  update(id: string, input: UpdateOrganizationInput): Promise<OrganizationEntity>;
  delete(id: string): Promise<void>;
}
