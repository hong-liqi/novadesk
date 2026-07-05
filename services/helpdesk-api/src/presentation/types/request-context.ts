import type { Request } from 'express';

export interface HelpdeskRequestContext {
  userId?: string;
  workspaceId?: string;
  email?: string;
}

export interface HelpdeskRequest extends Request {
  helpdesk?: HelpdeskRequestContext;
}
