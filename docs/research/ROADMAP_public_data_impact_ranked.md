# Roadmap research: public-data + host-side ideas ranked by impact

**Status:** SYNTHETIC validated · research backlog only  
**Updated:** 2026-08-08 (audit pass: high-signal only + H7)  
**ICPs:** strong_fit only (single-DM recurring, dual-income recurring)  
**Rule:** Phase 1 house-job exit stays primary. These are future research, not current build.  
**Role of this file:** Ranking overlay only. Does **not** supersede source notes listed at the bottom.

---

## Impact rank (high-signal keep)

| Rank | ID | Idea | Impact thesis | Depends on | Source notes |
|------|----|------|---------------|------------|--------------|
| **1** | H2 | Preventive envelope + comfort stack | Highest daily-life + HVAC beachhead fit. Year-built + mechanical permits + canopy + PVWatts → ordered comfort moves before full system swap. | Austin permits + TCAD year-built + canopy + NREL PVWatts | `proactive_public_data_living_standards.md` |
| **2** | P2 | Maintenance intelligence / next-due | Core recurring pain (forgotten preventive). Permit history as equipment-age proxy makes next-due concrete. | Austin Issued Construction Permits (mechanical) | `permit_data_synthetic_prioritization.md` |
| **3** | H1 | Lot capability brief (life-stage) | Highest happiness lift. Residual yard + canopy + family stage → 2–4 realistic outdoor options that become jobs. | Footprints + parcel GIS + canopy + optional life-stage | `proactive_public_data_living_standards.md` |
| **4** | P1 | Address enrichment on job create | Fastest demo. Silent permit pull into service brief cuts “what was already done?” research. | Austin permit API | `permit_data_synthetic_prioritization.md` |
| **5** | H3 | Yard health / canopy stress signal | Seasonal proactive, low drama. Imagery delta → one sentence + optional arborist path. | NAIP / Sentinel NDVI or Austin canopy delta | `proactive_public_data_living_standards.md` |
| **6** | H6 | Post-job “one next comfort move” | Packaging only. After HVAC/cleaning complete, one optional H2/H1-derived follow-on. Zero new funnel. | H2 or H1 | `proactive_data_synthetic_prioritization.md` |

---

## Deferred high-signal (correct architecture, wrong Phase 1 timing)

| ID | Idea | Why deferred | Source |
|----|------|--------------|--------|
| H7 | Host-side expectation calibration (provider-approved concept viz) | Host creates concept “after”; butler relays photo + min scope/budget/time; provider Accept / changes / Reject. Calibrates visual jobs only. **Not** for HVAC/cleaning default path. | `host_expectation_calibration_synthetic.md` |
| H4 | Affordable happiness project ranker | Highest mission upside; needs H1 geometry quality + clean life-stage tags first. | `proactive_data_synthetic_prioritization.md` |

**H7 non-negotiables if ever piloted:** host owns pixels; Totbox stays thin relay; text quote primary for money/time; concept labeling mandatory; skippable; visual-outcome services only.

---

## Explicitly out (weak_fit / rejected)

| ID | Idea | Why out |
|----|------|--------|
| P3 | Quote scope validation | Overlaps quote normalize; later |
| P4 | Provider professionalism signal | Directory gravity |
| P5 | Unpermitted-work risk flag | Fear can stall booking; later careful UX |
| P6 | Provider-side richer inbound | Wrong side of household-first Phase 1 |
| P7 | Vertical expansion readiness | Dilutes HVAC + cleaning beachhead |
| H5 | Climate passive comfort pack | Overlaps H2 |
| — | Totbox-owned rendering / style product | Scope trap; host does multimodal |
| — | Default viz on every job | Friction without value on non-visual work |
| — | Provider matching from imagery | Directory. Kill |
| — | Background yard surveillance | Consent. Kill |
| — | Invented price quotes | Honesty. Kill |

---

## Research sequence (if founder green-lights spikes)

1. **H2 + P2** (shared permit + year-built spine)  
2. **P1** (same spine, job-create path)  
3. **H1** (footprint residual + canopy)  
4. **H3** (imagery delta language)  
5. **H6** as packaging on H2/H1  
6. **H4** only after H1 quality + life-stage tags  
7. **H7** only after Phase 1 metrics and on a visual vertical pilot  

Kill criteria: enrichment or extra rounds add latency/confusion without measured touchpoint, next-due, or dual-approve lift on shadow jobs.

---

## Non-negotiables

- Workflow / job PM only. Rank projects, never providers.  
- User-initiated or explicit opt-in. No cold property monitoring.  
- Language: “public records / imagery suggest…” / “AI concept, not completed work.”  
- Prices: permit-valuation bands or provider quotes — never invented.  
- Austin-first public layers; expand only when the same stack exists.  
- Host multimodal capability is allowed; Totbox does not own a design product.

---

## Source artifacts (unchanged detail)

- `public_permit_data_opportunity.md`  
- `permit_data_synthetic_prioritization.md`  
- `proactive_public_data_living_standards.md`  
- `proactive_data_synthetic_prioritization.md`  
- `host_expectation_calibration_synthetic.md`  
- Decision traces under `traces/decisions/`

*SYNTHETIC ONLY. Not PMF. Not a build commitment.*
