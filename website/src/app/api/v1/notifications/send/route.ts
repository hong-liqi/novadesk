import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api-url';

export const dynamic = 'force-dynamic';

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
}

export type ContactSendErrorCode =
  | 'CONTACT_EMAIL_NOT_CONFIGURED'
  | 'EMAIL_DELIVERY_FAILED'
  | 'NOTIFICATION_UNAVAILABLE'
  | 'INVALID_REQUEST';

class ContactSendError extends Error {
  readonly code: ContactSendErrorCode;
  readonly status: number;

  constructor(code: ContactSendErrorCode, message: string, status = 502) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) {
      return value;
    }
  }

  return undefined;
}

function resolveNotificationSendUrl(): string {
  const notificationService = readEnv('NOTIFICATION_SERVICE_URL');
  if (notificationService) {
    return `${notificationService.replace(/\/$/, '')}/api/v1/notifications/send`;
  }

  return `${getApiBaseUrl()}/notifications/send`;
}

function readUpstreamMessage(body: string): string | undefined {
  try {
    const payload = JSON.parse(body) as { message?: string };
    return payload.message?.trim() || undefined;
  } catch {
    return undefined;
  }
}

async function resolveContactEmail(): Promise<string> {
  let settingsResponded = false;
  let settingsHasEmail = false;

  try {
    const response = await fetch(`${getApiBaseUrl()}/settings/contact-email`);
    if (response.ok) {
      settingsResponded = true;
      const payload = (await response.json()) as { contactEmail?: string | null };
      const contactEmail = payload.contactEmail?.trim();
      if (contactEmail) {
        settingsHasEmail = true;
        return contactEmail;
      }
    }
  } catch {
    // Fall back to env when settings API is unavailable.
  }

  const fromEnv = readEnv('CONTACT_EMAIL', 'DEFAULT_CONTACT_EMAIL');
  if (fromEnv) {
    return fromEnv;
  }

  if (settingsResponded && !settingsHasEmail) {
    throw new ContactSendError(
      'CONTACT_EMAIL_NOT_CONFIGURED',
      'This form cannot deliver messages yet because no inbox email has been saved in Admin → Settings.',
      503,
    );
  }

  throw new ContactSendError(
    'CONTACT_EMAIL_NOT_CONFIGURED',
    'This form cannot deliver messages yet. Save an inbox email in Admin → Settings, or set CONTACT_EMAIL on the website service.',
    503,
  );
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { code: 'INVALID_REQUEST', message: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { code: 'INVALID_REQUEST', message: 'Name, email, and message are required' },
      { status: 400 },
    );
  }

  try {
    const contactEmail = await resolveContactEmail();
    let upstream: Response;

    try {
      upstream = await fetch(resolveNotificationSendUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: contactEmail,
          subject: `Portfolio contact from ${name}`,
          body: `From: ${name} <${email}>\n\n${message}`,
          html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message.replace(/\n/g, '<br/>')}</p>`,
        }),
      });
    } catch {
      throw new ContactSendError(
        'NOTIFICATION_UNAVAILABLE',
        'Could not reach the email service. Check that the notification service is running and reachable from the website.',
        503,
      );
    }

    const responseBody = await upstream.text();

    if (!upstream.ok) {
      const upstreamMessage = readUpstreamMessage(responseBody);
      const deliveryDetail =
        upstreamMessage ?? `notification service returned ${String(upstream.status)}`;

      throw new ContactSendError(
        'EMAIL_DELIVERY_FAILED',
        `The message was accepted but email delivery failed: ${deliveryDetail}`,
        upstream.status >= 500 ? 502 : upstream.status,
      );
    }

    const contentType = upstream.headers.get('content-type') ?? 'application/json';

    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    if (error instanceof ContactSendError) {
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: error.status },
      );
    }

    const messageText =
      error instanceof Error ? error.message : 'Unexpected error while sending message';
    return NextResponse.json(
      { code: 'EMAIL_DELIVERY_FAILED', message: messageText },
      { status: 502 },
    );
  }
}
