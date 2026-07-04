import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import type { CustomerEntity } from '../../domain/entities/customer.entity';
import type {
  CreateCustomerInput,
  CustomerRepositoryPort,
  UpdateCustomerInput,
} from '../../application/ports/customer.repository.port';

@Injectable()
export class CustomerRepository implements CustomerRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  findByWorkspace(workspaceId: string): Promise<CustomerEntity[]> {
    return this.prisma.customer.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(workspaceId: string, id: string): Promise<CustomerEntity | null> {
    return this.prisma.customer.findFirst({ where: { id, workspaceId } });
  }

  create(input: CreateCustomerInput): Promise<CustomerEntity> {
    return this.prisma.customer.create({ data: input });
  }

  async update(
    workspaceId: string,
    id: string,
    input: UpdateCustomerInput,
  ): Promise<CustomerEntity> {
    const existing = await this.findById(workspaceId, id);
    if (!existing) {
      throw new Error('Customer not found');
    }
    return this.prisma.customer.update({ where: { id }, data: input });
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    const existing = await this.findById(workspaceId, id);
    if (!existing) {
      return;
    }
    await this.prisma.customer.delete({ where: { id } });
  }
}
