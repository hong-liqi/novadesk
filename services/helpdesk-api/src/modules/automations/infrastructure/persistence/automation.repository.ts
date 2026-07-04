import { Injectable } from '@nestjs/common';
import type { Automation } from '../../domain/entities/automation.entity';
import type { AutomationRepositoryPort } from '../../application/ports/automation.repository.port';

@Injectable()
export class AutomationRepository implements AutomationRepositoryPort {
  findById(_id: string): Promise<Automation | null> {
    return Promise.resolve(null);
  }
}
