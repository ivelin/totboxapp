# Decision trace: public permit data research

- **id:** 2026-08-08-public-permit-data-research
- **at:** 2026-08-08
- **label:** synthetic
- **journeyPhase / loopStage:** research backlog (not Phase 1 product lock)
- **decision:** Log public building-permit data as a free context layer for Totbox; run synthetic prioritization against strong_fit ICPs; prioritize only P2 (maintenance intelligence / next-due) and P1 (address enrichment on job create) for future research spikes. All other ideas (quote validation, provider signals, unpermitted flags, provider-side, vertical expansion) stay weak_fit / later.
- **why:** Austin open data is free and high-quality; aligns with recurring forget + brief-structure pain from email research; does not require directory product; must not distract from Phase 1 house-job exit.
- **observed:** Synthetic scorecards + persona dialogues (single-DM + dual-income) ranked P2 then P1 highest on pain and time-to-signal; directory-adjacent ideas (P4) and provider-first (P6) failed adversarial pass.
- **next:** Optional Austin API field spike for mechanical/HVAC-relevant permit classes; design optional `enrich_address_context` behind dry-run; kill if no measured touchpoint/next-due lift on shadow jobs.
- **artifacts:** `docs/research/public_permit_data_opportunity.md`, `docs/research/permit_data_synthetic_prioritization.md`, index update in `docs/research/README.md`
