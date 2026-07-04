import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'ui-btn ui-btn--primary',
  secondary: 'ui-btn ui-btn--secondary',
  ghost: 'ui-btn ui-btn--ghost',
  danger: 'ui-btn ui-btn--danger',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'ui-btn--sm',
  md: 'ui-btn--md',
  lg: 'ui-btn--lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leadingIcon,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        variantStyles[variant],
        sizeStyles[size],
        'ui-focus-ring ui-inline-flex ui-items-center ui-gap-2 ui-rounded-full ui-font-medium',
        className,
      )}
      disabled={disabled ?? loading}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {loading ? (
        <span className="ui-btn__loading" aria-live="polite">
          Loading...
        </span>
      ) : (
        <>
          {leadingIcon}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
