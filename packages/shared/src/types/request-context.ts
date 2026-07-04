import type { Role } from '../constants/roles';

export interface RequestContext {
  requestId: string;
  service: string;
  userId?: string;
  tenantId?: string;
  roles?: Role[];
  correlationId?: string;
}
