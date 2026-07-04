import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { parseBody } from '@presentation/validators/parse-body';
import type { OrganizationResponseDto } from '../../application/dto/organization.dto';
import {
  CreateOrganizationUseCase,
  DeleteOrganizationUseCase,
  GetOrganizationUseCase,
  ListOrganizationsUseCase,
  UpdateOrganizationUseCase,
} from '../../application/use-cases/organization.use-cases';
import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from '../validators/organization.validator';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly listOrganizations: ListOrganizationsUseCase,
    private readonly getOrganization: GetOrganizationUseCase,
    private readonly createOrganization: CreateOrganizationUseCase,
    private readonly updateOrganization: UpdateOrganizationUseCase,
    private readonly deleteOrganization: DeleteOrganizationUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all organizations' })
  findAll(): Promise<OrganizationResponseDto[]> {
    return this.listOrganizations.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<OrganizationResponseDto> {
    return this.getOrganization.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create an organization' })
  create(@Body() body: unknown): Promise<OrganizationResponseDto> {
    return this.createOrganization.execute(parseBody(createOrganizationSchema, body));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an organization' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ): Promise<OrganizationResponseDto> {
    return this.updateOrganization.execute(id, parseBody(updateOrganizationSchema, body));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an organization' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ success: true }> {
    await this.deleteOrganization.execute(id);
    return { success: true };
  }
}
