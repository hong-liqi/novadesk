import { randomUUID } from 'node:crypto';
import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  REQUEST_ID_HEADER,
  USER_ID_HEADER,
  TENANT_ID_HEADER,
  ROLES_HEADER,
  ROLE_LIST,
  type Role,
} from '@portfolio/shared';
import { createRequestContext, runWithContext } from '../context';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<{
      headers: Record<string, string | string[] | undefined>;
      method: string;
      url: string;
    }>();
    const response = http.getResponse<{
      statusCode: number;
      setHeader: (name: string, value: string) => void;
    }>();

    const requestId = this.normalizeHeader(request.headers[REQUEST_ID_HEADER]) ?? randomUUID();
    const service = process.env.SERVICE_NAME ?? 'portfolio-service';
    const requestContext = createRequestContext({
      requestId,
      service,
      userId: this.normalizeHeader(request.headers[USER_ID_HEADER]),
      tenantId: this.normalizeHeader(request.headers[TENANT_ID_HEADER]),
      roles: this.parseRoles(this.normalizeHeader(request.headers[ROLES_HEADER])),
    });
    const startedAt = Date.now();

    response.setHeader(REQUEST_ID_HEADER, requestId);

    return new Observable((subscriber) => {
      runWithContext(requestContext, () => {
        this.loggerService.getLogger().info(
          {
            method: request.method,
            path: request.url,
            requestId,
          },
          'request started',
        );

        next
          .handle()
          .pipe(
            tap({
              next: () => {
                this.loggerService.getLogger().info(
                  {
                    method: request.method,
                    path: request.url,
                    status: response.statusCode,
                    duration: Date.now() - startedAt,
                    requestId,
                  },
                  'request completed',
                );
              },
              error: (error: Error) => {
                this.loggerService.getLogger().error(
                  {
                    method: request.method,
                    path: request.url,
                    duration: Date.now() - startedAt,
                    requestId,
                    err: error,
                  },
                  'request failed',
                );
              },
            }),
          )
          .subscribe(subscriber);
      });
    });
  }

  private normalizeHeader(value: string | string[] | undefined): string | undefined {
    if (Array.isArray(value)) {
      return value[0];
    }

    return value;
  }

  private parseRoles(header: string | undefined): Role[] {
    if (!header) {
      return [];
    }

    return header
      .split(',')
      .map((role) => role.trim())
      .filter((role): role is Role => ROLE_LIST.includes(role as Role));
  }
}
