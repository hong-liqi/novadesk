import { Inject, Injectable } from '@nestjs/common';
import type { KnowledgeArticle } from '../../domain/entities/knowledge-article.entity';
import {
  KNOWLEDGEARTICLE_REPOSITORY,
  type KnowledgeArticleRepositoryPort,
} from '../ports/knowledge-article.repository.port';

@Injectable()
export class GetKnowledgeArticleUseCase {
  constructor(
    @Inject(KNOWLEDGEARTICLE_REPOSITORY)
    private readonly repository: KnowledgeArticleRepositoryPort,
  ) {}

  execute(id: string): Promise<KnowledgeArticle | null> {
    return this.repository.findById(id);
  }
}
