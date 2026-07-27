# Local household runbook — Phase 1 consumer path

**Audience:** You, running Totbox against **your own house** (or a developer clone).  
**Thesis:** Totbox is a **job project manager** for home services — not a city vendor directory. Find companies via Google / AI search / memory; Totbox tracks the chore with safety gates.

**Bootstrap focus (now):** Prove one house-service job end-to-end (HVAC or cleaning) with fewer touchpoints. Operator revenue and ServiceTitan-class provider MCP are **later**, after paid proof. See README **Bootstrap roadmap**.

---

## 1. Install (once)

```bash
git clone https://github.com/ivelin/totboxapp.git
cd totboxapp
npm install
```

Data lives in **`.data/`** (gitignored). **Never commit** real addresses, vendor emails, or access codes.

---

## 2. Mental model (8 consumer steps)

```text
1.Describe → 2.Details → 3.Contact → 4.Send
     → 5.Hear back → 6.Choose → 7.Booked → 8.Done
```

| Step | You | Totbox + your chat AI |
|------|-----|------------------------|
| Describe | “AC tune-up under $300” | `start_job` |
| Details | Confirm address (from memory / you) | `update_job_facts` — never invent PII |
| Contact | Who to email/call (you choose) | Draft skeleton for host to fill |
| Send | **Approve** the message | Dry-run record (or host Gmail after approval) |
| Hear back | Paste vendor reply | `ingest_provider_message` → quote fields |
| Choose | **Approve** price/time | `record_user_approval(commit_money_or_time)` |
| Booked | Show up | `confirm_appointment` |
| Done | Optional note + next due | `record_job_completion` |

Ask anytime: **“Where am I?”** → `get_workflow({ job_id })` or `get_job` → read `progress.strip` + `role_line`.

---

## 3. Start MCP (chat hosts)

```bash
npm run dev:mcp
# → http://localhost:3001/mcp
```

Wire **Grok / Hermes / curl** using [`local_mcp_connect.md`](local_mcp_connect.md) (HTTP endpoint; household path needs no token). Tools include `start_job`, `get_workflow`, …

**Or drive the same tools without a chat UI** (good for personal dry-run / debugging):

```bash
npm run smoke:job   # full HVAC + cleaning fixture path through Done + next-due
```

---

## 4. Fast path for **my house** this week (copy-paste sequence)

Use **placeholders** below. Replace with your real values only in your local chat or `.data/` — never in a git commit.

### 4.1 Start the job

Tool: `start_job`

```json
{
  "intent": "AC maintenance under $300 in the next 2 weeks",
  "provider_label": "YOUR_USUAL_HVAC_OR_SEARCH_RESULT",
  "provider_email": "vendor@example.com"
}
```

Save `job_id` from the response. You should see `next_action.type` ≈ `collect_field_via_host` (address) and a progress strip starting at **Details**.

### 4.2 Address (Details)

Tool: `update_job_facts`

```json
{
  "job_id": "JOB_ID",
  "service_address": "YOUR_STREET (local only — do not commit)"
}
```

Expect `next_action.type` = `draft_for_user_approval` and a draft skeleton.

### 4.3 Draft + approve send (Contact → Send)

1. Host fills the draft (or you write it).  
2. `submit_draft_for_approval` with `{ "job_id", "body", "channel": "email", "to": "..." }`  
3. **You approve:** `record_user_approval`  
   `{ "job_id", "kind": "send_message", "summary": "OK to send this outreach", "granted": true }`  
4. `approve_and_send_message` with `{ "job_id", "dryRun": true }`  
   - Dry-run is the default safety path (records the message; no silent network send).  
   - If your host already sent via Gmail: same tool with `hostPerformed: true` after approval.

Expect: strip advances toward **Hear back**; `next_action` = `await_provider_reply`.

### 4.4 Paste real vendor reply (Hear back)

When email/SMS arrives, paste the body:

Tool: `ingest_provider_message`

```json
{
  "job_id": "JOB_ID",
  "body": "PASTE the vendor email/SMS text here",
  "from": "vendor@example.com"
}
```

**Success check:** `quotes` array has at least one entry; if the text has `$245` style prices, `priceFromUsd` is set. Optional window hints (e.g. “Tuesday 9am”) appear as `proposedWindow`.

If price/window missing, refine without a directory:

Tool: `normalize_quote`

```json
{
  "job_id": "JOB_ID",
  "price_from_usd": 245,
  "proposed_window": "Tuesday morning"
}
```

### 4.5 Choose price/time (Choose)

```json
{
  "job_id": "JOB_ID",
  "kind": "commit_money_or_time",
  "summary": "I accept $245 on the proposed window",
  "granted": true
}
```

Then:

```json
{
  "job_id": "JOB_ID",
  "scheduled_at": "2026-07-15T09:00:00Z"
}
```

(`confirm_appointment`)

**Success check:** `status` = `scheduled`, `scheduled_at` set, progress on **Booked**, `next_action.type` = `mark_done`.  
**Safety:** `confirm_appointment` **REFUSES** if you only approved `send_message` — money/time is a separate gate.

### 4.6 Close out (Done)

After the visit (or when you want the job closed):

Tool: `record_job_completion`

```json
{
  "job_id": "JOB_ID",
  "notes": "Service done; filters replaced (no secrets)",
  "next_due": "2027-01-15"
}
```

**Success check:** `status` = `done`, `next_due` on the public view, progress strip shows **Done** as ✓.

### 4.7 “Where am I?” anytime

| Tool | Args | Look at |
|------|------|---------|
| `get_workflow` | `{}` | Full 8-step process |
| `get_workflow` | `{ "job_id" }` | Live strip + role line |
| `get_job` | `{ "job_id" }` | Same + quotes, approvals, checklist |
| `list_jobs` | `{}` | All open jobs with strips |

Browser sample (same spine, interactive): `npm run dev` → open **/workflow**.

---

## 5. Cleaning variant

Same tools. Example intent:

```text
3hr priority clean focusing on blinds, windows, under beds, corners
```

`start_job` extracts priorities into facts when phrased that way. Paste quote replies the same way (`$180`, day/time).

---

## 6. What success looks like (personal verification)

| Check | Pass |
|-------|------|
| Job created from plain language | `job_id` + checklist |
| Address never invented | You supplied it |
| Send blocked without approval | Without `record_user_approval`, send errors with REFUSED |
| Dry-run send recorded | `messages` / audit show dry-run |
| Vendor paste → quotes | `quotes[].priceFromUsd` or `normalize_quote` |
| Book needs money/time approval | Separate grant from send |
| Booked then Done | `scheduled` → `record_job_completion` → `done` + optional `next_due` |
| Progress strip | `get_job` / `get_workflow` shows where you are |

**Automated stand-in for the fixture path:** `npm run smoke:job` (HVAC + cleaning through Done). Your house = same sequence with real vendor paste offline.

---

## 7. What is / isn’t automated (Phase 1)

| Step | Now |
|------|-----|
| Discover vendors | **External** (search / AI / referral) |
| Job checklist + next_action | Yes |
| Draft + dry-run send | Yes (after approval) |
| Live Gmail/SMS send | Host tools only (`hostPerformed`) — no Totbox live adapter yet |
| Quote from paste | Yes (+ `normalize_quote`) |
| Confirm appointment | Yes (local record; not live Calendar write in job loop yet) |
| Next-due on close | Yes |
| City directory / ST multi-tenant | No (deferred) |

---

## 8. CLI helpers (optional)

```bash
npm run household -- help
npm run seed                 # demo fixtures for compare tools only — not your house
npm run smoke:house-owner    # legacy brief/compare smoke
npm run smoke:job            # Phase 1 full job PM path (use this)
```

Private rebook notes (`household -- add`) are **your** CRM, not metro inventory.

---

## 9. Privacy

- Do not commit real addresses, personal emails, phone numbers, or raw vendor threads.  
- `.data/` is local and gitignored.  
- See [`AGENTS.md`](../AGENTS.md) and [`research/README.md`](research/README.md).

---

*Related: [`product_thesis.md`](product_thesis.md) · [`host_llm_safety.md`](host_llm_safety.md) · [`workflows/house_service_v1.md`](workflows/house_service_v1.md) · README Bootstrap roadmap*
