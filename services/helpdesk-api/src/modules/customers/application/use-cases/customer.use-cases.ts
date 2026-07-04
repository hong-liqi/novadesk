import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateCustomerDto,
  CustomerResponseDto,
  UpdateCustomerDto,
} from '../dto/customer.dto';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepositoryPort,
} from '../ports/customer.repository.port';
import type { CustomerEntity } from '../../domain/entities/customer.entity';

@Injectable()
export class ListCustomersUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly repository: CustomerRepositoryPort,
  ) {}

  async execute(workspaceId: string): Promise<CustomerResponseDto[]> {
    const items = await this.repository.findByWorkspace(workspaceId);
    return items.map(mapCustomer);
  }
}

@Injectable()
export class GetCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly repository: CustomerRepositoryPort,
  ) {}

  async execute(workspaceId: string, id: string): Promise<CustomerResponseDto> {
    const customer = await this.repository.findById(workspaceId, id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return mapCustomer(customer);
  }
}

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly repository: CustomerRepositoryPort,
  ) {}

  async execute(workspaceId: string, dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const customer = await this.repository.create({ workspaceId, ...dto });
    return mapCustomer(customer);
  }
}

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly repository: CustomerRepositoryPort,
  ) {}

  async execute(
    workspaceId: string,
    id: string,
    dto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const customer = await this.repository.findById(workspaceId, id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const updated = await this.repository.update(workspaceId, id, dto);
    return mapCustomer(updated);
  }
}

@Injectable()
export class DeleteCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly repository: CustomerRepositoryPort,
  ) {}

  async execute(workspaceId: string, id: string): Promise<void> {
    const customer = await this.repository.findById(workspaceId, id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    await this.repository.delete(workspaceId, id);
  }
}

function mapCustomer(customer: CustomerEntity): CustomerResponseDto {
  return {
    id: customer.id,
    workspaceId: customer.workspaceId,
    name: customer.name,
    email: customer.email,
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
  };
}
