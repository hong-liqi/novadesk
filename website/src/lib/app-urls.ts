export interface AppUrls {
  helpdesk: string;
  analytics: string;
  admin: string;
  chat: string;
}

const LOCAL_DEFAULTS: AppUrls = {
  helpdesk: '/helpdesk',
  analytics: '/analytics',
  admin: '/admin',
  chat: '/chat',
};

/** Read at request time so CapRover env changes apply after restart (no rebuild). */
export function getAppUrls(): AppUrls {
  return {
    helpdesk:
      process.env.NOVADESK_HELPDESK_URL ??
      process.env.NEXT_PUBLIC_HELPDESK_URL ??
      LOCAL_DEFAULTS.helpdesk,
    analytics:
      process.env.NOVADESK_ANALYTICS_URL ??
      process.env.NEXT_PUBLIC_ANALYTICS_URL ??
      LOCAL_DEFAULTS.analytics,
    admin:
      process.env.NOVADESK_ADMIN_URL ?? process.env.NEXT_PUBLIC_ADMIN_URL ?? LOCAL_DEFAULTS.admin,
    chat: process.env.NOVADESK_CHAT_URL ?? process.env.NEXT_PUBLIC_CHAT_URL ?? LOCAL_DEFAULTS.chat,
  };
}

export function isExternalAppUrl(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://');
}
