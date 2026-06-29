/**
 * Totbox MCP Server (Stage 3)
 * Per-request fresh McpServer + close to avoid already-connected.
 */
import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { getProviders, getProvider, computeAvailability } from '../src/lib/store.js';

const PORT = process.env.MCP_PORT ? parseInt(process.env.MCP_PORT) : 3001;
const app = express();
app.use(express.json());

app.post('/mcp', async (req, res) => {
  const srv = new McpServer({ name: 'totbox', version: '0.1.0' });

  srv.tool('search_services', 'Search providers.', {
    query: z.string().optional(), category: z.string().optional(), location: z.string().optional(), limit: z.number().optional().default(5)
  }, async (a) => {
    let r = getProviders();
    if (a.category) r = r.filter(p => p.category.includes(a.category!));
    if (a.location) r = r.filter(p => p.location.toLowerCase().includes(a.location!.toLowerCase()));
    if (a.query) {
      const q = a.query.toLowerCase(); r = r.filter(p => p.name.toLowerCase().includes(q) || p.services.some(s => s.toLowerCase().includes(q)));
    }
    return { content: [{ type: 'text', text: JSON.stringify(r.slice(0, a.limit||5).map(p => ({id:p.id,name:p.name,category:p.category,location:p.location,services:p.services})), null, 2) }] };
  });

  srv.tool('get_provider_details', 'Details.', { providerId: z.string() }, async ({providerId}) => ({ content: [{type:'text', text: JSON.stringify(getProvider(providerId) || 'not found', null, 2)}] }));

  srv.tool('get_availability', 'Avail.', { providerId: z.string(), date: z.string() }, async ({providerId, date}) => ({ content: [{type:'text', text: JSON.stringify({providerId, date, slots: computeAvailability(providerId, date)}, null, 2)}] }));

  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  try { await srv.connect(transport); } catch(e:any){ if (!/Already connected/.test(String(e))) throw e; }
  await transport.handleRequest(req, res, req.body);
  try { await transport.close(); await srv.close(); } catch(e){}
});

app.get('/', (_, res) => res.json({ service: 'Totbox MCP Server', mcpEndpoint: `http://localhost:${PORT}/mcp`, tools: ['search_services', 'get_provider_details', 'get_availability'] }));

app.listen(PORT, () => console.log(`[Totbox] MCP listening on http://localhost:${PORT}/mcp`));
