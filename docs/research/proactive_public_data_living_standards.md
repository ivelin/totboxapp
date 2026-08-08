# Proactive living-standards from public geospatial + permit data

**Status:** Research backlog — high-impact only  
**Date:** 2026-08-08  
**Label:** SYNTHETIC + public-data research  
**Companion:** [`public_permit_data_opportunity.md`](public_permit_data_opportunity.md), [`permit_data_synthetic_prioritization.md`](permit_data_synthetic_prioritization.md)  
**Privacy:** Public-safe. No real addresses, household PII, or named private vendors.

---

## Mission fit

Totbox: *Disappear the logistics of family life.*  
Extension in scope: not only collapse chore friction, but surface **affordable, realistic improvements that raise daily comfort and happiness** — then turn “yes” into a managed job.

Hard constraints (non-negotiable):
- Workflow / job PM only. **Not** a vendor directory or marketplace ranking.
- User-initiated or explicit opt-in proactive. Never cold-spam.
- Affordability grounded in local public signals (permit valuations, lot residual, typical scopes) — never invented prices.
- Phase 1 house-job exit stays primary. These ideas are research layers, not new beachhead.

---

## Public data that actually works (Austin / Travis first)

| Layer | Source | Resolution / form | What it enables |
|-------|--------|-------------------|-----------------|
| Building permits | City of Austin open data (Socrata) + county portals | Address/parcel, type, valuation, date | Equipment age proxies, past scopes, unpermitted risk |
| Parcel + appraisal characteristics | TCAD public search + Travis/Austin GIS FeatureServers | Lot size, year built, building area, land use | Residual yard, age of structure, value band |
| Building footprints (multi-year) | Austin open data planimetrics | Polygon per structure | Usable yard = parcel − footprint − setbacks |
| Tree canopy 2022 | Austin open data (Maxar + NAIP derived) | Citywide canopy layer | Shade, comfort, arborist need, play-space quality |
| Impervious cover | Austin open data | Parcel-level | Drainage, heat, plantable area |
| NAIP aerial | USDA / USGS / Earth Engine | ~60 cm orthophoto, multi-year | Yard layout, structures, vegetation change (visual) |
| Sentinel-2 NDVI | ESA / GEE / Sentinel Hub | 10 m, ~5-day revisit | Vegetation stress over seasons |
| Solar potential | NREL PVWatts API (free key) | Lat/lon → kWh estimates | Roof/yard solar economics without a sales pitch |
| Flood / climate risk | FEMA NFIP + public First Street-style layers | Parcel/zone | Passive comfort and resilience ideas |
| Zoning / setbacks | Austin municipal GIS | District rules | What is actually buildable without a variance war |

Street View / commercial oblique imagery: useful for humans, weak for bulk product (ToS + cost). Prefer government layers above.

---

## High-impact ideas only

### H1 — Lot capability brief (life-stage aware)

**What:** On user request (“what could we do with the back yard?”) or after a completed home-service job, compute residual usable yard from parcel − footprint − typical setbacks, overlay tree canopy %, check recent structure permits, and combine with user-stated family stage (kids ages if offered).

**Output:** 2–4 ranked, affordable options with plain-English feasibility (e.g. shade structure, play set zone, raised beds, small gazebo). Each option includes: why it fits *this* lot, rough permit friction, and a one-click path to a Totbox job brief when they say yes.

**Why high impact:** Turns abstract “home improvement” into a concrete, lot-true shortlist. Happiness projects (play space, outdoor living) become schedulable chores the agent can finish.

**Thesis fit:** Discovery of *what is possible* is data; discovery of *who installs it* stays external. Totbox owns the brief → quote → approve → schedule loop.

---

### H2 — Preventive envelope + comfort stack

**What:** Fuse year built, last mechanical permits, tree canopy on heat-facing sides, and PVWatts solar resource into a “comfort stack” recommendation: insulation, shade, attic air sealing, window film, or HVAC tune-up — ordered by likely payback and disruption, not by contractor upsell.

**Output:** “Your house was built ~19XX; last major mechanical permit ~YYYY. South/west canopy is thin. Typical next step that improves summer comfort without a full system swap: …”

**Why high impact:** Families feel heat and bills every day. This is preventive + living-standards in one move, and it feeds the existing HVAC beachhead.

---

### H3 — Yard health / canopy stress signal

**What:** Compare recent NAIP or Sentinel NDVI / canopy layer vs prior year for the parcel neighborhood. If vegetation stress rose, surface a single plain sentence + optional arborist or irrigation job path.

**Output:** “Public imagery suggests more stress on trees/lawn this season vs last. Worth a check before peak heat.”

**Why high impact:** Proactive, seasonal, low false-positive if worded as “suggests.” Directly feeds tree/arborist expansion already on the roadmap.

---

### H4 — Affordable happiness project ranker

**What:** A small library of family-happiness projects (play structure, shade sail, outdoor seating pad, rain garden, raised beds, small pavilion) scored per parcel on:
1. Residual yard geometry  
2. Canopy / shade  
3. Zoning/setback friction  
4. Local permit valuation bands for similar work  
5. User life-stage tags (kids, aging-in-place, pets)

**Output:** Ranked 1–3 ideas with “why this one first” and estimated effort band. Never a product catalog. Never a price quote from Totbox.

**Why high impact:** This is the creative leap beyond chore reduction. Same coordination engine; different job intent (joy instead of repair).

---

### H5 — Climate passive comfort pack

**What:** Flood zone + heat exposure + canopy + impervious cover → 1–2 passive ideas (shade, permeable path, rain garden, reflective coating) that improve daily comfort and resilience without large CapEx.

**Why high impact:** Climate anxiety is real; cheap passive moves often beat equipment. Keeps Totbox on the side of the household, not the upsell.

---

## Explicit rejects (not high impact for now)

- Public “property score” or neighborhood ranking product  
- Automated contractor matching from imagery (directory gravity)  
- Bulk Street View scraping  
- Speculative ADU / major addition sales funnels  
- Anything that requires continuous background surveillance of a home without consent  

---

## Build posture

1. All enrichment is **job-scoped or explicit user ask**.  
2. Language is probabilistic (“public records / imagery suggest…”).  
3. Prices never invented; use “typical permit valuations in this metro for similar scopes” or “ask for quotes.”  
4. Austin layers first; other metros only when the same public stack exists.  
5. Ship only after Phase 1 house-job metrics move.

---

*Append-only. Prefer new dated sections over silent rewrites.*
