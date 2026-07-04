import type { DashboardStats } from '../../domain/entities/dashboard.entity';

export const DASHBOARD_REPOSITORY = Symbol('DASHBOARD_REPOSITORY');

export interface DashboardRepositoryPort {
  getStats(workspaceId: string): Promise<DashboardStats>;
}
