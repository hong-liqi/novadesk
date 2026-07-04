import { Injectable } from '@nestjs/common';
import type { Team } from '../../domain/entities/team.entity';
import type { TeamRepositoryPort } from '../../application/ports/team.repository.port';

@Injectable()
export class TeamRepository implements TeamRepositoryPort {
  findById(_id: string): Promise<Team | null> {
    return Promise.resolve(null);
  }
}
