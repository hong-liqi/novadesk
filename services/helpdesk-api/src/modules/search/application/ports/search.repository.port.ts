import type { Search } from '../../domain/entities/search.entity';

export const SEARCH_REPOSITORY = Symbol('SEARCH_REPOSITORY');

export interface SearchRepositoryPort {
  findById(id: string): Promise<Search | null>;
}
