/**
 * House-owner (consumer) smoke path — Stage 6
 *
 * Exercises the SHIPPED brief → compare loop the way a homeowner would:
 * natural-language HVAC and cleaning jobs against fictional beachhead providers.
 *
 * Modes:
 *   npm run smoke:house-owner          # store + MCP dispatch (no server required)
 *   npm run smoke:house-owner -- --live  # also POST tools/call to running MCP on :3001
 *
 * Public-safe: demo operators only; no personal addresses or private data.
 */

import {
  resetStore,
  seedProviders,
  beachheadSampleProviders,
  createServiceBrief,
  compareOptions,
} from '../../src/lib/store';
import { dispatchMcpTool } from '../../src/lib/mcp-tools';

const HVAC_JOB =
  'Find AC maintenance plans for my area in the next 2 weeks under $300 with good recent reviews';
const CLEAN_JOB =
  'Book a 3hr priority clean focusing on blinds, windows, under beds, corners — share options before I confirm';

function parseToolText(res: { content: Array<{ text: string }> }): unknown {
  return JSON.parse(res.content[0].text);
}

function assertHouseOwnerCompare(
  label: string,
  payload: {
    brief?: { id?: string; category?: string; naturalLanguage?: string };
    options: Array<{
      providerId: string;
      name: string;
      priceFromUsd?: number;
      offer?: {
        priceFromUsd?: number;
        membership?: string;
        cancelFeeUsd?: number;
        inclusions?: string[];
        priceHint?: string;
      };
    }>;
  }
) {
  if (!payload.options || payload.options.length < 2) {
    throw new Error(`${label}: expected multi-provider compare, got ${payload.options?.length ?? 0}`);
  }
  for (const o of payload.options) {
    if (!o.providerId || !o.name) throw new Error(`${label}: option missing identity`);
    const hasTerms =
      o.priceFromUsd != null ||
      o.offer?.priceFromUsd != null ||
      !!o.offer?.priceHint ||
      !!o.offer?.membership ||
      o.offer?.cancelFeeUsd != null ||
      (o.offer?.inclusions && o.offer.inclusions.length > 0);
    if (!hasTerms) throw new Error(`${label}: ${o.name} missing price/terms-like offer fields`);
  }
  console.log(`OK ${label}: ${payload.options.length} options`);
  for (const o of payload.options) {
    console.log(
      `  - ${o.name} | $${o.priceFromUsd ?? o.offer?.priceFromUsd ?? '?'} | ${o.offer?.membership || o.offer?.priceHint || 'terms ok'}`
    );
  }
}

async function liveMcpCompare(naturalLanguage: string, label: string) {
  const base = process.env.MCP_URL || 'http://localhost:3001/mcp';
  const h = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
  };

  const listRes = await fetch(base, {
    method: 'POST',
    headers: h,
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
  });
  const listJson = (await listRes.json()) as {
    result?: { tools?: Array<{ name: string }> };
    error?: unknown;
  };
  if (listJson.error) throw new Error(`tools/list error: ${JSON.stringify(listJson.error)}`);
  const names = (listJson.result?.tools || []).map(t => t.name);
  console.log('live MCP tools:', names.join(', '));
  for (const need of ['create_service_brief', 'compare_options']) {
    if (!names.includes(need)) throw new Error(`live MCP missing tool ${need}`);
  }

  const callRes = await fetch(base, {
    method: 'POST',
    headers: h,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'compare_options',
        arguments: { naturalLanguage, location: 'Austin', limit: 5 },
      },
    }),
  });
  const callJson = (await callRes.json()) as {
    result?: { content?: Array<{ text?: string }> };
    error?: unknown;
  };
  if (callJson.error) throw new Error(`tools/call error: ${JSON.stringify(callJson.error)}`);
  const text = callJson.result?.content?.[0]?.text;
  if (!text) throw new Error('live MCP compare returned empty content');
  const parsed = JSON.parse(text) as {
    brief?: { id?: string; category?: string };
    options: Array<{
      providerId: string;
      name: string;
      priceFromUsd?: number;
      offer?: {
        priceFromUsd?: number;
        membership?: string;
        cancelFeeUsd?: number;
        inclusions?: string[];
        priceHint?: string;
      };
    }>;
  };
  assertHouseOwnerCompare(`live-mcp ${label}`, parsed);
}

async function main() {
  const live = process.argv.includes('--live') || process.env.LIVE_MCP === '1';

  console.log('=== House-owner smoke (Stage 6) ===');
  console.log('Path: seed beachhead → create_service_brief → compare_options');
  console.log('');

  resetStore();
  seedProviders(beachheadSampleProviders());
  console.log(
    'Seeded providers:',
    beachheadSampleProviders()
      .map(p => `${p.name} [${p.category}]`)
      .join('; ')
  );

  // --- HVAC house-owner job (direct shipped store) ---
  const hvacBrief = createServiceBrief({ naturalLanguage: HVAC_JOB });
  const hvacCompare = compareOptions({ briefId: hvacBrief.id, location: 'Austin', limit: 5 });
  console.log('\n[HVAC] brief', hvacBrief.id, hvacBrief.category, 'budget', hvacBrief.budgetUsd);
  assertHouseOwnerCompare('store HVAC', hvacCompare);

  // --- Cleaning house-owner job (MCP dispatch = shipped tool path) ---
  const cleanBriefRes = dispatchMcpTool('create_service_brief', { naturalLanguage: CLEAN_JOB });
  const cleanBrief = parseToolText(cleanBriefRes) as { id: string; category?: string };
  const cleanCompareRes = dispatchMcpTool('compare_options', {
    briefId: cleanBrief.id,
    location: 'Austin',
    limit: 5,
  });
  const cleanCompare = parseToolText(cleanCompareRes) as {
    brief?: { id?: string };
    options: Array<{
      providerId: string;
      name: string;
      priceFromUsd?: number;
      offer?: {
        priceFromUsd?: number;
        membership?: string;
        cancelFeeUsd?: number;
        inclusions?: string[];
        priceHint?: string;
      };
    }>;
  };
  console.log('\n[CLEANING] brief', cleanBrief.id, cleanBrief.category);
  assertHouseOwnerCompare('mcp-dispatch cleaning', cleanCompare);

  // Also drive HVAC via MCP dispatch for symmetry
  const hvacMcp = parseToolText(
    dispatchMcpTool('compare_options', {
      naturalLanguage: HVAC_JOB,
      location: 'Austin',
      budgetUsd: 300,
      limit: 5,
    })
  ) as {
    options: Array<{
      providerId: string;
      name: string;
      priceFromUsd?: number;
      offer?: {
        priceFromUsd?: number;
        membership?: string;
        cancelFeeUsd?: number;
        inclusions?: string[];
        priceHint?: string;
      };
    }>;
  };
  assertHouseOwnerCompare('mcp-dispatch HVAC', hvacMcp);

  if (live) {
    console.log('\n--- Live MCP (:3001) ---');
    await liveMcpCompare(HVAC_JOB, 'HVAC');
    await liveMcpCompare(CLEAN_JOB, 'cleaning');
  } else {
    console.log('\n(skip live MCP; pass --live with npm run dev:mcp running to hit HTTP)');
  }

  console.log('\nHOUSE-OWNER SMOKE PASSED');
}

main().catch(e => {
  console.error('HOUSE-OWNER SMOKE FAILED', e);
  process.exit(1);
});
