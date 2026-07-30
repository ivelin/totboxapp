# Phase 1 — single-DM cleaning shadow path

**ICP:** `household-single-decision-maker-recurring`  
**Job type:** cleaning (**B**) — exception / rebook / rescope first  
**Dual-income A/B:** deferred until this cycle finishes  
**Scorecard:** [`scores.md`](scores.md) (5 plain pass/kill questions)

## Fair test jobs (pick one)

Good residual (use these):

- Cleaner canceled / no-show → need a one-off or replacement  
- Deep clean / blinds / move-out scope (not the usual recurring visit)  
- Rate change or “pause for 3 weeks then rebook” thrash  
- First cleaner hire this year (you already have 1–2 names from Google/AI/memory)

Avoid for first test:

- Standing biweekly with zero emails and nothing to decide  

## How to run (local)

```bash
npm install          # if needed
npm run dev:mcp      # http://localhost:3001/mcp
```

Connect your host chat to that MCP. Full consumer steps: [`docs/local_household_runbook.md`](../../local_household_runbook.md).

### Before you start

1. Count **status-quo hassle** for this job (rough): how many emails/calls/texts you expect without Totbox.  
2. List **1–2 cleaners you already chose** (no Totbox directory).  
3. Stay public-safe: real address/phone stay in `.data/` / host tools only — **not** in git.

### During

1. `start_job` — describe the cleaning exception/rebook.  
2. Facts only you provide (address, preferences) — never invent PII.  
3. Draft outreach → **you approve** before any send (dry-run default).  
4. Paste vendor replies → normalize quotes / times.  
5. **You approve** money/time → book.  
6. After service: complete + optional next-due.

### After (every job)

Answer the 5 pass/kill questions in `scores.md`.  
Write a **redacted** note (private OK; public-safe summary under `traces/decisions/` if committing).  
Then:

```bash
npm run company-os -- run-stage --signal "single-DM cleaning job: pass|fail on 1-5 + one-line outcome"
```

## Success bar for “cycle progress”

- At least **one** fair cleaning job fully instrumented.  
- Prefer **3–5** before declaring beachhead healthy or dead.  
- Only then open dual-income A/B.

---

## Cleaning `start_job` example (placeholders only)

```json
{
  "intent": "3hr deep clean: blinds, under beds, corners — need options before I confirm; this week if possible",
  "provider_label": "YOUR_USUAL_CLEANER_OR_SEARCH_NAME",
  "provider_email": "cleaner@example.com"
}
```

Use a **second** `start_job` or parallel outreach only if you are truly comparing two user-sourced cleaners (still no Totbox directory).

---

## After-job scorecard (copy, fill, keep private or redact)

```text
Job type: cleaning exception / rebook / rescope
Date: YYYY-MM-DD
Rough hassle WITHOUT Totbox (N emails/calls): __
Rough hassle WITH Totbox (N real decisions): __

1 Less hassle?     yes / no / unclear
2 Finished + gates? yes / no / unclear
3 Your vendors?    yes / no / unclear
4 Real leftover mess (not autopilot)? yes / no / unclear
5 Safe?            yes / no

One-line outcome: ________________________________
Open bugs / product gaps: ________________________
```

Public-safe one-liner for git (optional):

```bash
npm run company-os -- run-stage --signal "single-DM cleaning: pass 1-5 = Y/N/…; outcome=…"
```
