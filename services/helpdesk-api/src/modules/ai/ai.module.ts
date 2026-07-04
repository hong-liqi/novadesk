import { Module } from '@nestjs/common';
import { AiContextController } from './presentation/controllers/ai-context.controller';
import { AiContextRepository } from './infrastructure/persistence/ai-context.repository';
import { AICONTEXT_REPOSITORY } from './application/ports/ai-context.repository.port';

@Module({
  controllers: [AiContextController],
  providers: [
    {
      provide: AICONTEXT_REPOSITORY,
      useClass: AiContextRepository,
    },
  ],
  exports: [AICONTEXT_REPOSITORY],
})
export class AiModule {}
