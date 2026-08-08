# Roadmap research: public-data ideas ranked by impact

**Status:** SYNTHETIC validated · research backlog only  
**Date:** 2026-08-08  
**ICPs:** strong_fit only (single-DM recurring, dual-income recurring)  
**Rule:** Phase 1 house-job exit stays primary. These are future research, not current build.

---

## Impact rank (strong_fit only)

| Rank | ID | Idea | Impact thesis | Depends on | Source notes |
|------|----|------|---------------|------------|--------------|
| **1** | H2 | Preventive envelope + comfort stack | Highest daily-life + HVAC beachhead fit. Year-built + mechanical permits + canopy + PVWatts → ordered comfort moves (seal, shade, tune-up) before full system swap. | Austin permits + TCAD year-built + canopy quadrant + NREL PVWatts | `proactive_public_data_living_standards.md` |
| **2** | P2 | Maintenance intelligence / next-due | Core recurring pain (forgotten preventive). Permit history as equipment-age proxy makes next-due concrete. | Austin Issued Construction Permits (mechanical) | `permit_data_synthetic_prioritization.md` |
| **3** | H1 | Lot capability brief (life-stage) | Highest happiness lift. Residual yard (parcel − footprint − setbacks) + canopy + family stage → 2–4 realistic outdoor options that become jobs. | Footprints + parcel GIS + canopy + optional life-stage tag | `proactive_public_data_living_standards.md` |
| **4** | P1 | Address enrichment on job create | Fastest demo. Silent permit pull into service brief cuts “what was already done?” research. | Austin permit API | `permit_data_synthetic_prioritization.md` |
| **5** | H3 | Yard health / canopy stress signal | Seasonal proactive, low drama. Imagery delta → one sentence + optional arborist path. Feeds tree vertical. | NAIP / Sentinel NDVI or Austin canopy delta | `proactive_public_data_living_standards.md` |
| **6** | H6 | Post-job “one next comfort move” | Packaging, not new product. After HVAC/cleaning complete, offer one H2/H1-derived follow-on. Zero new funnel. | H2 or H1 implemented | `proactive_data_synthetic_prioritization.md` |
| **7** | H4 | Affordable happiness project ranker | Highest mission upside (joy projects). Needs clean life-stage input + H1 geometry quality first. | H1 data quality + life-stage tags | `proactive_data_synthetic_prioritization.md` |

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
| — | Provider matching from imagery | Directory. Kill |
| — | Background yard surveillance | Consent. Kill |
| — | Invented price quotes | Honesty. Kill |

---

## Research sequence (if founder green-lights spikes)

1. **H2 + P2** (share permit + year-built spine)  
2. **P1** (same spine, job-create path)  
3. **H1** (footprint residual + canopy)  
4. **H3** (imagery delta language)  
5. **H6** as packaging on top of H2/H1  
6. **H4** only after H1 quality + life-stage tags exist  

Kill criteria: enrichment adds latency/confusion without measured touchpoint or next-due lift on shadow jobs.

---

## Non-negotiables

- Workflow / job PM only. Rank projects, never providers.  
- User-initiated or explicit opt-in. No cold property monitoring.  
- Language: “public records / imagery suggest…”  
- Prices: permit-valuation bands or “get quotes” — never invented.  
- Austin-first public layers; expand only when the same stack exists.

---

## Source artifacts

- `public_permit_data_opportunity.md`  
- `permit_data_synthetic_prioritization.md`  
- `proactive_public_data_living_standards.md`  
- `proactive_data_synthetic_prioritization.md`  
- Decision traces: `2026-08-08-public-permit-data-research.md`, `2026-08-08-proactive-public-data-living-standards.md`

*SYNTHETIC ONLY. Not PMF. Not a build commitment.*
