import { SdkError } from '../errors';

const FRIENDLY_BY_EXACT_MESSAGE: Record<string, string> = {
  'Invalid credentials': 'Incorrect email or password.',
  'Incorrect email or password': 'Incorrect email or password.',
  'Email already registered': 'This email is already registered. Sign in instead.',
  'Refresh token required': 'Your session expired. Please sign in again.',
  'Refresh token expired': 'Your session expired. Please sign in again.',
  'Invalid refresh token': 'Your session expired. Please sign in again.',
  'Missing access token': 'You need to sign in to continue.',
  'Invalid access token': 'Your session expired. Please sign in again.',
};

const PASSWORD_POLICY_MESSAGE =
  'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number.';

/**
 * Maps SDK / network errors to short messages suitable for auth forms.
 */
export function formatAuthError(error: unknown, fallback = 'Request failed'): string {
  const raw = extractRawMessage(error);
  if (!raw) {
    return fallback;
  }

  const trimmed = raw.trim();
  const exact = FRIENDLY_BY_EXACT_MESSAGE[trimmed];
  if (exact) {
    return exact;
  }

  if (/password must be at least 8 characters/i.test(trimmed)) {
    return PASSWORD_POLICY_MESSAGE;
  }

  if (/request failed with status 401/i.test(trimmed)) {
    return 'Incorrect email or password.';
  }

  if (/request failed with status 409/i.test(trimmed)) {
    return 'This email is already registered. Sign in instead.';
  }

  if (/request failed with status 400/i.test(trimmed)) {
    return PASSWORD_POLICY_MESSAGE;
  }

  if (/request failed with status/i.test(trimmed)) {
    return fallback;
  }

  return trimmed;
}

function extractRawMessage(error: unknown): string | null {
  if (error instanceof SdkError && error.message) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return null;
}

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function getPasswordPolicyMessage(): string {
  return PASSWORD_POLICY_MESSAGE;
}

/** Client-side password policy — mirrors auth-service validatePassword. */
export function validatePasswordStrength(password: string): string | null {
  if (!PASSWORD_PATTERN.test(password)) {
    return PASSWORD_POLICY_MESSAGE;
  }
  return null;
}
