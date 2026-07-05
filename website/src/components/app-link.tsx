import Link from 'next/link';
import type { ReactNode } from 'react';
import { isExternalAppUrl } from '@/lib/app-urls';

interface AppLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

/** External subdomains use native anchors; internal paths use Next.js Link. */
export function AppLink({ href, className, children }: AppLinkProps) {
  if (isExternalAppUrl(href)) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
