import type { Automation } from '../../domain/entities/automation.entity';

export const AUTOMATION_REPOSITORY = Symbol('AUTOMATION_REPOSITORY');

export interface AutomationRepositoryPort {
  findById(id: string): Promise<Automation | null>;
}
