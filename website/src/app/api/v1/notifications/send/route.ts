import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api-url';

export const dynamic = 'force-dynamic';

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

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const upstream = await fetch(resolveNotificationSendUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const responseBody = await upstream.text();
    const contentType = upstream.headers.get('content-type') ?? 'application/json';

    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upstream request failed';
    return NextResponse.json({ message }, { status: 502 });
  }
}
