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

import { seedProviders, reloadProviders, beachheadSampleProviders } from '../../src/lib/store.js';
import { dispatchMcpTool, listJobPmToolDescriptors } from '../../src/lib/mcp-tools';
import { appendMcpTranscript } from '../../src/lib/mcp-transcript.js';

// Stage 6 beachhead seed: fictional HVAC + cleaning (+ tree) operators only
seedProviders(beachheadSampleProviders());

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

mcpServer.registerTool(
  'create_service_brief',
  {
    description:
      'Capture a natural-language home-services job as a structured service brief (Stage 6). Infers category/budget/priorities when possible.',
    inputSchema: {
      naturalLanguage: z.string().describe('User request in plain language'),
      category: z.string().optional(),
      serviceType: z.string().optional(),
      priorities: z.array(z.string()).optional(),
      budgetUsd: z.number().optional(),
      location: z.string().optional(),
      dateWindow: z.string().optional(),
    },
  },
  async (args) => {
    return dispatchMcpTool('create_service_brief', args);
  }
);

mcpServer.registerTool(
  'compare_options',
  {
    description:
      'Parallel multi-provider comparison (price, membership, cancel fee, inclusions, trust stub). Pass naturalLanguage and/or briefId (Stage 6).',
    inputSchema: {
      naturalLanguage: z.string().optional(),
      briefId: z.string().optional(),
      category: z.string().optional(),
      location: z.string().optional(),
      budgetUsd: z.number().optional(),
      query: z.string().optional(),
      limit: z.number().int().positive().optional().default(5),
    },
  },
  async (args) => {
    return dispatchMcpTool('compare_options', args);
  }
);

// Job PM tools are exposed via HTTP tools/list + tools/call → dispatchMcpTool (host-LLM-first PM).

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
        const legacy = [
          {
            name: 'search_services',
            description: 'Local fixture/search helper — NOT a city vendor directory. Prefer external discovery + start_job.',
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
              properties: { providerId: { type: 'string' }, date: { type: 'string' }, token: { type: 'string' } },
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
        return res.json({
          jsonrpc: '2.0',
          id,
          result: { tools: [...listJobPmToolDescriptors(), ...legacy] },
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
      version: 'job-pm-host-llm-safety',
      mcpEndpoint: `http://localhost:${PORT}/mcp`,
      principle: 'Safety before convenience. Host LLM first; explicit user approvals for side effects.',
      tools: [
        ...listJobPmToolDescriptors().map(t => t.name),
        'search_services',
        'get_provider_details',
        'get_availability',
        'create_service_brief',
        'compare_options',
      ],
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Totbox] MCP server listening on http://0.0.0.0:${PORT}/mcp`);
    appendMcpTranscript(`[MCP_TRANSCRIPT] listening`);
  });
})();
