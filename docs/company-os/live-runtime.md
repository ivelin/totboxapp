# Live Company Runtime  
## Persistent state + continuous learning loop

**Part of:** [Company Operating System](operating-system.md) (v2.8+)  
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
| **Research hypotheses & results** | Customer-group ranking and validation outcomes | Hypothesis id, method, evidence labels, scores, pass/fail, demotions |
| **Real-usage feedback** | What happened with real people | Redacted notes, outcomes, quotes (lawful capture only) |
| **Scores snapshot** | Current board | Completion, willingness, escalation, trust, etc. |
| **Loop cursor** | Where the runtime is | Current stage 1–7, last run id, blocked reason; optional: last snapshot date |
| **Autonomy posture** | How much the system may do alone | Strict / Auto / Dangerous ([blueprint](operating-system.md#autonomy-postures-how-much-the-system-may-do-alone)); default Strict |
| **Ready for human eyes** | May we ask cold humans to try a product URL? | `unknown` \| `blocked` \| `green` + optional evidence path / blockers ([blueprint](operating-system.md#ready-for-human-eyes-ship-gate-before-external-feedback)); default **unknown** |

### 3.2 Design rules for state

1. **Version personas and hypotheses** — never silently overwrite; you need “what we believed last month.”  
2. **Label runs and claims** — every *run* is `synthetic` | `real` | `mixed`. Important *claims* inside reports use the four evidence labels in the blueprint ([honest research](operating-system.md#how-to-do-honest-research--validation)): outside facts, company signals, assumed capability, needs real-world proof.  
3. **Redact by default in public repos** — personal data and raw recordings stay private / gitignored.  
4. **Trace-first** — if it is not written down, the company did not learn it.  
5. **Founder-readable** — structured files are fine; always keep a plain-language summary path (“Where are we?”).

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
| **Goal** | Explore customer groups and jobs-to-be-done cheaply across **several** groups |
| **Inputs** | Thesis, existing personas, hypotheses, prior scores, outside-facts notes |
| **Work** | Generate/update personas; run interviews/scenarios; use [staged trust reveal](operating-system.md#staged-trust-reveal-how-synthetic-trust-actually-moves) when scoring trust or price interest; surface pains, substitutes, willingness, trust, “no” reasons |
| **Outputs** | Ranked notes with evidence labels; score *movement* if staged; demotions; open questions; optional “what to say” drafts labeled as hypotheses |
| **Founder gate?** | Soft — do not promote a primary group without stage 2 + real evidence later |

#### 2 — Validation / concept testing

| | |
|--|--|
| **Goal** | Stress-test concepts and the **tiny slice** before/while building; run the [next pack](operating-system.md#after-synthetic-ranking-the-next-pack) after ranked research |
| **Inputs** | Ranked groups (promote = hold), thin-slice definition, pass/fail rules, research persona ids |
| **Work** | **Track A — light synthetic product sandbox (capability / feasibility):** isolated end-to-end baseline per group still on the board; sample path roles and styles; stress long-running work, multi-channel switches, handoffs, miscommunication, lost or wrong notes — ask “is the product capable enough yet?” not only “did the happy path finish?” **Track B — real interest tests:** waitlist/landing, organic, social, in-person, capped paid, or direct outreach — measure behavior with pre-written thresholds. Never treat simulated prices or waitlist size as willingness to pay. |
| **Outputs** | Sandbox scenario ids + pass/fail + capability verdict; interest-test counts and costs; kill/iterate recommendations; updated open questions |
| **Founder gate?** | Yes — next pack result (iterate / hold / deepen build); primary test group; slice definition; success thresholds |

#### 3 — Product building

| | |
|--|--|
| **Goal** | Ship the smallest thing that can fail the pass/fail rules honestly |
| **Inputs** | Locked (for now) slice + product knowledge base + evaluation-driven **spec** (criteria, harness plan) |
| **Work** | Implement via [Evaluation-Driven Development](operating-system.md#evaluation-driven-development-edd): Spec → Harness → Implement; keep scope to the slice |
| **Outputs** | Runnable product (or manual concierge path), decision traces for scope cuts |
| **Founder gate?** | Yes — major scope expands, spend, “platform” temptations |

#### 4 — Testing (synthetic + automated)

| | |
|--|--|
| **Goal** | Prove the slice **works** under control (fixtures, sims, unit/integration) **and** cold-user happy path where a product URL exists |
| **Inputs** | Product build, personas, scenarios, stress cases from prior failures; cold URL + happy-path definition |
| **Work** | Automated tests; synthetic end-to-end runs; safety/refusal cases; re-run same scenario ids; **Ready for human eyes** cold-path check (sandbox browser and/or NL synthetic user) before external asks |
| **Outputs** | Pass/fail against engineering and scenario suites; bug list; `readyForHumanEyes` update (`unknown` / `blocked` / `green`) + evidence path |
| **Founder gate?** | Soft — stop the line if safety tests fail; **hard** — do not draft external product-test asks while human-eyes is not green (unless explicit override + decision trace) |

#### 5 — Evaluation

| | |
|--|--|
| **Goal** | Score quality, not just “did it run?” |
| **Inputs** | Test artifacts, score definitions, baselines, numeric thresholds; human-eyes evidence if seeking external product feedback |
| **Work** | Score completion, extraction, escalation, time-to-resolution, trust, channel distribution, customer-group attractiveness; compare to thresholds; separate “engineering green” from “cold path green” from “people care” |
| **Outputs** | Scoreboard update; Advance/Iterate/Hold/Kill **recommendation** (not auto-apply) |
| **Founder gate?** | Yes — journey phase advance or kill |

#### 6 — Real user feedback ingestion

| | |
|--|--|
| **Goal** | Bring **reality** into state (lawfully, redacted) |
| **Inputs** | Conversations, usage, support, pilots — **prefer** after Ready for human eyes is green when the ask is “try my product link” |
| **Work** | Capture outcomes; separate what people *said* vs *did*; link to hypotheses; if feedback was “link broken,” write stress scenario and set human-eyes **blocked** |
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

**Learning rituals (blueprint):** Weekly control-plane snapshot is the **read-back**. Stage 7 is the **write-back**. Also: weekly scoreboard glance; monthly (or pre-hire) coordination-tax check. Full table: [operating-system — Learning rituals](operating-system.md#learning-rituals-your-crons-without-servers).

---

## 5. Mapping loop stages ↔ bootstrap journey phases

| Journey phase (slow) | Runtime stages that dominate |
|----------------------|------------------------------|
| 1–2 Thesis & success defs | Seed state; light stage 1 |
| 3 Synthetic research | **1** heavy |
| 4 Real-world research | **2** Track B + **6** (interest tests, talks) |
| 5 Design tiny system | **2** Track A (sandbox) → plan for **3** |
| 6 Build tiny slice | **3** + **4** (reuse sandbox scenario ids) |
| 7 Real/realistic users | **4** + **5** + **6** |
| 8 Learn & improve | **5** + **7** (full cycles) |
| 9 Grow | Full loop; [growth pack](operating-system.md#after-proof-the-growth-pack) only after proof markers; one channel hypothesis; expand spend only after founder promote |

---

## 6. Founder control inside the loop

The loop may be automated; **strategy must not**.

| Always human | May be AI-recommended |
|--------------|------------------------|
| Advance / kill journey phase | Stage transition inside a locked plan |
| Primary customer-group change | Persona draft updates |
| Success threshold change | Score calculation |
| Autonomy posture change (esp. toward looser) | Drafts / dry-runs under current posture |
| Spend / hiring / co-founder | Test generation |
| Shipping to real customers (first times) | Synthetic scenario runs |

AI permanent instructions: [`ai-instructions.md`](ai-instructions.md).

---

## 7. Evaluation harness & synthetic testing

Before relying only on real users, the system should run end-to-end against **synthetic** versions of the target customers. This is the backbone of loop stage **2** (light sandbox), then stages **4–5** as the product hardens.

The first serious harness is often the **light synthetic product sandbox** from the [next pack](operating-system.md#after-synthetic-ranking-the-next-pack): isolated, end-to-end, baseline scenarios, path roles only.

### What a good evaluation harness provides

- Realistic synthetic profiles for **customer groups** and other **path roles** (co-decider, provider, veto) with consistent constraints  
- Ability to run the full **thin slice** end-to-end in an isolated sandbox (no real side effects by default)  
- Clear pass/fail scoring against written success criteria  
- Decision traces for every run (why success or failure)  
- Ability to **re-run the same scenario ids** after changes to measure improvement  

### Synthetic continuity

The same synthetic personas used in early research (stage 1) should remain available in the product sandbox (stage 2) and later product evaluation (stages 4–5).  

That creates continuity: the people you “talked to” in research are the same ones the product path is later tested against. Over time, real usage (stage 6) refines these personas via stage 7 — it does not silently invent a second disconnected cast of characters.

Treat synthetic testing as a fast, repeatable **filter**. It does not replace real-world validation or real interest tests.

### Harness maturity ladder

| Level | What you have |
|-------|----------------|
| **0** | Manual checklist + one scripted walkthrough |
| **1** | Light synthetic product sandbox: baseline + path-role sample + multi-party/channel mess cases + pass/fail + capability verdict |
| **2** | Fixtures + automated unit/integration tests for the slice + versioned scenario ids |
| **3** | Multi-actor / multi-channel sim close to production shape |

Solo founders should not skip Level 1 while chasing Level 3 frameworks.  
The next pack’s sandbox **is** Level 1 — keep it light; grow depth only when the thin path already passes.

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
Stage 4  Harness / synthetic + automated re-runs + cold-path (human eyes)
Stage 5  Gate on scores → founder Advance/Iterate/Hold/Kill
```

See [Evaluation-Driven Development](operating-system.md#evaluation-driven-development-edd) and [Ready for human eyes](operating-system.md#ready-for-human-eyes-ship-gate-before-external-feedback).

### Ready for human eyes (runtime)

Before stage 6 product asks that depend on a **working URL** (mentor beta, “try this link,” interactive survey):

1. Founder states who + happy path + done-means + URL (plain language).  
2. Harness runs cold path (sandbox browser and/or NL synthetic first-time user).  
3. Set `readyForHumanEyes`: `blocked` (with blockers) or `green` (with evidence path).  
4. Only if **green** (or founder override + decision trace): draft external ask.  
5. Material path/deploy change → reset to `unknown` or re-run.

Checklist template: [`ready-for-human-eyes.md`](ready-for-human-eyes.md).

This is **not** Track A sandbox feasibility alone (sim capability). It is **cold deploy surface + happy path alive for a stranger**.

---

## 8. Minimum viable live OS (start here)

Before heavy agent frameworks, a solo founder can run an honest loop with:

1. Thesis + `research/` customer groups and personas (versioned by git)  
2. Market notes: what outside evidence supports vs does not establish  
3. `traces/` or `docs/decisions/YYYY-MM-DD-*.md`  
4. Scoreboard + loop cursor + **autonomy posture** (markdown is fine; default Strict)  
5. Learning rituals: weekly control-plane snapshot; stage 7 after real/heavy cycles; optional weekly scoreboard glance  
6. A weekly pass through stages 1→7 with written outputs (even if stage 3 is “no build this week”)  
7. After ranking: next pack — light synthetic product sandbox and/or real interest tests  
8. Product tests that encode pass/fail for the tiny slice (reuse sandbox scenario ids)  
9. **Ready for human eyes** field + cold-path check before external product-test asks ([checklist](ready-for-human-eyes.md))  
10. Reward/risk scorecards for top groups ([operating-system](operating-system.md#reward--risk-thinking--customer-group-ranking))  
11. Optional one-page virtual office (who does each function this week)  

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
| Default **Dangerous** posture | Harm without pauses |
| Channel expansion before thin slice works | Complexity without signal |
| Skip stage 7 + weekly snapshot | Chat logs, not a company |
| Simulated price tables treated as list prices | Fake demand; bad sales and bad fundraising stories |
| Capability-stage scores treated as current product proof | You measured a wish list, not a product |
| Green sandbox treated as product–market fit | Feasibility is not demand |
| Waitlist size treated as willingness to pay | Interest is not payment |
| Huge multi-role sim before thin baseline works | Complexity without a path |
| Paid ads scaled while sandbox baselines fail | Spend on a broken story |
| Growth pack without proof markers | Spend/reputation burn before the business is real ([growth pack](operating-system.md#after-proof-the-growth-pack)) |
| Multi-channel spray in phase 9 | Solo complexity without comparable signal |
| Vanity metrics as growth success | Optimizes noise; hides weak offer/channel |
| Ask mentor/user to try product while human-eyes is not green | Wastes human attention on deploy/path debris |
| “Works in my chat / my cookies” as ready for eyes | Cold users hit different failures |
| Green human-eyes treated as PMF | Path alive ≠ people care or pay |

---

## 10. Checklist: “Is our live OS real?”

- [ ] Personas and hypotheses are versioned; runs labeled synthetic / real / mixed  
- [ ] Important claims use evidence labels (outside facts / company signals / assumed capability / needs real-world proof)  
- [ ] Research personas are the same ids used in product eval (continuity)  
- [ ] Decision traces exist for last three strategy moves  
- [ ] Scores have numbers and thresholds, not only adjectives  
- [ ] Reward/risk scorecards exist for candidate customer groups (with demotions / hold)  
- [ ] After ranking, next pack artifacts exist: sandbox pass/fail and/or real interest tests with thresholds  
- [ ] Stage 4 tests run in continuous integration or on a known command (scenario ids from sandbox when possible)  
- [ ] High-value failures have become stress scenarios or explicit “wontfix yet” notes  
- [ ] Stage 6 has at least one real (or clearly labeled pilot) input path  
- [ ] Stage 7 updates personas, hypotheses, scores, and the next stage 1 question  
- [ ] Founder can answer “Where are we?” in under two minutes from state (phase + loop stage + posture + gate)  
- [ ] If claiming “growth,” proof markers and a growth-round note exist — or explicit hold-scale ([growth pack](operating-system.md#after-proof-the-growth-pack))  
- [ ] Autonomy posture is written down (default Strict); standing deny list known  
- [ ] Weekly control-plane snapshot happened recently  
- [ ] Virtual office (if used) names who approves external claims — no fake bot titles  
- [ ] `readyForHumanEyes` is tracked; external product-test asks only when **green** (or override + trace)  
- [ ] Cold happy path was run outside founder-only session before last mentor/user product ask  

---

*Implement with LangGraph, CrewAI, plain TypeScript, spreadsheets + scripts — whatever you will actually run weekly. The shape is the OS; the framework is furniture.*
