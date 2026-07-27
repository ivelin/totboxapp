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
| Grok workflow | [`.grok/workflows/company-operating-loop.rhai`](../../../.grok/workflows/company-operating-loop.rhai) |

## Where are we? (commands)

```bash
npm run company-os -- status
npm run company-os -- run-stage --signal "optional product note"
npm run company-os -- continue
npm run company-os -- advance-journey          # REFUSES without --approve
npm run company-os -- advance-journey --approve
npm run company-os -- start
```

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
