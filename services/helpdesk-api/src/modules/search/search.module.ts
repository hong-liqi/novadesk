import { Module } from '@nestjs/common';
import { SearchController } from './presentation/controllers/search.controller';
import { SearchRepository } from './infrastructure/persistence/search.repository';
import { SEARCH_REPOSITORY } from './application/ports/search.repository.port';

@Module({
  controllers: [SearchController],
  providers: [
    {
      provide: SEARCH_REPOSITORY,
      useClass: SearchRepository,
    },
  ],
  exports: [SEARCH_REPOSITORY],
})
export class SearchModule {}
