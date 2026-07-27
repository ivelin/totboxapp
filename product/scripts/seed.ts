// Stage 2+ / Stage 6 seed script
// Usage: npm run seed  (or npx tsx product/scripts/seed.ts)
// Seeds fictional beachhead providers only (public-safe — no real household data).

import {
  seedProviders,
  getProviders,
  computeAvailability,
  beachheadSampleProviders,
  compareOptions,
  createServiceBrief,
  resetStore,
} from '../../src/lib/store';

resetStore();
const sampleProviders = beachheadSampleProviders();
seedProviders(sampleProviders);

console.log('=== Totbox Seed (Stage 6 beachhead) ===');
console.log(
  'Providers:',
  getProviders().map(p => `${p.id} — ${p.name} [${p.category}]`)
);

const sampleDate = '2026-07-06'; // Monday
const slots = computeAvailability('prov_hvac_001', sampleDate);
console.log(`Sample availability for prov_hvac_001 on ${sampleDate}:`, slots);

const brief = createServiceBrief({
  naturalLanguage:
    'Find AC maintenance plans for my area in the next 2 weeks under $300 with good recent reviews',
});
const comparison = compareOptions({ briefId: brief.id, location: 'Austin', limit: 5 });
console.log('\nService brief:', brief.id, brief.category, brief.budgetUsd);
console.log(
  'Compare options:',
  comparison.options.map(o => `${o.name} $${o.priceFromUsd ?? '?'} score=${o.matchScore}`)
);

console.log('\nStore seeded with HVAC + cleaning (+ tree) demo operators.');
