import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentWorkspace } from '@presentation/decorators/current-workspace.decorator';
import { WorkspaceGuard } from '@presentation/guards/workspace.guard';
import { parseBody } from '@presentation/validators/parse-body';
import type { PaginatedResult } from '@shared/types/pagination';
import type { TicketResponseDto } from '../../application/dto/ticket.dto';
import {
  AssignTicketUseCase,
  CreateTicketUseCase,
  DeleteTicketUseCase,
  GetTicketUseCase,
  ListTicketsUseCase,
  UpdateTicketStatusUseCase,
  UpdateTicketUseCase,
} from '../../application/use-cases/ticket.use-cases';
import {
  assignTicketSchema,
  createTicketSchema,
  listTicketsQuerySchema,
  updateTicketSchema,
  updateTicketStatusSchema,
} from '../validators/ticket.validator';

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(WorkspaceGuard)
export class TicketController {
  constructor(
    private readonly listTickets: ListTicketsUseCase,
    private readonly getTicket: GetTicketUseCase,
    private readonly createTicket: CreateTicketUseCase,
    private readonly updateTicket: UpdateTicketUseCase,
    private readonly updateTicketStatus: UpdateTicketStatusUseCase,
    private readonly assignTicket: AssignTicketUseCase,
    private readonly deleteTicket: DeleteTicketUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List tickets (paginated)' })
  findAll(
    @CurrentWorkspace() workspaceId: string,
    @Query() query: unknown,
  ): Promise<PaginatedResult<TicketResponseDto>> {
    return this.listTickets.execute(workspaceId, parseBody(listTicketsQuerySchema, query));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by ID' })
  findOne(
    @CurrentWorkspace() workspaceId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TicketResponseDto> {
    return this.getTicket.execute(workspaceId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a ticket' })
  create(
    @CurrentWorkspace() workspaceId: string,
    @Body() body: unknown,
  ): Promise<TicketResponseDto> {
    return this.createTicket.execute(workspaceId, parseBody(createTicketSchema, body));
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update ticket status' })
  updateStatus(
    @CurrentWorkspace() workspaceId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ): Promise<TicketResponseDto> {
    return this.updateTicketStatus.execute(
      workspaceId,
      id,
      parseBody(updateTicketStatusSchema, body),
    );
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Assign ticket to agent or team' })
  assign(
    @CurrentWorkspace() workspaceId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ): Promise<TicketResponseDto> {
    return this.assignTicket.execute(workspaceId, id, parseBody(assignTicketSchema, body));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ticket' })
  update(
    @CurrentWorkspace() workspaceId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ): Promise<TicketResponseDto> {
    return this.updateTicket.execute(workspaceId, id, parseBody(updateTicketSchema, body));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ticket' })
  async remove(
    @CurrentWorkspace() workspaceId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: true }> {
    await this.deleteTicket.execute(workspaceId, id);
    return { success: true };
  }
}
