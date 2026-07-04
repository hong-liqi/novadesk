import type { Team } from '../../domain/entities/team.entity';

export const TEAM_REPOSITORY = Symbol('TEAM_REPOSITORY');

export interface TeamRepositoryPort {
  findById(id: string): Promise<Team | null>;
}
