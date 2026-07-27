# Live Company Runtime  
## Persistent state + continuous learning loop

**Part of:** [Company Operating System](operating-system.md) (v2.3+)  
**Audience:** Solo founders implementing the OS; AI helpers; mentors  
**Portable:** Yes — this is the *runtime shape*, not any one product  
**Totbox mapping:** [`applied-here.md`](applied-here.md)  
**Template edits:** Approval-gated — see [`README.md`](README.md#template-change-policy-standing-rule)

---

## 1. Two clocks, one company

The OS has **two coordinated views**. Do not collapse them into one list.

| View | What it is | Changes when |
|------|------------|--------------|
| **Bootstrap journey** (phases 1–9) | Where the company is on the *prove it* path | Founder **Advance / Iterate / Hold / Kill** |
| **Live runtime loop** (stages 1–7) | How the company *computes and learns every week* | Continuous; may run many cycles inside one journey phase |

Early on you mostly live in journey phases 1–4 (research).  
Later you still run the full runtime loop **inside** build/test/grow — research does not stop after launch.

```text
  BOOTSTRAP JOURNEY (slow, founder-gated)
  1 thesis → … → 9 grow
         │
         │  at every step, the LIVE LOOP can run:
         │
         ▼
  LIVE RUNTIME (fast, evidence-producing)
  persistent state ──► 1 research ──► 2 validate ──► 3 build
         ▲                    ──► 4 test ──► 5 eval ──► 6 real feedback
         └──────────────────── 7 memory update ◄────────────┘
```

---

## 2. Blueprint vs live runtime (restated)

| Layer | Holds |
|-------|--------|
| **Blueprint** | Principles, gates, forbidden moves ([`operating-system.md`](operating-system.md)) |
| **Live runtime** | Actual state, scores, traces, personas, eval results, open questions |
| **Compute** | Agents / graphs / scripts that read state, do work, write traces |

Writing a great blueprint without a live loop is **planning theater**.  
Running agents without founder gates and honest state is **automation theater**.

---

## 3. Persistent state (the company memory)

Whatever tools you pick, the **live OS needs durable, versioned state** that both you and AI can read.

### 3.1 Minimum stores

| Store | Purpose | Must include |
|-------|---------|--------------|
| **User personas** | Synthetic (and later real-derived) customers | Rich profile, version, history of interactions; optional psychographics (e.g. Big Five / OCEAN) — only if it improves scenario quality, not for vanity |
| **Product knowledge base** | What the product is, constraints, non-goals | Thesis, slice definition, API/UX facts, safety rules |
| **Decision traces** | Why the company did things | Decision, evidence, outcome, next review ([template in OS](operating-system.md#decision-traces--learning-loop)) |
| **Research hypotheses & results** | ICP ranking and validation outcomes | Hypothesis id, method (synthetic vs real), scores, pass/fail |
| **Real-usage feedback** | What happened with real people | Redacted notes, outcomes, quotes (lawful capture only) |
| **Scores snapshot** | Current board | Completion, willingness, escalation, trust, etc. |
| **Loop cursor** | Where the runtime is | Current stage 1–7, last run id, blocked reason |

### 3.2 Design rules for state

1. **Version personas and hypotheses** — never silently overwrite; you need “what we believed last month.”  
2. **Separate synthetic vs real** — label every artifact `synthetic` | `real` | `mixed`.  
3. **Redact by default in public repos** — PII and raw recordings stay private / gitignored.  
4. **Trace-first** — if it is not written down, the company did not learn it.  
5. **Founder-readable** — JSON/DB is fine; always keep a plain-language summary path (“Where are we?”).

### 3.3 Tooling (examples, not requirements)

Popular open-source stacks that fit this shape well:

| Concern | Example options | Notes |
|---------|-----------------|-------|
| **Durable graph + state** | [LangGraph](https://github.com/langchain-ai/langgraph) (checkpoints, threads) | Good default for “loop with memory” |
| **Multi-agent roles** | [CrewAI](https://github.com/crewAIInc/crewAI), LangGraph nodes, plain scripts | Use when roles (researcher, builder, critic) help; skip if one agent + tools is enough |
| **Evals / scenarios** | Your domain harness, Promptfoo, custom CI | Must score the *same* contracts you ship |
| **Docs + decisions as code** | Git markdown / YAML | Solo-friendly; starts before any framework |
| **Product app state** | Your app DB / `.data/` | Product runtime ≠ company OS state (link them with ids) |

**Rule:** Choose tools that fit *your* product and skill.  
A markdown + script loop that is honest beats a LangGraph cathedral that never runs.  
Upgrade when state and multi-step agents become the bottleneck — not before.

---

## 4. The continuous loop (7 stages)

Each stage **reads** persistent state, **does work**, and **writes** traces + updates.  
Founder gates sit between stages when strategy or spend would change.

```text
┌─────────────────────────────────────────────────────────────────┐
│                    PERSISTENT STATE                             │
│  • User Personas (rich, versioned; optional OCEAN + history)    │
│  • Product Knowledge Base + Decision Traces                     │
│  • Real-usage Feedback Store                                    │
│  • Research Hypotheses & Validation Results                     │
│  • Scores + loop cursor                                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────▼───────────────────┐
         │  1. SYNTHETIC USER RESEARCH           │
         └───────────────────┬───────────────────┘
                             │
         ┌───────────────────▼───────────────────┐
         │  2. VALIDATION / CONCEPT TESTING      │
         └───────────────────┬───────────────────┘
                             │
         ┌───────────────────▼───────────────────┐
         │  3. PRODUCT BUILDING                  │
         └───────────────────┬───────────────────┘
                             │
         ┌───────────────────▼───────────────────┐
         │  4. TESTING (Synthetic + Automated)   │
         └───────────────────┬───────────────────┘
                             │
         ┌───────────────────▼───────────────────┐
         │  5. EVALUATION                        │
         └───────────────────┬───────────────────┘
                             │
         ┌───────────────────▼───────────────────┐
         │  6. REAL USER FEEDBACK INGESTION      │
         └───────────────────┬───────────────────┘
                             │
         ┌───────────────────▼───────────────────┐
         │  7. MEMORY UPDATE & LOOP BACK         │
         └───────────────────┬───────────────────┘
                             │
                             └──────────► back to 1
```

### Stage cards

#### 1 — Synthetic user research

| | |
|--|--|
| **Goal** | Explore ICPs and jobs-to-be-done cheaply across **several** groups |
| **Inputs** | Thesis, existing personas, hypotheses, prior scores |
| **Work** | Generate/update personas; run interviews/scenarios; surface pains, substitutes, willingness, trust, “no” reasons |
| **Outputs** | Ranked notes, new/updated persona versions, open questions |
| **Founder gate?** | Soft — do not promote a primary ICP without stage 2 + real evidence later |

#### 2 — Validation / concept testing

| | |
|--|--|
| **Goal** | Stress-test concepts and the **tiny slice** before/while building |
| **Inputs** | Top hypotheses, concept pitches, slice pass/fail rules |
| **Work** | Synthetic A/B of value props; concierge scripts; pricing reactions; “would you switch?” probes |
| **Outputs** | Validation results linked to hypothesis ids; kill/iterate recommendations |
| **Founder gate?** | Yes — primary ICP, slice definition, success thresholds |

#### 3 — Product building

| | |
|--|--|
| **Goal** | Ship the smallest thing that can fail the pass/fail rules honestly |
| **Inputs** | Locked (for now) slice + product knowledge base + **EDD spec** (criteria, harness plan) |
| **Work** | Implement via [Evaluation-Driven Development](operating-system.md#evaluation-driven-development-edd): Spec → Harness → Implement; keep scope to the slice |
| **Outputs** | Runnable product (or manual concierge path), decision traces for scope cuts |
| **Founder gate?** | Yes — major scope expands, spend, “platform” temptations |

#### 4 — Testing (synthetic + automated)

| | |
|--|--|
| **Goal** | Prove the slice **works** under control (fixtures, sims, unit/integration) |
| **Inputs** | Product build, personas, scenarios, stress cases from prior failures |
| **Work** | Automated tests; synthetic end-to-end runs; safety/refusal cases; re-run same scenario ids |
| **Outputs** | Pass/fail against engineering and scenario suites; bug list |
| **Founder gate?** | Soft — stop the line if safety tests fail |

#### 5 — Evaluation

| | |
|--|--|
| **Goal** | Score quality, not just “did it run?” |
| **Inputs** | Test artifacts, score definitions, baselines, numeric thresholds |
| **Work** | Score completion, extraction, escalation, time-to-resolution, trust, channel distribution, ICP attractiveness; compare to thresholds |
| **Outputs** | Scoreboard update; Advance/Iterate/Hold/Kill **recommendation** (not auto-apply) |
| **Founder gate?** | Yes — journey phase advance or kill |

#### 6 — Real user feedback ingestion

| | |
|--|--|
| **Goal** | Bring **reality** into state (lawfully, redacted) |
| **Inputs** | Conversations, usage, support, pilots |
| **Work** | Capture outcomes; separate what people *said* vs *did*; link to hypotheses |
| **Outputs** | Feedback store entries; contradictions vs synthetic beliefs |
| **Founder gate?** | Yes — when real evidence overturns synthetic ranking |

#### 7 — Memory update & loop back

| | |
|--|--|
| **Goal** | Close the learning loop so the next cycle is smarter |
| **Inputs** | All new traces, scores, feedback |
| **Work** | Version personas; revise hypotheses; update product knowledge; write decision traces; set next loop cursor |
| **Outputs** | Fresh state ready for stage 1; explicit list of what changed and why |
| **Founder gate?** | Soft — review diffs when strategy-sensitive fields change |

**Never skip stage 7.** Without memory update, you are generating noise, not running a company OS.

---

## 5. Mapping loop stages ↔ bootstrap journey phases

| Journey phase (slow) | Runtime stages that dominate |
|----------------------|------------------------------|
| 1–2 Thesis & success defs | Seed state; light stage 1 |
| 3 Synthetic research | **1** heavy |
| 4 Real-world research | **2** + **6** (early real talks) |
| 5 Design tiny system | **2** → plan for **3** |
| 6 Build tiny slice | **3** + **4** |
| 7 Real/realistic users | **4** + **5** + **6** |
| 8 Learn & improve | **5** + **7** (full cycles) |
| 9 Grow | Full loop; raise thresholds; expand slice only with proof |

---

## 6. Founder control inside the loop

The loop may be automated; **strategy must not**.

| Always human | May be AI-recommended |
|--------------|------------------------|
| Advance / kill journey phase | Stage transition inside a locked plan |
| Primary ICP change | Persona draft updates |
| Success threshold change | Score calculation |
| Spend / hiring / co-founder | Test generation |
| Shipping to real customers (first times) | Synthetic scenario runs |

AI permanent instructions: [`ai-instructions.md`](ai-instructions.md).

---

## 7. Evaluation harness & synthetic testing

Before relying only on real users, the system should run end-to-end against **synthetic** versions of the target customers. This is the backbone of loop stages **4–5**.

### What a good evaluation harness provides

- A set of realistic synthetic customer profiles (ICPs) with consistent personalities and constraints  
- Ability to run the full **thin slice** against those profiles  
- Clear pass/fail scoring against written success criteria  
- Decision traces for every run (why success or failure)  
- Ability to **re-run the same scenarios** after changes to measure improvement  

### Synthetic continuity

The same synthetic personas used in early research (stage 1) should remain available during product evaluation (stages 4–5).  

That creates continuity: the people you “talked to” in research are the same ones the product is later tested against. Over time, real usage (stage 6) refines these personas via stage 7 — it does not silently invent a second disconnected cast of characters.

Treat synthetic testing as a fast, repeatable **filter**. It does not replace real-world validation.

### Harness maturity ladder

| Level | What you have |
|-------|----------------|
| **0** | Manual checklist + one scripted walkthrough |
| **1** | Fixtures + automated unit/integration tests for the slice |
| **2** | Versioned personas + repeatable scenario runner + scores |
| **3** | Multi-actor / multi-channel sim close to production shape |

Solo founders should not skip Level 1 while chasing Level 3 frameworks.

### Same schema: synthetic and real traces

Synthetic runs and real jobs should emit **decision traces with the same core fields** (inputs, action, observation, outcome, confidence/next-state as applicable). Label each run `synthetic` | `real` | `mixed`.

### High-value traces → stress scenarios and playbooks

Prioritize failures, novel objections, and successful recoveries:

1. Update reward/risk notes and persona attributes (stage 7)  
2. **Seed a permanent stress scenario** in the eval harness when the failure is repeatable or high-cost  
3. Promote successful patterns into playbooks / agent instructions only after the eval gate still passes  

Do not let high-value traces die in chat history.

### Coupling stages 3–5 with EDD

```text
Stage 3  Spec + implement thin increment
Stage 4  Harness / synthetic + automated re-runs
Stage 5  Gate on scores → founder Advance/Iterate/Hold/Kill
```

See [Evaluation-Driven Development](operating-system.md#evaluation-driven-development-edd).

---

## 8. Minimum viable live OS (start here)

Before LangGraph/CrewAI, a solo founder can run an honest loop with:

1. Thesis + `research/` ICPs/personas (versioned by git)  
2. `traces/` or `docs/decisions/YYYY-MM-DD-*.md`  
3. Scoreboard + loop cursor (markdown is fine)  
4. A weekly ritual: stages 1→7 with written outputs (even if stage 3 is “no build this week”)  
5. Product tests that encode pass/fail for the tiny slice  
6. Reward/risk scorecards for top ICPs ([operating-system](operating-system.md#reward--risk-thinking--icp-ranking))  

**Then** add durable agent graphs when:

- Multi-step research/build/eval is too slow by hand, and  
- You already have clear schemas for personas, hypotheses, and scores.

---

## 9. Anti-patterns

| Anti-pattern | Why it fails |
|--------------|--------------|
| Loop with no real stage 6 | Synthetic echo chamber |
| Build (3) before ranked 1–2 | Fast wrong product |
| Eval (5) without fixed thresholds | Endless storytelling |
| Memory (7) as chat history only | Nothing versioned or auditable |
| New personas every eval week | No synthetic continuity; scores not comparable |
| Framework first | Months of glue, zero evidence |
| Auto-advance journey phase | Founder out of control |
| Channel expansion before thin slice works | Complexity without signal |

---

## 10. Checklist: “Is our live OS real?”

- [ ] Personas and hypotheses are versioned and labeled synthetic vs real  
- [ ] Research personas are the same ids used in product eval (continuity)  
- [ ] Decision traces exist for last three strategy moves  
- [ ] Scores have numbers and thresholds, not only adjectives  
- [ ] Reward/risk scorecards exist for candidate ICPs  
- [ ] Stage 4 tests run in CI or on a known command  
- [ ] High-value failures have become stress scenarios or explicit “wontfix yet” notes  
- [ ] Stage 6 has at least one real (or clearly labeled pilot) input path  
- [ ] Stage 7 updates personas, hypotheses, scores, and the next stage 1 question  
- [ ] Founder can answer “Where are we?” in under two minutes from state  

---

*Implement with LangGraph, CrewAI, plain TypeScript, spreadsheets + scripts — whatever you will actually run weekly. The shape is the OS; the framework is furniture.*
