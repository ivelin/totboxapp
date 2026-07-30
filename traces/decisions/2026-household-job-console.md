# Decision: Household job console UI (Phase 1)

**Date:** 2026-07-30  
**Context:** Phase 1 shadow PMF open; Job PM + MCP complete; no browser path to exercise the same tools without chat host.

**Decision:** Ship `/jobs` household console + `/api/jobs` REST mirror of MCP job tools, sharing `dispatchMcpTool` / `job-pm`. Landing page copy aligned to home-services beachhead (not kids/FEC primary).

**Why:** Lowers friction for founder dry-runs and demos; keeps one PM spine (console ≡ chat MCP). Safety gates unchanged (dry-run default, dual approvals).

**Non-goals:** Live email/SMS send, provider directory, operator billing.

**Evidence:** `npm test`, `npm run smoke:job`, HTTP full-path API smoke, `npm run build` green.

**Follow-up:** Real house cleaning jobs + redacted stage-6 notes; do not expand build scope until Phase 1 pass/kill signals exist.
