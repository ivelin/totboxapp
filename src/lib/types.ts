// Core domain types for Totbox (Stage 2+)
// Zod schemas + TS interfaces aligned with product spec flows

import { z } from 'zod';

export const ServiceCategorySchema = z.enum([
  'kids_activities',
  'childcare_afterschool',
  'tutoring',
  'sports_extracurricular',
  'home_maintenance', // HVAC, plumbing, cleaning
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

export const ProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: ServiceCategorySchema,
  location: z.string(),
  services: z.array(z.string()),
  rules: ProviderRuleSchema,
  // populated later
  calendarConnected: z.boolean().default(false),
  calendarTokens: z.object({
    accessToken: z.string(),
    refreshToken: z.string().optional(),
  }).optional(), // Stage 5 (demo/plain for local; real would encrypt)
  token: z.string().optional(), // bearer for MCP scoping (Stage 4+)
});

export type Provider = z.infer<typeof ProviderSchema>;

export const BookingSchema = z.object({
  id: z.string(),
  providerId: z.string(),
  service: z.string(),
  date: z.string(),
  time: z.string(),
  consumerNote: z.string().optional(),
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
