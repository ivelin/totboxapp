import { headers } from 'next/headers';

/** Absolute public origin for this request (preview proxy / Vercel / local). */
export async function getPublicOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:8080';
  const proto =
    h.get('x-forwarded-proto') ||
    (host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https');
  return `${proto}://${host}`;
}

export async function getPublicMcpEndpoint(): Promise<string> {
  return `${await getPublicOrigin()}/mcp`;
}
