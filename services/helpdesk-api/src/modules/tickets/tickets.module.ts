import { Module } from '@nestjs/common';
import { TicketController } from './presentation/controllers/ticket.controller';
import { TicketRepository } from './infrastructure/persistence/ticket.repository';
import { TICKET_REPOSITORY } from './application/ports/ticket.repository.port';
import {
  AssignTicketUseCase,
  CreateTicketUseCase,
  DeleteTicketUseCase,
  GetTicketUseCase,
  ListTicketsUseCase,
  UpdateTicketStatusUseCase,
  UpdateTicketUseCase,
} from './application/use-cases/ticket.use-cases';

@Module({
  controllers: [TicketController],
  providers: [
    ListTicketsUseCase,
    GetTicketUseCase,
    CreateTicketUseCase,
    UpdateTicketUseCase,
    UpdateTicketStatusUseCase,
    AssignTicketUseCase,
    DeleteTicketUseCase,
    {
      provide: TICKET_REPOSITORY,
      useClass: TicketRepository,
    },
  ],
  exports: [TICKET_REPOSITORY],
})
export class TicketsModule {}
