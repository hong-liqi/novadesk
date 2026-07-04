import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { HelpdeskRequest } from '../types/request-context';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<HelpdeskRequest>();
    return request.helpdesk?.userId;
  },
);
