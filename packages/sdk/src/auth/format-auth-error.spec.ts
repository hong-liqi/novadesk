import { SdkError } from '../errors';
import {
  formatAuthError,
  getPasswordPolicyMessage,
  validatePasswordStrength,
} from './format-auth-error';

describe('formatAuthError', () => {
  it('maps invalid credentials to a clear login message', () => {
    expect(formatAuthError(new SdkError('Invalid credentials', 'Unauthorized', 401))).toBe(
      'Incorrect email or password.',
    );
  });

  it('maps generic 401 status fallback to a clear login message', () => {
    expect(formatAuthError(new SdkError('Request failed with status 401', 'HTTP_ERROR', 401))).toBe(
      'Incorrect email or password.',
    );
  });

  it('surfaces password policy messages from the API', () => {
    expect(
      formatAuthError(
        new SdkError(
          'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number',
          'Bad Request',
          400,
        ),
      ),
    ).toBe(getPasswordPolicyMessage());
  });

  it('maps generic 400 status fallback to password policy help', () => {
    expect(formatAuthError(new SdkError('Request failed with status 400', 'HTTP_ERROR', 400))).toBe(
      getPasswordPolicyMessage(),
    );
  });

  it('maps email conflicts', () => {
    expect(formatAuthError(new SdkError('Email already registered', 'Conflict', 409))).toBe(
      'This email is already registered. Sign in instead.',
    );
  });
});

describe('validatePasswordStrength', () => {
  it('rejects weak passwords', () => {
    expect(validatePasswordStrength('password')).toBe(getPasswordPolicyMessage());
    expect(validatePasswordStrength('Password')).toBe(getPasswordPolicyMessage());
    expect(validatePasswordStrength('Password1')).toBeNull();
  });
});
