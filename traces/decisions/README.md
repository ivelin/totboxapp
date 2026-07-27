# Decision traces (company OS)

Append-only records from the living company OS: what was done, why, observed, next.

- Written by `npm run company-os` and the state machine (`src/lib/company-os`).
- Individual `*.json` / `trace-index.jsonl` files are **gitignored** (runtime noise).
- Label every trace `synthetic` | `real` | `mixed`.
- **No PII** — see root `AGENTS.md`.

Schema (JSON fields): `id`, `at`, `journeyPhase`, `loopStage`, `decision`, `why`, `observed`, `next`, `label`.
