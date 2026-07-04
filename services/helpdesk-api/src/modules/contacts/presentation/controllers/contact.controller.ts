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
import type { ContactResponseDto } from '../../application/dto/contact.dto';
import {
  CreateContactUseCase,
  DeleteContactUseCase,
  GetContactUseCase,
  ListContactsUseCase,
  UpdateContactUseCase,
} from '../../application/use-cases/contact.use-cases';
import { createContactSchema, updateContactSchema } from '../validators/contact.validator';

@ApiTags('contacts')
@Controller()
@UseGuards(WorkspaceGuard)
export class ContactController {
  constructor(
    private readonly listContacts: ListContactsUseCase,
    private readonly getContact: GetContactUseCase,
    private readonly createContact: CreateContactUseCase,
    private readonly updateContact: UpdateContactUseCase,
    private readonly deleteContact: DeleteContactUseCase,
  ) {}

  @Get('customers/:customerId/contacts')
  @ApiOperation({ summary: 'List contacts for a customer' })
  findByCustomer(
    @CurrentWorkspace() workspaceId: string,
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): Promise<ContactResponseDto[]> {
    return this.listContacts.execute(workspaceId, customerId);
  }

  @Post('customers/:customerId/contacts')
  @ApiOperation({ summary: 'Create a contact for a customer' })
  create(
    @CurrentWorkspace() workspaceId: string,
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Body() body: unknown,
  ): Promise<ContactResponseDto> {
    return this.createContact.execute(
      workspaceId,
      customerId,
      parseBody(createContactSchema, body),
    );
  }

  @Get('contacts/:id')
  @ApiOperation({ summary: 'Get contact by ID' })
  findOne(
    @CurrentWorkspace() workspaceId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ContactResponseDto> {
    return this.getContact.execute(workspaceId, id);
  }

  @Patch('contacts/:id')
  @ApiOperation({ summary: 'Update a contact' })
  update(
    @CurrentWorkspace() workspaceId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ): Promise<ContactResponseDto> {
    return this.updateContact.execute(workspaceId, id, parseBody(updateContactSchema, body));
  }

  @Delete('contacts/:id')
  @ApiOperation({ summary: 'Delete a contact' })
  async remove(
    @CurrentWorkspace() workspaceId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: true }> {
    await this.deleteContact.execute(workspaceId, id);
    return { success: true };
  }
}
