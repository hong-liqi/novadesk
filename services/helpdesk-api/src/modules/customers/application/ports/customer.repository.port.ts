import type { CustomerEntity } from '../../domain/entities/customer.entity';

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');

export interface CreateCustomerInput {
  workspaceId: string;
  name: string;
  email?: string;
}

export interface UpdateCustomerInput {
  name?: string;
  email?: string | null;
}

export interface CustomerRepositoryPort {
  findByWorkspace(workspaceId: string): Promise<CustomerEntity[]>;
  findById(workspaceId: string, id: string): Promise<CustomerEntity | null>;
  create(input: CreateCustomerInput): Promise<CustomerEntity>;
  update(workspaceId: string, id: string, input: UpdateCustomerInput): Promise<CustomerEntity>;
  delete(workspaceId: string, id: string): Promise<void>;
}
