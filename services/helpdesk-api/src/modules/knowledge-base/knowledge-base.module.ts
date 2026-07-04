import { Module } from '@nestjs/common';
import { KnowledgeArticleController } from './presentation/controllers/knowledge-article.controller';
import { KnowledgeArticleRepository } from './infrastructure/persistence/knowledge-article.repository';
import { KNOWLEDGEARTICLE_REPOSITORY } from './application/ports/knowledge-article.repository.port';

@Module({
  controllers: [KnowledgeArticleController],
  providers: [
    {
      provide: KNOWLEDGEARTICLE_REPOSITORY,
      useClass: KnowledgeArticleRepository,
    },
  ],
  exports: [KNOWLEDGEARTICLE_REPOSITORY],
})
export class KnowledgeBaseModule {}
