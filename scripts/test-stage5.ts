/**
 * Stage 5 test driver.
 * - registers provider via real store
 * - simulates calendar connect + sample busy for a date
 * - calls getAvailabilityForToken (real shipped) for connected vs unconnected
 * - also exercises via MCP POST if MCP running (for verif-4)
 * Captures to stdout for redirect to {SCRATCH}/stage5-*.log
 */
import { registerProvider, setCalendarBusyMock, getAvailabilityForToken, connectCalendar } from '../src/lib/store.js';

const SCRATCH = process.env.SCRATCH || '/tmp/grok-goal-de43eae9ef8b/implementer';

async function main() {
  console.log('=== Stage 5 availability test (direct store path) ===');

  // fresh register
  const prov = registerProvider({
    name: 'Stage5TestProvider',
    location: 'Testville',
    services: ['test'],
  });
  console.log('registered:', prov.id, 'calendarConnected:', prov.calendarConnected);

  // unconnected case (should be rules only)
  const date = '2026-07-07'; // assume Tue allowed in default rules
  const unconn = getAvailabilityForToken(prov.id, date);
  console.log('UNCONNECTED slots:', JSON.stringify(unconn.slots));

  // simulate connect with busy that overlaps the window e.g. 10:00-11:00 busy
  connectCalendar(prov.id, { accessToken: 'demo-token' });
  setCalendarBusyMock(prov.id, date, [{ start: '10:00', end: '11:00' }]);

  const conn = getAvailabilityForToken(prov.id, date);
  console.log('CONNECTED (busy 10-11) slots:', JSON.stringify(conn.slots));

  // assert behavior: unconn available, connected has at least one unavailable due to overlap
  const unconnAvailable = unconn.slots[0]?.available;
  const connHasUnavailable = conn.slots.some((s: any) => s.available === false);
  console.log('unconn available?', unconnAvailable, 'conn has unavailable slot?', connHasUnavailable);

  if (!unconnAvailable || !connHasUnavailable) {
    console.error('FAIL: expected merge behavior not observed');
    process.exit(1);
  }

  console.log('direct store SUCCESS (merged differs from pure rules, fallback preserved)');

  // For MCP path (run with bg server):
  // node -e ' ... fetch to localhost:3001/mcp tools/call get_availability with token and providerId '
  // see verif plan for exact
}

main().catch(e => { console.error(e); process.exit(1); });
