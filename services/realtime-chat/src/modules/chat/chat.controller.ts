import { Controller, Get, Headers, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { USER_ID_HEADER } from '@novadesk/shared';
import { ChatRepository } from './chat.repository';
import type { ChatMessageResponse } from './chat.types';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatRepository: ChatRepository) {}

  @Get('rooms/:ticketId/messages')
  @ApiOperation({ summary: 'List chat messages for a ticket room' })
  listMessages(
    @Param('ticketId', ParseUUIDPipe) ticketId: string,
    @Query('limit') limit?: string,
    @Headers(USER_ID_HEADER) _userId?: string,
  ): Promise<ChatMessageResponse[]> {
    const parsedLimit = limit ? Number(limit) : 50;
    return this.chatRepository.findMessagesByTicket(ticketId, parsedLimit);
  }
}
