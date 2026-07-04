export type NovaDeskErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'EXTERNAL_SERVICE_ERROR'
  | 'UNKNOWN_ERROR';

export interface NovaDeskErrorOptions {
  code: NovaDeskErrorCode;
  message: string;
  status: number;
  details?: Record<string, unknown>;
  cause?: unknown;
}

export class NovaDeskError extends Error {
  readonly code: NovaDeskErrorCode;

  readonly status: number;

  readonly details?: Record<string, unknown>;

  override readonly cause?: unknown;

  constructor(options: NovaDeskErrorOptions) {
    super(options.message, options.cause ? { cause: options.cause } : undefined);
    this.name = 'NovaDeskError';
    this.code = options.code;
    this.status = options.status;
    this.details = options.details;
    this.cause = options.cause;
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      status: this.status,
      details: this.details,
    };
  }
}

export class ValidationError extends NovaDeskError {
  constructor(message = 'Validation failed', details?: Record<string, unknown>, cause?: unknown) {
    super({ code: 'VALIDATION_ERROR', message, status: 400, details, cause });
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends NovaDeskError {
  constructor(
    message = 'Authentication required',
    details?: Record<string, unknown>,
    cause?: unknown,
  ) {
    super({ code: 'AUTHENTICATION_ERROR', message, status: 401, details, cause });
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends NovaDeskError {
  constructor(
    message = 'Insufficient permissions',
    details?: Record<string, unknown>,
    cause?: unknown,
  ) {
    super({ code: 'AUTHORIZATION_ERROR', message, status: 403, details, cause });
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends NovaDeskError {
  constructor(message = 'Resource not found', details?: Record<string, unknown>, cause?: unknown) {
    super({ code: 'NOT_FOUND', message, status: 404, details, cause });
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends NovaDeskError {
  constructor(message = 'Conflict detected', details?: Record<string, unknown>, cause?: unknown) {
    super({ code: 'CONFLICT', message, status: 409, details, cause });
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends NovaDeskError {
  constructor(message = 'Rate limit exceeded', details?: Record<string, unknown>, cause?: unknown) {
    super({ code: 'RATE_LIMITED', message, status: 429, details, cause });
    this.name = 'RateLimitError';
  }
}

export class ExternalServiceError extends NovaDeskError {
  constructor(
    message = 'External service failed',
    details?: Record<string, unknown>,
    cause?: unknown,
  ) {
    super({ code: 'EXTERNAL_SERVICE_ERROR', message, status: 502, details, cause });
    this.name = 'ExternalServiceError';
  }
}
