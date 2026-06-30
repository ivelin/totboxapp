/**
 * Stage 5 MCP test helper (per strategist).
 * Assumes `npm run dev:mcp` is already running.
 * - register conn provider (with busy for date) and unconn
 * - POST get_availability via real fetch to mcp for both, using valid token
 * - use unique jsonrpc id per call (e.g. runX-conn)
 * - assert conn has available:false (merged), unconn available:true (fallback)
 * - prints full responses for capture
 * Called by orchestrator for x2 distinct runs.
 */
import { registerProvider, connectCalendar, setCalendarBusyMock } from '../src/lib/store.js';

const date = '2026-07-07';

async function main() {
  const runId = process.argv[2] || Date.now().toString(36);

  // conn provider + busy
  const conn = registerProvider({
    name: `Stage5McpConn-${runId}`,
    location: 'Mcpville',
    services: ['test'],
  });
  connectCalendar(conn.id, { accessToken: 'demo' });
  setCalendarBusyMock(conn.id, date, [{ start: '10:00', end: '11:00' }]);
  console.log('conn registered:', conn.id, 'token len', conn.token.length);

  // unconn
  const unconn = registerProvider({
    name: `Stage5McpUnconn-${runId}`,
    location: 'Mcpville',
    services: ['test'],
  });
  console.log('unconn registered:', unconn.id, 'token len', unconn.token.length);

  const base = 'http://localhost:3001/mcp';
  const h = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

  // conn call - expect available:false due to busy overlap
  const cId = `run-${runId}-conn`;
  const cB = { jsonrpc: '2.0', id: cId, method: 'tools/call', params: { name: 'get_availability', arguments: { providerId: conn.id, date, token: conn.token } } };
  const cRes = await fetch(base, { method: 'POST', headers: h, body: JSON.stringify(cB) });
  const cJ = await cRes.json();
  const cText = cJ.result?.content?.[0]?.text || '{}';
  const cParsed = JSON.parse(cText);
  console.log(`mcp conn (${cId}):`, cParsed);
  const connHasFalse = Array.isArray(cParsed.slots) && cParsed.slots.some((s: any) => s.available === false);
  if (!connHasFalse) {
    throw new Error('conn did not return unavailable slot from merged busy');
  }

  // unconn call - expect available:true
  const uId = `run-${runId}-unconn`;
  const uB = { jsonrpc: '2.0', id: uId, method: 'tools/call', params: { name: 'get_availability', arguments: { providerId: unconn.id, date, token: unconn.token } } };
  const uRes = await fetch(base, { method: 'POST', headers: h, body: JSON.stringify(uB) });
  const uJ = await uRes.json();
  const uText = uJ.result?.content?.[0]?.text || '{}';
  const uParsed = JSON.parse(uText);
  console.log(`mcp unconn (${uId}):`, uParsed);
  const unconnHasTrue = Array.isArray(uParsed.slots) && uParsed.slots.some((s: any) => s.available === true);
  if (!unconnHasTrue) {
    throw new Error('unconn did not return available slot (fallback)');
  }

  console.log(`MCP run ${runId} complete: conn merged, unconn fallback.`);
}

main().catch(e => { console.error(e); process.exit(1); });
