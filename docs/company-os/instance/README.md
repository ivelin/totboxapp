# Totbox company OS instance (index)

**This is the living instance**, not the portable template.

| Artifact | Path |
|----------|------|
| Durable state (machine) | [`company/state/company-state.json`](../../../company/state/company-state.json) |
| CLI entry | `npm run company-os -- <cmd>` → [`company/scripts/company-os.ts`](../../../company/scripts/company-os.ts) |
| State machine code | [`src/lib/company-os/`](../../../src/lib/company-os/) |
| Scoreboard (human) | [`scores.md`](scores.md) |
| Thesis snapshot | [`thesis.md`](thesis.md) |
| Orchestration choice | [`ORCHESTRATION.md`](ORCHESTRATION.md) |
| ICP research | [`research/icps/`](../../../research/icps/) |
| Decision traces | [`traces/decisions/`](../../../traces/decisions/) |
| Product surface | [`product/`](../../../product/) (MCP + product scripts; Next `src/` at root) |
| Evals | [`evals/`](../../../evals/) |
| Gap map (legacy) | [`../applied-here.md`](../applied-here.md) |
| Portable template | [`../operating-system.md`](../operating-system.md) · [`../live-runtime.md`](../live-runtime.md) |
| Grok workflows | [`.grok/workflows/company-operating-loop.rhai`](../../../.grok/workflows/company-operating-loop.rhai) (outer) · [`.grok/workflows/user-research.rhai`](../../../.grok/workflows/user-research.rhai) (ICP) · [`.grok/workflows/ready-for-human-eyes.rhai`](../../../.grok/workflows/ready-for-human-eyes.rhai) (ship gate) |
| Ready for human eyes | [`product/READY_FOR_HUMAN_EYES.md`](../../../product/READY_FOR_HUMAN_EYES.md) · portable [`../ready-for-human-eyes.md`](../ready-for-human-eyes.md) |

## Where are we? (commands)

```bash
npm run company-os -- status
# prints journey, loop, posture, gate, Ready for human eyes, last snapshot
npm run company-os -- run-stage --signal "optional product note"
npm run company-os -- continue
npm run company-os -- advance-journey          # REFUSES without --approve
npm run company-os -- advance-journey --approve
npm run company-os -- start
npm run company-os -- set-ready-for-eyes unknown|blocked|green --note "..."
```

**OS v2.8 dogfood (instance):** `readyForHumanEyes` defaults to **unknown** — cold happy path not yet recorded. Do not draft mentor “try this product” asks until **green**. Autonomy posture remains **Strict**. Learning rituals: weekly snapshot + stage 7 after real jobs ([`scores.md`](scores.md)).

### User research (synthetic ICP filter)

```text
/workflow user-research   args: { "mode": "round", "round_label": "1" }
/workflow user-research   args: { "mode": "status" }
# company-operating-loop action=user-research  → handoff card
# continue on loop 1–2 / journey 1–3 blocks until research/icps/READY_FOR_REAL_WORLD.md
```

Founder loop: read `research/icps/ROUND_*_report.md` → edit `FOUNDER_FEEDBACK.md` (`iterate` | `agree_ready` | `kill`) → resume workflow.

### Ready for human eyes (before external product-test asks)

```text
/workflow ready-for-human-eyes   args: { "mode": "status" }
/workflow ready-for-human-eyes   args: { "mode": "check", "url": "https://…", "happy_path": "…" }
/workflow ready-for-human-eyes   args: { "mode": "ask-for-feedback" }  # refuses unless green
```

Evidence marker: `product/READY_FOR_HUMAN_EYES.md`. Portable rules: [`../ready-for-human-eyes.md`](../ready-for-human-eyes.md).

## Layout vs template categories

| Template category | Instance location |
|-------------------|-------------------|
| research/ | `research/icps/` (+ product annex under `docs/research/`) |
| product/ | `product/` (MCP server + product scripts); Next app stays `src/` + `public/` at root |
| evals/ | `evals/` harness + fixtures; design docs in `docs/eval/`; unit tests in `src/lib/**/__tests__` |
| traces/ | `traces/decisions/` |
| growth/ | `growth/` (stub — deferred) |
| support/ | `support/` (stub) |
| infrastructure/ | `infrastructure/` (stub) |
| docs/ (OS) | `docs/company-os/` template + `instance/` |
| company/ | `company/state/` + `company/scripts/` |
