import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@portfolio/auth';
import { ROLES } from '@portfolio/shared';
import type {
  CreateTenantDto,
  TenantResponse,
  UpdateTenantDto,
} from '../../application/dto/tenant.dto';
import {
  CreateTenantUseCase,
  DeleteTenantUseCase,
  GetTenantUseCase,
  ListTenantsUseCase,
  UpdateTenantUseCase,
} from '../../application/use-cases/tenant.use-cases';

@ApiTags('tenants')
@Controller('tenants')
export class TenantsController {
  constructor(
    private readonly listTenants: ListTenantsUseCase,
    private readonly getTenant: GetTenantUseCase,
    private readonly createTenant: CreateTenantUseCase,
    private readonly updateTenant: UpdateTenantUseCase,
    private readonly deleteTenant: DeleteTenantUseCase,
  ) {}

  @Get()
  @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
  @ApiOperation({ summary: 'List all tenants' })
  findAll(): Promise<TenantResponse[]> {
    return this.listTenants.execute();
  }

  @Get(':id')
  @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
  @ApiOperation({ summary: 'Get tenant by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<TenantResponse> {
    return this.getTenant.execute(id);
  }

  @Post()
  @Roles(ROLES.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a tenant' })
  create(@Body() dto: CreateTenantDto): Promise<TenantResponse> {
    return this.createTenant.execute(dto);
  }

  @Patch(':id')
  @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
  @ApiOperation({ summary: 'Update a tenant' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTenantDto,
  ): Promise<TenantResponse> {
    return this.updateTenant.execute(id, dto);
  }

  @Delete(':id')
  @Roles(ROLES.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a tenant' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ success: true }> {
    await this.deleteTenant.execute(id);
    return { success: true };
  }
}
