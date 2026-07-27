# Research / ICPs (instance)

Candidate customer groups and evidence notes for the Totbox company OS instance.

**Latest synthetic round:** [**ROUND 1-r2**](ROUND_1-r2_report.md) — `SYNTHETIC ONLY`; AI `ready_for_real_world=false`; ranking_sound=`false` (single-DM recommended #1 over dual retention); all `promote_lean=hold`.  
**Prior round:** [ROUND 1](ROUND_1_report.md) (founder `iterate` → new challenger slate).  
**Founder gate:** [`FOUNDER_FEEDBACK.md`](FOUNDER_FEEDBACK.md) (pending decision).  
**Do not create** `READY_FOR_REAL_WORLD.md` until founder `agree_ready` after conditions in the round report.

## Round 1-r2 recommended rank order (synthetic filter)

| Rank | ICP | Verdict | Brief |
|------|-----|---------|-------|
| 1 | Single decision-maker (recurring home-service PM) | strong_fit | [`household-single-decision-maker-recurring.md`](household-single-decision-maker-recurring.md) |
| 2 | Busy dual-income (HVAC + cleaning chore PM) | strong_fit | [`household-dual-income-recurring.md`](household-dual-income-recurring.md) |
| 3 | New-homeowner / move-in concurrent job burst | weak_fit | [`household-new-homeowner-move-in-burst.md`](household-new-homeowner-move-in-burst.md) |
| 4 | Small landlord / tenant-split coordinator | weak_fit | (see ROUND_1-r2 report) |
| 5 | Reactive emergency HVAC repair | weak_fit | (see ROUND_1-r2 report) |

**Primary real-test recommendation:** single-DM primary shadow + dual-income topology A/B — **not** promoted primary focus / not PMF / not all five.  
**AI ready_for_real_world:** `false` (fail-closed).

## Round 1 rank order (historical)

| Rank | ICP | Verdict | Brief |
|------|-----|---------|-------|
| 1 | Busy dual-income (HVAC + cleaning chore PM) | strong_fit | [`household-dual-income-recurring.md`](household-dual-income-recurring.md) |
| 2 | Remote / multi-site coordinator | weak_fit | [`remote-care-or-multi-site-coordinator.md`](remote-care-or-multi-site-coordinator.md) |
| 3 | Seasonal tree / arborist | weak_fit | [`household-seasonal-tree-arborist.md`](household-seasonal-tree-arborist.md) |
| 4 | Operator Agentic Ready inbound (PAYER) | weak_fit | (see ROUND_1 report) |
| 5 | SMS/phone-native grounds (lawn / pest) | weak_fit | (see ROUND_1 report) |

## Artifact index

| Artifact | Notes |
|----------|--------|
| [`ROUND_1-r2_report.md`](ROUND_1-r2_report.md) | **Latest** full report (exec summary, scores, skeptic, next real tests) |
| [`ROUND_1_report.md`](ROUND_1_report.md) | Round 1 full report (historical) |
| [`FOUNDER_FEEDBACK.md`](FOUNDER_FEEDBACK.md) | Founder decision gate (`iterate` \| `agree_ready` \| `kill`) |
| [`household-single-decision-maker-recurring.md`](household-single-decision-maker-recurring.md) | Round 1-r2 rank #1 ICP brief |
| [`household-dual-income-recurring.md`](household-dual-income-recurring.md) | Round 1-r2 rank #2 (retained strong_fit) |
| [`household-new-homeowner-move-in-burst.md`](household-new-homeowner-move-in-burst.md) | Round 1-r2 rank #3 ICP brief |
| [`remote-care-or-multi-site-coordinator.md`](remote-care-or-multi-site-coordinator.md) | Round 1 rank #2 (not re-tested in 1-r2) |
| [`household-seasonal-tree-arborist.md`](household-seasonal-tree-arborist.md) | Round 1 rank #3 (not re-tested in 1-r2) |
| [`household-home-services.md`](household-home-services.md) | Prior beachhead hypothesis (public-safe; still hypothesis) |
| `READY_FOR_REAL_WORLD.md` | Written only when founder agrees ICPs are high quality enough for real tests |

## Workflow

Use project workflow **`user-research`** (`.grok/workflows/user-research.rhai`):

1. Best-guess **5 ICPs** (agent + deterministic seed fallback)  
2. Reward/risk scorecards + synthetic dialogues (Company OS blueprint)  
3. Adversarial challenge (fail-closed)  
4. Report → founder feedback → iterate until `agree_ready` or `kill`  

Outer loop **`company-operating-loop`** hands off here when loop stage is 1–2 or journey phase is 1–3 (unless ready marker exists).

Promote to “primary focus” only with synthetic **and** real-world evidence + reward/risk scorecard (see company OS template).  
`agree_ready` means “good enough to run concierge/shadow real tests” — **not** PMF.

## Public safety

No PII in this tree (see root `AGENTS.md`). Composites and metro-level language only.
