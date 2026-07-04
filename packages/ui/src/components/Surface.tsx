import { clsx } from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';

export type SurfaceVariant = 'default' | 'raised' | 'outline' | 'subtle';

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: SurfaceVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles: Record<SurfaceVariant, string> = {
  default: 'ui-surface ui-surface--default',
  raised: 'ui-surface ui-surface--raised',
  outline: 'ui-surface ui-surface--outline',
  subtle: 'ui-surface ui-surface--subtle',
};

const paddingStyles = {
  none: 'ui-p-0',
  sm: 'ui-p-3',
  md: 'ui-p-4',
  lg: 'ui-p-6',
} as const;

export function Surface({
  children,
  variant = 'default',
  padding = 'md',
  className,
  ...props
}: SurfaceProps) {
  return (
    <div
      className={clsx(variantStyles[variant], paddingStyles[padding], className)}
      data-variant={variant}
      {...props}
    >
      {children}
    </div>
  );
}
