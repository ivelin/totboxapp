# Synthetic prioritization: public permit data benefits

**Status:** SYNTHETIC ONLY — prioritization filter, not PMF  
**Date:** 2026-08-08  
**Method:** Adapted user-research style scorecards + persona dialogues against current strong_fit ICPs only  
**ICPs used:**  
1. `household-single-decision-maker-recurring` (rank #1)  
2. `household-dual-income-recurring` (rank #2 topology A/B)  
**Thesis constraints:** Workflow / job PM only; no directory; Phase 1 house-job exit stays primary  
**Audience:** Solo founder skim — plain English  
**Privacy:** Public-safe composites only

---

## Exec summary

Public permit data is a **real but secondary** lever for Totbox. Highest impact is **context that collapses research and forgotten next-due**, not new discovery surfaces.

**Prioritized shortlist (build research next):**

| Rank | Idea ID | Name | Verdict | Rationale |
|------|---------|------|---------|-----------|
| 1 | P2 | Maintenance intelligence / next-due | strong_fit | Keep — forgotten preventive cadence is core pain; age proxies from permits make reminders concrete |
| 2 | P1 | Address enrichment on job create | strong_fit | Keep — one silent pull into the brief cuts multi-turn “what’s already there?” research |
| 3 | P5 | Unpermitted-work risk flag | weak_fit (later) | Out near-term — safety useful but can scare users and distract from booking completion |
| 4 | P3 | Quote scope validation | weak_fit (later) | Out near-term — helps compare, but quote paste + normalize already covers most value |
| 5 | P4 | Provider professionalism signal | weak_fit | Out — edges toward ranking/directory gravity; private rebook memory is enough for Phase 1 |
| 6 | P6 | Provider-side richer inbound | weak_fit | Out for household-first Phase 1; revisit only after operator revenue path |
| 7 | P7 | Vertical expansion readiness | weak_fit | Out — solar/roofing later; do not dilute HVAC + cleaning beachhead |

**Actionable binary:** research/spike **P2 then P1** only. Everything else stays backlog until Phase 1 exit is proven on shadow jobs.

---

## Method (short)

1. Loaded thesis + strong_fit ICP briefs + home-services email friction map.  
2. Scored each idea P1–P7 on: pain relief, pay-or-act lift, channel fit, reach (Austin data readiness), risk (distraction / overclaim / privacy), time-to-signal.  
3. Synthetic dialogues: single-DM and dual-income personas reacting to each benefit in a typical HVAC-PM or cleaning job.  
4. Adversarial pass: fail closed on anything that pulls product toward directory, property dossier, or pre-Phase-1 scope creep.  
5. Rank: all strong_fit before weak_fit; humanized “Keep — …” / “Out — …” rationales.

Scores are AI judgment composites, not calibrated multi-N proof.

---

## Scorecard table (0–1; risk lower = better)

| ID | pain | pay_or_act | channel_fit | reach (data) | risk | time_to_signal | Composite note |
|----|------|------------|-------------|--------------|------|----------------|----------------|
| P2 | 0.82 | 0.58 | 0.85 | 0.78 | 0.35 | 0.72 | Highest pain fit to recurring forget |
| P1 | 0.74 | 0.55 | 0.88 | 0.82 | 0.32 | 0.80 | Fastest to demo in Austin |
| P5 | 0.48 | 0.40 | 0.70 | 0.75 | 0.68 | 0.55 | Risk of fear > value early |
| P3 | 0.52 | 0.45 | 0.75 | 0.70 | 0.45 | 0.50 | Overlaps quote normalize |
| P4 | 0.45 | 0.42 | 0.60 | 0.65 | 0.72 | 0.40 | Directory gravity |
| P6 | 0.50 | 0.48 | 0.55 | 0.70 | 0.50 | 0.35 | Wrong side of beachhead |
| P7 | 0.35 | 0.30 | 0.50 | 0.60 | 0.55 | 0.25 | Dilutes focus |

---

## Synthetic persona reactions (compressed)

### Single decision-maker (recurring)

- **P2:** “If it told me the AC was last permitted ~6 years ago and due for a check, I’d actually schedule. I forget every spring.” → Keep.  
- **P1:** “Don’t make me dig through old emails for what was done. Just put it in the brief.” → Keep.  
- **P5:** “Interesting, but don’t scare me off booking. I just need the tune-up done.” → Later.  
- **P4:** “I already have the guy I used last time. Ranking strangers feels like Yelp.” → Out.

### Dual-income (partner approve)

- **P2:** Same forgetfulness; partner argument drops if the reminder is factual (“last major work ~2019”). → Keep.  
- **P1:** Brief that already knows house context reduces forward-email loops. → Keep.  
- **P3 / P5:** Partner may over-index on risk flags and stall the job. → Later / careful UX.  
- **P6:** Not their problem; they care about household side first. → Out near-term.

---

## Skeptic / fail-closed notes

- Overclaim risk: permits are imperfect proxies for equipment age (replacements without permits, unincorporated gaps, incomplete history). Always present as “public record suggests…” not hard truth.  
- Privacy: enrichment must be job-scoped and user-initiated; never a public property browser.  
- Distraction risk: building a polished permit explorer before the 8-step house_service_v1 loop is complete would violate bootstrap priority.  
- Data reach: Austin open data is strong; statewide is uneven. Beachhead geography already matches best data coverage.  
- Directory gravity: any “provider score from permits” feature must stay private to the job, not a ranked public list.

---

## Recommended next real research (if founder agrees)

1. **Spike P2 + P1 only** against Austin Issued Construction Permits (mechanical / HVAC-relevant classes). Document available fields and null rates.  
2. Design `enrich_address_context` (or equivalent) as optional MCP input to job brief — dry-run default, human-visible summary, no auto-send.  
3. Shadow test: does a brief that includes “public records show last mechanical permit ~YYYY” reduce touchpoints or increase next-due follow-through vs control?  
4. Kill criteria: if enrichment adds latency or confusion without measured touchpoint drop, park the whole layer.

---

## Linkage

- Backlog ideas: [`public_permit_data_opportunity.md`](public_permit_data_opportunity.md)  
- Strong_fit ICPs: [`../icps/household-single-decision-maker-recurring.md`](../icps/household-single-decision-maker-recurring.md), [`../icps/household-dual-income-recurring.md`](../icps/household-dual-income-recurring.md)  
- Friction evidence: [`home_services_email_insights.md`](home_services_email_insights.md)  
- Thesis: [`../product_thesis.md`](../product_thesis.md)

*SYNTHETIC ONLY. Not PMF. Not a commitment to build.*
