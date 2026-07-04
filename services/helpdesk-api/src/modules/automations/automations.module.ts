import { Module } from '@nestjs/common';
import { AutomationController } from './presentation/controllers/automation.controller';
import { AutomationRepository } from './infrastructure/persistence/automation.repository';
import { AUTOMATION_REPOSITORY } from './application/ports/automation.repository.port';

@Module({
  controllers: [AutomationController],
  providers: [
    {
      provide: AUTOMATION_REPOSITORY,
      useClass: AutomationRepository,
    },
  ],
  exports: [AUTOMATION_REPOSITORY],
})
export class AutomationsModule {}
