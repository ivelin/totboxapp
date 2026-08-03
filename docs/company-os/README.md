# Company Operating System for Solo Founders

**This folder is intentionally isolated from Totbox product docs.**

It is a **living mentorship blueprint**: best practices and lessons for solo founders in bootstrapping mode (Founder Institute, SCORE, and similar). Totbox is one **application** of the system — not the definition of the system.

| File | What it is |
|------|------------|
| [`operating-system.md`](operating-system.md) | **Blueprint** — principles, journey phases, evidence labels, next pack (sandbox + interest tests), reward/risk, virtual office |
| [`live-runtime.md`](live-runtime.md) | **Live OS shape** — state + 7-stage loop, next pack in stage 2, eval harness; optional frameworks |
| [`ai-instructions.md`](ai-instructions.md) | Thin enforcement layer — copy-paste for your main AI tool (`AGENTS.md` / rules / system prompt) |
| [`applied-here.md`](applied-here.md) | **Instance only** — Totbox hypothesis, architecture, gap analysis (not the template) |
| [`instance/`](instance/) | **Living Totbox instance index** — state pointer, scores, orchestration, thesis snapshot |
| CLI | `npm run company-os -- status` — durable state machine entry (`company/scripts/`) |
| Workflow | `.grok/workflows/company-operating-loop.rhai` — outer loop (status/continue/start/user-research handoff) |
| User research | `.grok/workflows/user-research.rhai` — multi-round synthetic ICP filter + founder gates → `research/icps/` |
| Repo layout | Template categories at root: `company/`, `research/`, `product/`, `evals/`, `traces/`, `growth/`, `support/`, `infrastructure/`, `docs/` |

---

## Mental model (two minutes)

```text
BLUEPRINT (how to decide)          LIVE RUNTIME (how to learn every week)
operating-system.md                live-runtime.md
  journey phases 1–9                 persistent state (personas, traces, scores…)
  founder gates + honest evidence    stages 1→7 loop → memory → back to 1
  reward/risk + virtual office       optional: agent frameworks or scripts
```

---

## Template change policy (standing rule)

As **this product repo (Totbox)** evolves, useful patterns may emerge. Treat promotion into the **Company OS template** as rare, deliberate work — not a continuous sync from product PRs.

| Layer | Default when Totbox changes |
|-------|-----------------------------|
| **Instance** — `applied-here.md`, product docs under `docs/`, app code | Update as the product learns (public-safe; no PII) |
| **Template** — `operating-system.md`, `live-runtime.md`, `ai-instructions.md`, this README | **Do not change** unless the founder **explicitly approves** a template edit |

### When extraction is allowed

1. **Slow** — Prefer many product iterations before one template change.  
2. **Methodical** — Name the pattern, why it is domain-agnostic, and how mentees might misuse it.  
3. **Thoughtful** — Prefer principle + checklist over markets, stacks, or workflows unique to one product.  
4. **Approval-gated** — Propose a short template delta (what / why / where); wait for explicit approval.  
5. **Instance-first** — Keep Totbox-specific application in `applied-here.md` (or product docs) even when a portable principle is approved.

### Anti-patterns

- Auto-promoting every product win into the OS  
- Copying MCP, a beachhead market, or pricing into the blueprint “because we use them”  
- Silent template edits inside product PRs without template approval  

**Agents:** Default to instance docs for Totbox work. Do not edit the template files above without founder approval for that change.

---

## For mentees

1. Read [`operating-system.md`](operating-system.md), then [`live-runtime.md`](live-runtime.md).  
2. Optionally skim [`applied-here.md`](applied-here.md) to see one real project’s **gap analysis**.  
3. Put [`ai-instructions.md`](ai-instructions.md) into Cursor / Claude / Grok / root `AGENTS.md` / etc.  
4. **Do not** copy Totbox’s product thesis, customer group, or stack as your product. Copy the *method*.  
5. Start with markdown state + a weekly loop before adopting agent frameworks.

---

## For AI agents pointed at this repo

When a founder says: *“Take the Company OS from this repo and apply what’s useful to my startup”*:

1. Prefer **`operating-system.md` + `live-runtime.md`** over Totbox product files.  
2. Use **`applied-here.md` only as an illustration** of discipline and gap analysis — never as the mentee’s default market or feature list.  
3. Product files under `docs/strategy/`, `docs/workflows/`, root `README.md`, etc. are **one company’s product runtime**, not universal advice.  
4. Instantiate **their** thesis, customer groups, state stores, journey phase, loop stage, and tiny slice.  
5. Recommend frameworks (LangGraph, CrewAI, …) only when they reduce pain vs git + scripts.  
6. Respect public-repo privacy norms if contributing here (`AGENTS.md`); mentees’ private customer data belongs in *their* private stores.  
7. Respect the **Template change policy** above when editing this folder.

---

## Versioning

| Doc | Current |
|-----|---------|
| Operating system blueprint | **v2.7** |
| Live runtime | **v2.7** (growth pack after proof; next pack in stage 2; postures / deny list / learning rituals) |

### Recent template additions (portable only)

**v2.7 — growth pack (after proof)**

- Entry criteria before growth machinery; message/offer + single-channel tracks  
- Outcomes over vanity; audience quality before AI personalization  
- Founder gate: iterate / promote channel / kill channel / hold scale  
- Method in [`operating-system.md`](operating-system.md#after-proof-the-growth-pack) — not tooling folklore  

**v2.6 — control hygiene (borrowed patterns, solo-shaped)**

- Autonomy postures: Strict / Auto / Dangerous (default Strict)  
- Standing deny list (always on, every posture)  
- Learning rituals: weekly control-plane snapshot, stage 7 write-back, scoreboard glance, coordination-tax check  

**v2.5 — next pack after synthetic ranking**

- Track A: light isolated synthetic product sandbox (feasibility; path-role sample; not demand)  
- Track B: real interest tests (waitlist, organic, social, in-person, capped paid, direct)  
- Parallel or sequential; founder gate before heavy build  

**v2.4 — research and ops hygiene**

- Four claim labels; staged trust reveal; market supports vs does not establish  
- Optional “what to say” on scorecards; virtual office cards  

Improve the OS when principles get clearer — not when Totbox ships a feature. Template edits require founder approval (see policy above).

---

*Principles travel. Product details stay in Totbox docs.*
