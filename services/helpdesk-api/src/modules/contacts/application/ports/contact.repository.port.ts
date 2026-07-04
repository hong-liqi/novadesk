import type { ContactEntity } from '../../domain/entities/contact.entity';

export const CONTACT_REPOSITORY = Symbol('CONTACT_REPOSITORY');

export interface CreateContactInput {
  customerId: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface UpdateContactInput {
  name?: string;
  email?: string | null;
  phone?: string | null;
}

export interface ContactRepositoryPort {
  findByCustomer(workspaceId: string, customerId: string): Promise<ContactEntity[]>;
  findById(workspaceId: string, id: string): Promise<ContactEntity | null>;
  create(input: CreateContactInput): Promise<ContactEntity>;
  update(workspaceId: string, id: string, input: UpdateContactInput): Promise<ContactEntity>;
  delete(workspaceId: string, id: string): Promise<void>;
}
