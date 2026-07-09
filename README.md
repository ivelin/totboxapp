# Totbox

**Disappear the logistics of family life.**

Totbox helps small local operators reduce back-office admin and booking hassle so they can focus on in-person experiences. At the same time, it helps busy families cut the chore of researching, comparing, coordinating, and booking services.

Everything happens primarily in the chat apps you already use (Grok, Claude, ChatGPT, etc.) via simple **MCP** endpoints + OAuth — not another consumer app to install.

---

## Current beachhead (v3.1)

**Primary MVP:** Recurring **home services** in Austin — **HVAC preventive maintenance** and **house cleaning**, with **tree/arborist** next (seasonal rules).

**Why:** Anonymized multi-year household coordination research shows the highest multi-turn friction here (often 6–12+ emails per decision): parallel vendor comparison, PDF/plan quotes, review research, partner approvals, FSM invoices, and forgotten preventive cadence. That is the chore stack agents should own.

**Integrations (priority order):**
1. **Human channels** (phone / email / SMS / web forms) for **maximum provider coverage** — default book path.  
2. **Local MCP + CLI** so developers run Totbox on their own machine for real household chores.  
3. Optional Google Calendar (availability).  
4. **FSM APIs** (ServiceTitan, Jobber, …) **later / selective** — depth for multi-truck partners only, not required for coverage.

**Parallel track:** Kids’ activities, entertainment centers, childcare, tutoring, sports — still core to the long-term brand, not Stage-0.

| Doc | Purpose |
|-----|---------|
| [`docs/provider_onboarding_matrix.md`](docs/provider_onboarding_matrix.md) | **One-page** provider matrix + no-FSM-first strategy |
| [`docs/local_household_runbook.md`](docs/local_household_runbook.md) | **Dev/local** MCP + CLI household runbook |
| [`docs/totbox_product_spec.md`](docs/totbox_product_spec.md) | Full product plan |
| [`docs/research/`](docs/research/) | Anonymized research + ST annex (future depth) |
| [`AGENTS.md`](AGENTS.md) | Public repo: no PII in commits |

---

## Core approach

- **Coverage first:** Onboard any provider via human interfaces; do **not** require ServiceTitan/Jobber.
- **Local-first:** Clone the repo; run MCP/CLI for your own house; `.data/` stays private on disk.
- **Minimal friction for residents:** Chat/MCP/CLI → structured brief → compare → **you** confirm offline.
- **Hosted service later:** Only after local usefulness is proven for developers/power users.
- **FSM APIs optional:** High-volume HVAC partners only, after the human loop works.

---

## Quick start (product vision)

**For households**

Ask naturally, for example:

- “Find AC maintenance plans for my area in the next 2 weeks under $300 with good recent reviews”
- “Book a 3hr priority clean focusing on blinds, windows, under beds, corners — share options before I confirm”
- “Get live-oak pruning quotes and flag Oak Wilt season constraints”

**For providers (small operators)**

Add the Totbox MCP endpoint in your chat setup and connect your existing **calendar** (MVP). **ServiceTitan** operators get a deeper path later: qualified bookings into their tenant, webhooks for status, invoice-aware records. Inbound jobs arrive as structured briefs.

Onboarding target: under 10 minutes for the calendar path; ST connect documented separately (~10–15 min design target).

**Connecting the MCP (Stage 4)**  
Run `npm run dev:mcp`. Go to /dashboard to register (name, services, location, rules). You get a secret token + the MCP URL (http://localhost:3001/mcp). Add to your chat app with the token for scoped results. Tools now support optional `token` arg for scoping to your provider only.
Current tools (Stage 3): search_services, get_provider_details, get_availability.

---

## Architecture

```
Households
    |
    v
Chat Apps (Grok / Claude / ChatGPT)
    |
    |  MCP
    v
+----------------------------------+
|         Totbox Platform          |
|  - Service briefs & comparison   |
|  - MCP endpoint generator        |
|  - OAuth (Calendar; ST Tier 2)   |
|  - Rules / trust / recurring     |
|  - Household approval gates      |
|  - Records / archive hooks       |
+----------------------------------+
    |
    |  OAuth / webhooks
    v
Small local providers
  (HVAC, cleaning, tree, …)
```

---

## User flows

```
Household flow                         Provider flow
---------------------------------      ---------------------------------
1. Query via chat app                  1. MCP endpoint + OAuth calendar
2. Parallel discover & compare         2. Receive structured inbound brief
   (price, terms, reviews, slots)      3. AI helps qualify + suggest slots
3. Optional household approval         4. Confirm → sync calendar / ST
4. Book with service brief
5. Records + next-due reminders
```

---

## Local household use (developers — recommended path)

Run Totbox **on your computer** as MCP and/or CLI. No hosted account. No FSM API required.

Full walkthrough: [`docs/local_household_runbook.md`](docs/local_household_runbook.md)  
Provider strategy matrix: [`docs/provider_onboarding_matrix.md`](docs/provider_onboarding_matrix.md)

```bash
git clone https://github.com/ivelin/totboxapp.git && cd totboxapp
npm install

# Learn the loop with fictional demos
npm run seed
npm run smoke:house-owner

# Your real vendors (data stays in local .data/ — gitignored)
npm run household -- add --name "Preferred AC Co" --category hvac --location "Austin, TX" \
  --price 245 --membership "Bi-annual" --cancel-fee 120 --inclusions "Inspection,Coil clean" \
  --contact "their phone or email (local only)"
npm run household -- list
npm run household -- compare --text "AC maintenance under \$300 next 2 weeks"
npm run household -- draft --text "AC tune-up next week" --provider-id <id from list>

# Optional: MCP for Grok / Claude / OpenClaw / etc.
npm run dev:mcp   # http://localhost:3001/mcp
```

**House-owner smoke (demo providers):**

```bash
npm run smoke:house-owner              # no server
npm run smoke:house-owner -- --live    # with npm run dev:mcp running
```

Sample jobs: AC under $300; priority clean focusing on blinds/windows/under beds. Expect multi-option prices/terms. Book offline via phone/email/form.

---

## Development (stages 1–6+)

```bash
npm install
npm run dev          # Next.js UI on :3000
npm run dev:mcp      # MCP server on :3001
npm run build
npm test
npm run typecheck
npm run smoke:house-owner
```

- Landing page: `/`
- Provider dashboard (register, token, calendar connect): `/dashboard`
- MCP: `http://localhost:3001/mcp` (pass provider token for scoped tools)
- Tools: `search_services`, `get_provider_details`, `get_availability`, `create_service_brief`, `compare_options`
- Beachhead seed: fictional HVAC + cleaning (+ tree) demo operators (`npm run seed`)

**Connecting the MCP:** Run `npm run dev:mcp`. Register on `/dashboard` (name, services, location, rules). You get a secret token + MCP URL. Add both to your chat app for scoped results.

---

## Implementation status

| Area | Status |
|------|--------|
| Product vision + v3.1 beachhead / ST annex | On `main` |
| Stages 1–5 (Next.js, store, MCP, registration, Google Calendar availability) | On `main` |
| Stage 6 (service briefs, compare, HVAC/cleaning seeds, house-owner smoke) | This branch / PR #3 |
| Stages 7–9 (trust, household approval, recurring) | Spec’d; next |
| Stages 10a–10c (ServiceTitan design → prototype → pilot) | Spec’d in ST annex |
| Stage 11 (dual-sided referrals) | Spec’d; after core loop |

---

## Why this direction

- Shared pain on both sides of the same email thread.
- High frequency + urgency (especially HVAC/cleaning) → fast validation.
- Low-friction design matches how people already coordinate in 2026.
- Clear path: prove home-services loop → expand verticals → deepen ServiceTitan / calendar integrations.

---

## Contributing / early collaboration

Feedback from households and small operators is extremely valuable.

- Product plan: [`docs/totbox_product_spec.md`](docs/totbox_product_spec.md)
- Anonymized research insights: [`docs/research/home_services_email_insights.md`](docs/research/home_services_email_insights.md)
- Research privacy rules: [`docs/research/README.md`](docs/research/README.md)
- Agent hard rule (public repo, no PII): [`AGENTS.md`](AGENTS.md)
- Issues and discussions welcome

**License:** Apache-2.0

---

*Built to make family life logistics disappear — so families and the small operators who serve them can focus on what matters.*
