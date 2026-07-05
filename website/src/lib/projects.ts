import { getAppUrls } from '@/lib/app-urls';

export interface NovaDeskModule {
  id: string;
  name: string;
  description: string;
  href?: string;
  tags: string[];
  type: 'app' | 'service';
}

export function getNovaDeskModules(): NovaDeskModule[] {
  const urls = getAppUrls();

  return [
    {
      id: 'helpdesk',
      name: 'HelpDesk SaaS',
      description:
        'Multi-tenant ticket management with SLA policies, agent workflows, and real-time collaboration.',
      href: urls.helpdesk,
      tags: ['NestJS', 'Next.js', 'PostgreSQL', 'BullMQ'],
      type: 'app',
    },
    {
      id: 'analytics',
      name: 'Analytics Dashboard',
      description:
        'Business intelligence views with KPI tracking, exportable reports, and role-based dashboards.',
      href: urls.analytics,
      tags: ['NestJS', 'Next.js', 'Charts', 'CSV/PDF'],
      type: 'app',
    },
    {
      id: 'admin',
      name: 'Admin Portal',
      description:
        'Central control plane for users, tenants, service health, and platform-wide configuration.',
      href: urls.admin,
      tags: ['Next.js', 'RBAC', 'SDK'],
      type: 'app',
    },
    {
      id: 'chat',
      name: 'Realtime Chat',
      description:
        'WebSocket-powered messaging integrated with HelpDesk for agent and customer conversations.',
      tags: ['WebSocket', 'Redis Pub/Sub', 'NestJS'],
      type: 'service',
    },
    {
      id: 'auth',
      name: 'Auth Service',
      description:
        'JWT authentication with RS256, refresh token rotation, multi-tenant RBAC, and JWKS.',
      tags: ['NestJS', 'PostgreSQL', 'Redis', 'JWT'],
      type: 'service',
    },
    {
      id: 'gateway',
      name: 'API Gateway',
      description:
        'Unified entry point with JWT validation, rate limiting, circuit breaking, and service proxying.',
      tags: ['NestJS', 'Redis', 'OpenTelemetry'],
      type: 'service',
    },
    {
      id: 'notifications',
      name: 'Notification Service',
      description:
        'Transactional email delivery, in-app notifications, and template-driven messaging.',
      tags: ['NestJS', 'BullMQ', 'SMTP', 'PostgreSQL'],
      type: 'service',
    },
  ];
}
