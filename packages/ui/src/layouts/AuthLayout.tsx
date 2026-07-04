'use client';

import type { ReactNode } from 'react';
import { Stack } from '../components/Stack';
import { Surface } from '../components/Surface';

export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="ui-auth-layout">
      <Surface variant="raised" padding="lg" className="ui-auth-layout__panel">
        <Stack gap="md">
          <Stack gap="xs">
            <h1 className="ui-auth-layout__title">{title}</h1>
            {subtitle ? <p className="ui-auth-layout__subtitle">{subtitle}</p> : null}
          </Stack>
          {children}
          {footer ? <div className="ui-auth-layout__footer">{footer}</div> : null}
        </Stack>
      </Surface>
    </div>
  );
}
