import { Module } from '@nestjs/common';
import { CustomersModule } from '@modules/customers/customers.module';
import { ContactController } from './presentation/controllers/contact.controller';
import { ContactRepository } from './infrastructure/persistence/contact.repository';
import { CONTACT_REPOSITORY } from './application/ports/contact.repository.port';
import {
  CreateContactUseCase,
  DeleteContactUseCase,
  GetContactUseCase,
  ListContactsUseCase,
  UpdateContactUseCase,
} from './application/use-cases/contact.use-cases';

@Module({
  imports: [CustomersModule],
  controllers: [ContactController],
  providers: [
    ListContactsUseCase,
    GetContactUseCase,
    CreateContactUseCase,
    UpdateContactUseCase,
    DeleteContactUseCase,
    {
      provide: CONTACT_REPOSITORY,
      useClass: ContactRepository,
    },
  ],
  exports: [CONTACT_REPOSITORY],
})
export class ContactsModule {}
