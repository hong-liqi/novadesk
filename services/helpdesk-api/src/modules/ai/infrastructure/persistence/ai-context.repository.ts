import { Injectable } from '@nestjs/common';
import type { AiContext } from '../../domain/entities/ai-context.entity';
import type { AiContextRepositoryPort } from '../../application/ports/ai-context.repository.port';

@Injectable()
export class AiContextRepository implements AiContextRepositoryPort {
  findById(_id: string): Promise<AiContext | null> {
    return Promise.resolve(null);
  }
}
