# Company Operating System  
## For Solo Founders in Bootstrapping Mode

**Version:** 2.5  
**Last Updated:** 2026-07-28  
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

**Golden rule for extraction:** Copy *process and control*. Do not copy another founder’s market, customer group, feature list, or “current hypothesis” as yours.

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
2. Generate several possible customer groups — not one favorite.
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
| 1 | Form thesis and list possible customer groups | Ideation & Opportunity Framing | Written thesis + at least 3 customer-group candidates |
| 2 | Define what success looks like for each group | Vision, Mission & Customer Definition | Clear metrics / “done means…” per group |
| 3 | Synthetic research and first validation | Customer Discovery & Problem Validation *(synthetic leg)* | Ranked groups with written evidence notes; promote still **hold** |
| 4 | Real-world research and validation | Customer Discovery *(real leg)* + start of Solution & Monetization Validation | Real interest tests and/or conversations; weak groups demoted; see [next pack](#after-synthetic-ranking-the-next-pack) |
| 5 | Design the simplest system that can test the winner | Architecture & Agentic System Design | One tiny slice + pass/fail rules + human gates; light synthetic product sandbox often runs here in parallel with phase 4 |
| 6 | Build a tiny slice and test it hard | Build (Evaluation-Driven Development) | Slice runs end-to-end (fixture/sim OK); gate scores |
| 7 | Try it with real or realistic users | Test, Synthetic Evaluation & Early Launch | Observed behavior, not only compliments |
| 8 | Learn from what happens and improve | Traction, Feedback & Continuous Learning | Decision traces + score movement |
| 9 | Grow only after it clearly works | Scale & Expansion (after clear product–market fit) | Proof of value or payment; then expand |

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

Research has three jobs that must not be mixed up:

1. **Filter** cheaply with synthetic work (AI-modeled customers).  
2. **Ground** market claims in outside facts when you can.  
3. **Prove** with real people and real behavior before heavy building.

### Label every claim (what kind of evidence is this?)

Every important finding should carry **one** label. Use plain words so you never confuse a simulation with a sale.

| Label | Meaning | May be used as… |
|-------|---------|-----------------|
| **Outside facts** | Grounded in public or third-party sources (rules, filings, published data, on-the-record quotes) | Context for “why now” and market pressure |
| **Company signals** | Reaction to something true about *your* company (founder background, real pilots, real product behavior) | Trust and credibility tests only if the signal is real |
| **Assumed capability** | Valid **only if** a feature, security control, or process you do not fully have yet is treated as real | A build priority hypothesis — **not** proof you already have it |
| **Needs real-world proof** | Cannot be settled by AI-modeled people alone (demand, price they will pay, security approval, purchase) | Interview and pilot design only |

**Front-matter for any synthetic pack** (copy at the top of the file):

```text
What this is: AI-modeled customer responses used as a filter.
What this is not: proof of demand, willingness to pay, or a real purchase.
Outside facts are labeled separately. Everything else is a hypothesis to confirm or break with real people.
```

Older shorthand `synthetic` | `real` | `mixed` on traces is still fine for run type.  
For **claims inside a report**, prefer the four labels above so “assumed capability” cannot hide as “real.”

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

### Staged trust reveal (how synthetic trust actually moves)

If you score trust, adoption interest, or purchase interest with synthetic people, do **not** show them everything at once. Reveal in stages and score after each stage:

| Stage | What you show | Why |
|-------|----------------|-----|
| **1. Baseline** | Problem and offer only — no founder story, no traction claims, no product magic you do not have | Measures whether the idea is clear and relevant on its own |
| **2. Founder story** | Who you are and why you understand this problem (truthful only) | Isolates whether *you* earn attention |
| **3. Company signals** | Only real traction or proof you already have | Isolates whether the *company* earns a serious next step |
| **4. Assumed capability** | Features or controls you might build, clearly labeled as “if we had this” | Isolates what to build next — not what already exists |

**Reading rule:** Score **movement** between stages matters more than any single absolute score.  
A high final score that only appears after assumed capability means “build and re-test,” not “customers already want this.”  
Simulated prices and “I would buy” lines stay labeled **needs real-world proof**.

### Outside market facts (supports vs does not establish)

When you write or review market claims (deadlines, growth rates, competitor moves):

| Write explicitly | Purpose |
|------------------|---------|
| **What the evidence supports** | Claims that survive contact with sources (with links or citations) |
| **What the evidence does not establish** | Gaps, disagreements between sources, or leaps from “market is big” to “they will buy from me” |

Do not quote one vendor forecast as a hard fact when several sources disagree. Prefer a **range** and a **directional** claim you can defend.  
A strong market story is still not primary-focus promotion without customer evidence.

### Real-world research (required before heavy building)

- Talk to real people in the groups that looked strongest.
- Watch what they actually do, not only what they say.
- Run small tests (price conversations, manual “concierge” delivery, interest pages with waitlists, etc.).
- Look for clear signals that the problem is real and that people will take action.
- Carry forward open questions from synthetic work; design tests that can **break** your favorite story.

After you have a ranked synthetic research report, use the **next pack** below instead of jumping straight to a big build.

### Ranking rule

Only promote a customer group to **primary focus** if both synthetic and real-world evidence support it **and** the reward/risk scorecard looks manageable for a solo founder at the current stage (see next section).  
If evidence is weak, keep looking or kill the idea. Do not protect an idea just because you have already spent time on it.  
Multi-group research is not multi-group go-to-market: **rank, demote, and hold** until promotion criteria are met.

---

## After Synthetic Ranking: The Next Pack

When user research has produced **ranked customer groups** (still with promote = **hold**), do **not** jump to a large product or a multi-cohort sales push.  
Run a **next pack** with two tracks. They answer different questions and may run **in parallel** or one after the other.

| Track | Question it answers | Evidence label |
|-------|---------------------|----------------|
| **A. Light synthetic product sandbox** | Is the product **capable enough yet** on a thin path under messy, multi-person conditions? | Synthetic product feasibility — **not** demand |
| **B. Real interest tests** | Will real people take a small step (waitlist, reply, book a call)? | Early real signal — **not** proof they will pay or stay |

Both are **filters**. Neither alone unlocks primary-focus promotion or “ship and scale.”

```text
Ranked synthetic groups (promote = hold)
        │
        ├──────────────────────────────┐
        ▼                              ▼
A. Light synthetic product         B. Real interest tests
   sandbox (feasibility)              (waitlist / outreach / …)
        │                              │
        └──────────────┬───────────────┘
                       ▼
              Founder gate (iterate / hold / deepen build)
                       │
                       ▼
              Tiny real slice + keep sandbox as eval harness
```

### Track A — Light synthetic product sandbox (feasibility)

A **completely simulated, isolated** run of a baseline product path. No real customers. No real outbound messages by default. No production side effects.

**Purpose:** answer *“Is the product capable enough yet?”* under realistic mess — not “Do people want this?” (that is Track B and later real proof).

This is **product feasibility evaluation**. You stress the thin slice the way the real world will: many steps, many people, imperfect information. A pretty demo that only works on a happy path is not a pass.

**What “feasible” means here**

The product (often including an AI assistant) must hold a **useful thread of work** to a defined end state **without** the founder silently fixing everything off-stage.

Typical stresses to encode as scenarios (pick what your product actually faces):

| Stress | What you are testing |
|--------|----------------------|
| **Long-running work** | Context survives hours or days, not one chat turn |
| **Multiple channels** | Email, SMS, chat, forms, or voice notes — same job, switched midstream |
| **Multiple people** | User, co-decider, provider/operator, and handoffs between their staff |
| **Different language styles** | Formal vs terse vs slang; incomplete sentences; mixed languages if relevant |
| **Handoffs and triage** | “I’ll pass you to scheduling” / new employee who lacks prior context |
| **Miscommunication** | Ambiguous replies, talking past each other, conflicting instructions |
| **Lost or wrong notes** | Missing thread, outdated address, wrong date, invented detail |
| **Recovery** | Product notices the gap, asks, escalates, or re-states truthfully |

*Domain example (not a required market):* an assistant helping a household manager coordinate a service job while the provider side triages and hands the thread between employees. The sandbox asks whether the assistant can stay coherent across channels and people — or whether it is **not ready yet**.

**Who you simulate**

1. **Each customer group still on the board** from the research report (same group ids as research — synthetic continuity).  
2. For every group, a **small cast of synthetic people** drawn from the **roles on the real product path** — not your whole company org chart forever.  
   Examples of path roles (rename for your domain): end user, second decision-maker, provider or operator, front-line employee, supervisor who takes a handoff, reviewer who can say no.  
3. Prefer a **sample** of each role type (one typical + one difficult), not dozens of near-duplicates.  
4. Sample **behavior styles** as well as job titles (careful, rushed, hostile, vague).

**Depth rule (stay light)**

| Group rank | Sandbox depth |
|------------|----------------|
| Top 1–2 test priority | Full baseline path + hard multi-person / multi-channel cases |
| Other groups still “hold” | Short baseline only: does the path apply? |
| Explicitly demoted / kill | Skip or one-line note why out of scope |

**What to run (per group you include)**

Define **one thin end-to-end baseline** (same shape as the first tiny slice):

```text
Trigger → core steps (may span time and channels) → clear next human action or terminal state
```

Then run at least:

1. Happy path  
2. Messy or incomplete input  
3. Stuck / needs human help  
4. One adversarial or “status quo is fine” case  
5. **Capability stress** (when the product is multi-party or multi-channel): handoff, context switch, or wrong/lost information  

Write **pass/fail** before you run — including what counts as “held the thread” vs “lost the plot.”  
Record decision traces. Re-use scenario ids later in the real evaluation harness ([`live-runtime.md`](live-runtime.md)).

**Sandbox rules**

1. **Isolated** — fake data only; dry-run by default; nothing that can email, charge, or change a real account.  
2. **End-to-end for the thin path** — not a full platform.  
3. **Same personas / group ids** as research when possible.  
4. **Assumed capability stays labeled** — if the sim pretends a feature exists, mark those results **assumed capability**.  
5. **Fail closed on capability** — if success needs constant founder interpretation, secret re-prompts, or ignoring bad handoffs, the product is **not capable enough yet**.  
6. **Honest scoreboard** — separate “path is clear” from “AI/product held up under mess.” A clear path with a weak assistant is still a fail for ship-readiness of that assistant.

**Outputs (minimum)**

```text
Sandbox id / date:
Customer groups covered:
Path roles simulated (and styles):
Channels and time span exercised:
Scenario ids + pass/fail:
Capability verdict: capable enough for thin path / not yet / unknown:
Where humans must approve:
Where context was lost, invented, or handed off badly:
What to change in product or slice before real build:
Evidence label: synthetic product feasibility (not demand)
```

### Track B — Real interest tests (waitlist and friends)

Small **real-world** steps that measure whether people will act at all — not whether they will pay forever.

**Purpose:** interest and channel signal under the **needs real-world proof** label for demand and price.

**Typical tools (pick what fits; mix is fine)**

| Means | Examples |
|-------|----------|
| **Page + waitlist** | Simple landing page; email or SMS list; friction (who they are, what problem) |
| **Organic** | Communities, content, personal network, referrals |
| **Social** | Posts with a clear next step |
| **In person** | Events, local boards, warm intros |
| **Paid** | Small, capped ad tests only after the offer text is clear |
| **Direct** | Outreach that asks for a reply, call, or pilot brief |

**Rules**

1. **One primary message per test group** — do not run five unrelated brand stories at once.  
2. **Measure behavior**, not compliments: signup, reply, booked call, submitted brief.  
3. **Write decision thresholds before you spend** (example: “if fewer than X qualified signups in Y days on Z spend, iterate message or demote channel”).  
4. **Cap paid spend** until a thin offer has passed at least one honest real conversation or sandbox feasibility check.  
5. **Waitlist ≠ willingness to pay.** Treat it as early interest. Price and payment stay open questions.  
6. **Lawful capture only** — consent, no spam, public-safe notes in public repos.

**Outputs (minimum)**

```text
Test id / date:
Customer group targeted:
Channel(s) used:
Offer / page link (if any):
What people did (counts + examples, redacted):
Cost (time and money):
Pass / iterate / stop vs your pre-written thresholds:
Evidence label: real interest signal (not product-market fit)
```

### How to sequence A and B

| Pattern | When it fits |
|---------|----------------|
| **Parallel** (default for many solo founders) | Sandbox nights / AI time; interest tests when humans are reachable |
| **Sandbox first** | Path is unclear or multi-step; you would be embarrassed to show a broken story |
| **Interest first** | Message and channel are the open questions; the first offer is mostly concierge |

Do **not** wait for a perfect multi-actor simulated world before talking to anyone.  
Do **not** scale ads while the thin path fails every sandbox run.

### Founder gate before heavy build

After the next pack has produced artifacts, decide explicitly:

| Decision | Meaning |
|----------|---------|
| **Iterate** | Fix slice, message, or ranking; re-run A and/or B |
| **Hold** | Interesting but weak signal; no big build or big spend |
| **Deepen build** | Thin real slice + keep sandbox scenarios as the evaluation harness |
| **Kill** | Kill criteria hit for the hypothesis or the top group |

Primary-focus **promotion** still requires the full promotion rule (synthetic + real + manageable risk) — a green sandbox and a fat waitlist are helpful, not sufficient.

---

## Reward / Risk Thinking & Customer Group Ranking

Not every customer group is equally attractive for a bootstrapped solo founder.  
When ranking groups (sometimes called ideal customer profiles), write down **both** sides. A simple scorecard beats a vague feeling that “this group seems good.”

### Reward side

- How painful and frequent is the problem?
- How clearly will people pay or take action?
- How large is the **reachable** market for a solo founder (not a fantasy total-market slide)?
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

### Scorecard (copy per customer group)

Use this for ranking and promotion. Messaging fields are optional; they do **not** replace reward/risk or kill criteria.

```text
Customer group:
Reward notes (pain, pay, reach, channel fit):
Risk notes (reach cost, hand-holding, messiness, legal, time-to-signal):
Synthetic evidence (date, summary, evidence labels used):
Real evidence (date, summary):
Rank (1 = best test priority) / Promote? (yes / no / hold):
Kill criteria for this group:

Optional — what to say (for interview and outreach tests only):
  Main pain (in their words):
  Language that seems to work:
  Main objection:
  Proof they would need:
  Clear next step to offer:
  Price or offer range to test (hypothesis only — needs real-world proof):

Optional — next pack (after ranking):
  Sandbox baseline path pass/fail (date):
  Real interest test result (date, channel, behavior counts):
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

### Virtual office (how company work is divided)

You do not need a big team. You **do** need honest labels for who or what does each job today.  
This is about **company functions** (research, sales, product, finance), not product agents inside the app.

For each important function, keep a short card:

```text
Function name:
Job (one sentence):
Who does it today:
  - Founder owns it
  - AI helps (drafts or research only — human still decides)
  - Open (not staffed yet — hire or fill later)
What goes in:
What comes out:
What we do this week:
Who must approve before anything goes external:
```

Rules:

1. **No fake staffing.** Do not label a box “Marketing Bot” or “Research Agent” as if a person exists. If AI helps, say so and name the human who approves.  
2. **One human gate per external claim.** Market numbers, customer promises, and public posts need a named person (usually you).  
3. **Hire on a trigger, not a date.** Write what must be true before a hire makes sense (for example: “paid customers exceed white-glove founder time”), not only “hire in Q3.”  
4. **Outputs beat org charts.** Each function should hand something concrete to the next (brief, scorecard, pilot, decision trace).

A one-page virtual office plus the control plane answers “Where are we?” better than a title-heavy chart of empty roles.

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

- Customer profiles (groups / personas)  
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
Evidence used (run type: synthetic | real | mixed; claim labels if needed):
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
  research/               # customer groups, personas, validation notes
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

Two different maps — do not mix them:

| Map | What it describes | Where |
|-----|-------------------|--------|
| **Virtual office** | Company functions and who runs them today | Control plane (above) |
| **Product roles** | Specialized jobs *inside* what customers use | This section |

Inside the product it is often useful to think in **specialized roles** rather than one giant agent. Example role *types* (rename for your domain):

| Role type | Job |
|-----------|-----|
| Researcher | Finds and ranks options/candidates |
| Outreach | Contacts people/systems and manages conversations |
| Extractor | Pulls structured facts from messy replies |
| Presenter | Turns results into something a busy person understands quickly |
| Escalator | Knows when to ask the human for help |

These can be separate agents or clear responsibilities inside a larger system.  
What matters: each role has **clear success criteria**, leaves **decision traces**, and escalates high-stakes steps to a human.

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
3. Label claims honestly: outside facts, company signals, assumed capability, or needs real-world proof.
   Never treat simulated prices or "I would buy" as demand.
4. Always be able to tell me clearly where we are (journey phase + live loop stage), what evidence we have, and what the next gate is.
5. When an important decision needs human judgment, say so directly.
6. Prefer small, honest tests and evaluation-driven increments (Spec → Harness → Implement → Gate) over big unmeasured builds.
7. After ranked synthetic research, prefer the next pack: light synthetic product sandbox and/or real interest tests before a heavy build.
8. Record the reason for important actions (decision traces); close stage 7 (memory update) after meaningful runs.
9. Answer me in plain language I can understand. Avoid cryptic abbreviations.
10. Surface recommended human interjections when judgment is high-leverage (including autonomy levels and monetization path).
11. Keep reward/risk thinking visible when ranking customer groups or monetization paths.
12. Do not import another company's product thesis or market as mine unless I explicitly adopt it.
13. Treat agent frameworks as optional implementors of the live loop — principles first, framework second.

If you are unsure, ask me. Do not guess on strategy or protect weak ideas.
```

---

## Current Working Hypothesis (Template Only)

**Do not fill this section with someone else’s business.**  
In *your* company runtime, keep a short hypothesis file (e.g. `docs/thesis.md`) with:

1. **Who** you help (primary customer-group candidate)  
2. **What pain** you address  
3. **How** you help (one sentence)  
4. **Why now / why you**  
5. **Contrarian edge** (what others undervalue)  
6. Explicit label: **This is a hypothesis subject to evidence**

For how one real project currently states its hypothesis under this OS, see [`applied-here.md`](applied-here.md) — **example only**.

### First tiny slice (template)

For the primary customer group, define **one** slice that can fail fast. Before building, write:

| Artifact | Content |
|----------|---------|
| **End-to-end goal** | What a successful run produces |
| **Success criteria** | Pass/fail numbers, not vibes |
| **Harness reference** | How you re-run the slice (command, scenario ids) |
| **Expected artifacts** | Outputs that must exist (comparison, traces, state) |
| **Human gates** | What requires approval; what “stuck” means |
| **Synthetic runnable?** | Same personas as research can exercise the path |

Every run should leave decision traces.

If the slice works **and** the customer hypothesis still holds, define the **next small increment** with the **same checklist** (do not drop evaluation-driven discipline).

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
| **Reward vs risk** | Overall attractiveness of the current primary customer group (scorecard) |
| **Early-revenue attractiveness** | Rank derived from reward vs risk for prioritization |
| **Willingness to pay (early)** | Signals for price / fee / subscription (as applicable; real-world proof when claimed) |

Use scores to decide **Advance / Iterate / Hold / Kill** — not to decorate a pitch deck.  
Thin-slice gates should set numeric thresholds on at least Completion, Extraction, Escalation, and Trace Completeness under normal (and selected stress) conditions.  
**Improving scores on a weak hypothesis is less valuable than finding a stronger hypothesis.**

---

## Near-Term Checklist (Any Startup)

1. Confirm the primary focus and contrarian edge still feel right to **you** (soft human check).  
2. Write down the current thesis and the main customer groups under consideration.  
3. For market claims, write **what the evidence supports** and **what it does not establish**.  
4. Run honest synthetic research across several groups (not just the favorite), with evidence labels and a staged trust reveal when you score trust or price interest.  
5. Create **reward/risk scorecards** for the top candidates (optional “what to say” fields only after rank/hold is clear).  
6. Rank them by evidence, not by preference; demote weak groups explicitly; keep promote = **hold**.  
7. Run the **next pack**: light synthetic product sandbox (Track A) and/or real interest tests such as waitlists (Track B) — parallel is fine.  
8. Founder gate on sandbox + interest results before a heavy build.  
9. Do deeper real conversations and small paid or concierge tests with the strongest groups.  
10. Only then lock a primary focus and a tiny first slice (with the slice artifact checklist).  
11. Sketch a **virtual office**: who does each function today, what comes out this week, who approves external claims.  
12. Put the thin AI instructions into root `AGENTS.md` / your main tool.  
13. Define clear **numeric** pass/fail thresholds for the first slice **before** building further.  
14. Keep sandbox scenario ids as the seed of a **minimal evaluation harness** ([`live-runtime.md`](live-runtime.md)).  
15. Run evaluation-driven increments (Spec → Harness → Implement → Gate).  
16. Keep asking: “What evidence do we actually have?” and “What would make us kill this hypothesis?”  
17. Keep decision traces for anything that changes phase, customer group, monetization path, autonomy, or spend.

---

## Open Questions (Starter Set)

Every company should maintain its own list. Starter prompts:

- Which customer groups currently have the strongest **combined reward/risk** profile?  
- Did the light synthetic product sandbox pass baseline paths for the top groups?  
- Did real interest tests clear pre-written thresholds (waitlist, replies, calls)?  
- What exact price (if any) are people willing to pay? (real-world proof only — not simulated tables)  
- What are the **numeric pass thresholds** for the current thin slice?  
- How often should the system ask the human for approval versus acting within a safe draft/dry-run band (**how much the system may do alone**)?  
- What legal and ethical rules apply to outreach in our channels?  
- When do the risks of staying solo become larger than the risks of adding help?  
- What is the **smallest set of channels** that still produces real value?  
- How aggressively should multi-party outreach run in **parallel** vs building trust one step at a time?  
- How will real usage data be captured and fed back into synthetic personas and decision traces?  
- Which failures become permanent **stress scenarios**?  
- What would make us **kill** the current hypothesis cleanly?

---

## What This System Explicitly Avoids

- Treating a polished deck or long roadmap as proof  
- Building a platform before a single complete user loop works  
- Protecting a favorite customer group when scores are weak  
- Treating simulated prices or “I would buy” lines as demand  
- Treating “if we had this feature” scores as proof the product already works  
- Treating a green synthetic product sandbox as demand or product–market fit  
- Treating waitlist size alone as willingness to pay  
- Building a huge multi-role simulated world before a thin baseline path works  
- Scaling paid ads while the thin path fails sandbox runs  
- Optimizing operational scores while ignoring a weak hypothesis  
- Letting AI silently change strategy or phase  
- Building without an evaluation harness or numeric gate  
- Copying another startup’s product because their OS docs lived in the same monorepo  
- Expanding channels or multi-agent complexity before the thin slice works  
- Fake org charts (generic bot labels, empty roles with no outputs or human gates)  
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
| 2.4 | Evidence labels (outside facts / company signals / assumed capability / needs real-world proof); staged trust reveal; market “supports vs does not establish”; optional “what to say” fields on scorecards; virtual office cards + hire triggers; plain-language pass on ranking section |
| 2.5 | Next pack after synthetic ranking: light isolated synthetic product sandbox (capability/feasibility under multi-party mess) + real interest tests; parallel/sequence rules; founder gate before heavy build |

---

*AI tools change fast. Principles last longer.*  
*Goal: help a solo founder use AI to move faster than ever while staying honest, in control, and unwilling to protect weak ideas.*
