import { NextRequest, NextResponse } from 'next/server';
import { connectCalendar } from '@/lib/store';

// OAuth callback: exchange would happen here in prod; for Stage 5 demo we accept the code
// and persist a dummy access token, marking the provider connected.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // provider id from our start

  if (!code || !state) {
    return NextResponse.redirect('/dashboard?calendar_error=missing_code');
  }

  // Demo: use code presence to derive a token; in real we'd exchange code for tokens using client secret
  const accessToken = code.startsWith('demo-') ? 'demo-access-token-' + Date.now() : 'access-' + code;

  const ok = connectCalendar(state, { accessToken });
  if (!ok) {
    return NextResponse.redirect('/dashboard?calendar_error=provider_not_found');
  }

  // Success redirect back to dashboard
  return NextResponse.redirect('/dashboard?calendar_connected=1&provider=' + encodeURIComponent(state));
}
