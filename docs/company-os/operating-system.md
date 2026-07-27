# Company Operating System  
## For Solo Founders in Bootstrapping Mode

**Version:** 2.3  
**Last Updated:** 2026-07-27  
**Status:** Living guideline (blueprint — not any one company’s live runtime)  
**Audience:** Independent solo founders; mentors (e.g. Founder Institute, SCORE); AI helpers instructed to follow this system  
**Isolation:** Portable across startups. Totbox-specific application lives in [`applied-here.md`](applied-here.md) only.  
**Template changes:** Approval-gated — see [`README.md`](README.md#template-change-policy-standing-rule).  
**Live runtime (state + loop):** [`live-runtime.md`](live-runtime.md)

---

## True North

AI is the greatest leverage tool entrepreneurs have ever had.  
Today’s AI is the worst it will ever be.

This system helps a solo founder use that leverage to move fast, stay in control, and prove value with almost no money or team. It is written so a normal person — including a teenager — can understand and use it.

**AI without personal agency is not an edge.** Skillful tool use is table stakes. Real advantage comes from *your* insight and decisions — including contrarian ones — that most people and current AI still undervalue.

---

## Who This Is For

Independent solo founders building something new with very limited time and money.

**Solo is a smart starting position** because you can move at the speed of AI without waiting for permission or coordination. It is not a rule that you must stay alone forever. When you find people who are genuine force multipliers — people who can use AI even better in an area of shared passion and skill — you should seriously consider bringing them on. That decision requires a clear comparison of the risks of hiring or taking co-founders versus the risks and limits of remaining solo.

Some principles may be useful inside larger companies. Those environments have additional politics, risk, and constraints. Adapt with the help of frontier AI — **never copy this system verbatim into a corporate context** without rethinking ownership, approvals, and incentives.

---

## How Mentors and Mentees Should Use This

| Role | Use |
|------|-----|
| **Mentor** | Point mentees here as a shared language for phases, gates, evidence, and control. |
| **Mentee** | Adopt the OS in *your* repo; replace every product example with *your* thesis and tests. |
| **AI (any host)** | Follow the blueprint + [`ai-instructions.md`](ai-instructions.md). Treat other folders in a host repo as that company’s product, not as universal law. |

**Golden rule for extraction:** Copy *process and control*. Do not copy another founder’s market, ICP, feature list, or “current hypothesis” as yours.

---

## Core Beliefs

1. **You supply the insight. AI supplies the speed.**  
   Using AI well is now normal. Real advantage comes from noticing and acting on opportunities that most people — and current AI — still undervalue or dismiss. (AI without personal agency is not an edge.)

2. **Do not fall in love with your first idea.**  
   The system exists to force an honest process: form a thesis, test it hard, learn, and be willing to change or kill it.

3. **Stay small until it works.**  
   Build the tiniest version that can prove people will pay or get clear value. Expand only after you have real proof.

4. **You stay in control.**  
   AI does the heavy work. You decide the important things: what is true, what to build, when to move forward, and when to stop.

5. **Everything important must be visible and explainable.**  
   You should always be able to ask “Where are we?” and get a clear, honest answer.

6. **Evidence beats narrative.**  
   Time spent is not proof. Preference is not proof. Synthetic research is a filter. Real-world action is the gate.

7. **Build evaluation-first when you build.**  
   Spec success criteria and a harness before (or with) the implementation — not after a big unmeasured build.

---

## Blueprint vs Live Runtime

| Layer | What it is | Example |
|-------|------------|---------|
| **Blueprint (this document)** | How a company OS *should* work: journey phases, gates, control rules | This file |
| **Live runtime** | Persistent state + continuous 7-stage learning loop + compute | Personas, hypotheses, scores, agents/graphs — see [`live-runtime.md`](live-runtime.md) |
| **Product runtime** | What customers touch | Your app, MCP, website |

The blueprint is **not** the running system. Do not confuse “we wrote the plan” with “we proved the business.”

### Two clocks (must stay distinct)

1. **Bootstrap journey (phases 1–9 below)** — slow, founder-gated “where is the company on prove-it?”  
2. **Live loop (stages 1–7)** — fast weekly/daily cycle: research → validate → build → test → eval → real feedback → memory update → back  

You can run many loop cycles inside one journey phase. Full detail, state stores, and the stage diagram: **[`live-runtime.md`](live-runtime.md)**.

---

## Contrarian Insight as Edge

Before putting serious time into an idea, answer:

1. What do I believe about this problem or market that most smart people and current AI systems appear to disagree with or undervalue?
2. Is the disagreement about whether it *can* be done, *when* it should be done, or whether people will *care enough*?
3. If I am right, why has the opportunity not already been fully taken?
4. What is the upside if the view is correct versus the downside if it is wrong?
5. Can I test this belief with a **tiny, fast experiment** instead of a large bet?

You do not need rocket science. Many good companies win by acting on a simple truth others thought was too messy, too small, or not worth the effort.

---

## The Real Job of the Early Phases

The early phases are not a formality. They exist to stop you from building the wrong thing.

You must:

1. Form a clear thesis (what problem, for whom, why now, why you).
2. Generate several possible customer groups (ICPs) — not one favorite.
3. Test those groups with synthetic research (AI simulations of realistic people).
4. Rank them honestly by pain, willingness to act or pay, and how well you can reach them.
5. Do real-world conversations and small tests with actual people.
6. Only then choose a primary focus and a tiny first slice to build.
7. Keep testing. Be ready to change focus if the evidence is weak.

Any “current focus” in a real company is only a **hypothesis that has survived this process so far**. It is not assumed to be true forever.

---

## The 9 Phases (Simple View + Formal Aliases)

**Simple names are primary** (plain language).  
**Formal aliases** match common product-lifecycle language (FI decks, internal planning). They describe the **same journey**, not a second process.

| # | Simple phase (primary) | Formal alias | Exit signal (simple) |
|---|------------------------|--------------|----------------------|
| 1 | Form thesis and list possible customer groups | Ideation & Opportunity Framing | Written thesis + ≥3 ICP candidates |
| 2 | Define what success looks like for each group | Vision, Mission & ICP Definition | Clear metrics / “done means…” per group |
| 3 | Synthetic research and first validation | Customer Discovery & Problem Validation *(synthetic leg)* | Ranked groups with written evidence notes |
| 4 | Real-world research and validation | Customer Discovery *(real leg)* + start of Solution & Monetization Validation | Conversations/tests; weak groups demoted; reward/risk notes |
| 5 | Design the simplest system that can test the winner | Architecture & Agentic System Design | One tiny slice + pass/fail rules + human gates |
| 6 | Build a tiny slice and test it hard | Build (Evaluation-Driven Development) | Slice runs end-to-end (fixture/sim OK); gate scores |
| 7 | Try it with real or realistic users | Test, Synthetic Evaluation & Early Launch | Observed behavior, not only compliments |
| 8 | Learn from what happens and improve | Traction, Feedback & Continuous Learning | Decision traces + score movement |
| 9 | Grow only after it clearly works | Scale & Expansion (post clear PMF) | Proof of value or payment; then expand |

**Monetization stress** (will they pay / which path?) lives mainly in journey phases **4–5** and in ongoing reward/risk scorecards — not as a separate tenth phase.

### Phase gates (structured)

Every move from one phase to the next is a **visible decision**. Recommended labels: **Advance**, **Iterate**, **Hold**, **Kill**.  
**You** make the final call. The AI never advances a phase by itself.

Record (or be able to produce) at least:

| Field | Meaning |
|-------|---------|
| **Entry criteria** | What had to be true to even consider the gate |
| **Evidence pack** | Synthetic and/or real artifacts (links, summaries, scores) |
| **System recommendation** | Advance / Iterate / Hold / Kill + short why |
| **Founder decision** | Your call, date, and any conditions |

How these phases sit on top of the continuous compute loop (and persistent state): [`live-runtime.md`](live-runtime.md) §5.

---

## How to Do Honest Research & Validation

### Synthetic research (fast first filter)

Use AI to create realistic customer profiles and run conversations or scenarios with them.

Ask:

- How painful is the problem for this person?
- What do they currently do instead?
- Would they pay or change their behavior?
- What would make them trust a new solution?
- What would make them say no?

Do this for **several** customer groups, not just the one you like.  
Synthetic research is fast and cheap. It is also imperfect. Treat it as a useful **filter**, not final proof.

### Real-world research (required before heavy building)

- Talk to real people in the groups that looked strongest.
- Watch what they actually do, not only what they say.
- Run small tests (price conversations, manual “concierge” delivery, simple landing pages, waitlists with friction, etc.).
- Look for clear signals that the problem is real and that people will take action.

### Ranking rule

Only promote a customer group to **primary focus** if both synthetic and real-world evidence support it **and** the reward/risk scorecard looks manageable for a solo founder at the current stage (see next section).  
If evidence is weak, keep looking or kill the idea. Do not protect an idea just because you have already spent time on it.

---

## Reward / Risk Thinking & ICP Ranking

Not every customer group is equally attractive for a bootstrapped solo founder.  
When ranking ICPs, write down **both** sides. A simple scorecard beats a vague feeling that “this group seems good.”

### Reward side

- How painful and frequent is the problem?
- How clearly will people pay or take action?
- How large is the **reachable** market for a solo founder (not the fantasy TAM slide)?
- How well does the solution fit the channels you can actually operate today?

### Risk side

- How hard is it to reach these people?
- How much customization or hand-holding will they need?
- How messy is the other side of the market (suppliers, partners, operators)?
- How much legal or operational complexity is involved?
- How long will it take to get a clear signal?

### Promotion rule

Only promote a group to primary focus when:

1. Synthetic **and** real-world evidence support a real problem, and  
2. Reward looks real, and  
3. Risks look manageable for a solo founder **at this stage**

Improving scores on a **weak** hypothesis is less valuable than finding a stronger hypothesis.

Suggested one-row scorecard (copy per ICP):

```text
ICP:
Reward notes (pain, pay, reach, channel fit):
Risk notes (reach cost, hand-holding, messiness, legal, time-to-signal):
Synthetic evidence (date, summary):
Real evidence (date, summary):
Rank (1 = best) / Promote? (yes/no/hold):
Kill criteria for this ICP:
```

---

## Founder Control Plane

This is how you stay in charge of the company operating system.

### What you must always be able to see

- Current **journey phase** and **live loop stage**, and whether the next gate is **open**, **ready for review**, **blocked**, or **waiting for your decision**
- The top open questions or risks
- Current scores for the **active hypotheses and slices** (not only vanity product metrics)
- Clear moments when the system recommends you make a decision
- Recent important actions and the reasons they were taken (plain language)

### Natural language queries and Socratic dialogue

Ask the AI in normal language, for example:

- “Where are we right now?”
- “What is blocking the next step?”
- “What evidence do we actually have for this idea?”
- “Why do you think this customer group is strong?”
- “What should I decide today?”
- “Challenge the current ranking of customer groups.”
- “Show me the weakest assumptions we are still carrying.”

The AI must answer clearly, point to evidence, and accept challenge. Real back-and-forth about assumptions, trade-offs, and risks is expected.

### Strategic human interjection points

The system should surface moments where your judgment is especially valuable:

- Choosing or changing the primary customer group
- Setting or changing success thresholds
- Deciding whether weak evidence means “wrong idea” vs “needs more work”
- Deciding when to add people (hire / co-founder / contractor)
- Declaring that something has enough proof to grow (or enough weakness to kill)
- Choosing which **monetization path** to test next
- Setting **autonomy levels** (what the system may draft or do without you vs hard gates)

### When solo vs add people (lightweight test)

Stay solo while AI + your judgment still outrun coordination cost.  
Consider adding someone when **all** of the following hold:

1. A clear force-multiplier skill gap you cannot cover with AI + small tools  
2. Shared passion and standards (especially how they use AI)  
3. The risk of staying bottlenecked exceeds the risk of dilution, misalignment, or burn rate  
4. You can still keep phase gates and final strategy under founder control  

Document the decision either way.

---

## Decision Traces & Learning Loop

Important actions leave a simple record:

- **What** was done  
- **Why** (hypothesis or goal)  
- **What was observed**  
- **What happens next**  

These **decision traces** are the memory of the company. They serve three purposes:

1. **Honesty** — weak reasoning is harder to hide  
2. **Learning** — you and the AI improve from successes and failures  
3. **Feedback** — real usage flows back into the system  

When real users interact with the product, their decisions, approvals, rejections, and outcomes should feed back into:

- Customer profiles (ICPs / personas)  
- Success criteria and thresholds  
- Ranking of hypotheses  
- Improvement of the agents / product behavior itself  

Synthetic runs and real runs both produce traces. Over time the system should get better at predicting which actions lead to useful outcomes.  
Stage 7 of the live loop is where this write-back happens — see [`live-runtime.md`](live-runtime.md).

Suggested minimal template:

```text
Date:
Journey phase / loop stage:
Decision:
Options considered:
Evidence used (synthetic | real | mixed):
Choice:
Expected outcome:
Actual outcome (fill later):
Next review:
```

---

## Company-as-Code Thinking

In an AI-native company the repository (or single source of truth) is not just product code.  
It is the source of how the whole company thinks and acts: research, validation, product, evaluation, feedback, and learning.

Everything important lives in one place so both you and the AI agents can see the full picture. That is what makes the Control Plane work.

### Categories (names can evolve; categories should not)

| Category | Holds |
|----------|--------|
| **research/** | Customer profiles, interview notes, synthetic personas, validation results |
| **product/** | Working product pieces (app, agents, channels, flows) |
| **evals/** | Tests, scores, harnesses, pass/fail records, stress scenarios |
| **traces/** | Decision records from synthetic and real runs |
| **growth/** | Experiments, messaging, channel tests (once you reach that stage) |
| **docs/** | This operating system, open questions, thesis, ADRs |
| **AGENTS.md** (root) | Thin always-on enforcement for the primary AI agent |
| *Optional:* **company/** | Policies, autonomy rules, workflow schemas |
| *Optional:* **support/** | Escalation playbooks, exception handlers |
| *Optional:* **infrastructure/** | Shared synthetic tooling, persona/trace libraries |

Exact folder names can match your stack (`src/`, `docs/eval/`, etc.). The principle matters more than the labels: **one living source of truth** the founder and agents share. Nothing important should live only in chat history or in someone’s head.

### Example tree (adapt freely)

```text
your-startup/
  AGENTS.md               # Thin enforcement layer (see below)
  docs/
    company-os/           # Blueprint + live-runtime (or link)
    thesis.md             # Current thesis (hypothesis, not gospel)
    open-questions.md
  research/               # ICPs, personas, validation notes
  product/ or app/        # What you ship
  evals/ or tests/        # Automated + synthetic scenario tests
  traces/ or docs/decisions/
  growth/                 # Later
  company/                # Optional: policies, autonomy rules
  support/                # Optional: escalation playbooks
  infrastructure/         # Optional: shared synthetic tooling
  runtime/                # Optional: LangGraph/CrewAI/etc. company loop
```

Stage 7 of the live loop must write back into this tree (or an equivalent DB) so the next cycle is smarter.

**Frameworks:** LangGraph, CrewAI, and similar are **good options** for durable multi-step compute — not mandatory. Start with git + scripts if that is what you will actually run weekly. Details: [`live-runtime.md`](live-runtime.md).

Prefer public-safe language in public repos; keep real customer PII out of git history.

---

## Product Architecture Principles (Portable)

These are **company-design** principles, not a mandate to build any particular product (e.g. home services). Instance-specific architecture belongs in *your* product docs — Totbox example: [`applied-here.md`](applied-here.md).

### Multi-agent thinking (keep simple)

Inside the product it is often useful to think in **specialized roles** rather than one giant agent. Example role *types* (rename for your domain):

| Role type | Job |
|-----------|-----|
| Researcher | Finds and ranks options/candidates |
| Outreach | Contacts people/systems and manages conversations |
| Extractor | Pulls structured facts from messy replies |
| Presenter | Turns results into something a busy person understands quickly |
| Escalator | Knows when to ask the human for help |

These can be separate agents or clear responsibilities inside a larger system.  
What matters: each role has **clear success criteria** and leaves **decision traces**.

### Channel principle

Start with the **smallest set of channels** that can produce real value.  
Add channels only when the core loop already works and evidence supports expansion.

### Human high-stakes gate

Escalate to the human when stuck or when the decision is high-stakes (money, irreversible actions, PII, legal). Default to dry-run / draft until approval when harm is possible.

---

## Evaluation-Driven Development (EDD)

When you **build** (journey phase 6 / live loop stages 3–5), prefer this factory loop over “code first, measure later”:

```text
Spec + success criteria
    → Harness ready (can fail the slice repeatedly)
    → Implement the smallest increment
    → Evaluation gate (scores vs thresholds)
    → Integrate + capture decision traces
```

- **Spec** includes pass/fail numbers, human gates, and expected artifacts.  
- **Harness** may be fixtures, scripts, or synthetic personas — see [`live-runtime.md`](live-runtime.md).  
- **Gate** is founder-visible; weak scores mean Iterate/Hold, not silent ship.  

The **next product increment** after a thin slice passes uses the **same discipline** (criteria, harness, stress cases, gate) — do not invent a looser process for “just the next feature.”

---

## Instructions for Your Main AI Helper

### Thin enforcement layer vs full constitution

| Artifact | Role |
|----------|------|
| **This Operating System** (+ live-runtime) | Full constitution: phases, gates, research rules, scores |
| **Root `AGENTS.md` / project rules / system prompt** | **Thin, always-loaded** enforcement so the primary AI does not drift |

Most founder tools (Cursor, Claude, Codex-style agents, Grok, Lovable, etc.) support a persistent instruction file. Common names: `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, custom instructions.

That file should stay **short and authoritative**. It points at the full plan, encodes non-negotiable invariants, and tells the agent how to talk to you. It does **not** replace the Operating System, control plane, phase gates, or evaluation harnesses.

Canonical paste block: [`ai-instructions.md`](ai-instructions.md). Also pasteable below. Update when focus or hard rules change. Tools change quickly. Principles last longer.

```
You are my main AI operating partner for this company.

Follow the Company Operating System (solo-founder bootstrap blueprint + live runtime loop).
I stay in final control of strategy, journey phase changes, and important decisions.

Hard rules you must follow:
1. Never advance a journey phase without my explicit approval.
2. Never treat an early idea or customer group as proven until both synthetic and real-world evidence support it.
3. Always be able to tell me clearly where we are (journey phase + live loop stage), what evidence we have, and what the next gate is.
4. When an important decision needs human judgment, say so directly.
5. Prefer small, honest tests and evaluation-driven increments (Spec → Harness → Implement → Gate) over big unmeasured builds.
6. Record the reason for important actions (decision traces); close stage 7 (memory update) after meaningful runs.
7. Answer me in plain language I can understand.
8. Surface recommended human interjections when judgment is high-leverage (including autonomy levels and monetization path).
9. Keep reward/risk thinking visible when ranking customer groups or monetization paths.
10. Do not import another company's product thesis or market as mine unless I explicitly adopt it.
11. Treat LangGraph/CrewAI/etc. as optional implementors of the live loop — principles first, framework second.

If you are unsure, ask me. Do not guess on strategy or protect weak ideas.
```

---

## Current Working Hypothesis (Template Only)

**Do not fill this section with someone else’s business.**  
In *your* company runtime, keep a short hypothesis file (e.g. `docs/thesis.md`) with:

1. **Who** you help (primary ICP candidate)  
2. **What pain** you address  
3. **How** you help (one sentence)  
4. **Why now / why you**  
5. **Contrarian edge** (what others undervalue)  
6. Explicit label: **This is a hypothesis subject to evidence**

For how one real project currently states its hypothesis under this OS, see [`applied-here.md`](applied-here.md) — **example only**.

### First tiny slice (template)

For the primary ICP, define **one** slice that can fail fast. Before building, write:

| Artifact | Content |
|----------|---------|
| **End-to-end goal** | What a successful run produces |
| **Success criteria** | Pass/fail numbers, not vibes |
| **Harness reference** | How you re-run the slice (command, scenario ids) |
| **Expected artifacts** | Outputs that must exist (comparison, traces, state) |
| **Human gates** | What requires approval; what “stuck” means |
| **Synthetic runnable?** | Same personas as research can exercise the path |

Every run should leave decision traces.

If the slice works **and** the customer hypothesis still holds, define the **next small increment** with the **same checklist** (do not drop EDD discipline).

---

## Scoring Metrics We Watch

These scores help decide when something is good enough to move forward — or when to stop.  
Adjust names to your domain; keep them honest. Track them over time. Prefer **stable definitions** so comparisons stay meaningful across weeks.

### Evidence strength

| Score | What it asks |
|-------|----------------|
| **Problem evidence** | Is the pain real and frequent for this group? |
| **Willingness** | How often do synthetic and real people show clear willingness to act or pay? |

### Operational performance

| Score | What it asks |
|-------|----------------|
| **Completion** | % of runs that reach a defined terminal success state without unplanned escalation |
| **Extraction / quality** | % of contacts/sources that yield usable structured information |
| **Escalation** | % of runs needing human intervention (optionally by reason) |
| **Time-to-resolution** | Distribution of elapsed time from start to terminal state |
| **Trace completeness** | % of major steps that emit a valid decision trace |

### Experience & trust

| Score | What it asks |
|-------|----------------|
| **Trust / friction** | Does it feel trustworthy and low-friction? |
| **Approval friction** | How often / how many approval gates; acceptance vs rejection |
| **Re-engagement need** | How often the user must send extra clarifying input |
| **Channel success distribution** | Success rate by channel (email vs SMS vs form vs other) |

### Economic attractiveness

| Score | What it asks |
|-------|----------------|
| **Reward vs risk** | Overall attractiveness of the current primary ICP (scorecard) |
| **Early-revenue attractiveness** | Rank derived from reward vs risk for prioritization |
| **Willingness to pay (early)** | Signals for price / fee / subscription (as applicable) |

Use scores to decide **Advance / Iterate / Hold / Kill** — not to decorate a pitch deck.  
Thin-slice gates should set numeric thresholds on at least Completion, Extraction, Escalation, and Trace Completeness under normal (and selected stress) conditions.  
**Improving scores on a weak hypothesis is less valuable than finding a stronger hypothesis.**

---

## Near-Term Checklist (Any Startup)

1. Confirm the primary focus and contrarian edge still feel right to **you** (soft human check).  
2. Write down the current thesis and the main customer groups under consideration.  
3. Run honest synthetic research across several groups (not just the favorite).  
4. Create simple **reward/risk scorecards** for the top candidates.  
5. Rank them by evidence, not by preference.  
6. Do real conversations and small tests with the strongest groups.  
7. Only then lock a primary focus and a tiny first slice (with the slice artifact checklist).  
8. Put the thin AI instructions into root `AGENTS.md` / your main tool.  
9. Define clear **numeric** pass/fail thresholds for the first slice **before** building further.  
10. Set up a **minimal evaluation harness** so the slice can be run repeatedly against synthetic personas ([`live-runtime.md`](live-runtime.md)).  
11. Run evaluation-driven increments (Spec → Harness → Implement → Gate).  
12. Keep asking: “What evidence do we actually have?” and “What would make us kill this hypothesis?”  
13. Keep decision traces for anything that changes phase, ICP, monetization path, autonomy, or spend.

---

## Open Questions (Starter Set)

Every company should maintain its own list. Starter prompts:

- Which customer groups currently have the strongest **combined reward/risk** profile?  
- What exact price (if any) are people willing to pay?  
- What are the **numeric pass thresholds** for the current thin slice?  
- How often should the system ask the human for approval versus acting within a safe draft/dry-run band (**autonomy level**)?  
- What legal and ethical rules apply to outreach in our channels?  
- When do the risks of staying solo become larger than the risks of adding help?  
- What is the **minimum viable set of channels** that still produces real value?  
- How aggressively should multi-party outreach run in **parallel** vs sequential trust-building?  
- How will real usage data be captured and fed back into synthetic personas and decision traces?  
- Which failures become permanent **stress scenarios**?  
- What would make us **kill** the current hypothesis cleanly?

---

## What This System Explicitly Avoids

- Treating a polished deck or long roadmap as proof  
- Building a platform before a single complete user loop works  
- Protecting a favorite ICP when scores are weak  
- Optimizing operational scores while ignoring a weak hypothesis  
- Letting AI silently change strategy or phase  
- Building without an evaluation harness or numeric gate  
- Copying another startup’s product because their OS docs lived in the same monorepo  
- Expanding channels or multi-agent complexity before the thin slice works  
- Silently rewriting this template every time one product ships a feature  

---

## Changelog (high level)

| Version | Notes |
|---------|--------|
| 1.9 | Draft used in mentoring conversations |
| 2.0 | Isolated as portable blueprint; product hypothesis moved to application example; mentee/AI extraction rules; solo-vs-add test; company-as-code layout |
| 2.1 | Live runtime: persistent state + 7-stage continuous loop; two clocks (journey vs loop); framework-agnostic compute (LangGraph/CrewAI as examples) — see `live-runtime.md` |
| 2.2 | Reward/risk ICP scorecards; learning-loop feedback into personas/agents; company-as-code categories; portable multi-agent + channel principles; eval harness continuity (see live-runtime); refined score groups; monetization interjection |
| 2.3 | Enhance-only recovery from earlier drafts: formal lifecycle aliases; EDD loop; AGENTS.md thin enforcement; structured phase gates; TTR / channel distribution / early-revenue metrics; thin-slice artifact checklist; autonomy interjection; optional company/support/infrastructure leaves; template change policy pointer |

---

*AI tools change fast. Principles last longer.*  
*Goal: help a solo founder use AI to move faster than ever while staying honest, in control, and unwilling to protect weak ideas.*
