/** App entry URLs — path-based locally (nginx), full URL on CapRover subdomains. */
export const APP_URLS = {
  helpdesk: process.env.NEXT_PUBLIC_HELPDESK_URL ?? '/helpdesk',
  analytics: process.env.NEXT_PUBLIC_ANALYTICS_URL ?? '/analytics',
  admin: process.env.NEXT_PUBLIC_ADMIN_URL ?? '/admin',
  chat: process.env.NEXT_PUBLIC_CHAT_URL ?? '/chat',
} as const;

export function isExternalAppUrl(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://');
}
