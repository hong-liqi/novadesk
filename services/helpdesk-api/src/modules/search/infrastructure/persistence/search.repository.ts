import { Injectable } from '@nestjs/common';
import type { Search } from '../../domain/entities/search.entity';
import type { SearchRepositoryPort } from '../../application/ports/search.repository.port';

@Injectable()
export class SearchRepository implements SearchRepositoryPort {
  findById(_id: string): Promise<Search | null> {
    return Promise.resolve(null);
  }
}
