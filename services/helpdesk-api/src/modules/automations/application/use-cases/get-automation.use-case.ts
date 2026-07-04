import { Inject, Injectable } from '@nestjs/common';
import type { Automation } from '../../domain/entities/automation.entity';
import {
  AUTOMATION_REPOSITORY,
  type AutomationRepositoryPort,
} from '../ports/automation.repository.port';

@Injectable()
export class GetAutomationUseCase {
  constructor(
    @Inject(AUTOMATION_REPOSITORY)
    private readonly repository: AutomationRepositoryPort,
  ) {}

  execute(id: string): Promise<Automation | null> {
    return this.repository.findById(id);
  }
}
