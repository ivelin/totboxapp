/**
 * Shared MCP HTTP JSON-RPC handlers (Streamable HTTP–compatible subset).
 * Used by Next /mcp and product/server/mcp.ts so UI + host share one surface.
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
    /* optional file reload */
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

export function listAllMcpTools() {
  return [...listJobPmToolDescriptors(), ...LEGACY_TOOLS];
}

export function handleMcpJsonRpc(body: Record<string, unknown>) {
  ensureSeed();
  const method = String(body.method || (body.jsonrpc ? 'unknown' : 'no-method'));
  const id = body.id ?? 1;

  if (
    method === 'initialize' ||
    method === 'notifications/initialized' ||
    method === 'unknown' ||
    !method ||
    method === 'no-method'
  ) {
    return {
      jsonrpc: '2.0' as const,
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'totbox', version: '0.1.0' },
      },
    };
  }

  if (method === 'ping') {
    return { jsonrpc: '2.0' as const, id, result: {} };
  }

  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0' as const,
      id,
      result: { tools: listAllMcpTools() },
    };
  }

  if (method === 'tools/call') {
    const params = (body.params || {}) as { name?: string; arguments?: Record<string, unknown> };
    const name = params.name || '';
    const args = params.arguments || {};
    const result = dispatchMcpTool(name, args);
    return { jsonrpc: '2.0' as const, id, result };
  }

  return {
    jsonrpc: '2.0' as const,
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  };
}

export function mcpServiceInfo(endpoint: string) {
  return {
    service: 'Totbox MCP Server',
    version: 'job-pm-host-llm-safety',
    mcpEndpoint: endpoint,
    transport: 'http',
    auth: 'none required for household job PM tools',
    principle: 'Safety before convenience. Host LLM first; explicit user approvals for side effects.',
    tools: listAllMcpTools().map((t) => t.name),
    grok: {
      add: `grok mcp add --transport http totbox ${endpoint}`,
      sample: 'Using Totbox MCP: call get_workflow, then start_job with a cleaning intent.',
    },
  };
}
