import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepositoryPort,
} from '@modules/customers/application/ports/customer.repository.port';
import type { ContactResponseDto, CreateContactDto, UpdateContactDto } from '../dto/contact.dto';
import { CONTACT_REPOSITORY, type ContactRepositoryPort } from '../ports/contact.repository.port';
import type { ContactEntity } from '../../domain/entities/contact.entity';

@Injectable()
export class ListContactsUseCase {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly repository: ContactRepositoryPort,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customers: CustomerRepositoryPort,
  ) {}

  async execute(workspaceId: string, customerId: string): Promise<ContactResponseDto[]> {
    const customer = await this.customers.findById(workspaceId, customerId);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const items = await this.repository.findByCustomer(workspaceId, customerId);
    return items.map(mapContact);
  }
}

@Injectable()
export class GetContactUseCase {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly repository: ContactRepositoryPort,
  ) {}

  async execute(workspaceId: string, id: string): Promise<ContactResponseDto> {
    const contact = await this.repository.findById(workspaceId, id);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    return mapContact(contact);
  }
}

@Injectable()
export class CreateContactUseCase {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly repository: ContactRepositoryPort,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customers: CustomerRepositoryPort,
  ) {}

  async execute(
    workspaceId: string,
    customerId: string,
    dto: CreateContactDto,
  ): Promise<ContactResponseDto> {
    const customer = await this.customers.findById(workspaceId, customerId);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const contact = await this.repository.create({ customerId, ...dto });
    return mapContact(contact);
  }
}

@Injectable()
export class UpdateContactUseCase {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly repository: ContactRepositoryPort,
  ) {}

  async execute(
    workspaceId: string,
    id: string,
    dto: UpdateContactDto,
  ): Promise<ContactResponseDto> {
    const contact = await this.repository.findById(workspaceId, id);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    const updated = await this.repository.update(workspaceId, id, dto);
    return mapContact(updated);
  }
}

@Injectable()
export class DeleteContactUseCase {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly repository: ContactRepositoryPort,
  ) {}

  async execute(workspaceId: string, id: string): Promise<void> {
    const contact = await this.repository.findById(workspaceId, id);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    await this.repository.delete(workspaceId, id);
  }
}

function mapContact(contact: ContactEntity): ContactResponseDto {
  return {
    id: contact.id,
    customerId: contact.customerId,
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    createdAt: contact.createdAt.toISOString(),
    updatedAt: contact.updatedAt.toISOString(),
  };
}
