# Totbox

**Disappear the logistics of family life.**

Totbox.app helps busy families cut the chore of researching, comparing, coordinating, and booking services. It also helps small local services operators reduce back-office admin and booking hassle so they can focus on delivering great in-person experiences. 

Everything happens primarily in the chat apps you already use (Grok, Claude, ChatGPT, etc.) via simple **MCP** endpoints + OAuth — not another consumer app to install.

### Company OS instance

This repository is **both** a product codebase **and** a living **instance** of the portable [Company Operating System](docs/company-os/) for solo founders (bootstrap mentorship blueprint).

| Layer | What it is | Start here |
|-------|------------|------------|
| **Template** (portable method) | Principles, journey phases, synthetic research, EDD, founder gates | [`docs/company-os/operating-system.md`](docs/company-os/operating-system.md) · [`live-runtime.md`](docs/company-os/live-runtime.md) |
| **Instance** (Totbox application) | Durable state, scores, ICPs, workflows, product gap map — steal the discipline, not the beachhead | [`docs/company-os/instance/`](docs/company-os/instance/) · [`applied-here.md`](docs/company-os/applied-here.md) · `npm run company-os -- status` |

Mentees and agents: use the template for *how to decide*; treat Totbox product thesis and ICP as **one worked example**, not defaults to copy.

---

## Current beachhead (v3.1)

**Primary MVP:** Recurring **home services** in Austin — **HVAC preventive maintenance** and **house cleaning**, with **tree/arborist** next (seasonal rules).

**Why:** Anonymized multi-year household coordination research shows the highest multi-turn friction here (often 6–12+ emails per decision): parallel vendor comparison, PDF/plan quotes, review research, partner approvals, FSM invoices, and forgotten preventive cadence. That is the chore stack agents should own.

**Thesis:** Scheduling/coordination workflow — **not** a vendor registry (discovery is Google/AI).  
**Host LLM first:** Grok / Claude / OpenClaw / Codex draft and use **user’s existing tools** (memory, Gmail, SMS/voice MCP). Totbox is the **job PM** (checklist, gates, audit).  
**Safety before convenience:** explicit user approval for send/PII/money; dry-run default; validate every step (FSD: must not do harm).

| Doc | Purpose |
|-----|---------|
| [`docs/strategy/bootstrap_pmf_and_agentic_gap.md`](docs/strategy/bootstrap_pmf_and_agentic_gap.md) | **Strategy:** agentic gap vs e‑com, bootstrap phases, what not to build |
| [`docs/eval/continuous_sim_eval.md`](docs/eval/continuous_sim_eval.md) | **Parallel:** multi-actor sim + continuous eval (sandbox ≈ prod) |
| [`docs/local_mcp_connect.md`](docs/local_mcp_connect.md) | **Local test:** Grok / Hermes / curl → `localhost:3001/mcp` |
| [`docs/local_household_runbook.md`](docs/local_household_runbook.md) | Personal house job path (consumer tools) |
| [`docs/host_llm_safety.md`](docs/host_llm_safety.md) | Safety + host capability fallthrough |
| [`docs/workflows/house_service_v1.md`](docs/workflows/house_service_v1.md) | **Consumer 8-step map** + dev drill-down |
| [`docs/workflows/format.md`](docs/workflows/format.md) | **Interchange format** (`totbox.workflow_*` + Mermaid) |
| [`docs/mcp_workflow_architecture.md`](docs/mcp_workflow_architecture.md) | Job PM / next_action contract |
| [`docs/product_thesis.md`](docs/product_thesis.md) | Scheduling not discovery |
| [`docs/totbox_product_spec.md`](docs/totbox_product_spec.md) | Broader product plan |
| [`AGENTS.md`](AGENTS.md) | Public repo: no PII |
| [`docs/company-os/`](docs/company-os/) | **Company OS:** portable template + **this repo as living instance** (see callout above) |

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

**Connecting the MCP (local)**  
See [`docs/local_mcp_connect.md`](docs/local_mcp_connect.md): `npm run dev:mcp` → `http://localhost:3001/mcp` → Grok (`grok mcp add --transport http …`) or Hermes HTTP. Household job PM needs **no** token. Optional Stage 4 provider token (register at `/dashboard`) only scopes fixture search to one operator.

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

**Workflow visibility:** ask the host anytime — `get_workflow` (general or `service_kind`) or `get_workflow({ job_id })` / `get_job` for the live strip. Same 8 steps for every house service; you stay in control of approvals. Structured as `totbox.workflow_def` / `totbox.workflow_progress` with optional Mermaid projection (`diagrams.mermaid`) — see [`docs/workflows/format.md`](docs/workflows/format.md).

**Interactive sample (browser):** `npm run dev` → open [**/workflow**](http://localhost:3000/workflow) — mobile-friendly strip, tap a step for You vs App, sample “approve message” card.

Host loop: follow each `next_action` (prefer host memory/Gmail/SMS/voice tools) → `record_user_approval` → never send without grant → dry-run or `hostPerformed` send → `ingest_provider_message`.

Also: `npm run smoke:house-owner` (legacy fixture compare). Docs: [`docs/host_llm_safety.md`](docs/host_llm_safety.md), [`docs/workflows/house_service_v1.md`](docs/workflows/house_service_v1.md), [`docs/workflows/format.md`](docs/workflows/format.md).

---

## Development

```bash
npm install
npm run dev          # Next.js UI on :3000 (src/, public/)
npm run dev:mcp      # MCP on :3001 (product/server/)
npm run smoke:job    # product/scripts/job-smoke.ts
npm run company-os -- status
npm test && npm run typecheck && npm run build
```

### Repo layout (company-as-code)

| Dir | Role |
|-----|------|
| `company/` | Living OS state + CLI |
| `research/` | ICP / research notes |
| `product/` | MCP server + product scripts (Next app stays `src/` + `public/`) |
| `evals/` | Eval harness + fixtures |
| `traces/` | Decision traces |
| `growth/` · `support/` · `infrastructure/` | Stubs (later) |
| `docs/company-os/` | Portable OS template + Totbox instance index |

MCP job tools: `get_workflow`, `start_job`, `get_job`, `list_jobs`, `update_job_facts`, `submit_draft_for_approval`, `record_user_approval`, `approve_and_send_message`, `ingest_provider_message`, `normalize_quote`, `confirm_appointment`, `record_job_completion`, …

---

## Implementation status

| Area | Status |
|------|--------|
| Stages 1–6 scaffold | On `main` |
| Job PM + host-LLM safety gates | On `main` |
| Phase 1 full household path (paste quote → book → next-due) | **Now** — see Bootstrap roadmap |
| Always-on 24/7 daemon / real SMS vendor | Non-goal for now |
| Operator paid pilots (Phase 2) | Deferred until shadow PMF |
| Stages 10a–10c (ServiceTitan design → prototype → pilot) | Spec’d; **after** revenue/LOI |
| Multi-level “Shopify-like” provider MCP suite | **Not** bootstrap; long-horizon option |
| Stage 11 (dual-sided referrals) | Spec’d; after core loop |

---

## Bootstrap roadmap (north star)

Survive and learn before platform depth. Every stage either **completes more household jobs** or **converts proof into revenue**.

| Phase | Focus | Exit |
|-------|--------|------|
| **0** | Foundation on `main` (job PM, safety, `house_service_v1`, Calendar OAuth scaffold, ST design annex) | Done — stop yak-shaving formats |
| **1 — now** | Shadow PMF: real HVAC/cleaning jobs via MCP; quote-from-paste; confirm appointment; explicit completion + next-due | ≥5 jobs with touchpoint drop; runbook works for your house |
| **2** | First $: structured inbound for local operators (or household sub if faster) | 1–3 paid pilots / LOIs |
| **3** | Stickiness: harden quote/calendar/rebook from pilot feedback | Retention + case study |
| **4** | Adjacent only with cash/LOI: ST private pilot, “Agentic Ready” packaging, second vertical | Demand-funded adapters |

**Explicit non-goals until Phase 2+ exit:** city provider directory, multi-FSM integration matrix, viral referral GTM, kids/FEC GTM, claiming a full field-services agent commerce platform.

**Personal house path:** [`docs/local_household_runbook.md`](docs/local_household_runbook.md) · host connect: [`docs/local_mcp_connect.md`](docs/local_mcp_connect.md) · rationale: [`docs/strategy/bootstrap_pmf_and_agentic_gap.md`](docs/strategy/bootstrap_pmf_and_agentic_gap.md) · smoke: `npm run smoke:job`.

---

## Why this direction

- Shared pain on both sides of the same email thread.
- High frequency + urgency (especially HVAC/cleaning) → fast validation.
- Low-friction design matches how people already coordinate in 2026.
- Clear path: **prove household job loop (Phase 1)** → paid operator wedge (Phase 2) → deepen Calendar/ST only when funded.

---

## Contributing / early collaboration

Feedback from households and small operators is extremely valuable.

- Product plan: [`docs/totbox_product_spec.md`](docs/totbox_product_spec.md)
- Anonymized research insights: [`docs/research/home_services_email_insights.md`](docs/research/home_services_email_insights.md)
- Research privacy rules: [`docs/research/README.md`](docs/research/README.md)
- Agent hard rule (public repo, no PII): [`AGENTS.md`](AGENTS.md)
- Issues and discussions welcome

### Mentorship: Company Operating System (portable)

This repo also hosts a **standalone** bootstrap OS for solo founders (FI / SCORE / mentees). It is **not** Totbox product policy.

- Start: [`docs/company-os/README.md`](docs/company-os/README.md)
- Blueprint: [`docs/company-os/operating-system.md`](docs/company-os/operating-system.md)
- Live runtime (state + 7-stage loop): [`docs/company-os/live-runtime.md`](docs/company-os/live-runtime.md)
- How Totbox applies it (example + gap analysis): [`docs/company-os/applied-here.md`](docs/company-os/applied-here.md)
- Living instance index: [`docs/company-os/instance/`](docs/company-os/instance/)
- Instance CLI: `npm run company-os -- status`
- Grok workflow: `.grok/workflows/company-operating-loop.rhai`

Point an AI at the repo and ask it to apply the OS to *their* startup — not to copy Totbox’s market.

## License

**Apache License 2.0** — see [`LICENSE`](LICENSE).

You may use, modify, and distribute this software under the terms of the Apache License, Version 2.0.

---

*Built to make family life logistics disappear — so families and the small operators who serve them can focus on what matters.*
