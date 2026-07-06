export interface AppUrls {
  helpdesk: string;
  analytics: string;
  admin: string;
  chat: string;
  code?: string;
}

const LOCAL_DEFAULTS: AppUrls = {
  helpdesk: '/helpdesk',
  analytics: '/analytics',
  admin: '/admin',
  chat: '/chat',
};

function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) {
      return value;
    }
  }
  return undefined;
}

/** Read at request time so CapRover env changes apply after restart (no rebuild). */
export function getAppUrls(): AppUrls {
  return {
    helpdesk:
      readEnv('NOVADESK_HELPDESK_URL', 'NEXT_PUBLIC_HELPDESK_URL') ?? LOCAL_DEFAULTS.helpdesk,
    analytics:
      readEnv('NOVADESK_ANALYTICS_URL', 'NEXT_PUBLIC_ANALYTICS_URL') ?? LOCAL_DEFAULTS.analytics,
    admin: readEnv('NOVADESK_ADMIN_URL', 'NEXT_PUBLIC_ADMIN_URL') ?? LOCAL_DEFAULTS.admin,
    chat: readEnv('NOVADESK_CHAT_URL', 'NEXT_PUBLIC_CHAT_URL') ?? LOCAL_DEFAULTS.chat,
    code: readEnv('NOVADESK_CODE_URL', 'NEXT_PUBLIC_CODE_URL'),
  };
}

export function getSiteUrl(): string {
  return readEnv('NEXT_PUBLIC_SITE_URL', 'NOVADESK_SITE_URL') ?? 'https://novadesk.local';
}

export function isExternalAppUrl(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://');
}
