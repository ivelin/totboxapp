// Stage 1 seed script (will be expanded in Stage 2)
// Run with: npx tsx scripts/seed.ts (after tsx installed) or node after build

const sampleProviders = [
  {
    id: "prov_001",
    name: "Austin Kids Play Center",
    category: "kids_activities",
    location: "Austin, TX",
    services: ["Birthday parties", "Open play", "Art classes"],
    rules: { availability: { days: ["Tue", "Thu", "Sat"], windows: ["09:00-17:00"] } },
  },
  {
    id: "prov_002",
    name: "Hill Country HVAC Pros",
    category: "home_maintenance",
    location: "Austin, TX",
    services: ["AC Tune-up", "Furnace Check", "Filter Replacement"],
    rules: { availability: { days: ["Mon", "Wed", "Fri"], windows: ["08:00-16:00"] } },
  },
];

console.log("Totbox Seed Data (Stage 1 placeholder)");
console.log(JSON.stringify(sampleProviders, null, 2));
console.log("\nNext stages will load this into the in-memory store and MCP tools.");
