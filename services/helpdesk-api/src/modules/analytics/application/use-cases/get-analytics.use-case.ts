import { Inject, Injectable } from '@nestjs/common';
import type { Analytics } from '../../domain/entities/analytics.entity';
import {
  ANALYTICS_REPOSITORY,
  type AnalyticsRepositoryPort,
} from '../ports/analytics.repository.port';

@Injectable()
export class GetAnalyticsUseCase {
  constructor(
    @Inject(ANALYTICS_REPOSITORY)
    private readonly repository: AnalyticsRepositoryPort,
  ) {}

  execute(id: string): Promise<Analytics | null> {
    return this.repository.findById(id);
  }
}
