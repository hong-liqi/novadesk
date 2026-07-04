import type { File } from '../../domain/entities/file.entity';

export const FILE_REPOSITORY = Symbol('FILE_REPOSITORY');

export interface FileRepositoryPort {
  findById(id: string): Promise<File | null>;
}
