import { NextRequest, NextResponse } from 'next/server';
import { handleMcpJsonRpc, mcpServiceInfo } from '@/lib/mcp-http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Accept, Authorization, Mcp-Session-Id, Last-Event-ID',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id',
};

function withCors(res: NextResponse) {
  for (const [k, v] of Object.entries(CORS)) res.headers.set(k, v);
  return res;
}

function publicEndpoint(req: NextRequest) {
  // Prefer reverse-proxy host (Grok sandbox / Vercel) so the URL is copy-paste ready
  const xfProto = req.headers.get('x-forwarded-proto');
  const xfHost = req.headers.get('x-forwarded-host') || req.headers.get('host');
  if (xfHost) {
    const proto = xfProto || (xfHost.includes('localhost') ? 'http' : 'https');
    return `${proto}://${xfHost}/mcp`;
  }
  return new URL('/mcp', req.url).toString();
}

/** Health + connect metadata (no auth). */
export async function GET(req: NextRequest) {
  const endpoint = publicEndpoint(req);
  return withCors(NextResponse.json(mcpServiceInfo(endpoint)));
}

/** MCP JSON-RPC (initialize, tools/list, tools/call). */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const payload = handleMcpJsonRpc(body);
    return withCors(NextResponse.json(payload));
  } catch (e) {
    return withCors(
      NextResponse.json(
        {
          jsonrpc: '2.0',
          id: null,
          error: { code: -32603, message: e instanceof Error ? e.message : 'internal error' },
        },
        { status: 500 }
      )
    );
  }
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}
