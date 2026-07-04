import type { Analytics } from '../../domain/entities/analytics.entity';

export const ANALYTICS_REPOSITORY = Symbol('ANALYTICS_REPOSITORY');

export interface AnalyticsRepositoryPort {
  findById(id: string): Promise<Analytics | null>;
}
