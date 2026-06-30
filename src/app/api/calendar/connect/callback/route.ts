import { NextRequest, NextResponse } from 'next/server';
import { connectCalendar, setCalendarBusyMock } from '@/lib/store';

// OAuth callback: exchange would happen here in prod; for Stage 5 demo we accept the code
// and persist a dummy access token, marking the provider connected.
// Also populate sample busy so connected availability actually merges (not pure rules).
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // provider id from our start

  if (!code || !state) {
    return NextResponse.redirect('http://localhost:3000/dashboard?calendar_error=missing_code');
  }

  // Demo: use code presence to derive a token; in real we'd exchange code for tokens using client secret
  const accessToken = code.startsWith('demo-') ? 'demo-access-token-' + Date.now() : 'access-' + code;

  const ok = connectCalendar(state, { accessToken });
  if (!ok) {
    return NextResponse.redirect('http://localhost:3000/dashboard?calendar_error=provider_not_found');
  }

  // Populate sample busy using caller-provided demoDate (not hardcoded to single date)
  const demoDate = searchParams.get('demoDate') || '2026-07-07';
  setCalendarBusyMock(state, demoDate, [{ start: '10:00', end: '11:00' }]);

  // Success redirect back to dashboard (absolute for test sim + real Next)
  return NextResponse.redirect('http://localhost:3000/dashboard?calendar_connected=1&provider=' + encodeURIComponent(state));
}
