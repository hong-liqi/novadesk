import { Injectable, NestMiddleware } from '@nestjs/common';
import { TENANT_ID_HEADER, USER_ID_HEADER } from '@novadesk/shared';
import type { NextFunction, Response } from 'express';
import type { HelpdeskRequest } from '../types/request-context';

function normalizeHeader(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

@Injectable()
export class WorkspaceContextMiddleware implements NestMiddleware {
  use(req: HelpdeskRequest, _res: Response, next: NextFunction): void {
    const userId =
      normalizeHeader(req.headers[USER_ID_HEADER]) ?? normalizeHeader(req.headers['x-user-id']);
    const workspaceId =
      normalizeHeader(req.headers[TENANT_ID_HEADER]) ?? normalizeHeader(req.headers['x-tenant-id']);

    req.helpdesk = { userId, workspaceId };
    next();
  }
}
