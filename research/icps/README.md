# Research / ICPs (instance)

Candidate customer groups and evidence notes for the Totbox company OS instance.

| Artifact | Notes |
|----------|--------|
| [`household-home-services.md`](household-home-services.md) | Prior beachhead hypothesis (public-safe) |
| `ROUND_*_report.md` | Synthetic research round reports (from `user-research` workflow) |
| `FOUNDER_FEEDBACK.md` | Founder decision gate (`iterate` \| `agree_ready` \| `kill`) |
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
