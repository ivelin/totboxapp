import { describe, it, expect, beforeEach } from 'vitest';
import { mergeWithBusy, searchProviders, resetStore, seedProviders, computeAvailability } from '../store';

describe('mergeWithBusy (pure availability merge)', () => {
  const baseSlot = { date: '2026-07-07', start: '09:00', end: '17:00', available: true };

  it('returns original slots when no busy periods', () => {
    const result = mergeWithBusy([baseSlot], []);
    expect(result).toEqual([baseSlot]);
  });

  it('marks slot unavailable on full overlap with busy', () => {
    const busy = [{ start: '10:00', end: '11:00' }];
    const result = mergeWithBusy([baseSlot], busy);
    expect(result[0].available).toBe(false);
  });

  it('keeps available when busy does not overlap', () => {
    const busy = [{ start: '18:00', end: '19:00' }];
    const result = mergeWithBusy([baseSlot], busy);
    expect(result[0].available).toBe(true);
  });

  it('handles multiple busy periods and partial overlaps', () => {
    const slots = [
      { ...baseSlot, start: '09:00', end: '12:00' },
      { ...baseSlot, start: '13:00', end: '17:00' },
    ];
    const busy = [
      { start: '11:00', end: '11:30' },
      { start: '14:00', end: '15:00' },
    ];
    const result = mergeWithBusy(slots, busy);
    expect(result[0].available).toBe(false);
    expect(result[1].available).toBe(false);
  });

  it('preserves other slot properties', () => {
    const result = mergeWithBusy([baseSlot], [{ start: '10:00', end: '11:00' }]);
    expect(result[0].date).toBe(baseSlot.date);
    expect(result[0].start).toBe(baseSlot.start);
  });
});

describe('rules engine via computeAvailability', () => {
  beforeEach(() => {
    resetStore();
  });

  it('returns slot for allowed weekday (Tue rule for 2026-07-07)', () => {
    seedProviders([{
      id: 'prov_r1', name: 'R1', category: 'kids_activities', location: 'X', services: ['s'],
      rules: { availability: { days: ['Tue'], windows: ['09:00-17:00'] } },
      calendarConnected: false, token: 't1'
    }]);
    const slots = computeAvailability('prov_r1', '2026-07-07');
    expect(slots).toHaveLength(1);
    expect(slots[0].available).toBe(true);
  });

  it('returns empty for disallowed day', () => {
    seedProviders([{
      id: 'prov_r2', name: 'R2', category: 'kids_activities', location: 'X', services: ['s'],
      rules: { availability: { days: ['Mon'], windows: ['09:00-17:00'] } },
      calendarConnected: false, token: 't2'
    }]);
    const slots = computeAvailability('prov_r2', '2026-07-07');
    expect(slots).toHaveLength(0);
  });
});

describe('searchProviders (real search logic)', () => {
  beforeEach(() => {
    resetStore();
    seedProviders([{
      id: 'prov_test1',
      name: 'Austin Kids Play Center',
      category: 'kids_activities' as const,
      location: 'Austin, TX',
      services: ['Birthday parties'],
      rules: { availability: { days: ['Tue'], windows: ['09:00-17:00'] } },
      calendarConnected: false,
      token: 'tok_test',
    }]);
  });

  it('filters by query on name/services using real fn', () => {
    const res = searchProviders({ query: 'Austin' });
    expect(res.length).toBeGreaterThan(0);
    expect(res[0].name).toContain('Austin');
  });

  it('respects limit using real fn', () => {
    const res = searchProviders({ limit: 1 });
    expect(res.length).toBeLessThanOrEqual(1);
  });
});
