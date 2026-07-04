import {
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  ExternalServiceError,
  NotFoundError,
  PortfolioError,
  RateLimitError,
  ValidationError,
} from './portfolio-error';

describe('portfolio errors', () => {
  it('serializes the base error shape', () => {
    const error = new PortfolioError({
      code: 'UNKNOWN_ERROR',
      message: 'Unexpected failure',
      status: 500,
      details: { reason: 'boom' },
    });

    expect(error.toJSON()).toEqual({
      name: 'PortfolioError',
      code: 'UNKNOWN_ERROR',
      message: 'Unexpected failure',
      status: 500,
      details: { reason: 'boom' },
    });
  });

  it('creates typed validation errors', () => {
    const error = new ValidationError('Invalid payload');
    expect(error.status).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
  });

  it('creates typed authorization errors', () => {
    expect(new AuthenticationError().status).toBe(401);
    expect(new AuthorizationError().status).toBe(403);
    expect(new NotFoundError().status).toBe(404);
    expect(new ExternalServiceError().status).toBe(502);
  });

  it('creates conflict and rate limit errors', () => {
    expect(new ConflictError().status).toBe(409);
    expect(new RateLimitError().status).toBe(429);
  });
});
