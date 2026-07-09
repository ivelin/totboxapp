// Stage 2+ seed script
// Usage: npx tsx scripts/seed.ts

import { seedProviders, getProviders, computeAvailability } from '../src/lib/store';
import { Provider } from '../src/lib/types';

const sampleProviders: Provider[] = [
  {
    id: "prov_001",
    name: "Austin Kids Play Center",
    category: "kids_activities",
    location: "Austin, TX",
    services: ["Birthday parties", "Open play", "Art classes"],
    rules: {
      availability: { days: ["Tue", "Thu", "Sat"], windows: ["09:00-17:00"] },
    },
    calendarConnected: false,
  },
  {
    id: "prov_002",
    name: "Hill Country HVAC Pros",
    category: "home_maintenance",
    location: "Austin, TX",
    services: ["AC Tune-up", "Furnace Check"],
    rules: {
      availability: { days: ["Mon", "Wed", "Fri"], windows: ["08:00-16:00"] },
    },
    calendarConnected: false,
  },
];

seedProviders(sampleProviders);

console.log("=== Totbox Seed (Stage 2) ===");
console.log("Providers:", getProviders().map(p => `${p.id} — ${p.name}`));

const sampleDate = "2026-07-05"; // a Saturday (matches prov_001)
const slots = computeAvailability("prov_001", sampleDate);
console.log(`Sample availability for prov_001 on ${sampleDate}:`, slots);

console.log("\nStore seeded. Stage 3 will wire this into MCP tools.");
