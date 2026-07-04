import type { AiContext } from '../../domain/entities/ai-context.entity';

export const AICONTEXT_REPOSITORY = Symbol('AICONTEXT_REPOSITORY');

export interface AiContextRepositoryPort {
  findById(id: string): Promise<AiContext | null>;
}
