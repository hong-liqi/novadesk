import { throwError, of } from 'rxjs';
import { LoggerInterceptor } from './logger.interceptor';

describe('LoggerInterceptor', () => {
  it('propagates request id and writes completion logs', (done) => {
    const info = jest.fn();
    const error = jest.fn();
    const loggerService = {
      getLogger: () => ({ info, error }),
    } as never;

    const interceptor = new LoggerInterceptor(loggerService);
    const response = {
      statusCode: 200,
      setHeader: jest.fn(),
    };
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            'x-request-id': 'req-1',
            'x-user-id': 'user-1',
            'x-tenant-id': 'tenant-1',
            'x-roles': 'admin,user',
          },
          method: 'GET',
          url: '/health',
        }),
        getResponse: () => response,
      }),
    } as never;

    interceptor.intercept(context, { handle: () => of('ok') }).subscribe({
      complete: () => {
        expect(response.setHeader).toHaveBeenCalledWith('x-request-id', 'req-1');
        expect(info).toHaveBeenCalled();
        done();
      },
      error: done,
    });
  });

  it('generates request ids and logs failures', (done) => {
    const info = jest.fn();
    const error = jest.fn();
    const loggerService = {
      getLogger: () => ({ info, error }),
    } as never;

    const interceptor = new LoggerInterceptor(loggerService);
    const response = {
      statusCode: 500,
      setHeader: jest.fn(),
    };
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            'x-roles': ['admin', 'invalid-role'],
            'x-user-id': ['user-1'],
          },
          method: 'POST',
          url: '/orders',
        }),
        getResponse: () => response,
      }),
    } as never;

    interceptor
      .intercept(context, { handle: () => throwError(() => new Error('boom')) })
      .subscribe({
        complete: () => done(new Error('expected failure')),
        error: () => {
          expect(response.setHeader).toHaveBeenCalledWith('x-request-id', expect.any(String));
          expect(error).toHaveBeenCalled();
          done();
        },
      });
  });
});
