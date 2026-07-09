/**
 * Local household CLI — manage providers + compare jobs without a chat host.
 * Data: .data/providers.json (gitignored). Public-safe: never commit real PII.
 *
 *   npm run household -- help
 *   npm run household -- list
 *   npm run household -- add --name "..." --category hvac --location "Austin, TX" ...
 *   npm run household -- compare --text "AC under $300"
 *   npm run household -- draft --text "..." --provider-id prov_xxx
 */

import {
  getProviders,
  registerProvider,
  createServiceBrief,
  compareOptions,
  getProvider,
  reloadProviders,
  beachheadSampleProviders,
  seedProviders,
  upsertProvider,
} from '../src/lib/store';
import type { ServiceCategory } from '../src/lib/types';

function argValue(argv: string[], name: string): string | undefined {
  const i = argv.indexOf(name);
  if (i < 0 || i + 1 >= argv.length) return undefined;
  return argv[i + 1];
}

function hasFlag(argv: string[], name: string): boolean {
  return argv.includes(name);
}

function printHelp() {
  console.log(`Totbox household CLI (local, no FSM APIs)

Usage:
  npm run household -- help
  npm run household -- list
  npm run household -- seed-demo
  npm run household -- add --name NAME --category hvac|cleaning|tree_arborist|... --location "Metro, ST" [options]
  npm run household -- compare --text "natural language job" [--category hvac] [--location Austin] [--budget 300]
  npm run household -- draft --text "job" --provider-id ID

add options:
  --services "a,b,c"
  --price 245
  --membership "Bi-annual plan"
  --cancel-fee 120
  --inclusions "Inspection,Coil clean"
  --exclusions "Parts"
  --contact "phone/email/form note (local only)"
  --days "Mon,Wed,Fri"
  --windows "08:00-16:00"

Data dir: .data/ (gitignored). Do not commit real addresses or personal emails to public git.
`);
}

function cmdList() {
  reloadProviders();
  const list = getProviders();
  if (!list.length) {
    console.log('No providers. Try: npm run household -- seed-demo');
    console.log('Or: npm run household -- add --name "..." --category hvac --location "Austin, TX"');
    return;
  }
  for (const p of list) {
    const price = p.offer?.priceFromUsd != null ? `$${p.offer.priceFromUsd}` : (p.offer?.priceHint || '—');
    console.log(`${p.id}  [${p.category}]  ${p.name}  @ ${p.location}  ${price}`);
  }
  console.log(`\n${list.length} provider(s)`);
}

function cmdSeedDemo() {
  seedProviders(beachheadSampleProviders());
  console.log('Seeded fictional demo operators (public-safe).');
  cmdList();
}

function cmdAdd(argv: string[]) {
  const name = argValue(argv, '--name');
  const location = argValue(argv, '--location');
  const category = (argValue(argv, '--category') || 'hvac') as ServiceCategory;
  if (!name || !location) {
    console.error('add requires --name and --location');
    process.exit(1);
  }
  const services = (argValue(argv, '--services') || 'General').split(',').map(s => s.trim()).filter(Boolean);
  const days = (argValue(argv, '--days') || 'Mon,Tue,Wed,Thu,Fri').split(',').map(s => s.trim());
  const windows = (argValue(argv, '--windows') || '09:00-17:00').split(',').map(s => s.trim());
  const price = argValue(argv, '--price');
  const membership = argValue(argv, '--membership');
  const cancelFee = argValue(argv, '--cancel-fee');
  const inclusions = argValue(argv, '--inclusions');
  const exclusions = argValue(argv, '--exclusions');
  const contact = argValue(argv, '--contact');

  const reg = registerProvider({
    name,
    location,
    category,
    services: contact ? [...services, `contact:${contact}`] : services,
    rules: {
      availability: { days, windows },
      pricingHint: membership || (price ? `From $${price}` : undefined),
      serviceTypes: [category],
    },
  });

  // Attach offer terms (local household-maintained commercial notes)
  const p = getProvider(reg.id);
  if (p) {
    p.offer = {
      priceFromUsd: price != null ? Number(price) : undefined,
      priceHint: membership || (price ? `From $${price}` : undefined),
      membership,
      cancelFeeUsd: cancelFee != null ? Number(cancelFee) : undefined,
      inclusions: inclusions ? inclusions.split(',').map(s => s.trim()) : undefined,
      exclusions: exclusions ? exclusions.split(',').map(s => s.trim()) : undefined,
      partsExtra: category === 'hvac' ? true : undefined,
      trustSummary: 'Local household entry (user-maintained)',
    };
    upsertProvider(p);
  }

  console.log('Registered local provider:');
  console.log(`  id:    ${reg.id}`);
  console.log(`  token: ${reg.token} (MCP scope; keep private)`);
  console.log(`  name:  ${reg.name} [${category}] @ ${location}`);
}

function cmdCompare(argv: string[]) {
  const text = argValue(argv, '--text');
  if (!text) {
    console.error('compare requires --text "..."');
    process.exit(1);
  }
  reloadProviders();
  if (!getProviders().length) {
    console.error('No providers in store. seed-demo or add first.');
    process.exit(1);
  }
  const category = argValue(argv, '--category');
  const location = argValue(argv, '--location');
  const budget = argValue(argv, '--budget');
  const res = compareOptions({
    naturalLanguage: text,
    category: category || undefined,
    location: location || undefined,
    budgetUsd: budget != null ? Number(budget) : undefined,
    limit: 10,
  });
  console.log('Brief:', res.brief?.id, res.brief?.category, 'budget=', res.brief?.budgetUsd);
  if (res.brief?.priorities?.length) console.log('Priorities:', res.brief.priorities.join(', '));
  console.log('');
  if (!res.options.length) {
    console.log('No matching providers.');
    return;
  }
  for (const o of res.options) {
    console.log(`# score ${o.matchScore}  ${o.name} (${o.providerId})`);
    console.log(`  category=${o.category}  location=${o.location}`);
    console.log(`  priceFrom=$${o.priceFromUsd ?? o.offer?.priceFromUsd ?? '?'}`);
    if (o.offer?.membership) console.log(`  membership=${o.offer.membership}`);
    if (o.offer?.cancelFeeUsd != null) console.log(`  cancelFee=$${o.offer.cancelFeeUsd}`);
    if (o.offer?.inclusions?.length) console.log(`  inclusions=${o.offer.inclusions.join('; ')}`);
    if (o.withinBudget != null) console.log(`  withinBudget=${o.withinBudget}`);
    console.log(`  reasons=${o.matchReasons.join(',')}`);
    console.log('');
  }
}

function cmdDraft(argv: string[]) {
  const text = argValue(argv, '--text');
  const providerId = argValue(argv, '--provider-id');
  if (!text || !providerId) {
    console.error('draft requires --text and --provider-id');
    process.exit(1);
  }
  reloadProviders();
  const p = getProvider(providerId);
  if (!p) {
    console.error('Provider not found:', providerId);
    process.exit(1);
  }
  const brief = createServiceBrief({ naturalLanguage: text });
  const contactHint = p.services.find(s => s.startsWith('contact:'))?.replace(/^contact:/, '') || '(their phone/email/form)';

  const body = `Subject: Service request — ${brief.serviceType || brief.category || 'home service'}

Hi ${p.name},

I'm requesting the following (structured brief from Totbox):

Job: ${brief.naturalLanguage}
Category: ${brief.category || 'n/a'}
${brief.budgetUsd != null ? `Budget ceiling: ~$${brief.budgetUsd}\n` : ''}${brief.priorities?.length ? `Priorities: ${brief.priorities.join(', ')}\n` : ''}${brief.dateWindow ? `Timing: ${brief.dateWindow}\n` : ''}
Please confirm availability, exact price, and what's included/excluded.

Thanks
`;

  console.log('--- Draft outreach (copy/send yourself) ---');
  console.log(`To contact: ${contactHint}`);
  console.log(`Provider: ${p.name} (${p.id})`);
  console.log('');
  console.log(body);
  console.log('--- End draft ---');
  console.log(`Brief id: ${brief.id}`);
}

function main() {
  const argv = process.argv.slice(2);
  const cmd = argv[0] || 'help';

  switch (cmd) {
    case 'help':
    case '-h':
    case '--help':
      printHelp();
      break;
    case 'list':
      cmdList();
      break;
    case 'seed-demo':
      cmdSeedDemo();
      break;
    case 'add':
      cmdAdd(argv);
      break;
    case 'compare':
      cmdCompare(argv);
      break;
    case 'draft':
      cmdDraft(argv);
      break;
    default:
      console.error('Unknown command:', cmd);
      printHelp();
      process.exit(1);
  }
}

main();
