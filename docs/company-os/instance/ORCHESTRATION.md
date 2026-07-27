# Orchestration choice (Totbox company OS v1)

## Decision

**Pure TypeScript state machine + stage runner** in `src/lib/company-os/`, file-backed JSON state, CLI entry.

Not LangGraph / CrewAI for this first living slice.

## Why

| Criterion | TS machine | Heavy graph framework |
|-----------|------------|------------------------|
| Durable state + HITL gates | Yes (`company/state/*.json`, founder approval on journey) | Yes, more glue |
| Fits monorepo / vitest / Node 22 | Native | Python sidecar or extra deps |
| “Honest markdown/JSON beats empty cathedral” | Matches template | Risk of cathedral |
| Multi-step stage agents later | Adapter can call graphs later | Premature |

Template allows LangGraph/CrewAI as optional implementors. Upgrade when multi-actor continuous sim (Level 2+) needs durable graphs — see `docs/eval/continuous_sim_eval.md`.

## How it runs

1. **Load** `company/state/company-state.json`  
2. **Transition** via pure functions (`startLoop`, `continueLoopStage`, `advanceJourneyPhase`, `orchestrateCurrentStage`)  
3. **Commit** state + decision trace under `traces/decisions/`  
4. **Never** auto-advance journey without `explicitApproval`  

## Grok workflow mapping

### Outer loop — `.grok/workflows/company-operating-loop.rhai`

| `args.action` | Behavior |
|---------------|----------|
| `status` | Agent reads instance state + prints where we are; flags research stages |
| `continue` | If loop stage 1–2 or journey 1–3 and no `research/icps/READY_FOR_REAL_WORLD.md`, **blocks** with handoff to `user-research` (override: `skip_research_handoff=true`) |
| `user-research` | Explicit handoff card → run sibling `user-research` workflow |
| `start` | Start or restart live loop at stage 1 |
| `advance-journey` | Founder-gated journey advance only |

### User research — `.grok/workflows/user-research.rhai`

Implements Company OS synthetic research + reward/risk ranking (filter, not PMF proof):

1. Load thesis / OS blueprint / prior ICPs / founder notes  
2. Propose **exactly 5** ICP candidates (seed slate fallback if agent incomplete)  
3. Parallel reward/risk scorecards  
4. Parallel synthetic dialogues (3 scenarios per ICP) + `verdict_key_factors`  
5. Adversarial skeptic (fail-closed on `ready_for_real_world_ai`)  
6. Write `research/icps/ROUND_*_report.md` (verdict table includes **Key factors** column) + `FOUNDER_FEEDBACK.md`  
7. **`await_user`** — founder sets `decision: iterate | agree_ready | kill`  
8. Iterate rounds until `agree_ready` (writes `READY_FOR_REAL_WORLD.md`) or `kill`  

Workflows cannot nest: outer loop **hands off**; founder runs `user-research` then resumes continue.

Founder gates use `await_user` — not silent journey advance or silent ICP promotion.
