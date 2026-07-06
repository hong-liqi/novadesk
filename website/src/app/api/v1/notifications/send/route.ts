import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api-url';

export const dynamic = 'force-dynamic';

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
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

async function resolveContactEmail(): Promise<string> {
  const response = await fetch(`${getApiBaseUrl()}/settings/contact-email`);
  if (!response.ok) {
    throw new Error('Contact destination is not configured');
  }

  const payload = (await response.json()) as { contactEmail?: string | null };
  const contactEmail = payload.contactEmail?.trim();
  if (!contactEmail) {
    throw new Error('Contact destination is not configured in Admin → Settings');
  }

  return contactEmail;
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json({ message: 'Name, email, and message are required' }, { status: 400 });
  }

  try {
    const contactEmail = await resolveContactEmail();
    const upstream = await fetch(resolveNotificationSendUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: contactEmail,
        subject: `NovaDesk contact from ${name}`,
        body: `From: ${name} <${email}>\n\n${message}`,
        html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message.replace(/\n/g, '<br/>')}</p>`,
      }),
    });

    const responseBody = await upstream.text();
    const contentType = upstream.headers.get('content-type') ?? 'application/json';

    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    const messageText = error instanceof Error ? error.message : 'Upstream request failed';
    return NextResponse.json({ message: messageText }, { status: 502 });
  }
}
