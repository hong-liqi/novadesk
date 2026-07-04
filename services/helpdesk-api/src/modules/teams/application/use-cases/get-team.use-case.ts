import { Inject, Injectable } from '@nestjs/common';
import type { Team } from '../../domain/entities/team.entity';
import { TEAM_REPOSITORY, type TeamRepositoryPort } from '../ports/team.repository.port';

@Injectable()
export class GetTeamUseCase {
  constructor(
    @Inject(TEAM_REPOSITORY)
    private readonly repository: TeamRepositoryPort,
  ) {}

  execute(id: string): Promise<Team | null> {
    return this.repository.findById(id);
  }
}
