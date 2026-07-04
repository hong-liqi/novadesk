import { clsx } from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
}

const gapStyles = {
  xs: 'ui-gap-1',
  sm: 'ui-gap-2',
  md: 'ui-gap-4',
  lg: 'ui-gap-6',
  xl: 'ui-gap-8',
} as const;

const alignStyles = {
  start: 'ui-items-start',
  center: 'ui-items-center',
  end: 'ui-items-end',
  stretch: 'ui-items-stretch',
} as const;

const justifyStyles = {
  start: 'ui-justify-start',
  center: 'ui-justify-center',
  end: 'ui-justify-end',
  between: 'ui-justify-between',
} as const;

export function Stack({
  children,
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  className,
  ...props
}: StackProps) {
  return (
    <div
      className={clsx(
        'ui-flex ui-flex-col',
        gapStyles[gap],
        alignStyles[align],
        justifyStyles[justify],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
