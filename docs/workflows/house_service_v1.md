# House Service Job — stable workflow v1

**Workflow ID:** `house_service_v1`  
**Audience:** end users (simple path) + developers (drill-down)  
**Rule:** one spine for all house services; service kinds only change **fields/templates**, not the top-level story.

Code maps live instances → this view via `src/lib/workflow-progress.ts` (`progress` on `get_job` / MCP).

**Interchange format:** versioned JSON (`totbox.workflow_def` / `totbox.workflow_progress`) + Mermaid/text projections — see [`format.md`](format.md).

### Ask your host AI anytime (MCP)

| You say | Tool |
|---------|------|
| “How does Totbox work for house services?” | `get_workflow` |
| “What is different for HVAC / cleaning?” | `get_workflow({ service_kind: "hvac" })` |
| “Where is my AC job?” | `get_workflow({ job_id })` or `get_job` |
| “List my open jobs” | `list_jobs` (each has `progress_strip`) |

Host should render **`strip` + `role_line`** (or `progress.strip` / `progress.role_line`) on one mobile screen. Full control: you approve send, address sharing, and money/time.

**Live sample UI (interactive):** open **`/workflow`** in the Next app — same data model as MCP `get_workflow`, mobile-friendly, tap steps to inspect You vs App roles.

---

## What you see (consumer — any phone or desktop)

Keep this diagram **short enough for one screen**. Eight steps max.

```text
  1.Describe  →  2.Details  →  3.Contact  →  4.Send
       ↓              ↓             ↓            ↓
  5.Hear back  →  6.Choose  →  7.Booked  →  8.Done
```

**Where you are:** one step is **current** (●), earlier are **done** (✓), later are **upcoming** (○).  
If something is waiting on you: **needs you** (⚠).

### Mobile-friendly strip

```text
✓ Describe · ✓ Details · ● Send · ○ Hear back · ○ Choose · ○ Booked · ○ Done
You: approve this message before we send it.
```

### What each step means (plain language)

| # | Step | You (homeowner) | App + your AI helper |
|---|------|-----------------|----------------------|
| 1 | **Describe** | Say what you need (e.g. AC tune-up, deep clean) | Turns it into a clear job package |
| 2 | **Details** | Confirm address / access if asked | Pulls from memory when allowed; never invents |
| 3 | **Contact** | Pick who to contact (from search or “my usual”) | Drafts the message; does **not** invent a city directory |
| 4 | **Send** | **Approve** the message (and that address may be shared) | Sends via your tools (email/SMS) or records dry-run |
| 5 | **Hear back** | Paste a reply if needed | Watches/records quotes and times |
| 6 | **Choose** | **Approve** price and time | Shows options; won’t lock money/time without you |
| 7 | **Booked** | Be ready on the day | Holds the confirmed appointment |
| 8 | **Done** | Pay / note outcome | Optional next-due reminder |

**Safety:** early on, the app asks more often. That is intentional (must not do harm).

---

## Same spine for every house service?

**Yes** for the eight steps above.

| Service | Same steps? | What changes (under the hood / copy) |
|---------|-------------|--------------------------------------|
| HVAC | Yes | Maintenance vs repair notes, system fields, membership language |
| Cleaning | Yes | Priority rooms list, duration |
| Tree / lawn | Yes | Season rules (e.g. Oak Wilt), site notes |
| Other | Yes | Generic brief fields |

We do **not** ship a different top-level diagram per trade. Rare branches (cancel, no-reply chase, multi-vendor fan-out) stay **inside** steps 4–6 as loops, not a new consumer map.

---

## Instance = your job this week

```text
Stable workflow house_service_v1
        │
        ▼
Job instance  job_abc123  (HVAC · “tune-up under $300”)
  progress: step 4 Send · needs your approval
  you: approve draft email
  app: waiting — will not send without you
```

Facts (address, vendor email, Tuesday 9am) live on the **instance**. The **map** stays the same.

---

## Developer drill-down (what you see + under the hood)

Consumers only need the 8 steps. Developers also see:

| Consumer step | Internal status (examples) | Checklist ids | Typical tools |
|---------------|----------------------------|---------------|---------------|
| 1 Describe | `intake` | `brief` | `start_job` |
| 2 Details | `blocked` / `planning` | `address` | `update_job_facts` (host memory) |
| 3 Contact | `planning` / `drafting_outreach` | `provider_contact`, `draft_outreach` | draft work order |
| 4 Send | `awaiting_user_approval` → `outbound_sent` | `send_outreach` | `record_user_approval`, `approve_and_send_message` |
| 5 Hear back | `awaiting_provider_reply` / `negotiating` | `provider_reply` | `ingest_provider_message` |
| 6 Choose | `awaiting_user_decision` | `user_decision` | `record_user_approval` (money/time) |
| 7 Booked | `scheduled` / `in_progress` | `scheduled` | `confirm_appointment` |
| 8 Done | `done` / `settling` | `settle` | audit / next-due later |

**Debug bundle on every job** (`get_job` / MCP):

- `progress` — consumer steps + current + role lines (safe to show users)  
- `status`, `checklist`, `blocks`, `next_action` — engine state  
- `approvals`, `audit_tail`, `messages_count`, `quotes` — forensics  

Illegal transitions stay **REFUSED** (e.g. send without approval; confirm without money/time grant).

---

## Collaborative stabilize → implement instances

1. **Design** this v1 diagram with real dogfood jobs (change rarely).  
2. **Compile** into code (`workflow-progress.ts` + `job-pm` checklists) + tests.  
3. **Version** as `house_service_v1`; bump only with a written reason.  
4. **Instances** = `start_job` with household/task/time data.  
5. **Trace** = same diagram + audit for support/debug.

---

## Non-goals for the top-level view

- Full BPMN for consumers (BPMN is a **semantic dialect** only — see [`format.md`](format.md))  
- Per-trade different main maps  
- Showing raw tool names to homeowners  
- City-wide vendor directory as a step  
- Mermaid or ASCII as a second source of truth (always derive from JSON)

---

*Source of truth for the consumer story. Implementation: `src/lib/workflow-progress.ts` + format schemas in `src/lib/workflow-format.ts`.*
