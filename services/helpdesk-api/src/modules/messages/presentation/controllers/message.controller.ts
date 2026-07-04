import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';
import { CurrentWorkspace } from '@presentation/decorators/current-workspace.decorator';
import { WorkspaceGuard } from '@presentation/guards/workspace.guard';
import { parseBody } from '@presentation/validators/parse-body';
import type { MessageResponseDto } from '../../application/dto/message.dto';
import {
  CreateMessageUseCase,
  GetMessageUseCase,
  ListMessagesUseCase,
} from '../../application/use-cases/message.use-cases';
import { createMessageSchema } from '../validators/message.validator';

@ApiTags('messages')
@Controller()
@UseGuards(WorkspaceGuard)
export class MessageController {
  constructor(
    private readonly listMessages: ListMessagesUseCase,
    private readonly getMessage: GetMessageUseCase,
    private readonly createMessage: CreateMessageUseCase,
  ) {}

  @Get('tickets/:ticketId/messages')
  @ApiOperation({ summary: 'List messages for a ticket' })
  findByTicket(
    @CurrentWorkspace() workspaceId: string,
    @Param('ticketId', ParseUUIDPipe) ticketId: string,
  ): Promise<MessageResponseDto[]> {
    return this.listMessages.execute(workspaceId, ticketId);
  }

  @Post('tickets/:ticketId/messages')
  @ApiOperation({ summary: 'Add a message to a ticket' })
  create(
    @CurrentWorkspace() workspaceId: string,
    @CurrentUser() userId: string | undefined,
    @Param('ticketId', ParseUUIDPipe) ticketId: string,
    @Body() body: unknown,
  ): Promise<MessageResponseDto> {
    return this.createMessage.execute(
      workspaceId,
      ticketId,
      userId,
      parseBody(createMessageSchema, body),
    );
  }

  @Get('messages/:id')
  @ApiOperation({ summary: 'Get message by ID' })
  findOne(
    @CurrentWorkspace() workspaceId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MessageResponseDto> {
    return this.getMessage.execute(workspaceId, id);
  }
}
