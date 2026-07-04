import { ValidationError } from '@portfolio/shared';

export class ConfigValidationError extends ValidationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
    this.name = 'ConfigValidationError';
  }
}
