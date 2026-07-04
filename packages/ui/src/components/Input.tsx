import { clsx } from 'clsx';
import type { InputHTMLAttributes, ReactNode } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  size?: InputSize;
  leadingIcon?: ReactNode;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'ui-input--sm',
  md: 'ui-input--md',
  lg: 'ui-input--lg',
};

export function Input({
  label,
  hint,
  error,
  size = 'md',
  leadingIcon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label className={clsx('ui-input-field', className)} htmlFor={inputId}>
      {label ? <span className="ui-input-field__label">{label}</span> : null}
      <span
        className={clsx(
          'ui-input-field__control',
          sizeStyles[size],
          error && 'ui-input-field__control--error',
        )}
      >
        {leadingIcon ? <span className="ui-input-field__icon">{leadingIcon}</span> : null}
        <input id={inputId} className="ui-input" aria-invalid={Boolean(error)} {...props} />
      </span>
      {error ? <span className="ui-input-field__error">{error}</span> : null}
      {!error && hint ? <span className="ui-input-field__hint">{hint}</span> : null}
    </label>
  );
}
