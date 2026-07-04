const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function validatePassword(password: string): void {
  if (!PASSWORD_PATTERN.test(password)) {
    throw new Error(
      'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number',
    );
  }
}
