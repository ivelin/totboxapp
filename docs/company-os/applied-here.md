# Application example: Totbox (this repository)

**Status:** Illustration only — not part of the portable operating system.  
**Read first:** [`operating-system.md`](operating-system.md) · [`live-runtime.md`](live-runtime.md)  
**Product source of truth for Totbox:** root [`README.md`](../../README.md) and [`docs/strategy/bootstrap_pmf_and_agentic_gap.md`](../strategy/bootstrap_pmf_and_agentic_gap.md)

Mentees: **do not adopt Totbox’s market or features by default.** Steal the discipline, not the beachhead.

---

## Journey phase (bootstrap) — where Totbox is

| OS simple # | Formal alias | Totbox status (honest) |
|-------------|--------------|-------------------------|
| 1–2 | Ideation / Vision–ICP | Working hypothesis: household home-service job PM (HVAC + cleaning beachhead) |
| 3–4 | Discovery / monetization validation | Synthetic filter historical; **real Phase 1 proof still open** |
| 5 | Architecture & agentic design | Host LLM + MCP job PM + safety gates; channels email/SMS/form first |
| 6 | Build (EDD) | Job PM largely coded; harness Level ~1 (`smoke:job` + unit tests) — not full multi-actor EDD yet |
| 7–8 | Test / early launch → traction | Engineering green; business touchpoint wins not yet documented at scale |
| 9 | Scale | Deferred (product Phase 2+) |

Product phase language (“Phase 0/1/2…”) is **Totbox’s** bootstrap roadmap, not the universal 9-phase table.

---

## How Totbox maps to OS principles

| OS idea | Where it shows up in this repo |
|---------|--------------------------------|
| Thesis as hypothesis | [`docs/product_thesis.md`](../product_thesis.md) — scheduling workflow, not directory |
| Stay small / complete loop first | Bootstrap phases in README + strategy doc |
| Contrarian edge | Physical services lag e‑com agent MCP — [`bootstrap_pmf_and_agentic_gap.md`](../strategy/bootstrap_pmf_and_agentic_gap.md) |
| Founder / user control | Host LLM + explicit approvals ([`host_llm_safety.md`](../host_llm_safety.md)); **autonomy posture Strict** |
| Autonomy postures + deny list (OS v2.6) | Product: dry-run defaults + send/money/time gates. Company: `autonomyPosture` in state + [`instance/scores.md`](instance/scores.md) |
| Learning rituals (OS v2.6) | Scoreboard control plane + stage 6/7 after real jobs — **discipline still open** (no weekly snapshot stamped yet) |
| “Where are we?” (product) | `get_workflow` / progress strip; [`house_service_v1`](../workflows/house_service_v1.md) |
| “Where are we?” (company) | `npm run company-os -- status` + [`instance/scores.md`](instance/scores.md) |
| Tiny slice + hard tests | `npm run smoke:job`; [`local_household_runbook.md`](../local_household_runbook.md) |
| Synthetic / continuous eval (design) | [`docs/eval/continuous_sim_eval.md`](../eval/continuous_sim_eval.md) |
| Company-as-code | Product, strategy, workflows, tests, company-os in one public repo |
| Kill / non-goals | Explicit non-goals until Phase 2+ |
| Public-safe memory | [`AGENTS.md`](../../AGENTS.md) — no PII in git |
| Reward / risk ICP ranking | Informal in strategy docs; formal scorecards still open |
| Multi-agent roles + channels | Instance section below; host LLM + MCP tools today |
| Eval harness / synthetic continuity | Level ~1: `evals/` + smoke; design for Level 2+ in `docs/eval/` |
| Evaluation-Driven Development | Partial: tests after/with build; numeric business gates not locked |
| AGENTS.md thin enforcement | Root [`AGENTS.md`](../../AGENTS.md) is **public-repo PII rules**, not yet the company-OS paste block |
| Metrics: TTR, channel distribution | Not yet scored formally |
| Template change policy | Instance updates free; template needs founder approval ([`README`](README.md#template-change-policy-standing-rule)) |
| Living state machine | `npm run company-os` + `company/state/company-state.json` + `src/lib/company-os/` |
| Instance index | [`instance/README.md`](instance/README.md) |
| Grok loop workflow | `.grok/workflows/company-operating-loop.rhai` |
| Synthetic ICP research | `.grok/workflows/user-research.rhai` → `research/icps/` (founder-gated rounds until `READY_FOR_REAL_WORLD.md`) |

---

## Live runtime map (state + 7 stages)

This is the **faithful gap analysis** for applying [`live-runtime.md`](live-runtime.md) to Totbox — so we can improve methodically without pretending the full loop already exists.

### Persistent state

| Store (OS) | Totbox today | Faithful next step |
|------------|--------------|--------------------|
| User personas (versioned) | Implicit in research docs + eval design; no versioned persona registry | Add `docs/icp/` or private sim personas (public-safe composites only in git) |
| Product knowledge base | README, thesis, workflows, host safety, MCP architecture | Keep docs as SoR; optional machine index later |
| Decision traces | Strategy docs + PR narratives; not a `docs/decisions/` log | Start decision traces for phase gates, ICP rank changes, kill criteria |
| Research hypotheses & results | Strategy + research insights (anonymized) | Structured hypothesis ids + pass/fail after real house runs |
| Real-usage feedback | Local `.data/` jobs (gitignored); runbook | Redacted feedback notes after each real job; never commit PII |
| Scores snapshot | Engineering: tests green; business: informal | Explicit scoreboard for Phase 1 exit (touchpoints, completion, escalation) |
| Loop cursor | `journeyPhase` / `loopStage` / `gateStatus` in `company-state.json` | Keep CLI + scores.md in sync after each cycle |
| Autonomy posture | **Strict** in state (v2.6 dogfood) | Change only with founder decision + decision trace |
| Learning rituals | Scoreboard has slots; snapshot not yet stamped | Weekly: status + scores.md; after real job: stage 6 note → stage 7 |
| Product job state | `.data/jobs.json`, job PM | Remains product runtime — link job_ids into company traces when useful |

**Compute frameworks:** Totbox product loop today is **MCP + TypeScript job PM + host LLM**, not LangGraph/CrewAI. Company-level multi-actor sim is **designed** in eval docs. Adopt LangGraph/CrewAI (or stay TS) only if they speed the company loop — not as a fashion requirement.

### Loop stages

| Stage | Totbox today | Faithful next step |
|-------|--------------|--------------------|
| **1 Synthetic research** | Historical email insights + strategy; no continuous persona runner | Lightweight synthetic ICP drills for HVAC/cleaning (and challenger ICPs) before expanding scope |
| **2 Validation / concept** | Thesis locked for beachhead; still hypothesis | Real conversations + shadow jobs; re-rank if evidence weakens |
| **3 Product building** | Phase 1 loop largely coded (job PM → complete/next-due) | Only build what closes Phase 1 exit or paid pilot path |
| **4 Testing (synth + auto)** | Vitest + `smoke:job`; fixture path | Keep green; add scenario fixtures as eval design lands |
| **5 Evaluation** | Engineering pass/fail; multi-actor eval **design only** | Implement minimal eval scores when sim harness exists; until then score real jobs by hand |
| **6 Real feedback ingestion** | Personal runbook path; no formal ingest store | After each real household job: redacted outcome → feedback + decision note |
| **7 Memory update** | Docs updated ad hoc via PRs | Ritual: update scores, hypothesis status, open questions after each real or synth cycle |

### Honest “loop health” (Totbox)

| Checklist item ([live-runtime](live-runtime.md) §9) | Status |
|------------------------------------------------------|--------|
| Versioned personas labeled synthetic vs real | Partial / missing |
| Decision traces for last strategy moves | Partial (docs/PRs, not log) |
| Scores with thresholds | Engineering yes; business Phase 1 exit qualitative |
| Stage 4 in CI / known command | Yes (`npm test`, `smoke:job`) |
| Stage 6 real input path | Manual (runbook); needs discipline |
| Stage 7 writes next question | Ad hoc — **ritual required after next real job** |
| Autonomy posture written down | **Yes — Strict** |
| Weekly control-plane snapshot | **Not yet** (scores.md board ready; stamp when run) |
| “Where are we?” under two minutes | Product job: yes via MCP; **company**: `company-os status` + scores.md |

---

## Current working hypothesis (Totbox only)

Help busy dual-income / busy household professionals by coordinating **home services** (HVAC, cleaning, lawn/tree and similar) — starting as a **job PM** fee path (household first; operator revenue later if evidence supports).  
Channels: **email, text, web forms** first; deeper calendar/FSM only with proof.

**This remains a hypothesis.** It must keep surviving synthetic and real-world tests. If evidence weakens, change or kill it.  
Exit criteria for current product bootstrap: README Phase 1 (shadow PMF: real jobs, touchpoint drop) — not the portable OS.

### First tiny slice (Totbox product, not universal)

**Engineering-complete path (in repo):**  
intent → structured facts → draft outreach → **human approval** → contact (dry-run / host tools) → paste/ingest quote → money/time approval → book → explicit completion + next-due + progress strip.

**Narrower “prove coordination value” slice (hypothesis language):**  
research local providers → contact them → collect useful quotes or availability → clear comparison.

| Slice artifact (OS checklist) | Totbox |
|-------------------------------|--------|
| Success criteria | Engineering: smoke green; Business: fewer touchpoints on real jobs (numeric thresholds still open) |
| Harness reference | `npm run smoke:job` (`product/scripts/`); multi-actor sim design in `docs/eval/` |
| Expected artifacts | Job state, progress strip, dry-run/approval records, quote fields |
| Human gates | Send; money/time; PII — see host safety |
| Next increment | **Scheduling & coordination** — same EDD discipline once thin coordination value is proven |

Pass/fail for **engineering**: `npm run smoke:job`.  
Pass/fail for **business**: real household jobs with fewer touchpoints — Phase 1 gate.  
Every run should leave decision traces (product audit + company trace).

**Scheduling increment (instance, design-level):** Convert comparison into proposed time windows, confirm via allowed channels, update job state; stress: delay, conflict, non-response. Out of scope until thin slice business gate is honest: deep calendar products, payments, voice-as-primary.

---

## Instance architecture notes (Totbox product — not the OS template)

Portable multi-agent / channel principles live in the [OS blueprint](operating-system.md#product-architecture-principles-portable).  
**Totbox’s** concrete shape:

### Core product capabilities (conceptual)

- Structure a home-service job and keep checklist / gates (MCP job PM)  
- Prefer **host LLM** tools for memory, Gmail, SMS/voice when available  
- Research / shortlist providers **outside** a city directory (user/AI discovery)  
- Contact via allowed human channels; dry-run default  
- Collect quotes, availability, basic terms; normalize for comparison  
- Present a clear comparison / progress strip to the homeowner  
- Follow-ups and scheduling as the proven next increment  
- Escalate when stuck or high-stakes (send, money, time, PII)

### Role thinking inside the product

Useful responsibilities (may be host LLM + Totbox tools rather than separate frameworks):

| Role | Totbox-ish ownership |
|------|----------------------|
| Researcher | Host discovery + user-sourced vendors; not Totbox SEO directory |
| Outreach | Drafts + `approve_and_send` / host send after approval |
| Extractor | `ingest_provider_message`, `normalize_quote` |
| Presenter | `get_workflow` / progress strip / compare surfaces |
| Escalator | Safety gates; `record_user_approval`; never silent live send |

### Channel principle (instance)

Start: email / SMS / web form (+ paste).  
Add: Calendar write-path, voice, ServiceTitan-class adapters **only** with evidence and (for ST) revenue/LOI — see product strategy docs.

### Eval continuity (instance)

Design for continuous multi-actor sim: [`docs/eval/continuous_sim_eval.md`](../eval/continuous_sim_eval.md).  
Today: Level ~1 harness (`smoke:job` + unit tests). Synthetic persona continuity and Level 2+ are still open (see live runtime map above).

### Reward / risk (instance sketch — not scored formally yet)

| | Home-service household job PM |
|--|-------------------------------|
| **Reward** | High multi-turn friction; recurring HVAC/cleaning; dual-sided pain later for operators |
| **Risk** | Messy providers; channel legal rules; safety surface; solo ops load |
| **Status** | Primary focus **hypothesis** — promote only while real jobs confirm |

---

## Recommended Totbox application order (methodical)

Do these in order; each is an OS-faithful step, not feature creep:

1. **Weekly control-plane snapshot** — `npm run company-os -- status` + update [`instance/scores.md`](instance/scores.md); set `lastSnapshotAt` when you mean it.  
2. **Stay Strict** until a written reason to loosen (decision trace if posture changes).  
3. **Reward/risk scorecard** for beachhead vs challengers (public-safe notes only).  
4. **Decision trace** after next real house job and after any strategy, monetization, or autonomy-posture change.  
5. **Stage 6 → 7 ritual**: every real job → redacted feedback note → update scores / open questions / hypothesis notes.  
6. **Lock numeric** thin-slice / Phase 1 business thresholds before more build scope.  
7. **Stage 1/2 challenger ICPs** only if Phase 1 stalls (do not expand market while beachhead unproven).  
8. **Eval harness continuity**: same synthetic household personas for research and later multi-actor sim ([`continuous_sim_eval.md`](../eval/continuous_sim_eval.md)); optional LangGraph only if it reduces glue vs TypeScript.  
9. **Optional:** root company-OS instructions block (separate from public-repo PII `AGENTS.md` rules) if founder wants session enforcement.  
10. **Never** auto-advance product Phase 2 (revenue/operators) without founder call + evidence.  
11. **Do not** promote Totbox learnings into template files without explicit template approval.

---

## What mentees should *not* copy blindly

- Home services / Austin / HVAC as “the” correct market  
- MCP as a required architecture for every startup  
- Totbox phase numbers as their phase numbers  
- LangGraph/CrewAI because Totbox mentioned them as options  
- Any fixture providers or demo data as real traction  

---

## Prompt mentees can give their AI

```text
Read docs/company-os/operating-system.md, docs/company-os/live-runtime.md,
and docs/company-os/ai-instructions.md from this repo (or github.com/ivelin/totboxapp).

Apply the Company Operating System to MY startup.
Use docs/company-os/applied-here.md only as an example of discipline and gap analysis.
Do not adopt Totbox’s product thesis unless I explicitly ask.

Start by:
1) restating my thesis and candidate ICPs
2) naming my bootstrap journey phase (1–9)
3) naming my live loop stage (1–7) and what state stores I already have
4) proposing the smallest next stage-7 memory write and next experiment
```

---

*When Totbox’s strategy or loop maturity changes, update product docs and **this** mapping first.  
Template files (`operating-system.md`, `live-runtime.md`, `ai-instructions.md`) change only with founder approval — see [Template change policy](README.md#template-change-policy-standing-rule).*
