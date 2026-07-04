import { Module } from '@nestjs/common';
import { AuthModule } from '@infrastructure/auth/auth.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatRepository } from './chat.repository';

@Module({
  imports: [AuthModule],
  controllers: [ChatController],
  providers: [ChatRepository, ChatGateway],
})
export class ChatModule {}
