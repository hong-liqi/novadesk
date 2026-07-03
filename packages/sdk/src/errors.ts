import type { ApiError } from '@portfolio/shared';

export class SdkError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = 'SdkError';
  }

  static fromApiError(payload: ApiError): SdkError {
    const { error } = payload;
    return new SdkError(error.message, error.code, error.status, error.requestId);
  }

  static network(message: string): SdkError {
    return new SdkError(message, 'NETWORK_ERROR');
  }

  static timeout(message = 'Request timed out'): SdkError {
    return new SdkError(message, 'TIMEOUT', 408);
  }
}
