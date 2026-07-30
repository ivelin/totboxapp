# Ready for real-world tests (founder gate)

**Status:** Founder `agree_ready` (2026-07-29 session)  
**Label:** Good enough for **concierge / shadow real tests** — **not** PMF, LOI, or permanent primary-focus lock.

## ICP pick

| Priority | ICP id | Role |
|----------|--------|------|
| **1 — beachhead** | `household-single-decision-maker-recurring` | Full cycle first (shadow jobs → stage-6 feedback → re-rank) |
| **2 — deferred A/B** | `household-dual-income-recurring` | Only after primary cycle complete |

Synthetic source: [ROUND 1-r6](ROUND_1-r6_report.md) (and consistent strong_fit across 1-r2…1-r6).  
AI skeptic `ready_for_real_world` was `true` on 1-r6 for thin shadow plan only.

## What “full cycle” means (primary before dual)

1. Lock Phase 1 pass/fail metrics (touchpoints, completion, gates, directory demand, residual falsifier).  
2. Run instrumented single-DM jobs (HVAC preventive/membership and/or cleaning exception-rebook).  
3. Ingest redacted stage-6 feedback; update scoreboard + decision trace.  
4. Re-rank: keep / kill / demote single-DM beachhead.  
5. **Only then** open dual-income topology A/B real tests if primary still holds.

## Hard constraints

- No vendor directory / marketplace inventory  
- Human approve-before-send; dry-run default  
- Public-safe git only (see root `AGENTS.md`)  
- Do not advance journey phase without founder `--approve`

## Next OS pointer

Company OS: journey ~6 (build), loop stage should move through **validation → real feedback** on this beachhead (see `docs/company-os/applied-here.md` recommended order).  
Runbook: [`docs/local_household_runbook.md`](../../docs/local_household_runbook.md).
