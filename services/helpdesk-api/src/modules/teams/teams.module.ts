import { Module } from '@nestjs/common';
import { TeamController } from './presentation/controllers/team.controller';
import { TeamRepository } from './infrastructure/persistence/team.repository';
import { TEAM_REPOSITORY } from './application/ports/team.repository.port';

@Module({
  controllers: [TeamController],
  providers: [
    {
      provide: TEAM_REPOSITORY,
      useClass: TeamRepository,
    },
  ],
  exports: [TEAM_REPOSITORY],
})
export class TeamsModule {}
