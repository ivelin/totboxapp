import { describe, it, expect, beforeEach } from 'vitest';
import {
  mergeWithBusy,
  searchProviders,
  resetStore,
  seedProviders,
  computeAvailability,
  beachheadSampleProviders,
  createServiceBrief,
  compareOptions,
} from '../store';

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

describe('Stage 6 service briefs + compare', () => {
  beforeEach(() => {
    resetStore();
    seedProviders(beachheadSampleProviders());
  });

  it('creates brief with inferred hvac category and budget', () => {
    const brief = createServiceBrief({
      naturalLanguage: 'Find AC maintenance plans under $300 in Austin next 2 weeks',
    });
    expect(brief.category).toBe('hvac');
    expect(brief.budgetUsd).toBe(300);
    expect(brief.id).toMatch(/^brief_/);
  });

  it('infers cleaning priorities from natural language', () => {
    const brief = createServiceBrief({
      naturalLanguage: 'Book 3hr priority clean focusing on blinds, windows, under beds',
    });
    expect(brief.category).toBe('cleaning');
    expect(brief.priorities?.length).toBeGreaterThan(0);
  });

  it('compares hvac options and ranks within-budget higher', () => {
    const { options } = compareOptions({
      naturalLanguage: 'AC tune-up under $200 Austin',
      category: 'hvac',
      location: 'Austin',
      budgetUsd: 200,
    });
    expect(options.length).toBeGreaterThanOrEqual(2);
    const metro = options.find(o => o.providerId === 'prov_hvac_002');
    const hill = options.find(o => o.providerId === 'prov_hvac_001');
    expect(metro?.withinBudget).toBe(true);
    expect(hill?.withinBudget).toBe(false);
    expect(options[0].matchScore).toBeGreaterThanOrEqual(options[1].matchScore);
  });

  it('search by category hvac returns beachhead providers', () => {
    const res = searchProviders({ category: 'hvac', location: 'Austin' });
    expect(res.some(p => p.category === 'hvac')).toBe(true);
    expect(res[0].offer).toBeDefined();
  });
});
