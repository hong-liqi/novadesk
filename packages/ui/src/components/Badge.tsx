import { clsx } from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'ui-badge ui-badge--default',
  accent: 'ui-badge ui-badge--accent',
  success: 'ui-badge ui-badge--success',
  warning: 'ui-badge ui-badge--warning',
  danger: 'ui-badge ui-badge--danger',
};

export function Badge({ children, variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span className={clsx(variantStyles[variant], className)} data-variant={variant} {...props}>
      {children}
    </span>
  );
}
