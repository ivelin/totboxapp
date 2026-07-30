import { NextRequest, NextResponse } from 'next/server';
import {
  formatSseMessage,
  handleMcpMessage,
  isJsonRpcRequest,
  isNotification,
  mcpServiceInfo,
  type JsonRpcMessage,
} from '@/lib/mcp-http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
/** Allow enough time for tool calls on Vercel */
export const maxDuration = 60;

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Accept, Authorization, Mcp-Session-Id, Last-Event-ID, Mcp-Protocol-Version',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id, Mcp-Protocol-Version',
};

function applyCors(headers: Headers) {
  for (const [k, v] of Object.entries(CORS)) headers.set(k, v);
}

function publicEndpoint(req: NextRequest) {
  const xfProto = req.headers.get('x-forwarded-proto');
  const xfHost = req.headers.get('x-forwarded-host') || req.headers.get('host');
  if (xfHost) {
    const proto =
      xfProto ||
      (xfHost.includes('localhost') || xfHost.startsWith('127.') ? 'http' : 'https');
    return `${proto}://${xfHost}/mcp`;
  }
  return new URL('/mcp', req.url).toString();
}

function wantsSse(req: NextRequest): boolean {
  const accept = (req.headers.get('accept') || '').toLowerCase();
  return accept.includes('text/event-stream');
}

/**
 * GET:
 * - Accept: text/event-stream → open standalone SSE (optional per MCP)
 * - otherwise → service metadata (humans / health)
 *
 * On serverless (Vercel), return a short completed SSE body so the function can finish.
 * Long-lived keepalives are only useful on a always-on Node process.
 */
export async function GET(req: NextRequest) {
  if (wantsSse(req)) {
    // Short-lived SSE: proves SSE support without holding the connection open.
    // Clients treat open-then-end as OK; 405 also OK, but some hosts require SSE Content-Type.
    const body = ': totbox-mcp-sse\n\n';
    const headers = new Headers({
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    applyCors(headers);
    return new Response(body, { status: 200, headers });
  }

  const headers = new Headers({ 'Content-Type': 'application/json' });
  applyCors(headers);
  return new Response(JSON.stringify(mcpServiceInfo(publicEndpoint(req))), {
    status: 200,
    headers,
  });
}

/**
 * POST: JSON-RPC (initialize, tools/list, tools/call, notifications).
 * Prefer SSE when client Accept includes text/event-stream (Grok Streamable HTTP).
 * Notifications-only → 202.
 */
export async function POST(req: NextRequest) {
  try {
    const accept = (req.headers.get('accept') || '').toLowerCase();
    const preferSse = accept.includes('text/event-stream');

    const raw = await req.json().catch(() => null);
    if (raw == null) {
      return jsonError(400, -32700, 'Parse error: Invalid JSON');
    }

    const messages: JsonRpcMessage[] = Array.isArray(raw) ? raw : [raw];
    const requests = messages.filter(isJsonRpcRequest);
    const notifications = messages.filter(isNotification);

    for (const n of notifications) {
      handleMcpMessage(n);
    }

    if (requests.length === 0) {
      const headers = new Headers();
      applyCors(headers);
      return new Response(null, { status: 202, headers });
    }

    const responses: JsonRpcMessage[] = [];
    for (const m of requests) {
      const r = handleMcpMessage(m);
      if (r) responses.push(r);
    }

    const bodyPayload = responses.length === 1 ? responses[0] : responses;

    if (preferSse) {
      let sse = '';
      for (let i = 0; i < responses.length; i++) {
        sse += formatSseMessage(responses[i], `evt-${Date.now()}-${i}`);
      }
      const headers = new Headers({
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      });
      applyCors(headers);
      const init = responses.find(
        (r) =>
          r.result &&
          typeof r.result === 'object' &&
          r.result !== null &&
          'protocolVersion' in (r.result as object)
      );
      if (init && init.result && typeof init.result === 'object') {
        const pv = (init.result as { protocolVersion?: string }).protocolVersion;
        if (pv) headers.set('Mcp-Protocol-Version', pv);
      }
      return new Response(sse, { status: 200, headers });
    }

    const headers = new Headers({ 'Content-Type': 'application/json' });
    applyCors(headers);
    return new Response(JSON.stringify(bodyPayload), { status: 200, headers });
  } catch (e) {
    return jsonError(500, -32603, e instanceof Error ? e.message : 'internal error');
  }
}

export async function DELETE() {
  const headers = new Headers();
  applyCors(headers);
  return new Response(null, { status: 200, headers });
}

export async function OPTIONS() {
  const headers = new Headers();
  applyCors(headers);
  return new Response(null, { status: 204, headers });
}

function jsonError(httpStatus: number, code: number, message: string) {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  applyCors(headers);
  return new Response(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code, message } }), {
    status: httpStatus,
    headers,
  });
}
