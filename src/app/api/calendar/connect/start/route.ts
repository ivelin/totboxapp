import { NextRequest, NextResponse } from 'next/server';

// Minimal Google OAuth start (Stage 5 demo)
// Redirects to Google's consent; for demo without real creds we can short-circuit
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'provider id required' }, { status: 400 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || 'demo-client-id';
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/calendar/connect/callback';
  const scope = 'https://www.googleapis.com/auth/calendar.readonly';

  // Build auth url (real would use state + pkce)
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');
  authUrl.searchParams.set('state', id); // pass provider id via state for callback

  // For demo when no real client id, short circuit directly to callback with demo code
  if (clientId === 'demo-client-id' || !process.env.GOOGLE_CLIENT_ID) {
    const demoCb = new URL(redirectUri);
    demoCb.searchParams.set('code', 'demo-code-for-' + id);
    demoCb.searchParams.set('state', id);
    return NextResponse.redirect(demoCb.toString());
  }

  return NextResponse.redirect(authUrl.toString());
}
