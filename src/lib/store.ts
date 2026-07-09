// Simple in-memory store (Stage 2)
// Will evolve to sqlite / persistent layer later per plan

import {
  Provider,
  Booking,
  AvailabilitySlot,
  ProviderRule,
  ServiceCategory,
  ServiceBrief,
  CompareOption,
  OfferTerms,
} from './types';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), '.data');
const PROVIDERS_FILE = path.join(DATA_DIR, 'providers.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadProviders() {
  ensureDataDir();
  if (fs.existsSync(PROVIDERS_FILE)) {
    try {
      const raw = JSON.parse(fs.readFileSync(PROVIDERS_FILE, 'utf8'));
      if (Array.isArray(raw)) {
        const loaded = new Map(raw.map((p: Provider) => [p.id, p] as const));
        for (const [id, p] of loaded.entries()) {
          const idx = providers.findIndex(x => x.id === id);
          if (idx >= 0) providers[idx] = p;
          else providers.push(p);
        }
      }
    } catch {}
  }
}

export function reloadProviders() {
  loadProviders();
}

function saveProviders() {
  ensureDataDir();
  fs.writeFileSync(PROVIDERS_FILE, JSON.stringify(providers, null, 2));
}

let providers: Provider[] = [];
let bookings: Booking[] = [];
let serviceBriefs: ServiceBrief[] = [];

loadProviders();

export function resetStore() {
  providers = [];
  bookings = [];
  serviceBriefs = [];
}

export function seedProviders(sample: Provider[]) {
  // Merge: do not clobber providers loaded from file or previously registered via UI
  const existing = new Map(providers.map(p => [p.id, p] as const));
  for (const s of sample) {
    if (!existing.has(s.id)) {
      providers.push({ ...s });
    }
  }
  saveProviders();
}

export function getProviders(): Provider[] {
  return providers;
}

export function getProvider(id: string): Provider | undefined {
  return providers.find(p => p.id === id);
}

export function upsertProvider(p: Provider): Provider {
  const idx = providers.findIndex(x => x.id === p.id);
  if (idx >= 0) {
    providers[idx] = p;
  } else {
    providers.push(p);
  }
  saveProviders();
  return p;
}

export function setProviderToken(id: string, token: string) {
  const p = getProvider(id);
  if (p) {
    p.token = token;
    saveProviders();
  }
}

/**
 * Stage 4: pure register that generates secret token, upserts, returns it.
 * Returns the provider including the secret token (display once).
 */
export function registerProvider(details: {
  name: string;
  category?: ServiceCategory;
  location: string;
  services: string[];
  rules?: ProviderRule;
}): Provider & { token: string } {
  const id = 'prov_' + Date.now().toString(36) + crypto.randomBytes(3).toString('hex');
  const token = crypto.randomBytes(16).toString('hex');

  const provider: Provider = {
    id,
    name: details.name,
    category: (details.category || 'hvac') as ServiceCategory,
    location: details.location,
    services: details.services || [],
    rules: details.rules || { availability: { days: ['Mon','Tue','Wed','Thu','Fri'], windows: ['09:00-17:00'] } },
    calendarConnected: false,
    token,
  };

  upsertProvider(provider);
  return provider as Provider & { token: string };
}

/** Rotate token for an existing provider id (returns new token). */
export function rotateProviderToken(id: string): string | null {
  const p = getProvider(id);
  if (!p) return null;
  const newToken = crypto.randomBytes(16).toString('hex');
  p.token = newToken;
  saveProviders();
  return newToken;
}

/** Return providers matching the token (for scoping). Always reload to see cross-process writes. */
export function getProvidersForToken(token?: string): Provider[] {
  reloadProviders();
  if (!token) return [];
  return providers.filter(p => p.token === token);
}

/** Thin helper for search (used by both SDK registerTool and raw shim to avoid dupe). */
export function searchProviders(args: {query?: string, category?: string, location?: string, limit?: number}, token?: string) {
  // invalid/unknown token retains prior unseeded (no-token) behavior
  if (token) {
    const matches = getProvidersForToken(token);
    if (matches.length === 0) token = undefined;
  }
  let results = token ? getProvidersForToken(token) : getProviders();
  if (args.category) {
    const cat = args.category.toLowerCase();
    results = results.filter(p => categoryMatches(p.category, cat));
  }
  if (args.location) {
    const loc = args.location.toLowerCase();
    results = results.filter(p => p.location.toLowerCase().includes(loc));
  }
  if (args.query) {
    const q = args.query.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.services.some(s => s.toLowerCase().includes(q)) ||
      (p.offer?.inclusions || []).some(s => s.toLowerCase().includes(q)) ||
      (p.offer?.membership || '').toLowerCase().includes(q)
    );
  }
  return results.slice(0, args.limit ?? 5).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    location: p.location,
    services: p.services,
    offer: p.offer,
  }));
}

/** Map home_maintenance umbrella + new verticals for beachhead search. */
function categoryMatches(providerCategory: ServiceCategory, requested: string): boolean {
  if (providerCategory === requested || providerCategory.includes(requested)) return true;
  if (requested === 'home_maintenance') {
    return providerCategory === 'hvac' || providerCategory === 'cleaning' || providerCategory === 'tree_arborist' || providerCategory === 'home_maintenance';
  }
  if (requested === 'hvac' || requested === 'cleaning' || requested === 'tree_arborist') {
    return providerCategory === requested || providerCategory === 'home_maintenance';
  }
  return false;
}

export function getBookingsForProvider(providerId: string): Booking[] {
  return bookings.filter(b => b.providerId === providerId);
}

export function createBooking(b: Omit<Booking, 'id' | 'status'> & { status?: Booking['status'] }): Booking {
  const booking: Booking = {
    ...b,
    id: 'bk_' + Date.now().toString(36),
    status: b.status || 'pending',
  };
  bookings.push(booking);
  return booking;
}

// Pure rules-based (refactored for Stage 5 reuse)
// Use UTC day to make weekday deterministic across timezones / test runs
function computeRulesOnly(rule: ProviderRule['availability'], date: string): AvailabilitySlot[] {
  // Parse as UTC date to avoid local TZ skew (e.g. 2026-07-08 may be Tue locally but Wed UTC)
  const d = new Date(date + 'T00:00:00Z');
  const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getUTCDay()];

  const isAllowedDay = rule.days.some(d => 
    d.toLowerCase().startsWith(dayName.toLowerCase()) || 
    dayName.toLowerCase().startsWith(d.toLowerCase())
  );
  if (!isAllowedDay) {
    console.warn('[store] day not allowed', { date, dayName, allowed: rule.days });
    return [];
  }

  const win = rule.windows[0] || '09:00-17:00';
  const [start, end] = win.split('-');

  return [{ date, start, end, available: true }];
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return timeToMinutes(aStart) < timeToMinutes(bEnd) && timeToMinutes(bStart) < timeToMinutes(aEnd);
}

// Merge rules slots with busy periods (mark unavailable on overlap; simple for MVP)
// Exported for direct test/driver exercise (Stage 5 verif requirement)
export function mergeWithBusy(ruleSlots: AvailabilitySlot[], busy: Array<{start: string; end: string}>): AvailabilitySlot[] {
  if (busy.length === 0) return ruleSlots;
  return ruleSlots.map(slot => {
    const overlapsBusy = busy.some(b => overlaps(slot.start, slot.end, b.start, b.end));
    return { ...slot, available: slot.available && !overlapsBusy };
  });
}

// Very naive availability for Stage 2 (rules only, calendar in Stage 5)
export function computeAvailability(providerId: string, date: string): AvailabilitySlot[] {
  reloadProviders();
  const p = getProvider(providerId);
  if (!p) return [];

  const ruleSlots = computeRulesOnly(p.rules.availability, date);
  if (!p.calendarConnected) return ruleSlots;

  const busy = getCalendarBusyMock(providerId, date);
  return mergeWithBusy(ruleSlots, busy);
}

export function listAllBookings(): Booking[] {
  return [...bookings];
}

// Stage 4 helpers for thin delegation (per strategist)
export function getProviderDetailsForToken(providerId: string, _token?: string) {
  reloadProviders();
  const p = getProvider(providerId);
  if (!p) return null;
  // invalid/unknown token retains prior unseeded behavior (return data like no-token)
  // only a matching token "scopes" but since id is explicit, data is visible either way
  const { token: _omitToken, ...safe } = p as unknown as { [key: string]: unknown; token?: string };
  void _omitToken;
  void _token;
  return safe;
}

export function getAvailabilityForToken(providerId: string, date: string, _token?: string) {
  reloadProviders();
  const p = getProvider(providerId);
  if (!p) return { providerId, date, slots: [] };
  // invalid/unknown token retains prior unseeded behavior (compute slots like no-token)
  void _token;
  const slots = computeAvailability(providerId, date);
  return { providerId, date, slots };
}

type ProviderWithCalendar = Provider & {
  calendarBusy?: Record<string, Array<{start: string; end: string}>>;
  calendarTokens?: { accessToken: string; refreshToken?: string };
};

/** Stage 5: connect calendar for a provider (persists tokens; demo uses plain tokens) */
export function connectCalendar(id: string, tokens: { accessToken: string; refreshToken?: string }) {
  reloadProviders();
  const p = getProvider(id);
  if (!p) return false;
  const pe = p as ProviderWithCalendar;
  pe.calendarConnected = true;
  pe.calendarTokens = { ...tokens };
  saveProviders();
  return true;
}

export function disconnectCalendar(id: string) {
  reloadProviders();
  const p = getProvider(id);
  if (!p) return false;
  const pe = p as ProviderWithCalendar;
  pe.calendarConnected = false;
  delete pe.calendarTokens;
  saveProviders();
  return true;
}

/** For demo / testing: allow injecting sample busy periods without real OAuth */
export function setCalendarBusyMock(id: string, date: string, busy: Array<{start: string; end: string}>) {
  reloadProviders();
  const p = getProvider(id);
  if (!p) return false;
  const pe = p as ProviderWithCalendar;
  if (!pe.calendarConnected) {
    pe.calendarConnected = true;
  }
  const key = `busy_${date}`;
  if (!pe.calendarBusy) pe.calendarBusy = {};
  pe.calendarBusy[key] = busy;
  saveProviders();
  return true;
}

export function getCalendarBusyMock(id: string, date: string): Array<{start: string; end: string}> {
  reloadProviders();
  const p = getProvider(id);
  if (!p || !p.calendarConnected) return [];
  const pe = p as ProviderWithCalendar;
  const key = `busy_${date}`;
  return pe.calendarBusy?.[key] || [];
}

// --- Stage 6: service briefs + compare options ---

export function createServiceBrief(input: {
  naturalLanguage: string;
  category?: ServiceCategory;
  serviceType?: string;
  priorities?: string[];
  budgetUsd?: number;
  location?: string;
  dateWindow?: string;
}): ServiceBrief {
  const inferred = inferBriefFromText(input.naturalLanguage);
  const brief: ServiceBrief = {
    id: 'brief_' + crypto.randomBytes(4).toString('hex'),
    naturalLanguage: input.naturalLanguage,
    category: input.category || inferred.category,
    serviceType: input.serviceType || inferred.serviceType,
    priorities: input.priorities || inferred.priorities,
    budgetUsd: input.budgetUsd ?? inferred.budgetUsd,
    location: input.location || inferred.location,
    dateWindow: input.dateWindow || inferred.dateWindow,
    createdAt: new Date().toISOString(),
  };
  serviceBriefs.push(brief);
  return brief;
}

export function getServiceBrief(id: string): ServiceBrief | undefined {
  return serviceBriefs.find(b => b.id === id);
}

export function listServiceBriefs(): ServiceBrief[] {
  return [...serviceBriefs];
}

function inferBriefFromText(text: string): Partial<ServiceBrief> {
  const t = text.toLowerCase();
  const out: Partial<ServiceBrief> = {};
  if (/\b(ac|hvac|air condition|furnace|tune-?up)\b/.test(t)) {
    out.category = 'hvac';
    out.serviceType = 'preventive_maintenance';
  } else if (/\b(clean|maid|housekeep)\b/.test(t)) {
    out.category = 'cleaning';
    out.serviceType = 'house_clean';
  } else if (/\b(tree|arbor|oak wilt|prune)\b/.test(t)) {
    out.category = 'tree_arborist';
    out.serviceType = 'pruning';
  }
  const budget = t.match(/under\s*\$?\s*(\d+)/) || t.match(/\$\s*(\d+)/);
  if (budget) out.budgetUsd = Number(budget[1]);
  if (/\baustin\b/.test(t)) out.location = 'Austin, TX';
  // crude priority list: "focusing on a, b, and c"
  const focus = t.match(/focusing on ([^.]+)/);
  if (focus) {
    out.priorities = focus[1]
      .split(/,| and /)
      .map(s => s.trim())
      .filter(Boolean);
  }
  if (/\bnext (week|2 weeks|two weeks)\b/.test(t)) out.dateWindow = 'next_2_weeks';
  return out;
}

/**
 * Parallel multi-provider comparison for a brief or free-form filters.
 * Pure ranking on seeded offer terms + category/location match (no external review APIs yet).
 */
export function compareOptions(args: {
  briefId?: string;
  naturalLanguage?: string;
  category?: string;
  location?: string;
  budgetUsd?: number;
  query?: string;
  limit?: number;
}): { brief?: ServiceBrief; options: CompareOption[] } {
  reloadProviders();
  let brief: ServiceBrief | undefined;
  if (args.briefId) brief = getServiceBrief(args.briefId);
  if (!brief && args.naturalLanguage) {
    brief = createServiceBrief({
      naturalLanguage: args.naturalLanguage,
      category: args.category as ServiceCategory | undefined,
      location: args.location,
      budgetUsd: args.budgetUsd,
    });
  }

  const category = args.category || brief?.category;
  const location = args.location || brief?.location;
  const budget = args.budgetUsd ?? brief?.budgetUsd;
  // Optional free-text query only (do not hard-filter on inferred serviceType — that is scored).
  const query = args.query;

  let candidates = getProviders();
  if (category) {
    candidates = candidates.filter(p => categoryMatches(p.category, category.toLowerCase()));
  }
  if (location) {
    const loc = location.toLowerCase();
    candidates = candidates.filter(p => p.location.toLowerCase().includes(loc));
  }
  if (query) {
    const q = query.toLowerCase();
    candidates = candidates.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.services.some(s => s.toLowerCase().includes(q)) ||
      (p.offer?.inclusions || []).some(s => s.toLowerCase().includes(q))
    );
  }

  const options: CompareOption[] = candidates.map(p => scoreCompareOption(p, budget, brief));
  options.sort((a, b) => b.matchScore - a.matchScore);
  const limit = args.limit ?? 5;
  return { brief, options: options.slice(0, limit) };
}

function scoreCompareOption(p: Provider, budget?: number, brief?: ServiceBrief): CompareOption {
  const offer: OfferTerms | undefined = p.offer;
  const price = offer?.priceFromUsd;
  const reasons: string[] = [];
  let score = 10;

  if (offer?.membership) {
    score += 5;
    reasons.push('membership_plan');
  }
  if (offer?.inclusions?.length) {
    score += Math.min(5, offer.inclusions.length);
    reasons.push('structured_inclusions');
  }
  if (typeof offer?.cancelFeeUsd === 'number') {
    score += 2;
    reasons.push('cancel_terms_listed');
  }
  if (typeof offer?.partsExtra === 'boolean') {
    score += 1;
    reasons.push(offer.partsExtra ? 'parts_extra' : 'parts_included_or_na');
  }
  if (offer?.trustSummary) {
    score += 3;
    reasons.push('trust_summary');
  }

  let withinBudget: boolean | undefined;
  if (budget != null && price != null) {
    withinBudget = price <= budget;
    if (withinBudget) {
      score += 8;
      reasons.push('within_budget');
    } else {
      score -= 5;
      reasons.push('over_budget');
    }
  } else if (budget != null && price == null) {
    reasons.push('price_unknown');
  }

  if (brief?.priorities?.length && offer?.inclusions?.length) {
    const inc = offer.inclusions.map(s => s.toLowerCase());
    const hits = brief.priorities.filter(pr => inc.some(i => i.includes(pr.toLowerCase()) || pr.toLowerCase().includes(i)));
    if (hits.length) {
      score += hits.length * 3;
      reasons.push(`priority_hits:${hits.length}`);
    }
  }

  return {
    providerId: p.id,
    name: p.name,
    category: p.category,
    location: p.location,
    services: p.services,
    offer,
    priceFromUsd: price,
    withinBudget,
    matchScore: score,
    matchReasons: reasons,
  };
}

/** Shared beachhead seed data (fictional operators only — public-safe). */
export function beachheadSampleProviders(): Provider[] {
  return [
    {
      id: 'prov_hvac_001',
      name: 'Demo Hill Country Comfort',
      category: 'hvac',
      location: 'Austin, TX',
      services: ['AC tune-up', 'Bi-annual membership', 'Filter check'],
      rules: {
        availability: { days: ['Mon', 'Wed', 'Fri'], windows: ['08:00-16:00'] },
        pricingHint: 'Membership from $245',
        serviceTypes: ['preventive_maintenance', 'tune-up'],
      },
      offer: {
        priceFromUsd: 245,
        priceHint: '$245 first system bi-annual plan',
        membership: 'Bi-annual preventive plan',
        cancelFeeUsd: 120,
        partsExtra: true,
        inclusions: ['Seasonal inspection', 'Coil clean', 'Performance check'],
        exclusions: ['Parts', 'Major repairs'],
        commitment: '1 year',
        trustSummary: 'Stub: solid recent praise for punctuality (demo)',
      },
      calendarConnected: false,
      token: 'tok_hvac001_demo',
    },
    {
      id: 'prov_hvac_002',
      name: 'Demo Metro Air Care',
      category: 'hvac',
      location: 'Austin, TX',
      services: ['Seasonal plan', 'Diagnostic visit'],
      rules: {
        availability: { days: ['Tue', 'Thu', 'Sat'], windows: ['09:00-17:00'] },
        serviceTypes: ['preventive_maintenance'],
      },
      offer: {
        priceFromUsd: 189,
        priceHint: 'Seasonal plan from $189',
        membership: 'Seasonal plan (unit-dependent)',
        cancelFeeUsd: 0,
        partsExtra: true,
        inclusions: ['Tune-up', 'Safety check'],
        exclusions: ['Parts', 'Refrigerant'],
        commitment: 'Seasonal',
        trustSummary: 'Stub: mixed recent feedback — verify before book (demo)',
      },
      calendarConnected: false,
      token: 'tok_hvac002_demo',
    },
    {
      id: 'prov_clean_001',
      name: 'Demo Capital Sparkle Cleaning',
      category: 'cleaning',
      location: 'Austin, TX',
      services: ['Standard clean', 'Deep clean', '3hr priority custom'],
      rules: {
        availability: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], windows: ['09:00-15:00'] },
        serviceTypes: ['house_clean', 'priority_clean'],
      },
      offer: {
        priceFromUsd: 170,
        priceHint: 'Priority 3hr custom from $170+tax; standard initial ~$245+tax',
        cancelFeeUsd: 75,
        partsExtra: false,
        inclusions: ['Baths', 'Kitchens', 'Floors'],
        exclusions: ['Interior windows unless priority add-on'],
        commitment: 'Optional 6-month recurring special',
        trustSummary: 'Stub: reliable for priority lists (demo)',
      },
      calendarConnected: false,
      token: 'tok_clean001_demo',
    },
    {
      id: 'prov_clean_002',
      name: 'Demo Riverbend Maids',
      category: 'cleaning',
      location: 'Austin, TX',
      services: ['One-time clean', 'Recurring biweekly'],
      rules: {
        availability: { days: ['Wed', 'Fri', 'Sat'], windows: ['08:00-14:00'] },
        serviceTypes: ['house_clean'],
      },
      offer: {
        priceFromUsd: 220,
        priceHint: 'One-time from $220',
        inclusions: ['Standard rooms', 'Kitchen', 'Baths'],
        exclusions: ['Inside oven', 'Garage'],
        cancelFeeUsd: 50,
        partsExtra: false,
        trustSummary: 'Stub: strong access-instruction flow (demo)',
      },
      calendarConnected: false,
      token: 'tok_clean002_demo',
    },
    {
      id: 'prov_tree_001',
      name: 'Demo Live Oak Care Co',
      category: 'tree_arborist',
      location: 'Austin, TX',
      services: ['Pruning', 'Seasonal guidance'],
      rules: {
        availability: { days: ['Mon', 'Thu'], windows: ['07:00-15:00'] },
        serviceTypes: ['pruning'],
      },
      offer: {
        priceFromUsd: 400,
        priceHint: 'Pruning quotes vary by canopy',
        inclusions: ['Cleanup', 'Oak Wilt awareness guidance'],
        exclusions: ['Removal permits'],
        trustSummary: 'Stub: seasonal education strength (demo)',
      },
      calendarConnected: false,
      token: 'tok_tree001_demo',
    },
  ];
}
