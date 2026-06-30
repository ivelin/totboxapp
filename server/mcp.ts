/**
 * Totbox MCP Server (Stage 3)
 * - McpServer + registerTool from official SDK
 * - Seeds data at startup (real non-empty results)
 * - Thin delegation to store (getProviders / getProvider / computeAvailability)
 * - Single McpServer + single StreamableHTTPServerTransport, connect once
 * - Express + handleRequest on POST /mcp
 * - No top-level await at module level (IIFE for startup)
 */

import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';

import { seedProviders, reloadProviders } from '../src/lib/store.js';
import { dispatchMcpTool } from '../src/lib/mcp-tools';
import { appendMcpTranscript } from '../src/lib/mcp-transcript.js';

// Sample data matching types (typed to avoid literal errors)
const SAMPLE_PROVIDERS = [
  {
    id: 'prov_001',
    name: 'Austin Kids Play Center',
    category: 'kids_activities' as const,
    location: 'Austin, TX',
    services: ['Birthday parties', 'Open play', 'Art classes'],
    rules: { availability: { days: ['Tue', 'Thu', 'Sat'], windows: ['09:00-17:00'] } },
    calendarConnected: false,
    token: 'tok_prov001_demo',
  },
  {
    id: 'prov_002',
    name: 'Hill Country HVAC Pros',
    category: 'home_maintenance' as const,
    location: 'Austin, TX',
    services: ['AC Tune-up', 'Furnace Check'],
    rules: { availability: { days: ['Mon', 'Wed', 'Fri'], windows: ['08:00-16:00'] } },
    calendarConnected: false,
    token: 'tok_prov002_demo',
  },
];
seedProviders(SAMPLE_PROVIDERS);

const PORT = process.env.MCP_PORT ? parseInt(process.env.MCP_PORT) : 3001;

const mcpServer = new McpServer({ name: 'totbox', version: '0.1.0' });

// Thin delegation using store functions
mcpServer.registerTool(
  'search_services',
  {
    description: 'Search providers by query, category or location. Returns matching providers. Supply token for scoped results (Stage 4).',
    inputSchema: {
      query: z.string().optional(),
      category: z.string().optional(),
      location: z.string().optional(),
      limit: z.number().int().positive().optional().default(5),
      token: z.string().optional().describe('Provider token for scoping results to one provider'),
    },
  },
  async (args) => {
    return dispatchMcpTool('search_services', args);
  }
);

mcpServer.registerTool(
  'get_provider_details',
  {
    description: 'Return full details for one provider (token optional for scoping in Stage 4).',
    inputSchema: { providerId: z.string(), token: z.string().optional() },
  },
  async (args) => {
    return dispatchMcpTool('get_provider_details', args);
  }
);

mcpServer.registerTool(
  'get_availability',
  {
    description: 'Get availability slots for a provider on a date (rules + calendar if connected, Stage 5). Supply token to scope.',
    inputSchema: { providerId: z.string(), date: z.string(), token: z.string().optional() },
  },
  async (args) => {
    return dispatchMcpTool('get_availability', args);
  }
);

// Startup (IIFE to avoid top-level await cjs issues with tsx/esbuild)
(async () => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  await mcpServer.connect(transport);

  const app = express();
  app.use(express.json());

  app.use((req, _res, next) => {
    console.error('[MCP req]', req.method, req.url, 'content-type:', req.headers['content-type']);
    next();
  });

  app.post('/mcp', async (req, res) => {
    reloadProviders(); // pick up latest from file (UI reg or other processes)
    const body = req.body || {};
    const method = body.method || (body.jsonrpc ? 'unknown' : 'no-method');
    const id = body.id ?? 1;
    appendMcpTranscript(`[MCP_TRANSCRIPT] POST id=${id} method=${method} token? ${body.params?.arguments?.token ? 'yes' : 'no'}`);
    console.error('POST HANDLER ENTERED for', method, 'id=', id);

    // wrap res.json to capture full response body sent (for transcript)
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (body && body.jsonrpc && body.id) {
        appendMcpTranscript(`[MCP_TRANSCRIPT] RESP id=${body.id} body=${JSON.stringify(body)}`);
      }
      return originalJson(body);
    };

    try {
      if (method === 'initialize' || method === 'notifications/initialized' || method === 'unknown' || !method) {
        return res.json({
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'totbox', version: '0.1.0' },
          },
        });
      }

      if (method === 'tools/list') {
        return res.json({
          jsonrpc: '2.0',
          id,
          result: {
            tools: [
              {
                name: 'search_services',
                description: 'Search providers by query, category or location. (token optional for scoping)',
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
                description: 'Return full details for one provider.',
                inputSchema: { type: 'object', properties: { providerId: { type: 'string' }, token: { type: 'string' } }, required: ['providerId'] },
              },
              {
                name: 'get_availability',
                description: 'Get availability slots for a provider on a date.',
                inputSchema: { type: 'object', properties: { providerId: { type: 'string' }, date: { type: 'string' }, token: { type: 'string' } }, required: ['providerId', 'date'] },
              },
            ],
          },
        });
      }

      if (method === 'tools/call') {
        const name = body.params?.name;
        const args = body.params?.arguments || {};
        appendMcpTranscript(`[MCP_TRANSCRIPT] POST id=${id} tool=${name} token? ${args.token ? 'yes' : 'no'}`);
        const result = dispatchMcpTool(name, args);
        return res.json({ jsonrpc: '2.0', id, result });
      }

      // unknown - try transport
      await transport.handleRequest(req, res, body);
    } catch (e) {
      console.error('[MCP post error]', e);
      if (!res.headersSent) res.status(500).json({ error: String(e) });
    }
  });

  app.get('/', (_req, res) => {
    res.json({
      service: 'Totbox MCP Server',
      version: 'stage-3',
      mcpEndpoint: `http://localhost:${PORT}/mcp`,
      tools: ['search_services', 'get_provider_details', 'get_availability'],
    });
  });

  app.listen(PORT, () => {
    console.log(`[Totbox] MCP server listening on http://localhost:${PORT}/mcp`);
    appendMcpTranscript(`[MCP_TRANSCRIPT] listening`);
  });
})();
