import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateOrganizationDto,
  OrganizationResponseDto,
  UpdateOrganizationDto,
} from '../dto/organization.dto';
import {
  ORGANIZATION_REPOSITORY,
  type OrganizationRepositoryPort,
} from '../ports/organization.repository.port';
import type { OrganizationEntity } from '../../domain/entities/organization.entity';

@Injectable()
export class ListOrganizationsUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repository: OrganizationRepositoryPort,
  ) {}

  async execute(): Promise<OrganizationResponseDto[]> {
    const items = await this.repository.findAll();
    return items.map(mapOrganization);
  }
}

@Injectable()
export class GetOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repository: OrganizationRepositoryPort,
  ) {}

  async execute(id: string): Promise<OrganizationResponseDto> {
    const org = await this.repository.findById(id);
    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    return mapOrganization(org);
  }
}

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repository: OrganizationRepositoryPort,
  ) {}

  async execute(dto: CreateOrganizationDto): Promise<OrganizationResponseDto> {
    const existing = await this.repository.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException('Organization slug already exists');
    }
    const org = await this.repository.create(dto);
    return mapOrganization(org);
  }
}

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repository: OrganizationRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateOrganizationDto): Promise<OrganizationResponseDto> {
    const org = await this.repository.findById(id);
    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    if (dto.slug && dto.slug !== org.slug) {
      const existing = await this.repository.findBySlug(dto.slug);
      if (existing) {
        throw new ConflictException('Organization slug already exists');
      }
    }
    const updated = await this.repository.update(id, dto);
    return mapOrganization(updated);
  }
}

@Injectable()
export class DeleteOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repository: OrganizationRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const org = await this.repository.findById(id);
    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    await this.repository.delete(id);
  }
}

function mapOrganization(org: OrganizationEntity): OrganizationResponseDto {
  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    createdAt: org.createdAt.toISOString(),
    updatedAt: org.updatedAt.toISOString(),
  };
}
