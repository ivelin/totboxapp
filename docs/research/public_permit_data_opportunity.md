# Public building-permit data opportunity (backlog)

**Status:** Research backlog — not committed roadmap  
**Date logged:** 2026-08-08  
**Label:** SYNTHETIC + public-data research only  
**Related:** [`home_services_email_insights.md`](home_services_email_insights.md) · product thesis · strong_fit ICPs (single-DM + dual-income)  
**Privacy:** Public-safe. No real addresses, household PII, or named private vendors.

---

## Why this exists

Building permits and related construction records are **public** under the Texas Public Information Act (and open-records laws in all 50 states). In Austin city limits they are also available via free open-data APIs (Socrata / data.austintexas.gov). Unincorporated Travis County and many other Texas jurisdictions expose the same class of records via portals or formal requests.

Totbox thesis remains unchanged: **scheduling + coordination workflow, not vendor directory**. Permit data is a free **context layer** that can enrich job briefs, next-due logic, and trust signals — not a discovery product.

---

## Candidate product ideas (backlog)

| ID | Idea | Brief description | Primary thesis fit |
|----|------|-------------------|--------------------|
| P1 | Address enrichment on job create | When a household starts a job ("Book AC maintenance"), silently pull recent relevant permits at the address and fold age / scope proxies into the service brief | Structure the job |
| P2 | Maintenance intelligence / next-due | Infer approximate equipment age or last major work from permit history; surface proactive preventive reminders before systems fail | Recurring / seasonal |
| P3 | Quote scope validation | Cross-check a contractor’s proposed scope against what is typically permitted for that work type in the metro | Compare quotes in hand |
| P4 | Provider professionalism signal | Prefer (or surface) contractors with a public track record of pulling permits for similar work — private rebook memory + public pattern, not a ranking marketplace | Trust / records |
| P5 | Unpermitted-work risk flag | Optional caution when past work at the address appears unpermitted or when a quote implies work that usually requires a permit | Safety / records |
| P6 | Provider-side richer inbound | Small operators receive structured inbound briefs that already include permit context (reduces their admin when quoting) | Provider back-office relief |
| P7 | Vertical expansion readiness | Same data layer later supports solar, roofing, additions, pools — after HVAC + cleaning loop is solid | Future cadence |

---

## Data facts (public)

- **Austin city limits:** Free Socrata SODA API + open-data downloads (Issued Construction Permits and related sets). Daily refresh common.
- **Unincorporated Travis County:** Public portals (pre-2014 search + MyGovernmentOnline / MGO Connect). Free customer account may be needed; less clean bulk API than Austin.
- **Texas statewide:** Legally public under TPIA; practical access quality varies by city/county. No single statewide permit database.
- **US-wide:** Public in all 50 states under open-records laws; major cities often have free portals/APIs; smaller jurisdictions often require formal requests.
- **Cost:** Official access is free (or low copy fees). Third-party enrichment APIs are optional paid layers.

---

## Explicit non-goals

- Do **not** turn this into a public vendor directory or SEO “best HVAC near me” product.
- Do **not** store or display precise private household addresses in shared product surfaces beyond what the user already supplied for the job.
- Do **not** let permit enrichment block Phase 1 house-job exit (intent → brief → approve → confirm → next-due).
- Do **not** require providers to create Totbox accounts to appear in any signal.

---

## Next research steps (ordered)

1. Synthetic prioritization of P1–P7 against strong_fit ICPs (see companion note).
2. Spike Austin open-data API fields relevant to HVAC / mechanical / plumbing / building permits (public schema only).
3. Design privacy boundary: address used only for enrichment on user-initiated jobs; never published as a public property dossier.
4. If high-priority ideas survive, define a minimal MCP primitive (e.g. `enrich_address_context`) behind a feature flag for shadow tests.

---

*Append-only living note. Prefer new dated sections over silent rewrites.*
