import type { SVGProps } from 'react';

export type IconName =
  'check' | 'close' | 'menu' | 'search' | 'sun' | 'moon' | 'plus' | 'chevron-down';

const paths: Record<IconName, string> = {
  check: 'M5 13l4 4L19 7',
  close: 'M6 6l12 12M18 6L6 18',
  menu: 'M4 7h16M4 12h16M4 17h16',
  search: 'M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm11 3-4.2-4.2',
  sun: 'M12 3v2m0 14v2m9-9h-2M5 12H3m14.36 6.36-1.42-1.42M7.06 7.06 5.64 5.64m12.72 0-1.42 1.42M7.06 16.94l-1.42 1.42M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z',
  plus: 'M12 5v14m-7-7h14',
  'chevron-down': 'M6 9l6 6 6-6',
};

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={props['aria-label'] ? undefined : true}
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
