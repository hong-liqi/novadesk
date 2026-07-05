import { SdkError } from '../errors';

export function formatAuthError(error: unknown, fallback = 'Request failed'): string {
  if (error instanceof SdkError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
