# Totbox

**Disappear the logistics of family life.**

Totbox helps small local operators reduce back-office admin and booking hassle so they can focus on in-person experiences. At the same time, it helps busy families cut the chore of researching, comparing, coordinating, and booking services.

Everything happens primarily in the chat apps you already use (Grok, Claude, ChatGPT, etc.) via simple **MCP** endpoints + OAuth — not another consumer app to install.

---

## Current beachhead (v3.1)

**Primary MVP:** Recurring **home services** in Austin — **HVAC preventive maintenance** and **house cleaning**, with **tree/arborist** next (seasonal rules).

**Why:** Anonymized multi-year household coordination research shows the highest multi-turn friction here (often 6–12+ emails per decision): parallel vendor comparison, PDF/plan quotes, review research, partner approvals, FSM invoices, and forgotten preventive cadence. That is the chore stack agents should own.

**Thesis:** Scheduling/coordination workflow — **not** a vendor registry (discovery is Google/AI).  
**Host LLM first:** Grok / Claude / OpenClaw / Codex draft and use **user’s existing tools** (memory, Gmail, SMS/voice MCP). Totbox is the **job PM** (checklist, gates, audit).  
**Safety before convenience:** explicit user approval for send/PII/money; dry-run default; validate every step (FSD: must not do harm).

| Doc | Purpose |
|-----|---------|
| [`docs/host_llm_safety.md`](docs/host_llm_safety.md) | Safety + host capability fallthrough |
| [`docs/workflows/house_service_v1.md`](docs/workflows/house_service_v1.md) | **Consumer 8-step map** + dev drill-down |
| [`docs/mcp_workflow_architecture.md`](docs/mcp_workflow_architecture.md) | Job PM / next_action contract |
| [`docs/product_thesis.md`](docs/product_thesis.md) | Scheduling not discovery |
| [`docs/totbox_product_spec.md`](docs/totbox_product_spec.md) | Broader product plan |
| [`AGENTS.md`](AGENTS.md) | Public repo: no PII |

---

## Core approach

- **Not a directory:** Find vendors externally; Totbox runs the job checklist.
- **Host LLM = EA; Totbox MCP = PM:** `next_action` work orders; prefer host Gmail/voice/memory.
- **Safety first:** `record_user_approval` before send; default dry-run; full audit trail.
- **Human channels** for coverage (phone/email/form); FSM APIs optional later.
- **Local-first:** `.data/jobs.json` gitignored; `npm run smoke:job`.

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

## Job PM smoke (host-LLM safety path)

```bash
npm install
npm run smoke:job    # HVAC + cleaning: start → draft → approval → dry-run send → ingest
npm run dev:mcp      # start_job, get_workflow, record_user_approval, …
```

**Workflow visibility:** ask the host anytime — `get_workflow` (general or `service_kind`) or `get_workflow({ job_id })` / `get_job` for the live strip. Same 8 steps for every house service; you stay in control of approvals.

**Interactive sample (browser):** `npm run dev` → open [**/workflow**](http://localhost:3000/workflow) — mobile-friendly strip, tap a step for You vs App, sample “approve message” card.

Host loop: follow each `next_action` (prefer host memory/Gmail/SMS/voice tools) → `record_user_approval` → never send without grant → dry-run or `hostPerformed` send → `ingest_provider_message`.

Also: `npm run smoke:house-owner` (legacy fixture compare). Docs: [`docs/host_llm_safety.md`](docs/host_llm_safety.md), [`docs/workflows/house_service_v1.md`](docs/workflows/house_service_v1.md).

---

## Development

```bash
npm install
npm run dev          # Next.js UI on :3000
npm run dev:mcp      # MCP on :3001
npm run smoke:job
npm test && npm run typecheck && npm run build
```

MCP job tools: `get_workflow`, `start_job`, `get_job`, `list_jobs`, `update_job_facts`, `submit_draft_for_approval`, `record_user_approval`, `approve_and_send_message`, `ingest_provider_message`, `confirm_appointment`, …

---

## Implementation status

| Area | Status |
|------|--------|
| Stages 1–6 scaffold | On `main` |
| Job PM + host-LLM safety gates | This branch |
| Always-on 24/7 daemon / real SMS vendor | Non-goal for now |
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
