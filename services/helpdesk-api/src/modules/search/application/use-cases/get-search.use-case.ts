import { Inject, Injectable } from '@nestjs/common';
import type { Search } from '../../domain/entities/search.entity';
import { SEARCH_REPOSITORY, type SearchRepositoryPort } from '../ports/search.repository.port';

@Injectable()
export class GetSearchUseCase {
  constructor(
    @Inject(SEARCH_REPOSITORY)
    private readonly repository: SearchRepositoryPort,
  ) {}

  execute(id: string): Promise<Search | null> {
    return this.repository.findById(id);
  }
}
