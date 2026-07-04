import { Module } from '@nestjs/common';
import { TicketsModule } from '@modules/tickets/tickets.module';
import { MessageController } from './presentation/controllers/message.controller';
import { MessageRepository } from './infrastructure/persistence/message.repository';
import { MESSAGE_REPOSITORY } from './application/ports/message.repository.port';
import {
  CreateMessageUseCase,
  GetMessageUseCase,
  ListMessagesUseCase,
} from './application/use-cases/message.use-cases';

@Module({
  imports: [TicketsModule],
  controllers: [MessageController],
  providers: [
    ListMessagesUseCase,
    GetMessageUseCase,
    CreateMessageUseCase,
    {
      provide: MESSAGE_REPOSITORY,
      useClass: MessageRepository,
    },
  ],
  exports: [MESSAGE_REPOSITORY],
})
export class MessagesModule {}
