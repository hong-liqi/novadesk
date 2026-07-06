export interface NavItem {
  href: string;
  label: string;
  description?: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { href: '/about', label: 'About', description: 'Engineering philosophy and background' },
  { href: '/#projects', label: 'Platform', description: 'NovaDesk modules and services' },
  { href: '/#case-studies', label: 'Case Studies', description: 'Production systems delivered' },
  { href: '/engineering', label: 'Engineering', description: 'Architecture, ADRs, and decisions' },
  { href: '/#contact', label: 'Contact', description: 'Get in touch' },
];

export const ENGINEERING_NAV: NavItem[] = [
  {
    href: '/engineering/architecture',
    label: 'Architecture',
    description: 'System context and service boundaries',
  },
  {
    href: '/engineering/monorepo',
    label: 'Monorepo',
    description: 'Repository layout and package boundaries',
  },
  {
    href: '/engineering/auth-flow',
    label: 'Auth Flow',
    description: 'JWT, RBAC, and token lifecycle',
  },
  {
    href: '/engineering/request-flow',
    label: 'Request Flow',
    description: 'Gateway routing and service communication',
  },
  { href: '/engineering/roadmap', label: 'Roadmap', description: 'Delivery milestones and status' },
  { href: '/engineering/decisions', label: 'ADRs', description: 'Architecture Decision Records' },
];

export const FOOTER_NAV: NavItem[] = [
  { href: '/about', label: 'About' },
  { href: '/engineering', label: 'Engineering' },
  { href: '/#case-studies', label: 'Case Studies' },
  { href: '/#contact', label: 'Contact' },
];

export const ENGINEER_LINKS = {
  linkedin: 'https://www.linkedin.com/in/hongllqi/',
  github: 'https://github.com/hong-liqi/novadesk',
  resume: '/resume/Curriculo_Li_Hong_Software_Engineer.pdf',
} as const;
