import { Injectable } from '@nestjs/common';
import type { File } from '../../domain/entities/file.entity';
import type { FileRepositoryPort } from '../../application/ports/file.repository.port';

@Injectable()
export class FileRepository implements FileRepositoryPort {
  findById(_id: string): Promise<File | null> {
    return Promise.resolve(null);
  }
}
