import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentWorkspace } from '@presentation/decorators/current-workspace.decorator';
import { WorkspaceGuard } from '@presentation/guards/workspace.guard';
import { parseBody } from '@presentation/validators/parse-body';
import type { CustomerResponseDto } from '../../application/dto/customer.dto';
import {
  CreateCustomerUseCase,
  DeleteCustomerUseCase,
  GetCustomerUseCase,
  ListCustomersUseCase,
  UpdateCustomerUseCase,
} from '../../application/use-cases/customer.use-cases';
import { createCustomerSchema, updateCustomerSchema } from '../validators/customer.validator';

@ApiTags('customers')
@Controller('customers')
@UseGuards(WorkspaceGuard)
export class CustomerController {
  constructor(
    private readonly listCustomers: ListCustomersUseCase,
    private readonly getCustomer: GetCustomerUseCase,
    private readonly createCustomer: CreateCustomerUseCase,
    private readonly updateCustomer: UpdateCustomerUseCase,
    private readonly deleteCustomer: DeleteCustomerUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List customers in workspace' })
  findAll(@CurrentWorkspace() workspaceId: string): Promise<CustomerResponseDto[]> {
    return this.listCustomers.execute(workspaceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  findOne(
    @CurrentWorkspace() workspaceId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CustomerResponseDto> {
    return this.getCustomer.execute(workspaceId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a customer' })
  create(
    @CurrentWorkspace() workspaceId: string,
    @Body() body: unknown,
  ): Promise<CustomerResponseDto> {
    return this.createCustomer.execute(workspaceId, parseBody(createCustomerSchema, body));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer' })
  update(
    @CurrentWorkspace() workspaceId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ): Promise<CustomerResponseDto> {
    return this.updateCustomer.execute(workspaceId, id, parseBody(updateCustomerSchema, body));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer' })
  async remove(
    @CurrentWorkspace() workspaceId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: true }> {
    await this.deleteCustomer.execute(workspaceId, id);
    return { success: true };
  }
}
