#!/usr/bin/env tsx
/**
 * Strong evaluation / regression harness for Totbox core behaviors.
 * 
 * Golden fixtures live in scripts/eval/fixtures/
 * Extend with new cases for every feature addition or behavior change.
 * 
 * Run: npm run test:eval   (or npx tsx scripts/eval/run-eval.ts)
 * 
 * Exit code: 0 = all evals pass, 1 = regression detected.
 */

import { readFileSync } from 'fs';
import path from 'path';
import {
  resetStore,
  seedProviders,
  connectCalendar,
  setCalendarBusyMock,
  searchProviders,
  computeAvailability,
} from '../../src/lib/store';
import { dispatchMcpTool } from '../../src/lib/mcp-tools';

const FIXTURES_DIR = path.join(__dirname, 'fixtures');

function loadJson<T>(name: string): T {
  const full = path.join(FIXTURES_DIR, name);
  return JSON.parse(readFileSync(full, 'utf8'));
}

interface AvailabilityCase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  providerSeed: any;
  connectTokens?: { accessToken: string };
  busy?: Array<{start: string; end: string}>;
  date: string;
  expectedFirstSlotAvailable: boolean;
  description?: string;
}

interface SearchCase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  providerSeed?: any;
  args: { query?: string; category?: string; location?: string; limit?: number };
  token?: string;
  expectedCountMin: number;
  expectedIdsContain?: string[];
  description?: string;
}

function setupProvider(caseItem: AvailabilityCase) {
  resetStore();
  const p = { ...caseItem.providerSeed };
  seedProviders([p]);
  if (caseItem.connectTokens) {
    connectCalendar(p.id, caseItem.connectTokens);
  }
  if (caseItem.busy) {
    setCalendarBusyMock(p.id, caseItem.date, caseItem.busy);
  }
}

function runAvailabilityEval(cases: AvailabilityCase[]): { passed: number; failed: number; details: string[] } {
  let passed = 0, failed = 0;
  const details: string[] = [];

  for (const c of cases) {
    try {
      setupProvider(c);
      const slots = computeAvailability(c.providerSeed.id, c.date);
      const firstAvailable = slots.length > 0 ? slots[0].available : false;
      if (firstAvailable === c.expectedFirstSlotAvailable) {
        passed++;
        // also drive via MCP dispatch for real path
        const mcpRes = dispatchMcpTool('get_availability', { providerId: c.providerSeed.id, date: c.date, token: c.providerSeed.token });
        const parsed = JSON.parse(mcpRes.content[0].text);
        const mcpAvail = parsed.slots?.[0]?.available;
        if (mcpAvail !== firstAvailable) {
          failed++;
          details.push(`FAIL mcp-dispatch availability mismatch for ${c.description}`);
        }
      } else {
        failed++;
        details.push(`FAIL availability: ${c.description || c.providerSeed.id} on ${c.date} expected ${c.expectedFirstSlotAvailable} got ${firstAvailable}`);
      }
    } catch (e: unknown) {
      failed++;
      details.push(`ERROR availability ${c.providerSeed.id}: ${(e as Error).message}`);
    }
  }
  return { passed, failed, details };
}

function runSearchEval(cases: SearchCase[]): { passed: number; failed: number; details: string[] } {
  let passed = 0, failed = 0;
  const details: string[] = [];

  for (const c of cases) {
    try {
      resetStore();
      if (c.providerSeed) {
        seedProviders([c.providerSeed]);
      } else {
        // fallback
        seedProviders([{
          id: 'prov_eval_search',
          name: 'Eval Search Provider',
          category: 'kids_activities',
          location: 'Testville',
          services: ['test'],
          rules: { availability: { days: ['Tue'], windows: ['09:00-17:00'] } },
          calendarConnected: false,
          token: 'tok_eval_s',
        }]);
      }
      const results = searchProviders(c.args, c.token);
      const okCount = results.length >= (c.expectedCountMin || 0);
      const okIds = !c.expectedIdsContain || c.expectedIdsContain.every(id => results.some((r: {id?: string}) => r.id === id));
      if (okCount && okIds) {
        passed++;
        // drive via mcp dispatch too
        dispatchMcpTool('search_services', { ...c.args, token: c.token });
      } else {
        failed++;
        details.push(`FAIL search: ${c.description || JSON.stringify(c.args)} got ${results.length}`);
      }
    } catch (e: unknown) {
      failed++;
      details.push(`ERROR search: ${(e as Error).message}`);
    }
  }
  return { passed, failed, details };
}

function main() {
  console.log('=== Totbox Strong Eval Runner ===');

  const availCases: AvailabilityCase[] = loadJson('availability-cases.json');
  const searchCases: SearchCase[] = loadJson('search-cases.json');

  const availRes = runAvailabilityEval(availCases);
  const searchRes = runSearchEval(searchCases);

  const totalFailed = availRes.failed + searchRes.failed;
  console.log(`Availability: ${availRes.passed} passed, ${availRes.failed} failed`);
  console.log(`Search: ${searchRes.passed} passed, ${searchRes.failed} failed`);

  if (availRes.details.length) console.log('Availability details:', availRes.details);
  if (searchRes.details.length) console.log('Search details:', searchRes.details);

  if (totalFailed > 0) {
    console.error('EVAL FAILED — regressions detected');
    process.exit(1);
  }

  console.log('EVAL PASSED');
  process.exit(0);
}

main();
