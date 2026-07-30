/**
 * Shared MCP JSON-RPC handlers + Streamable HTTP helpers.
 * Spec: initialize / tools/list / tools/call; POST may return SSE or JSON;
 * GET with Accept: text/event-stream opens optional standalone SSE.
 */

import { dispatchMcpTool, listJobPmToolDescriptors } from './mcp-tools';
import { seedProviders, beachheadSampleProviders, reloadProviders } from './store';

let seeded = false;

function ensureSeed() {
  if (!seeded) {
    seedProviders(beachheadSampleProviders());
    seeded = true;
  }
  try {
    reloadProviders();
  } catch {
    /* optional */
  }
}

const LEGACY_TOOLS = [
  {
    name: 'search_services',
    description:
      'Local fixture/search helper — NOT a city vendor directory. Prefer external discovery + start_job.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        category: { type: 'string' },
        location: { type: 'string' },
        limit: { type: 'number' },
        token: { type: 'string' },
      },
    },
  },
  {
    name: 'get_provider_details',
    description: 'Return full details for one local fixture provider.',
    inputSchema: {
      type: 'object',
      properties: { providerId: { type: 'string' }, token: { type: 'string' } },
      required: ['providerId'],
    },
  },
  {
    name: 'get_availability',
    description: 'Get availability slots for a provider on a date.',
    inputSchema: {
      type: 'object',
      properties: {
        providerId: { type: 'string' },
        date: { type: 'string' },
        token: { type: 'string' },
      },
      required: ['providerId', 'date'],
    },
  },
  {
    name: 'create_service_brief',
    description: 'Legacy brief helper; prefer start_job for full PM checklist.',
    inputSchema: {
      type: 'object',
      properties: {
        naturalLanguage: { type: 'string' },
        category: { type: 'string' },
        serviceType: { type: 'string' },
        priorities: { type: 'array', items: { type: 'string' } },
        budgetUsd: { type: 'number' },
        location: { type: 'string' },
        dateWindow: { type: 'string' },
      },
      required: ['naturalLanguage'],
    },
  },
  {
    name: 'compare_options',
    description: 'Compare local fixture offers; job quotes use ingest_provider_message on a job.',
    inputSchema: {
      type: 'object',
      properties: {
        naturalLanguage: { type: 'string' },
        briefId: { type: 'string' },
        category: { type: 'string' },
        location: { type: 'string' },
        budgetUsd: { type: 'number' },
        query: { type: 'string' },
        limit: { type: 'number' },
      },
    },
  },
];

/** Prefer newer protocol versions Grok may negotiate */
export const SUPPORTED_PROTOCOL_VERSIONS = [
  '2025-11-25',
  '2025-06-18',
  '2025-03-26',
  '2024-11-05',
];

export function negotiateProtocolVersion(requested?: string): string {
  if (requested && SUPPORTED_PROTOCOL_VERSIONS.includes(requested)) return requested;
  return '2025-03-26';
}

export function listAllMcpTools() {
  return [...listJobPmToolDescriptors(), ...LEGACY_TOOLS];
}

export type JsonRpcMessage = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
  result?: unknown;
  error?: unknown;
};

export function isJsonRpcRequest(msg: JsonRpcMessage): boolean {
  return !!msg.method && msg.id !== undefined && msg.id !== null;
}

export function isNotification(msg: JsonRpcMessage): boolean {
  return !!msg.method && (msg.id === undefined || msg.id === null);
}

/**
 * Handle a single JSON-RPC request/notification.
 * Returns a response object for requests, or null for notifications.
 */
export function handleMcpMessage(body: JsonRpcMessage): JsonRpcMessage | null {
  ensureSeed();
  const method = String(body.method || '');
  const id = body.id;

  // Notifications — no response body
  if (method.startsWith('notifications/') || (method && (id === undefined || id === null))) {
    if (method === 'notifications/initialized' || method === 'notifications/cancelled') {
      return null;
    }
    // Unknown notification: still accept
    if (method && (id === undefined || id === null)) return null;
  }

  if (method === 'initialize') {
    const requested =
      typeof body.params?.protocolVersion === 'string' ? body.params.protocolVersion : undefined;
    return {
      jsonrpc: '2.0',
      id: id ?? 1,
      result: {
        protocolVersion: negotiateProtocolVersion(requested),
        capabilities: {
          tools: { listChanged: false },
        },
        serverInfo: { name: 'totbox', version: '0.1.0' },
        instructions:
          'Totbox household job PM. Prefer start_job → update_job_facts → submit_draft_for_approval → record_user_approval → approve_and_send_message (dryRun) → ingest_provider_message → confirm_appointment → record_job_completion. No token required.',
      },
    };
  }

  if (method === 'ping') {
    return { jsonrpc: '2.0', id: id ?? 1, result: {} };
  }

  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id: id ?? 1,
      result: { tools: listAllMcpTools() },
    };
  }

  if (method === 'tools/call') {
    const name = String(body.params?.name || '');
    const args = (body.params?.arguments || {}) as Record<string, unknown>;
    const result = dispatchMcpTool(name, args);
    return { jsonrpc: '2.0', id: id ?? 1, result };
  }

  if (method === 'resources/list') {
    return { jsonrpc: '2.0', id: id ?? 1, result: { resources: [] } };
  }

  if (method === 'prompts/list') {
    return { jsonrpc: '2.0', id: id ?? 1, result: { prompts: [] } };
  }

  return {
    jsonrpc: '2.0',
    id: id ?? 1,
    error: { code: -32601, message: `Method not found: ${method || '(none)'}` },
  };
}

/** @deprecated use handleMcpMessage */
export function handleMcpJsonRpc(body: Record<string, unknown>) {
  return handleMcpMessage(body as JsonRpcMessage) || {
    jsonrpc: '2.0' as const,
    id: body.id ?? 1,
    result: {},
  };
}

export function formatSseMessage(payload: unknown, eventId?: string): string {
  const idLine = eventId ? `id: ${eventId}\n` : '';
  return `${idLine}event: message\ndata: ${JSON.stringify(payload)}\n\n`;
}

export function mcpServiceInfo(endpoint: string) {
  return {
    service: 'Totbox MCP Server',
    version: 'job-pm-host-llm-safety',
    mcpEndpoint: endpoint,
    transport: 'streamable-http',
    auth: 'none required for household job PM tools',
    principle: 'Safety before convenience. Host LLM first; explicit user approvals for side effects.',
    tools: listAllMcpTools().map((t) => t.name),
    protocolVersions: SUPPORTED_PROTOCOL_VERSIONS,
    grok: {
      add: `grok mcp add --transport http totbox ${endpoint}`,
      sample: 'Using Totbox MCP: call get_workflow, then start_job with a cleaning intent.',
    },
  };
}
