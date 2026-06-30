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

import { seedProviders, getProviders, getProvider, computeAvailability } from '../src/lib/store.js';

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
  },
  {
    id: 'prov_002',
    name: 'Hill Country HVAC Pros',
    category: 'home_maintenance' as const,
    location: 'Austin, TX',
    services: ['AC Tune-up', 'Furnace Check'],
    rules: { availability: { days: ['Mon', 'Wed', 'Fri'], windows: ['08:00-16:00'] } },
    calendarConnected: false,
  },
];
seedProviders(SAMPLE_PROVIDERS);

const PORT = process.env.MCP_PORT ? parseInt(process.env.MCP_PORT) : 3001;

const mcpServer = new McpServer({ name: 'totbox', version: '0.1.0' });

// Thin delegation using store functions
mcpServer.registerTool(
  'search_services',
  {
    description: 'Search providers by query, category or location. Returns matching providers.',
    inputSchema: {
      query: z.string().optional(),
      category: z.string().optional(),
      location: z.string().optional(),
      limit: z.number().int().positive().optional().default(5),
    },
  },
  async (args) => {
    let results = getProviders();
    if (args.category) {
      results = results.filter(p => p.category.includes(args.category as any));
    }
    if (args.location) {
      const loc = args.location.toLowerCase();
      results = results.filter(p => p.location.toLowerCase().includes(loc));
    }
    if (args.query) {
      const q = args.query.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.services.some(s => s.toLowerCase().includes(q))
      );
    }
    const sliced = results.slice(0, args.limit ?? 5).map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      location: p.location,
      services: p.services,
    }));
    return { content: [{ type: 'text', text: JSON.stringify(sliced, null, 2) }] };
  }
);

mcpServer.registerTool(
  'get_provider_details',
  {
    description: 'Return full details for one provider.',
    inputSchema: { providerId: z.string() },
  },
  async ({ providerId }) => {
    const p = getProvider(providerId);
    return { content: [{ type: 'text', text: JSON.stringify(p ?? 'Provider not found', null, 2) }] };
  }
);

mcpServer.registerTool(
  'get_availability',
  {
    description: 'Get availability slots for a provider on a date (rules-based).',
    inputSchema: { providerId: z.string(), date: z.string() },
  },
  async ({ providerId, date }) => {
    const slots = computeAvailability(providerId, date);
    return { content: [{ type: 'text', text: JSON.stringify({ providerId, date, slots }, null, 2) }] };
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
    const body = req.body || {};
    const method = body.method || (body.jsonrpc ? 'unknown' : 'no-method');
    const id = body.id ?? 1;
    console.error('[MCP POST]', method, 'id=', id, 'params keys=', Object.keys(body.params || {}));

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
                description: 'Search providers by query, category or location.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    query: { type: 'string' },
                    category: { type: 'string' },
                    location: { type: 'string' },
                    limit: { type: 'number' },
                  },
                },
              },
              {
                name: 'get_provider_details',
                description: 'Return full details for one provider.',
                inputSchema: { type: 'object', properties: { providerId: { type: 'string' } }, required: ['providerId'] },
              },
              {
                name: 'get_availability',
                description: 'Get availability slots for a provider on a date.',
                inputSchema: { type: 'object', properties: { providerId: { type: 'string' }, date: { type: 'string' } }, required: ['providerId', 'date'] },
              },
            ],
          },
        });
      }

      if (method === 'tools/call') {
        const name = body.params?.name;
        const args = body.params?.arguments || {};
        let content: any[];
        if (name === 'search_services') {
          let results = getProviders();
          if (args.category) results = results.filter((p: any) => p.category.includes(args.category));
          if (args.location) results = results.filter((p: any) => p.location.toLowerCase().includes(String(args.location).toLowerCase()));
          if (args.query) {
            const q = String(args.query).toLowerCase();
            results = results.filter((p: any) => p.name.toLowerCase().includes(q) || p.services.some((s: string) => s.toLowerCase().includes(q)));
          }
          const out = results.slice(0, args.limit ?? 5).map((p: any) => ({ id: p.id, name: p.name, category: p.category, location: p.location, services: p.services }));
          content = [{ type: 'text', text: JSON.stringify(out, null, 2) }];
        } else if (name === 'get_provider_details') {
          const p = getProvider(args.providerId);
          content = [{ type: 'text', text: JSON.stringify(p ?? 'not found', null, 2) }];
        } else if (name === 'get_availability') {
          const slots = computeAvailability(args.providerId, args.date);
          content = [{ type: 'text', text: JSON.stringify({ providerId: args.providerId, date: args.date, slots }, null, 2) }];
        } else {
          content = [{ type: 'text', text: JSON.stringify({ error: 'unknown tool ' + name }) }];
        }
        return res.json({ jsonrpc: '2.0', id, result: { content } });
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
  });
})();
