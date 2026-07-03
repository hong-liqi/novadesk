import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
};

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'ui-btn-primary',
  secondary: 'ui-btn-secondary',
  ghost: 'ui-btn-ghost',
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'ui-btn-sm',
  md: 'ui-btn-md',
  lg: 'ui-btn-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={clsx('ui-btn', variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled ?? loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
