import { headers } from 'next/headers';
import fs from 'node:fs';
import path from 'node:path';

/** Absolute public origin for this request (preview proxy / Vercel / local). */
export async function getPublicOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:8080';
  const proto =
    h.get('x-forwarded-proto') ||
    (host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https');
  return `${proto}://${host}`;
}

/**
 * Preferred MCP endpoint for external hosts (Grok cloud).
 * Order:
 * 1. PUBLIC_MCP_URL env
 * 2. .data/public-mcp-url.txt (Cloudflare quick tunnel / deploy)
 * 3. request origin + /mcp (works only if that host is internet-reachable)
 */
export async function getPublicMcpEndpoint(): Promise<string> {
  const fromEnv = process.env.PUBLIC_MCP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  try {
    const p = path.join(process.cwd(), '.data', 'public-mcp-url.txt');
    if (fs.existsSync(p)) {
      const u = fs.readFileSync(p, 'utf8').trim();
      if (u.startsWith('http')) return u.replace(/\/$/, '');
    }
  } catch {
    /* ignore */
  }

  return `${await getPublicOrigin()}/mcp`;
}

/** True when endpoint is only reachable inside the sandbox / laptop. */
export function isLocalOnlyMcpUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.hostname === 'localhost' ||
      u.hostname === '127.0.0.1' ||
      u.hostname.endsWith('.local') ||
      u.hostname.includes('grok-sandbox') ||
      u.hostname.includes('hades-www')
    );
  } catch {
    return false;
  }
}
