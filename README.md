# Totbox

**Disappear the logistics of family life.**

Totbox helps small local operators reduce back-office admin and booking hassle so they can focus on in-person experiences. At the same time, it helps busy families cut the chore of researching, comparing, coordinating, and booking services.

Everything happens primarily in the chat apps you already use (Grok, Claude, ChatGPT, etc.) via simple **MCP** endpoints + OAuth — not another consumer app to install.

---

## Current beachhead (v3.1)

**Primary MVP:** Recurring **home services** in Austin — **HVAC preventive maintenance** and **house cleaning**, with **tree/arborist** next (seasonal rules).

**Why:** Anonymized multi-year household coordination research shows the highest multi-turn friction here (often 6–12+ emails per decision): parallel vendor comparison, PDF/plan quotes, review research, partner approvals, FSM invoices, and forgotten preventive cadence. That is the chore stack agents should own.

**Integrations:** **Tier 1** Google Calendar (stages 1–5). **Tier 2** ServiceTitan (jobs, Leads booking push, invoices, webhooks) — design in-repo, pilot after core brief/compare loop. Non-ST operators keep the Calendar path.

**Parallel track:** Kids’ activities, entertainment centers, childcare, tutoring, sports — still core to the long-term “family life” brand, not the Stage-0 validation path.

Full plan: [`docs/totbox_product_spec.md`](docs/totbox_product_spec.md)  
Research insights: [`docs/research/home_services_email_insights.md`](docs/research/home_services_email_insights.md)  
ServiceTitan annex: [`docs/research/servicetitan_integration.md`](docs/research/servicetitan_integration.md)  
Research privacy (public repo): [`docs/research/README.md`](docs/research/README.md)

---

## Core approach

- **Minimal friction:** Chat + MCP + OAuth. Humans keep only high-value gates (final book/pay, access details, non-standard scope).
- **Dual-sided value:** Households get one conversational loop. Small operators get structured inbound and less admin (stay in Calendar / ServiceTitan).
- **Built on real pain:** Collapse discovery → quote/scope → household approval → schedule → records → recurring reminders.
- **Growth (after the loop works):** Easy resident “tell a neighbor” + provider peer invites — measured referrals, not growth theater first.

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

## Development (stages 1–5+)

```bash
npm install
npm run dev          # Next.js UI on :3000
npm run dev:mcp      # MCP server on :3001
npm run build
npm test
npm run typecheck
```

- Landing page: `/`
- Provider dashboard (register, token, calendar connect): `/dashboard`
- MCP: `http://localhost:3001/mcp` (pass provider token for scoped tools)
- Tools: `search_services`, `get_provider_details`, `get_availability`, `create_service_brief`, `compare_options`
- Beachhead seed: fictional HVAC + cleaning (+ tree) demo operators (`npx tsx scripts/seed.ts`)

**Connecting the MCP:** Run `npm run dev:mcp`. Register on `/dashboard` (name, services, location, rules). You get a secret token + MCP URL. Add both to your chat app for scoped results.

---

## Implementation status

| Area | Status |
|------|--------|
| Product vision + v3.1 beachhead / ST annex | On `main` |
| Stages 1–5 (Next.js, store, MCP, registration, Google Calendar availability) | On `main` |
| Stage 6 (service briefs, compare, HVAC/cleaning seeds) | This branch |
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
