import type { KnowledgeArticle } from '../../domain/entities/knowledge-article.entity';

export const KNOWLEDGEARTICLE_REPOSITORY = Symbol('KNOWLEDGEARTICLE_REPOSITORY');

export interface KnowledgeArticleRepositoryPort {
  findById(id: string): Promise<KnowledgeArticle | null>;
}
