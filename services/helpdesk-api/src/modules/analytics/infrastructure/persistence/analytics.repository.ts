import { Injectable } from '@nestjs/common';
import type { Analytics } from '../../domain/entities/analytics.entity';
import type { AnalyticsRepositoryPort } from '../../application/ports/analytics.repository.port';

@Injectable()
export class AnalyticsRepository implements AnalyticsRepositoryPort {
  findById(_id: string): Promise<Analytics | null> {
    return Promise.resolve(null);
  }
}
