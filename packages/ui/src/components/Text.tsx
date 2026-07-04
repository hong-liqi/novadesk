import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export type TextTone = 'default' | 'muted' | 'accent' | 'danger' | 'success';
export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';

interface TextOwnProps<T extends ElementType> {
  as?: T;
  tone?: TextTone;
  size?: TextSize;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  children: ReactNode;
}

export type TextProps<T extends ElementType = 'p'> = TextOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TextOwnProps<T>>;

const toneStyles: Record<TextTone, string> = {
  default: 'ui-text-default',
  muted: 'ui-text-muted',
  accent: 'ui-text-accent',
  danger: 'ui-text-danger',
  success: 'ui-text-success',
};

const sizeStyles: Record<TextSize, string> = {
  xs: 'ui-text-xs',
  sm: 'ui-text-sm',
  base: 'ui-text-base',
  lg: 'ui-text-lg',
  xl: 'ui-text-xl',
  '2xl': 'ui-text-2xl',
};

const weightStyles = {
  normal: 'ui-font-normal',
  medium: 'ui-font-medium',
  semibold: 'ui-font-semibold',
  bold: 'ui-font-bold',
} as const;

export function Text<T extends ElementType = 'p'>({
  as,
  tone = 'default',
  size = 'base',
  weight = 'normal',
  className,
  children,
  ...props
}: TextProps<T>) {
  const Component = as ?? 'p';
  return (
    <Component
      className={clsx(toneStyles[tone], sizeStyles[size], weightStyles[weight], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
