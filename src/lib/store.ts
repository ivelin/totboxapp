// Simple in-memory store (Stage 2)
// Will evolve to sqlite / persistent layer later per plan

import { Provider, Booking, AvailabilitySlot, ProviderRule, ServiceCategory } from './types';
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
        for (let [id, p] of loaded.entries()) {
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

loadProviders();

export function resetStore() {
  providers = [];
  bookings = [];
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
    category: (details.category || 'kids_activities') as ServiceCategory,
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
  if (args.category) results = results.filter(p => p.category.includes(args.category as any));
  if (args.location) {
    const loc = args.location.toLowerCase();
    results = results.filter(p => p.location.toLowerCase().includes(loc));
  }
  if (args.query) {
    const q = args.query.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.services.some(s => s.toLowerCase().includes(q))
    );
  }
  return results.slice(0, args.limit ?? 5).map(p => ({
    id: p.id, name: p.name, category: p.category, location: p.location, services: p.services,
  }));
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

// Very naive availability for Stage 2 (rules only, calendar in Stage 5)
export function computeAvailability(providerId: string, date: string): AvailabilitySlot[] {
  const p = getProvider(providerId);
  if (!p) return [];

  const rule = p.rules.availability;
  const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' }); // "Thu"

  const isAllowedDay = rule.days.some(d => 
    d.toLowerCase().startsWith(dayName.toLowerCase()) || 
    dayName.toLowerCase().startsWith(d.toLowerCase())
  );
  if (!isAllowedDay) {
    console.warn('[store] day not allowed', { date, dayName, allowed: rule.days });
    return [];
  }

  // Return simple slots from first window
  const win = rule.windows[0] || '09:00-17:00';
  const [start, end] = win.split('-');

  return [
    { date, start, end, available: true },
  ];
}

export function listAllBookings(): Booking[] {
  return [...bookings];
}

// Stage 4 helpers for thin delegation (per strategist)
export function getProviderDetailsForToken(providerId: string, token?: string) {
  reloadProviders();
  const p = getProvider(providerId);
  if (!p) return null;
  // invalid/unknown token retains prior unseeded behavior (return data like no-token)
  // only a matching token "scopes" but since id is explicit, data is visible either way
  const { token: _t, ...safe } = p as any;
  return safe;
}

export function getAvailabilityForToken(providerId: string, date: string, token?: string) {
  reloadProviders();
  const p = getProvider(providerId);
  if (!p) return { providerId, date, slots: [] };
  // invalid/unknown token retains prior unseeded behavior (compute slots like no-token)
  const slots = computeAvailability(providerId, date);
  return { providerId, date, slots };
}
