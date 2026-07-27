# Evals

Harnesses, fixtures, and (design) docs for evaluation-driven product quality.

| Path | Role |
|------|------|
| [`run-eval.ts`](run-eval.ts) | Strong eval runner (`npm run test:eval`) |
| [`fixtures/`](fixtures/) | Golden cases (availability, search, compare) |
| Unit tests | `src/lib/**/__tests__` via `npm test` |
| Design | [`../docs/eval/`](../docs/eval/) continuous sim + scenario/trace schemas |
| Job smoke | `npm run smoke:job` → [`../product/scripts/job-smoke.ts`](../product/scripts/job-smoke.ts) |

Company loop scores live under [`../company/state/`](../company/state/) and [`../docs/company-os/instance/scores.md`](../docs/company-os/instance/scores.md).
