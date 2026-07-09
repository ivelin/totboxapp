# Home Services Email Research Insights

**Status:** Applied to product plan (spec **v3.1**)  
**Source:** Anonymized multi-year household coordination research (email-channel patterns, ~2021–2026) plus ServiceTitan API / persona design notes. Raw corpora stay private.  
**Purpose:** Ground Totbox prioritization and MVP design in real multi-turn coordination patterns.  
**Last research update:** 2026-07-09  
**Related:** [`servicetitan_integration.md`](servicetitan_integration.md) · privacy rules: [`README.md`](README.md)

> **Public-safe extract only.** No names, emails, street addresses, unit numbers, personal zips, raw threads, or invoices. Patterns and product implications only.

---

## 1. What the archive actually shows

### Volume & intensity
- Recent years show a **clear surge** in home-services email coordination (especially HVAC preventive maintenance and multi-site repairs) vs lighter earlier patterns.
- Earlier years: more fragmented (occasional cleaning, shared-building maintenance decisions, sporadic vendor threads).
- Implication: coordination load is growing, not shrinking — validates agentic middleware even for “simple” maintenance.

### Category ranking by email intensity (observed)
| Rank | Category | Email intensity | Structure | Notes |
|------|----------|-----------------|-----------|--------|
| 1 | HVAC / preventive maintenance | Very high (2026) | High | Parallel vendor threads; ServiceTitan-heavy; membership/plan PDFs; review research before commit |
| 2 | Cleaning | High | High | Quotes with tiers/specials; custom priority lists; partner approval via forward |
| 3 | Tree / arborist | Medium | Medium | Yelp quote → schedule; seasonal education (e.g. Oak Wilt); price variance pain |
| 4 | Lawn / landscaping | Low in email | Unknown | Likely phone/text/cash/side-hustle; HOA noise ≠ vendor workflows |
| — | Plumbing, pest, roofing (standalone) | Low in top results | — | Often PM-mediated or non-email channels |
| — | Kids play equipment installers | None commercial | — | Not a beachhead signal from this archive |

### Provider stack reality
- Many HVAC / multi-trade operators run **ServiceTitan** (estimates, invoices, tech dispatch, reminders, post-service review requests from noreply-style systems).
- Cleaning providers more often use **email/PDF quotes + website booking**.
- Tree work often starts on **Yelp messaging**, then moves to email/quote.
- **Property managers** (portal statements, vendor handoffs) appear in multi-site / rental-ops hybrid workflows.

---

## 2. Canonical workflow (cross-category)

Almost every high-friction job follows the same stages:

1. **Discovery & research** — Google/Yelp/provider sites; manual review aggregation (Yelp, Reddit, BBB, Facebook).
2. **Quote & scope clarification** — PDF/plan flyer; multi-turn on inclusions, exclusions, memberships, cancel fees, parts, custom priorities.
3. **Family / partner coordination** — Forward quote; iterate custom needs; wait for approval.
4. **Availability & scheduling** — Window negotiation; sometimes upfront charge to hold slot.
5. **Delivery & admin** — Dispatch/reminders; invoice/receipt; payment; **forward to PM or personal archive**.
6. **Recurring / seasonal management** — Next due dates; membership renewals; local rules (e.g. Oak Wilt windows, freeze prep).

**Pain magnitude:** Often **6–12+ emails per decision**, plus off-platform review research. Low-friction outliers exist (e.g. simple website booking + one “looks good” reply) but are not the norm for multi-vendor comparison.

---

## 3. Friction map → Totbox automation targets

| # | Friction | Human value of doing it manually | Agent automation fit |
|---|----------|----------------------------------|----------------------|
| 1 | Multi-provider discovery + comparison | Low | High — parallel MCP/API queries |
| 2 | Quote/scope multi-turn loops | Medium (preferences) | High for standard clarifications; human for exceptions |
| 3 | Scheduling / calendar | Low | High — OAuth calendar + ranked slots |
| 4 | Family/partner approvals | High (judgment) | Medium — agent drafts brief; humans approve once |
| 5 | Recurring / seasonal tracking | Low | High — rules + history reminders |
| 6 | Invoice archive / PM forwarding | Near zero | High — pure grunt work |
| 7 | Trust / review scanning | Medium | High — aggregate recent complaints/praise |
| 8 | Multi-property + PM handoff | Medium | Medium — multi-site context + status briefs |

**Design principle (from research):**  
Agents should own **repetitive, low-cognitive-load grunt work**. Humans keep **high-value gates only**: final booking/payment, unique physical access, non-standard scope.

---

## 4. Concrete query / job patterns (MVP seeds)

These are the shapes real email threads collapse into:

```text
"Find AC maintenance plans for my area in the next 2 weeks under $300 with good recent reviews"
"Compare bi-annual HVAC memberships: what’s included, cancel fee, parts extra, availability next week"
"Book a 3hr priority clean focusing on blinds, windows, under beds, corners — share options with partner before confirm"
"Get tree pruning quotes for live oaks; flag Oak Wilt season constraints and compare recent reviews"
"Remind me when next HVAC tune-up is due; draft rebook with last year’s provider + 2 alternatives"
"After service: archive invoice and draft a forward to the property manager for the other site"
```

---

## 5. MCP / product primitives implied by the archive

Minimum tool surface for home-services beachhead:

| Primitive | Why (from research) |
|-----------|---------------------|
| `search_providers` / discover | Parallel multi-vendor start is the default behavior |
| `get_quote` / `request_quote` | PDF/plan loops dominate HVAC + cleaning |
| `compare_options` | Price, inclusions, terms, reviews, availability in one view |
| `get_availability` | Already partially built (calendar merge) |
| `book_with_brief` | Natural-language scope → structured service brief |
| `get_guidance` | Seasonal/local rules (Oak Wilt, preventive cadence) |
| `share_for_approval` | Partner/family coordination without email forwards |
| `record_service` / archive hooks | Invoices, memberships, next-due tracking |
| Optional: ServiceTitan / FSM webhook layer | Matches how many HVAC ops already run |

---

## 6. Implications for Totbox plan (decisions)

### Beachhead reorder (evidence-backed)
1. **Primary MVP vertical: Recurring home services — HVAC preventive + house cleaning**  
   Highest email volume, clearest multi-turn structure, ServiceTitan-shaped provider ops, strong dual-sided value.
2. **Near-term expansion: Tree / arborist** with seasonal rules engine (Austin-relevant).
3. **Secondary / parallel track: Kids activities & FECs** remain strategically important for “family life” brand but are **not** the strongest email-validated beachhead from this research. Treat as co-roadmap, not Stage-0 default.
4. **Later:** Lawn (hybrid/local network), pest/plumbing if channels appear, multi-property + property-manager workflows.

### What to stop under-specifying
- **Quote + scope briefs** (not just availability booking).
- **Review/trust summaries** before commit (users already do this manually; cancelations happen after bad review research).
- **Household coordination** as a first-class object (not “email forward yourself”).
- **Recurring memberships / preventive cadence**, not one-off jobs only.
- **Post-service admin** (receipts, PM forwards) as an explicit automation layer.
- **Provider systems beyond Google Calendar** — ServiceTitan-class FSM is the HVAC reality (see annex for concrete API mapping).

### Validation metrics suggested by the research
- Emails (or human touchpoints) per completed booking — target collapse from ~6–12 → 1 conversation + 1–2 approvals.
- Time-to-confirmed booking.
- % of jobs with multi-provider comparison before choose.
- Recurring-job reminder → rebook conversion.
- Provider onboarding time (esp. calendar / ST connect).
- Family NPS on “logistics disappeared.”
- (Stage 11+) Referral share rate; provider peer invites; NPS per persona.

### Risks / caveats
- Insights currently drawn from a **small, anonymized design sample** (not a published multi-household study). Strong for product shape; still need 5–10 external household interviews and 10–20 provider interviews.
- Lawn/pest/plumbing low email ≠ low need; may need SMS/voice or local network GTM.
- ServiceTitan access is not fully self-serve (developer portal + integration env); quotes may stay hybrid outside ST.
- Do not ship multi-property PM features in MVP; keep as extension after single-site home services loop works.
- Viral mechanics only work after core touchpoint collapse is real — do not lead with growth hacks.
- **Public repo:** never promote raw research logs or PII into git; see [`README.md`](README.md).

---

## 7. ServiceTitan (updated research pass)

Research now includes a concrete **ServiceTitan V2** exploration for Totbox middleware. Full design: [`servicetitan_integration.md`](servicetitan_integration.md).

**Takeaways for the plan:**
- Prefer **Leads/bookings push + webhooks** first, then jobs/appointments read, then invoice pull.
- Auth model: OAuth2 **client credentials** + App Key + granular scopes (server-to-server).
- MCP wrappers: `create_job_from_brief`, ST-backed `get_availability`, `get_invoice`, webhook subscription (ops).
- Calendar remains the universal fallback; ST deepens HVAC/multi-trade operators who already live there.
- **Quote/membership PDF loops** may remain hybrid — ST is strong on ops, not a complete replacement for compare UX.

---

## 8. Persona-split & viral mechanics (updated research)

### Resident (household)
- Pain: discovery overload, multi-turn scope/price, partner approval, invoices/PM forwards, seasonal rules.
- Totbox+ST win: one chat brief → multi-provider compare → book → webhook status → invoice into records.
- Satisfaction drivers: time saved, better options, low-friction recurring, trustworthy handoff.

### Provider (ST-native small operator)
- Pain: unqualified multi-channel leads, scheduling negotiation, keeping ST as source of truth, retention outreach.
- Totbox+ST win: structured inbound into Leads/jobs; less phone/email; dispatch/billing stay in ST.
- Satisfaction drivers: conversion efficiency, time back for delivery, peer growth via quality leads.

### Shared flywheel (Stage 11+, not MVP-critical)
- Resident: post-job “recommend to a neighbor” with pre-filled share / referral code.
- Provider: dashboard peer invite (“pre-qualified jobs land in my ServiceTitan”).
- Measure: referral source attribution, conversion from shares, NPS per persona.
- Network: Austin HOAs/schools/Nextdoor on consumer side; trade groups on provider side.

---

## 9. Linkage to implementation (feat/expand-scope)

Already built (stages 1–5) that map cleanly:
- Provider registration + MCP endpoint generation
- Google Calendar OAuth + read-first availability merge
- Dashboard, store, verify/capture scaffolding

**Next product stages suggested by this research (not yet fully represented in stage-5):**
- Stage 6: Structured **service briefs + quote comparison** objects; seed HVAC + cleaning providers
- Stage 7: **Trust summaries** (review aggregation stub) + cancel/membership term fields
- Stage 8: **Household sharing / approval gate** primitive
- Stage 9: Recurring plan + next-due reminders + seasonal guidance rules
- Stage **10a**: ServiceTitan design freeze + sandbox checklist + connection model
- Stage **10b**: Prototype ST MCP connector (bookings/jobs + webhook stub)
- Stage **10c**: Pilot 1–2 ST operators; invoice pull for records
- Stage **11**: Dual-sided referral prompts + attribution metrics

---

## 10. Open research follow-ups
- Deeper thread digs on low-friction vs high-friction confirmation flows (what to copy).
- Targeted lawn/tree receipt hunts (attachments, specific vendor names).
- Extract golden-path fixtures for eval harness from anonymized patterns above.
- 5–10 external families + 10–20 Austin HVAC/cleaning operators for triangulation.
- ServiceTitan sandbox access + confirm booking payload fields for HVAC/cleaning briefs.
- Webhook signing/verification and public vs private app path for multi-tenant.

---

*Living research note. Prefer appending new rounds here (anonymized) rather than scattering insights only in chat.*
