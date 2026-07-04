import { Inject, Injectable } from '@nestjs/common';
import type { AiContext } from '../../domain/entities/ai-context.entity';
import {
  AICONTEXT_REPOSITORY,
  type AiContextRepositoryPort,
} from '../ports/ai-context.repository.port';

@Injectable()
export class GetAiContextUseCase {
  constructor(
    @Inject(AICONTEXT_REPOSITORY)
    private readonly repository: AiContextRepositoryPort,
  ) {}

  execute(id: string): Promise<AiContext | null> {
    return this.repository.findById(id);
  }
}
