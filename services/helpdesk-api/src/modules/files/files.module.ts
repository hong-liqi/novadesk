import { Module } from '@nestjs/common';
import { FileController } from './presentation/controllers/file.controller';
import { FileRepository } from './infrastructure/persistence/file.repository';
import { FILE_REPOSITORY } from './application/ports/file.repository.port';

@Module({
  controllers: [FileController],
  providers: [
    {
      provide: FILE_REPOSITORY,
      useClass: FileRepository,
    },
  ],
  exports: [FILE_REPOSITORY],
})
export class FilesModule {}
