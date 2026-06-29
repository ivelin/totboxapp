// Simple in-memory store (Stage 2)
// Will evolve to sqlite / persistent layer later per plan

import { Provider, Booking, AvailabilitySlot, ProviderRule } from './types';

let providers: Provider[] = [];
let bookings: Booking[] = [];

export function resetStore() {
  providers = [];
  bookings = [];
}

export function seedProviders(sample: Provider[]) {
  providers = [...sample];
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
  return p;
}

export function setProviderToken(id: string, token: string) {
  const p = getProvider(id);
  if (p) p.token = token;
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
