import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api-url';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  try {
    const upstream = await fetch(`${getApiBaseUrl()}/settings/contact-email`, {
      next: { revalidate: 0 },
    });
    const body = await upstream.text();

    return new NextResponse(body, {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upstream request failed';
    return NextResponse.json({ message }, { status: 502 });
  }
}
