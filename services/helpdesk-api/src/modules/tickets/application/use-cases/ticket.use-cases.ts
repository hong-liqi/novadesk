import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PaginatedResult } from '@shared/types/pagination';
import type {
  AssignTicketDto,
  CreateTicketDto,
  ListTicketsQueryDto,
  TicketResponseDto,
  UpdateTicketDto,
  UpdateTicketStatusDto,
} from '../dto/ticket.dto';
import { TICKET_REPOSITORY, type TicketRepositoryPort } from '../ports/ticket.repository.port';
import type { TicketEntity } from '../../domain/entities/ticket.entity';

@Injectable()
export class ListTicketsUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly repository: TicketRepositoryPort,
  ) {}

  async execute(
    workspaceId: string,
    query: ListTicketsQueryDto,
  ): Promise<PaginatedResult<TicketResponseDto>> {
    const result = await this.repository.findMany({
      workspaceId,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      status: query.status,
    });
    return {
      ...result,
      items: result.items.map(mapTicket),
    };
  }
}

@Injectable()
export class GetTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly repository: TicketRepositoryPort,
  ) {}

  async execute(workspaceId: string, id: string): Promise<TicketResponseDto> {
    const ticket = await this.repository.findById(workspaceId, id);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return mapTicket(ticket);
  }
}

@Injectable()
export class CreateTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly repository: TicketRepositoryPort,
  ) {}

  async execute(workspaceId: string, dto: CreateTicketDto): Promise<TicketResponseDto> {
    const ticket = await this.repository.create({ workspaceId, ...dto });
    return mapTicket(ticket);
  }
}

@Injectable()
export class UpdateTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly repository: TicketRepositoryPort,
  ) {}

  async execute(workspaceId: string, id: string, dto: UpdateTicketDto): Promise<TicketResponseDto> {
    const ticket = await this.repository.findById(workspaceId, id);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    const updated = await this.repository.update(workspaceId, id, dto);
    return mapTicket(updated);
  }
}

@Injectable()
export class UpdateTicketStatusUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly repository: TicketRepositoryPort,
  ) {}

  async execute(
    workspaceId: string,
    id: string,
    dto: UpdateTicketStatusDto,
  ): Promise<TicketResponseDto> {
    const ticket = await this.repository.findById(workspaceId, id);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    const updated = await this.repository.updateStatus(workspaceId, id, dto.status);
    return mapTicket(updated);
  }
}

@Injectable()
export class AssignTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly repository: TicketRepositoryPort,
  ) {}

  async execute(workspaceId: string, id: string, dto: AssignTicketDto): Promise<TicketResponseDto> {
    const ticket = await this.repository.findById(workspaceId, id);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    const updated = await this.repository.assign(workspaceId, id, dto);
    return mapTicket(updated);
  }
}

@Injectable()
export class DeleteTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly repository: TicketRepositoryPort,
  ) {}

  async execute(workspaceId: string, id: string): Promise<void> {
    const ticket = await this.repository.findById(workspaceId, id);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    await this.repository.delete(workspaceId, id);
  }
}

function mapTicket(ticket: TicketEntity): TicketResponseDto {
  return {
    id: ticket.id,
    workspaceId: ticket.workspaceId,
    customerId: ticket.customerId,
    contactId: ticket.contactId,
    assigneeId: ticket.assigneeId,
    teamId: ticket.teamId,
    channelId: ticket.channelId,
    subject: ticket.subject,
    status: ticket.status,
    priority: ticket.priority,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
  };
}
