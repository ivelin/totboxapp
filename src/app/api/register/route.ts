import { NextRequest, NextResponse } from 'next/server';
import { registerProvider } from '@/lib/store';

// Simple POST to register a provider (Stage 4)
// Body: { name, services, location, rules? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.location) {
      return NextResponse.json({ error: 'name and location required' }, { status: 400 });
    }
    const result = registerProvider({
      name: body.name,
      location: body.location,
      services: body.services || [],
      rules: body.rules,
      category: body.category,
    });
    // Return full including secret token (display once on client)
    return NextResponse.json({ ok: true, provider: result });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'register failed' }, { status: 500 });
  }
}
