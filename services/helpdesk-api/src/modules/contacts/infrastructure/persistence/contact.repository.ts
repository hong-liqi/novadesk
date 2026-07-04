import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import type { ContactEntity } from '../../domain/entities/contact.entity';
import type {
  ContactRepositoryPort,
  CreateContactInput,
  UpdateContactInput,
} from '../../application/ports/contact.repository.port';

@Injectable()
export class ContactRepository implements ContactRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByCustomer(workspaceId: string, customerId: string): Promise<ContactEntity[]> {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, workspaceId },
    });
    if (!customer) {
      return [];
    }
    return this.prisma.contact.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(workspaceId: string, id: string): Promise<ContactEntity | null> {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
      include: { customer: true },
    });
    if (!contact) {
      return null;
    }
    if (contact.customer.workspaceId !== workspaceId) {
      return null;
    }
    const { customer, ...entity } = contact;
    void customer;
    return entity;
  }

  create(input: CreateContactInput): Promise<ContactEntity> {
    return this.prisma.contact.create({ data: input });
  }

  async update(workspaceId: string, id: string, input: UpdateContactInput): Promise<ContactEntity> {
    const existing = await this.findById(workspaceId, id);
    if (!existing) {
      throw new Error('Contact not found');
    }
    return this.prisma.contact.update({ where: { id }, data: input });
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    const existing = await this.findById(workspaceId, id);
    if (!existing) {
      return;
    }
    await this.prisma.contact.delete({ where: { id } });
  }
}
