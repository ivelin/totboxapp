# Totbox Product Spec

**Version:** 3.1 (July 9, 2026)  
**Prepared by:** Grok (Co-Founder)  
**Change driver:** Anonymized multi-year home-services coordination research + ServiceTitan API / persona-split pass. See [`docs/research/home_services_email_insights.md`](research/home_services_email_insights.md), [`docs/research/servicetitan_integration.md`](research/servicetitan_integration.md), and research privacy rules in [`docs/research/README.md`](research/README.md).

**Product Vision:** Totbox helps small local operators in family life services reduce back-office admin and booking hassle so they can focus on in-person customer experiences. At the same time, it helps busy families cut the chore of researching, comparing, and booking these services. We collapse multi-turn email/form loops into conversational agent flows (MCP + chat apps), with humans keeping only high-value approval gates.

---

## Executive Summary

Totbox is a thin **agentic middleware** layer that makes small family-oriented service providers discoverable and bookable by consumer AI agents (via MCP) while automating inbound coordination and post-service grunt work.

**MVP beachhead (evidence-backed reorder):**  
**Recurring home services — HVAC preventive maintenance + house cleaning** in Austin/TX, with **tree/arborist** as the first expansion vertical (seasonal rules). Kids’ activities / Family Entertainment Centers remain core to the long-term “family life” brand but are **parallel track**, not the primary validation path, until home-services loops are proven.

**Why the reorder:** Longitudinal email research shows the highest structured multi-turn friction in HVAC + cleaning (often 6–12+ emails per decision, parallel vendor comparison, review research, partner approval, ServiceTitan invoices, PM forwards). That is exactly the chore stack MCP agents can own.

**Key value:**
- **Families / households:** One conversational interface for discovery, comparison, scope briefs, scheduling, household approval, and records — instead of email archaeology.
- **Small operators:** Qualified inbound, structured briefs, slot suggestion, less phone/email admin; stay in tools they already use (**Google Calendar** first; **ServiceTitan** Tier 2 for jobs/leads/invoices/webhooks).

**Key UX principle:** No new app fatigue. Chat apps (Grok, Claude, ChatGPT, etc.) + simple MCP endpoints + OAuth. Humans approve finals; agents handle the mundane.

---

## User Research & Insights (Grounded)

### Prior (general family-life thesis)
- Families face constant coordination friction: research, forms, scheduling, no-shows.
- Small local providers lose time to manual booking/admin.
- MCP + chat matches 2026 behavior.

### New (anonymized household email-channel research, multi-year) — applied in v3 / v3.1
- **Recent intensification** of home-services email (esp. HVAC preventive + multi-site repairs) vs lighter earlier patterns.
- **Dominant email-intensive categories:** HVAC (ServiceTitan-heavy membership/plan flows), cleaning (tiered quotes + custom priority lists + partner forward/approval), tree care (Yelp quote + seasonal Oak Wilt education + price variance).
- **Weaker email signal:** Lawn (likely phone/text/cash), standalone plumbing/pest/roofing (often PM-mediated).
- **Canonical stages:** Discover → quote/scope multi-turn → household coordination → schedule → service + invoice → archive/forward → recurring/seasonal tracking.
- **Trust behavior:** Users cancel or delay after manual review research (Yelp/Reddit/BBB/FB). Trust summaries are not optional polish.
- **Hybrid multi-site workflows:** Property-manager handoffs appear in some jobs; valuable extension, not MVP core.
- **ServiceTitan (v3.1):** Concrete V2 surface for jobs, appointments, invoices, Leads booking push, webhooks, client-credentials auth — see annex. Quotes/membership PDFs remain **hybrid** (not assumed fully in ST).
- **Persona + viral (v3.1):** Dual-sided value and post-job referral / provider peer invite flywheel specified; productize after core loop works (Stage 11).
- **Full write-ups (public-safe only):** [`docs/research/home_services_email_insights.md`](research/home_services_email_insights.md), [`docs/research/servicetitan_integration.md`](research/servicetitan_integration.md).

**Caveat:** Design insights currently come from a **small anonymized sample**, not a published multi-household study. External validation still required (5–10 households, 10–20 providers). **Never commit raw research corpora or PII** to this public repo.

---

## Ideal Customer Profiles (ICPs)

### Consumer ICP – Busy Family / Household (primary)
- Parents juggling work, kids, and **recurring home logistics** (plus kids’ activities over time).
- High pain: Multi-provider research, PDF/plan comparison, email loops, partner approvals, forgotten preventive cadence, invoice filing.
- Wants: Conversational discovery + comparison + booking; household shared context; reminders for recurring work.
- Example jobs: AC tune-up/membership, priority clean with custom focus list, seasonal tree pruning.

### Provider ICP – Small Local Home-Service Operator (primary MVP)
- Solo or small-team HVAC, cleaning, (soon) tree/arborist operators serving residential families.
- Pain: Unqualified leads, phone/email quote ping-pong, no-shows, admin after ServiceTitan/calendar work is done.
- Wants: Structured inbound briefs, availability-aware booking, less back-and-forth, calendar/FSM-friendly tools — not a heavy new stack.

### Secondary ICPs (roadmap)
- Kids’ activity / FEC / childcare / tutoring operators (original brand expansion).
- Multi-property owners and small property managers (status briefs, vendor handoffs, invoice routing).

---

## Problem & Solution

**Problem:** Families burn hours on fragmented research, multi-turn email, partner coordination, and post-service admin for services that are frequent and urgent. Small providers lose the same hours on the other side of the thread — and lose focus on in-person delivery.

**Solution:** Totbox provides MCP-powered discoverability, structured service briefs, parallel comparison (price/terms/reviews/availability), calendar-aware booking, household approval gates, and lightweight records automation — via the chat apps people already use.

**Human gates (minimal by design):** Final booking/payment; unique access instructions; non-standard scope. Everything else is agent territory.

---

## Prioritized Service Categories

### MVP (Beachhead)
1. **HVAC / preventive maintenance** — Highest observed email volume and structure; memberships, cancel terms, parts exclusions, ServiceTitan ops patterns.
2. **House cleaning** — Strong quote tiers, custom natural-language scope (“blinds, under beds, corners”), partner approval pattern, recurring specials.

### Near-term expansion
3. **Tree / arborist** — Real quote + seasonal-guidance pattern; rules engine (e.g. Oak Wilt windows) is a product differentiator in Austin.
4. **Lawn / landscaping** — Demand likely; email thin — hybrid onboarding (chat + local network / SMS) rather than email-parity assumptions.

### Parallel brand track (not blocked, not Stage-0 default)
5. **Kids’ activities & Family Entertainment Centers**
6. **Childcare / after-school**
7. **Tutoring & educational enrichment**
8. **Sports / extracurricular coaching**

### Explicit later / opportunistic
- Pest, standalone plumbing, roofing (unless provider already in multi-trade FSM).
- Property-manager and multi-site dashboards.

---

## Friction → Product Capabilities

| Friction (research) | Totbox capability |
|---------------------|-------------------|
| Parallel multi-provider research | Discover + standardized compare |
| Quote/scope email loops | Natural language → **service brief**; structured quote fields (inclusions, cancel fee, membership, parts) |
| Review scanning before commit | Trust summary (recent praise/complaints, confidence) |
| Calendar negotiation | OAuth calendar (built) + ranked slots |
| Partner approval via forward | **Household share / approval gate** |
| Forgotten preventive work | Recurring plans + next-due reminders |
| Seasonal constraints | Domain **guidance** rules (local) |
| Invoice/PM admin | Record hooks + optional forward rules |
| Provider admin load | MCP inbound + brief + slot suggest; Calendar then ServiceTitan/FSM adapters |

---

## User Flows

### Consumer (household) — home services primary
1. Chat: *“Find AC maintenance plans near me in the next 2 weeks under $300 with good recent reviews”* or *“Book a 3hr priority clean focusing on blinds, windows, under beds — share with partner before confirm.”*
2. Agent discovers providers via Totbox MCP; returns parallel comparison (price/terms/reviews/availability).
3. Optional: household share → one approval.
4. Confirm booking with structured brief; calendar sync.
5. Post-service: receipt capture, archive, optional PM forward draft.
6. Ongoing: next-due reminders, rebook with last provider + alternatives.

### Provider (small operator)
1. Register / generate MCP endpoint; OAuth calendar (MVP); later FSM/ServiceTitan-class hook.
2. Receive structured inbound brief (not raw rambling email).
3. AI-assisted qualification + slot suggestion.
4. Confirm → write-back to calendar/FSM.
5. Focus on in-person delivery; less quote ping-pong.

### Onboarding target
- Both sides under ~10 minutes for MVP (MCP + calendar + basic profile/rules).

---

## Architecture (target)

```
Households (chat apps)
        |
        | MCP (consumer tools)
        v
+------------------------------------------+
|              Totbox Platform             |
|  - Intent + service brief capture        |
|  - Provider registry + MCP endpoints     |
|  - Orchestration (match / rules / trust) |
|  - Household approval primitives         |
|  - Recurring + seasonal rules            |
|  - Records / archive hooks               |
+------------------------------------------+
        |
        | OAuth / webhooks / thin adapters
        v
Providers (HVAC, cleaning, tree, …)
  Calendar adapter (Tier 1) · ServiceTitan adapter (Tier 2)
```

### MCP primitives (home-services MVP set)
- `search_providers` / discover  
- `get_quote` / `request_quote`  
- `compare_options`  
- `get_availability` *(partially implemented on feat/expand-scope; Calendar now, ST later)*  
- `book_with_brief`  
- `get_guidance` (seasonal / preventive)  
- `share_for_approval`  
- `record_service` (lightweight)

### Tier 2 MCP / connector wrappers (ServiceTitan-backed; not MVP-required)
- `create_job_from_brief` — map brief → ST Leads booking and/or `POST /v2/jobs`
- ST-backed `get_availability` — jobs/appointments read with Calendar fallback
- `get_invoice` — post-service archive path
- Webhook subscription (ops) — job/booking/payment events → household status

---

## Integration Philosophy

- **Read-first, low migration:** Prefer OAuth/webhooks over ripping out existing tools. Providers keep their system of record.
- **Tier 1 (MVP):** Google Calendar (done on feature branch), structured provider profiles, manual/MCP onboarding for pilot operators.
- **Tier 2 (ServiceTitan — design now, pilot after brief/compare loop):**
  1. **Leads / bookings push** (qualified agent inbound into tenant)
  2. **Jobs / appointments read** (availability signals)
  3. **Webhooks** (booking confirmed, job completed, payment posted)
  4. **Invoice pull** (records / optional PM-forward drafts later)
  - Auth: OAuth2 **client credentials** + App Key + least-privilege scopes ([developer.servicetitan.io](https://developer.servicetitan.io/))
  - Start **private app / integration environment**; public multi-tenant only if needed
  - **Quote gap:** membership PDFs and multi-turn inclusions/cancel/parts stay hybrid (offer schema + external sources)
  - Detail: [`docs/research/servicetitan_integration.md`](research/servicetitan_integration.md)
- **Non-ST fallback:** Same consumer UX via Calendar + structured brief; thinner provider automation.
- **Tier 3:** Yelp/Google (or trusted) review aggregation for trust summaries.
- MCP remains the abstraction so any compatible agent host can call Totbox.

---

## MVP Scope & Features

**MVP vertical:** Austin residential **HVAC preventive + house cleaning**, with seeded demo data and 5–10 pilot operators.

**In scope:**
- MCP endpoint generation + provider registration (existing trajectory).
- Consumer chat discovery + **multi-provider comparison** (price, inclusions/exclusions, membership/cancel terms, availability, trust summary stub).
- **Service briefs** from natural language (cleaning priorities; HVAC system/plan notes).
- Calendar OAuth availability merge (existing Stage 5).
- Booking confirmation path with human approval gate.
- Basic household share/approval (even if v1 is “generate shareable summary + confirm token”).
- Simple provider dashboard.
- Seed + eval fixtures drawn from research job patterns.
- Success logging: touchpoints-to-book, time-to-confirm.

**Out of scope for MVP:**
- Full marketplace bidding, payments processing, advanced automated quoting.
- Deep ServiceTitan **production** multi-tenant integration (design + sandbox prep OK; pilot is Stage 10c).
- Productized viral referral program (soft post-job prompt copy can be drafted; attribution is Stage 11).
- Full multi-property PM product.
- Kids/FEC full vertical go-to-market (sample seed providers OK for demos, not GTM focus).

---

## GTM Strategy

- **Market:** Austin/TX residential HVAC and cleaning operators serving families; early tree operators for seasonal narrative. Prefer a mix of Calendar-only and ServiceTitan-native pilots.
- **Channels:** Local operator networks, Facebook parent + small-biz groups, Reddit (r/Austin), direct outreach from real job templates.
- **Messaging:** “Collapse the 12-email HVAC and cleaning mess into one chat. You only approve the final.” Providers: “Pre-qualified jobs into the tools you already use.”
- **Pricing (directional):** Provider tiers ($199–$599/mo); consumer freemium or per-booking convenience fee.
- **Network flywheel (after core loop works):**
  - Residents: post-success “recommend to a neighbor” (pre-filled share / referral code).
  - Providers: peer invite from dashboard (“pre-qualified jobs land in ServiceTitan / calendar”).
  - Optional later: referral credits; track attribution and conversion.
- **Validation path:**  
  1. Land research-backed job fixtures + landing narrative.  
  2. 5–10 household shadow runs (time/emails saved).  
  3. 10–20 provider pilots (calendar-connected first; 1–2 ST-connected when ready).  
  4. Paid conversion after proved touchpoint reduction.  
  5. Then turn on dual-sided referral measurement.

---

## Roadmap (aligned to research + current code)

| Window | Focus |
|--------|--------|
| **Done / in PR** | Stages 1–5 on `feat/expand-scope`: Next.js scaffold, models/store, MCP server, provider registration, Calendar OAuth + availability merge, verify/capture scaffolding |
| **Now (plan + docs)** | v3.1 beachhead + ServiceTitan annex + persona/viral plan language |
| **Stage 6** | Service brief + quote/compare objects; seed HVAC + cleaning providers; consumer compare UX in chat tools |
| **Stage 7** | Trust summary stub + membership/cancel/parts fields on offers |
| **Stage 8** | Household share / approval gate |
| **Stage 9** | Recurring plans, next-due reminders, seasonal `get_guidance` (Oak Wilt / preventive cadence) |
| **Stage 10a** | ServiceTitan design freeze + sandbox access checklist + per-tenant connection model |
| **Stage 10b** | Prototype ST connector: Leads/jobs create-read + webhook stub; MCP wrappers behind flag |
| **Stage 10c** | Pilot 1–2 ST operators; invoice pull for post-service records |
| **Stage 11** | Dual-sided referral prompts + attribution metrics |
| **Parallel** | Keep FEC/kids path designed but not blocking home-services validation |
| **Later** | Lawn hybrid channels; multi-property + PM workflows; public multi-tenant ST app if needed |

---

## Success Metrics

| Metric | Target / intent |
|--------|------------------|
| Human touchpoints (emails/calls) per booking | Collapse 6–12 → **1 conversation + ≤2 approvals** |
| Time-to-confirmed booking | Down vs baseline email loop |
| Multi-provider comparison rate | Majority of successful jobs compared ≥2 options |
| Onboarding completion | >80% in <10 min (calendar path); track ST connect separately |
| Pilot → paid | >40% |
| Recurring rebook via reminder | Track; improve quarter over quarter |
| Family NPS (“logistics disappeared”) | Qualitative + score; optional NPS **per persona** |
| Provider churn | <10% first 3 months |
| Referral share rate (Stage 11+) | % completed jobs with resident share action |
| Provider peer invites (Stage 11+) | Invites sent → activated operators |

---

## Tech Notes for Build

- MCP is the canonical interface for discovery and tool calling.
- Prefer typed service-brief and offer schemas (Zod) over free-text-only state.
- Calendar: keep read-first availability merge; write-back only on confirmed book.
- ServiceTitan adapter: per-tenant credentials, least-privilege scopes, rate-limit/pagination handling, idempotent booking pushes, signed webhooks when available — see annex.
- Extend verify/capture/eval harness with fixtures from research patterns (HVAC compare, cleaning brief + partner approval, seasonal tree guidance); later add ST sandbox fixtures.
- Security: scoped tokens, provider verification, audit logs; never require household mailbox access for core product.
- Public-repo hygiene: no PII in seeds, fixtures, logs, or docs (see [`docs/research/README.md`](research/README.md)). Seeds use metro-level geography and fictional sample operators only.
- Austin seed defaults: metro-area examples, sample HVAC/cleaning operators, seasonal rule stubs — never real private addresses or personal zips.

---

## Document history

| Version | Date | Notes |
|---------|------|--------|
| 2.0 | 2026-06-27 | Family life services expansion; FEC-led prioritization |
| 3.0 | 2026-07-09 | Anonymized coordination research: HVAC+cleaning beachhead, workflow primitives, household approval, trust + records, stages 6–10 |
| **3.1** | **2026-07-09** | **ServiceTitan V2 annex; persona-split + viral flywheel; roadmap 10a–10c + Stage 11; public research privacy rules** |

**End of Spec**
