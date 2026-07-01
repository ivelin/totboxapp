import { NextRequest, NextResponse } from 'next/server';
import { registerProvider } from '@/lib/store';

// Simple POST to register a provider (Stage 4)
// Body: { name, services, location, rules? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>;
    if (!body.name || !body.location) {
      return NextResponse.json({ error: 'name and location required' }, { status: 400 });
    }
    const result = registerProvider({
      name: String(body.name),
      location: String(body.location),
      services: (body.services as string[]) || [],
      rules: body.rules as Parameters<typeof registerProvider>[0]['rules'],
      category: body.category as Parameters<typeof registerProvider>[0]['category'],
    });
    // Return full including secret token (display once on client)
    return NextResponse.json({ ok: true, provider: result });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error)?.message || 'register failed' }, { status: 500 });
  }
}
