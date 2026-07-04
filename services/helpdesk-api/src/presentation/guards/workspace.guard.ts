import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { HelpdeskRequest } from '../types/request-context';

@Injectable()
export class WorkspaceGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<HelpdeskRequest>();
    if (!request.helpdesk?.workspaceId) {
      throw new BadRequestException('X-Tenant-Id header (workspace) is required');
    }
    return true;
  }
}
