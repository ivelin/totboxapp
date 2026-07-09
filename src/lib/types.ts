// Core domain types for Totbox (Stage 2+)
// Zod schemas + TS interfaces aligned with product spec flows

import { z } from 'zod';

export const ServiceCategorySchema = z.enum([
  'kids_activities',
  'childcare_afterschool',
  'tutoring',
  'sports_extracurricular',
  'home_maintenance', // HVAC, plumbing, cleaning (legacy umbrella)
  'hvac',
  'cleaning',
  'tree_arborist',
]);

export type ServiceCategory = z.infer<typeof ServiceCategorySchema>;

export const AvailabilityRuleSchema = z.object({
  days: z.array(z.string()), // e.g. ["Mon", "Tue", ...]
  windows: z.array(z.string()), // "09:00-17:00"
  buffersMins: z.number().optional(),
  maxPerDay: z.number().optional(),
});

export const ProviderRuleSchema = z.object({
  availability: AvailabilityRuleSchema,
  pricingHint: z.string().optional(),
  serviceTypes: z.array(z.string()).optional(),
});

export type ProviderRule = z.infer<typeof ProviderRuleSchema>;

/** Stage 6: structured commercial terms for compare / quote surfaces */
export const OfferTermsSchema = z.object({
  priceFromUsd: z.number().optional(),
  priceHint: z.string().optional(),
  membership: z.string().optional(),
  cancelFeeUsd: z.number().optional(),
  partsExtra: z.boolean().optional(),
  inclusions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
  commitment: z.string().optional(),
  trustSummary: z.string().optional(), // stub until Stage 7 aggregation
});

export type OfferTerms = z.infer<typeof OfferTermsSchema>;

export const ProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: ServiceCategorySchema,
  location: z.string(),
  services: z.array(z.string()),
  rules: ProviderRuleSchema,
  offer: OfferTermsSchema.optional(),
  // populated later
  calendarConnected: z.boolean().default(false),
  calendarTokens: z.object({
    accessToken: z.string(),
    refreshToken: z.string().optional(),
  }).optional(), // Stage 5 (demo/plain for local; real would encrypt)
  calendarBusy: z.record(z.array(z.object({start: z.string(), end: z.string()}))).optional(), // date -> busy slots, persisted for demo (Stage 5)
  token: z.string().optional(), // bearer for MCP scoping (Stage 4+)
});

export type Provider = z.infer<typeof ProviderSchema>;

/** Stage 6: natural-language job captured as structured brief */
export const ServiceBriefSchema = z.object({
  id: z.string(),
  naturalLanguage: z.string(),
  category: ServiceCategorySchema.optional(),
  serviceType: z.string().optional(),
  priorities: z.array(z.string()).optional(),
  budgetUsd: z.number().optional(),
  location: z.string().optional(),
  dateWindow: z.string().optional(),
  createdAt: z.string(),
});

export type ServiceBrief = z.infer<typeof ServiceBriefSchema>;

export const CompareOptionSchema = z.object({
  providerId: z.string(),
  name: z.string(),
  category: ServiceCategorySchema,
  location: z.string(),
  services: z.array(z.string()),
  offer: OfferTermsSchema.optional(),
  priceFromUsd: z.number().optional(),
  withinBudget: z.boolean().optional(),
  matchScore: z.number(),
  matchReasons: z.array(z.string()),
});

export type CompareOption = z.infer<typeof CompareOptionSchema>;

export const BookingSchema = z.object({
  id: z.string(),
  providerId: z.string(),
  service: z.string(),
  date: z.string(),
  time: z.string(),
  consumerNote: z.string().optional(),
  briefId: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled']).default('pending'),
});

export type Booking = z.infer<typeof BookingSchema>;

export const AvailabilitySlotSchema = z.object({
  date: z.string(),
  start: z.string(),
  end: z.string(),
  available: z.boolean(),
});

export type AvailabilitySlot = z.infer<typeof AvailabilitySlotSchema>;
