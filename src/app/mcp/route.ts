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
    const proto = xfProto || (xfHost.includes('localhost') || xfHost.startsWith('127.') ? 'http' : 'https');
    return `${proto}://${xfHost}/mcp`;
  }
  return new URL('/mcp', req.url).toString();
}

function wantsSse(req: NextRequest): boolean {
  const accept = (req.headers.get('accept') || '').toLowerCase();
  return accept.includes('text/event-stream');
}

function wantsJson(req: NextRequest): boolean {
  const accept = (req.headers.get('accept') || '').toLowerCase();
  return accept.includes('application/json') || accept === '' || accept === '*/*';
}

/**
 * GET:
 * - Accept: text/event-stream → open standalone SSE (Grok Streamable HTTP)
 * - otherwise → service metadata (for humans / health)
 */
export async function GET(req: NextRequest) {
  if (wantsSse(req)) {
    // Optional standalone SSE stream for server→client notifications.
    // Keep connection open with periodic comments (keepalive).
    const stream = new ReadableStream({
      start(controller) {
        const enc = new TextEncoder();
        // Priming comment so clients see a valid SSE stream immediately
        controller.enqueue(enc.encode(': totbox-mcp-sse\n\n'));
        const t = setInterval(() => {
          try {
            controller.enqueue(enc.encode(': keepalive\n\n'));
          } catch {
            clearInterval(t);
          }
        }, 15000);
        // Store cleanup on cancel via closed stream
        const cancel = () => {
          clearInterval(t);
          try {
            controller.close();
          } catch {
            /* */
          }
        };
        // Auto-close after 5 min to avoid orphan streams in serverless-ish envs
        setTimeout(cancel, 5 * 60 * 1000);
      },
    });

    const headers = new Headers({
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    applyCors(headers);
    return new Response(stream, { status: 200, headers });
  }

  // Browser / health
  const headers = new Headers({ 'Content-Type': 'application/json' });
  applyCors(headers);
  return new Response(JSON.stringify(mcpServiceInfo(publicEndpoint(req)), null, 0), {
    status: 200,
    headers,
  });
}

/**
 * POST: JSON-RPC messages (initialize, tools/list, tools/call, notifications).
 * When client Accept includes text/event-stream, respond as SSE (Streamable HTTP).
 * Notifications-only → 202.
 */
export async function POST(req: NextRequest) {
  try {
    const accept = (req.headers.get('accept') || '').toLowerCase();
    // Grok / MCP clients must Accept both; if they only send SSE we still handle.
    const preferSse = accept.includes('text/event-stream');

    const raw = await req.json().catch(() => null);
    if (raw == null) {
      return jsonError(400, -32700, 'Parse error: Invalid JSON');
    }

    const messages: JsonRpcMessage[] = Array.isArray(raw) ? raw : [raw];
    const requests = messages.filter(isJsonRpcRequest);
    const notifications = messages.filter(isNotification);

    // Process notifications (side-effect free for us)
    for (const n of notifications) {
      handleMcpMessage(n);
    }

    if (requests.length === 0) {
      // Spec: notifications-only → 202 Accepted, empty body
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
      // Streamable HTTP: each JSON-RPC response as SSE event:message
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
      // Protocol version echo (optional but helpful)
      const init = responses.find(
        (r) => r.result && typeof r.result === 'object' && r.result !== null && 'protocolVersion' in (r.result as object)
      );
      if (init && init.result && typeof init.result === 'object') {
        const pv = (init.result as { protocolVersion?: string }).protocolVersion;
        if (pv) headers.set('Mcp-Protocol-Version', pv);
      }
      return new Response(sse, { status: 200, headers });
    }

    // JSON response mode (curl, simple clients)
    const headers = new Headers({ 'Content-Type': 'application/json' });
    applyCors(headers);
    return new Response(JSON.stringify(bodyPayload), { status: 200, headers });
  } catch (e) {
    return jsonError(500, -32603, e instanceof Error ? e.message : 'internal error');
  }
}

/** Session teardown (stateless — always 200) */
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
  return new Response(
    JSON.stringify({ jsonrpc: '2.0', id: null, error: { code, message } }),
    { status: httpStatus, headers }
  );
}
