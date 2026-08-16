# Company scoreboard (human view)

Machine scores live in `company/state/company-state.json`. Update both when you close a loop cycle.

## Where do we stand? (plain English)

Run anytime: `npm run company-os -- status` — same board in the terminal.

**PARKED 2026-08-16.** Shape A is not a live product-company bet. See [`traces/decisions/2026-08-16-shape-a-parked.md`](../../../traces/decisions/2026-08-16-shape-a-parked.md) and [`reward-risk-2026-08-16.md`](reward-risk-2026-08-16.md).

| Question | Answer right now |
|----------|------------------|
| How far are we on proving the business? | Step **6 of 9** — tiny slice was coded; **do not Advance**. Phase 1 never closed. |
| What are we doing in this week’s learning loop? | Step **7 of 7** — memory write (this park, **not** a real household job) |
| Can we keep going without a founder decision? | **No** — gate is **waiting for founder** |
| How free is the AI? | **Strict** — drafts and dry-runs only; you approve send, money, and big moves |
| Did we do this week’s check-in? | **Yes** — weekly snapshot stamped 2026-08-16 |
| Did we write memory after the last real job? | **Memory written** — park/kill of Shape A. Still **zero** redacted stage-6 household job notes. |
| Ready for human eyes? | **Unknown** — no cold happy path recorded; do not ask mentors to “try the product” until green |

**One-line read:** PARKED 2026-08-16 · Slow clock step 6 (hold) · fast clock step 7 (memory written) · waiting for founder · human-eyes unknown · Phase 1 not passed · status quo is Grok Bot + Booking Agent + calendar.

### Standing deny list (always on — this instance)

- No silent journey advance  
- No live-send / money-time / real-account change without founder OK  
- No synthetic “I would buy” as demand  
- No PII / secrets in public git  
- No fake bot staffing  
- Close stage 7 after meaningful real or heavy synthetic work  
- **No external product-test asks** until Ready for human eyes is **green** (or founder override + decision trace)

## Scores

| Score | Current (approx) | Notes |
|-------|------------------|--------|
| Did the thin path finish in tests? | 0.86 | Engineering only — not “customers love it” |
| Did we write down decisions? | 0.7 | Park gate + reward/risk cards written 2026-08-16 |
| How often do we need a human? | high by design | You approve send / money / time (Strict) |
| Will people pay? | unknown | Needs real-world proof — not shown |
| Is this customer group worth it? | **parked** | Shape A product-company bet killed/held 2026-08-16 |

**Beachhead (founder agree_ready, then parked):** `household-single-decision-maker-recurring` was the test ICP; dual-income only after. **Not a live GTM.**  
**First real job type:** **cleaning** (exception / rebook / rescope — not pure standing-Tuesday autopilot). Never instrumented.  
**Markers:** research `research/icps/READY_FOR_REAL_WORLD.md` · product ship gate `product/READY_FOR_HUMAN_EYES.md` (unknown until cold path).

### Phase 1 pass / kill (founder accepted — plain English)

Test on **fair** single-DM cleaning jobs with residual mess (exception, rebook, new scope, replacement — not “cleaner always comes and nothing to do”).

| # | Question | Pass | Kill / demote |
|---|----------|------|----------------|
| 1 | **Less hassle?** | Clearly fewer human back-and-forths than **Grok Bot + Booking Agent + calendar** | Same or more hassle |
| 2 | **Finished with you in control?** | Booked/done (or clean cancel) **and** you approved before send / money-time | Job dies halfway **or** you must skip safety (“just send without asking”) |
| 3 | **Coordinate your vendors?** | Value from running the job with people **you** chose | Only useful as a city directory / “who’s free” |
| 4 | **Real leftover mess?** | Job needed real coordination (exception/lumpy) | Only works if life is already full autopilot |
| 5 | **Safe?** | No wrong send / private info / money-time without OK | Any serious safety incident |

**Phase 1 business exit:** **not passed / parked** (2026-08-16). No fair household jobs scored. No redacted stage-6 note. Engineering is not demand. Un-park only with a new written `founder_gate`.
