import { Injectable } from '@nestjs/common';
import type { KnowledgeArticle } from '../../domain/entities/knowledge-article.entity';
import type { KnowledgeArticleRepositoryPort } from '../../application/ports/knowledge-article.repository.port';

@Injectable()
export class KnowledgeArticleRepository implements KnowledgeArticleRepositoryPort {
  findById(_id: string): Promise<KnowledgeArticle | null> {
    return Promise.resolve(null);
  }
}
