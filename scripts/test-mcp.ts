/**
 * Stage 4 test script (slim, per strategist).
 * Assumes `npm run dev:mcp` is already running (per verif plan step 4).
 * - register via store
 * - fetch tools/list + tools/call for BOTH search_services and get_availability using reg.token
 * - assert scoped returns only the registered provider's data (non-empty)
 */
import { registerProvider, getProvidersForToken } from '../src/lib/store.js';

async function main() {
  console.log('=== Stage 4 ===');

  const reg = registerProvider({
    name: 'RegisteredInTestScript',
    location: 'Scriptville',
    services: ['scripted'],
  });
  console.log('registered name:', reg.name, 'token:', reg.token);

  const directScoped = getProvidersForToken(reg.token);
  console.log('direct scoped count:', directScoped.length, 'names:', directScoped.map(p => p.name));
  if (directScoped.length !== 1 || !directScoped[0].name.includes('RegisteredInTestScript')) {
    throw new Error('direct scoped did not return the just registered');
  }

  const base = 'http://localhost:3001/mcp';
  const h = { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream' };

  const listB = { jsonrpc: '2.0', id: 1, method: 'tools/list' };
  const lres = await fetch(base, { method: 'POST', headers: h, body: JSON.stringify(listB) });
  const lj = await lres.json();
  console.log('mcp listTools:', (lj.result?.tools || []).map((t: any) => t.name));

  // search with reg.token
  const sB = { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'search_services', arguments: { query: 'RegisteredInTestScript', token: reg.token } } };
  const sres = await fetch(base, { method: 'POST', headers: h, body: JSON.stringify(sB) });
  const sj = await sres.json();
  const st = sj.result?.content?.[0]?.text || '[]';
  const sParsed = JSON.parse(st);
  console.log('mcp scoped search (reg token):', sParsed);
  if (!Array.isArray(sParsed) || sParsed.length === 0 || !sParsed[0].name.includes('RegisteredInTestScript')) {
    throw new Error('mcp scoped search with reg token did not return the registered provider');
  }

  // availability with reg.token (use Mon date to match default rules)
  const aB = { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'get_availability', arguments: { providerId: reg.id, date: '2026-07-07', token: reg.token } } };
  const ares = await fetch(base, { method: 'POST', headers: h, body: JSON.stringify(aB) });
  const aj = await ares.json();
  const at = aj.result?.content?.[0]?.text || '{}';
  const aParsed = JSON.parse(at);
  console.log('mcp scoped availability (reg token):', aParsed);
  if (!aParsed.slots || aParsed.slots.length === 0) {
    throw new Error('mcp scoped availability with reg token returned no slots');
  }

  console.log('Test complete (both tools with reg.token).');
}

main().catch(e => { console.error(e); process.exit(1); });
