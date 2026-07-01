import { NextRequest, NextResponse } from 'next/server';
import { getProvidersForToken } from '@/lib/store';

// GET /api/lookup?token=xxx  -> returns the matching provider (public fields) or 404
// Provides basic "session by token" lookup for dashboard reloads (Stage 4 minimal)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 });
  const matches = getProvidersForToken(token);
  if (matches.length === 0) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const p = matches[0];
  // return without the secret token for safety in this lookup
  const { token: _t, ...publicP } = p as unknown as Record<string, unknown>;
  return NextResponse.json({ provider: publicP });
}
