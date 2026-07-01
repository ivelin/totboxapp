/**
 * Verification exercise for scaffolding plan (real shipped code paths).
 * Run with: npx tsx scripts/verify-scaffolding.ts
 */
import { resetStore, registerProvider, connectCalendar, setCalendarBusyMock, getAvailabilityForToken } from '../src/lib/store.js';
import { dispatchMcpTool } from '../src/lib/mcp-tools.js';

resetStore();

console.log('=== scaffolding verify: real store/MCP paths ===');

const unconn = registerProvider({ name: 'ScafUnconn', location: 'X', services: ['s'] });
const d = '2026-07-07';
const u = getAvailabilityForToken(unconn.id, d);
console.log('UNCONN slots[0].available:', u.slots[0]?.available);
const uViaMcp = dispatchMcpTool('get_availability', { providerId: unconn.id, date: d, token: unconn.token });
const uParsed = JSON.parse(uViaMcp.content[0].text);
console.log('UNCONN via MCP available:', uParsed.slots[0]?.available);

const conn = registerProvider({ name: 'ScafConn', location: 'X', services: ['s'] });
connectCalendar(conn.id, { accessToken: 'demo' });
setCalendarBusyMock(conn.id, d, [{ start: '10:00', end: '11:00' }]);
const c = getAvailabilityForToken(conn.id, d);
console.log('CONN (busy) slots[0].available:', c.slots[0]?.available);
const cViaMcp = dispatchMcpTool('get_availability', { providerId: conn.id, date: d, token: conn.token });
const cParsed = JSON.parse(cViaMcp.content[0].text);
console.log('CONN via MCP available:', cParsed.slots[0]?.available);

const search = dispatchMcpTool('search_services', { query: 'Scaf' });
console.log('SEARCH via MCP returned count >0 :', JSON.parse(search.content[0].text).length > 0);

if (
  u.slots[0]?.available === true &&
  c.slots[0]?.available === false &&
  uParsed.slots[0]?.available === true &&
  cParsed.slots[0]?.available === false
) {
  console.log('SUCCESS: merged false vs fallback true on real paths');
  process.exit(0);
} else {
  console.error('FAIL: observables not as expected');
  process.exit(1);
}
