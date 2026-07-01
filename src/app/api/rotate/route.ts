import { NextRequest, NextResponse } from 'next/server';
import { rotateProviderToken } from '@/lib/store';

// POST { id } -> rotates token for the provider, returns new token
export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json() as { id?: string };
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const newTok = rotateProviderToken(id);
    if (!newTok) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json({ ok: true, token: newTok });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error)?.message || 'rotate failed' }, { status: 500 });
  }
}
