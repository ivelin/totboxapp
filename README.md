# Totbox

**Disappear the logistics of family life.**

Totbox helps small local operators reduce back-office admin and booking hassle so they can focus on in-person experiences. At the same time, it helps busy families cut the chore of researching, comparing, coordinating, and booking services.

Everything happens primarily in the chat apps you already use (Grok, Claude, ChatGPT, etc.) via simple **MCP** endpoints + OAuth — not another consumer app to install.

---

## Current beachhead (v3.1)

**Primary MVP:** Recurring **home services** in Austin — **HVAC preventive maintenance** and **house cleaning**, with **tree/arborist** next (seasonal rules).

**Why:** Anonymized multi-year household coordination research shows the highest multi-turn friction here (often 6–12+ emails per decision): parallel vendor comparison, PDF/plan quotes, review research, partner approvals, FSM invoices, and forgotten preventive cadence. That is the chore stack agents should own.

**Core thesis:** Providers are already discoverable via SEO, Maps, and AI chat. **Totbox owns the scheduling/coordination workflow** (brief → quotes → household decide → schedule → confirm → records)—**not** a competing vendor registry. See [`docs/product_thesis.md`](docs/product_thesis.md).

**Integrations (priority order):**
1. **Human channels** (phone / email / SMS / web forms) — universal book/confirm path.  
2. **Local MCP + CLI** for developers managing real household chores.  
3. Optional Google Calendar (busy / propose times).  
4. **FSM APIs** (ServiceTitan, Jobber, …) **later / selective** — dispatch depth only, never “fill a directory.”

**Parallel track:** Kids’ activities / FEC etc. remain long-term brand, not Stage-0.

| Doc | Purpose |
|-----|---------|
| [`docs/product_thesis.md`](docs/product_thesis.md) | **Scheduling not discovery** thesis |
| [`docs/provider_onboarding_matrix.md`](docs/provider_onboarding_matrix.md) | Coordination channel matrix (no registry) |
| [`docs/local_household_runbook.md`](docs/local_household_runbook.md) | Dev/local MCP + CLI runbook |
| [`docs/totbox_product_spec.md`](docs/totbox_product_spec.md) | Full plan (being aligned to thesis) |
| [`docs/research/`](docs/research/) | Anonymized research + ST annex |
| [`AGENTS.md`](AGENTS.md) | Public repo: no PII |

---

## Core approach

- **Not a directory:** Do not maintain a city-wide vendor registry; discovery is external.
- **Workflow first:** Structure the job, normalize quotes you collect, schedule, follow up, rebook.
- **Local-first:** Clone; MCP/CLI; private `.data/` for *your* rebook memory only.
- **Book offline by default:** Phone/email/form—covers every provider without FSM signup.
- **Hosted later:** Same workflow for non-tech users after local proof.
- **FSM optional:** Only when a partner needs dispatch-native jobs.

---

## Quick start (product vision)

**For households**

1. Find candidates however you already do (search / AI / referral).  
2. Ask Totbox (MCP/CLI) to structure and schedule the chore, for example:

- “I need AC maintenance in the next 2 weeks under $300—help me brief and schedule”
- “Compare these two cleaning quotes and draft a confirmation for the cheaper one”
- “Remind me when live-oak pruning season opens; rebook last arborist if terms look ok”

**For providers**

No signup required for a resident to complete a job. Optional later: accept structured briefs / calendar holds / FSM job create if they want less admin.

Onboarding target for *household tool use*: minutes to brief + draft outreach—not “list every vendor in Austin.”

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
Household workflow (Totbox)              Provider channel (external)
---------------------------------        ---------------------------------
1. Need a job (chat/CLI)                 Found via Google / AI / referral
2. Service brief                         |
3. Collect/compare quotes                Phone / email / web form
4. Propose times (calendar)              Confirms slot
5. Track confirm + records + rebook      Invoices on their tools
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

# Optional private rebook memory (vendors YOU already chose — not a city directory)
npm run household -- add --name "Preferred AC Co" --category hvac --location "Austin, TX" \
  --price 245 --membership "Bi-annual" --cancel-fee 120 --inclusions "Inspection,Coil clean" \
  --contact "their phone or email (local only)"
npm run household -- compare --text "AC maintenance under \$300 next 2 weeks"
npm run household -- draft --text "AC tune-up next week" --provider-id <id from list>
# Find new vendors via Google/AI search; book on their phone/email/form

# Optional: MCP for Grok / Claude / OpenClaw / etc.
npm run dev:mcp   # http://localhost:3001/mcp
```

**Smoke (demo fixtures for learning/CI only — not a product directory):**

```bash
npm run smoke:house-owner              # no server
npm run smoke:house-owner -- --live    # with npm run dev:mcp running
```

Real use: **discover externally** → Totbox brief / quote compare / draft / schedule help → **confirm on their channel**.

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
