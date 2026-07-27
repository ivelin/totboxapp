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

`.grok/workflows/company-operating-loop.rhai`:

| `args.action` | Behavior |
|---------------|----------|
| `status` | Agent reads instance state + prints where we are |
| `continue` | Agent runs CLI continue / stage work; `await_user` if journey gate |
| `start` | Start or restart live loop at stage 1 |

Founder gates use `await_user` — not silent journey advance.
