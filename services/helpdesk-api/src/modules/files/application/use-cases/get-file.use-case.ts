import { Inject, Injectable } from '@nestjs/common';
import type { File } from '../../domain/entities/file.entity';
import { FILE_REPOSITORY, type FileRepositoryPort } from '../ports/file.repository.port';

@Injectable()
export class GetFileUseCase {
  constructor(
    @Inject(FILE_REPOSITORY)
    private readonly repository: FileRepositoryPort,
  ) {}

  execute(id: string): Promise<File | null> {
    return this.repository.findById(id);
  }
}
