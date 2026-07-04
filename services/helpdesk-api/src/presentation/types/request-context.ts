import type { Request } from 'express';

export interface HelpdeskRequestContext {
  userId?: string;
  workspaceId?: string;
}

export interface HelpdeskRequest extends Request {
  helpdesk?: HelpdeskRequestContext;
}
