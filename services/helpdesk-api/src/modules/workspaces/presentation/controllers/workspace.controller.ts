import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';
import { parseBody } from '@presentation/validators/parse-body';
import type { WorkspaceResponseDto } from '../../application/dto/workspace.dto';
import {
  CreateWorkspaceUseCase,
  DeleteWorkspaceUseCase,
  GetWorkspaceUseCase,
  ListWorkspacesUseCase,
  UpdateWorkspaceUseCase,
} from '../../application/use-cases/workspace.use-cases';
import { createWorkspaceSchema, updateWorkspaceSchema } from '../validators/workspace.validator';

@ApiTags('workspaces')
@Controller('workspaces')
export class WorkspaceController {
  constructor(
    private readonly listWorkspaces: ListWorkspacesUseCase,
    private readonly getWorkspace: GetWorkspaceUseCase,
    private readonly createWorkspace: CreateWorkspaceUseCase,
    private readonly updateWorkspace: UpdateWorkspaceUseCase,
    private readonly deleteWorkspace: DeleteWorkspaceUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List workspaces for the current user' })
  findAll(@CurrentUser() userId?: string): Promise<WorkspaceResponseDto[]> {
    return this.listWorkspaces.execute(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workspace by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<WorkspaceResponseDto> {
    return this.getWorkspace.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a workspace' })
  create(@Body() body: unknown): Promise<WorkspaceResponseDto> {
    return this.createWorkspace.execute(parseBody(createWorkspaceSchema, body));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a workspace' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ): Promise<WorkspaceResponseDto> {
    return this.updateWorkspace.execute(id, parseBody(updateWorkspaceSchema, body));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workspace' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ success: true }> {
    await this.deleteWorkspace.execute(id);
    return { success: true };
  }
}
