# MCP workflow architecture: host LLM as executive assistant

## Goal

Totbox MCP is the **project manager for a home-service job**: durable checklist, state, templates, and side-effect tools (send email, wait for reply, advance steps). The **user’s host LLM** (Grok app, Grok Build, OpenClaw, Claude, etc.) is the **executive assistant brain**—drafting, interpreting provider replies, using memory/history, and deciding when to ask the human “boss.”

**Not a vendor registry.** Discovery stays external (search / host web tools). Totbox runs the **workflow until the job is done**.

Related: [`product_thesis.md`](product_thesis.md).

---

## How MCP actually divides labor (important)

MCP is primarily **host → server tool calls**, not “server puppets the model continuously in the background.”

| Actor | Role |
|-------|------|
| **Host LLM** | Conversation, memory, judgment, drafting, parsing messy email, when to ping the user |
| **Totbox MCP server** | Job state machine, templates by service type, validation, persistence, send/receive adapters, “what’s next?” |
| **User (boss)** | Approvals, secrets, final pay, access instructions, ambiguous trade-offs |

### Pattern A — LLM-orchestrated loop (works on all hosts today)

```text
User: "Get AC tune-up scheduled next 2 weeks under $300"
  → Host LLM calls totbox.start_job(...)
  → Tool returns: job_id, checklist, next_action, draft_spec (template + required fields)
  → Host LLM fills draft from memory/history, shows user
User: "looks good"
  → Host LLM calls totbox.approve_and_send_message(job_id, channel=email, body=...)
  → Tool sends (or queues) email, advances state to awaiting_provider_reply
  → Later: host/user pastes reply OR inbound webhook
  → Host LLM calls totbox.ingest_provider_message(...)
  → Tool returns: extracted fields still missing, next_action
  → Host LLM drafts follow-up or asks user only if blocked
  → … until checklist complete
```

The MCP tool responses should be **explicitly actionable for the host LLM**:

```json
{
  "job_id": "job_…",
  "status": "awaiting_user_approval",
  "checklist": [ ... ],
  "next_action": {
    "type": "draft_for_user_approval",
    "channel": "email",
    "to": "…",
    "template_id": "hvac_outreach_v1",
    "instructions_for_host_llm": "Fill placeholders using user memory. Do not invent address. Ask user if missing.",
    "placeholders": { "service_address": null, "system_notes": "…", "urgency": "maintenance" },
    "draft_skeleton": "Hi {{provider_name}}, …"
  },
  "blocks": [{ "code": "missing_service_address", "ask_user": true }]
}
```

That is how the MCP **“asks the LLM to do work”** in a host-compatible way: **return a structured work order**, not a free-floating server-side agent.

### Pattern B — MCP sampling (where supported)

Some MCP hosts implement **server-initiated sampling**: the server asks the client to run an LLM completion (draft, extract, classify) and return the text. Use when available for:

- Draft generation inside a long tool call  
- Extracting quote terms from a pasted email  

**Do not depend on sampling alone**—always support Pattern A so OpenClaw/Grok/Claude variants that only do tool-calling still work.

---

## Job state machine (project manager core)

Every home-service project is a **Job** with a checklist.

### Statuses

| Status | Meaning |
|--------|---------|
| `intake` | Capturing brief / missing user facts |
| `planning` | Choosing approach (who to contact, budget) |
| `drafting_outreach` | Host LLM preparing message |
| `awaiting_user_approval` | Boss must approve draft / spend / access |
| `outbound_sent` | Message sent; waiting on provider |
| `awaiting_provider_reply` | Inbox / paste / webhook |
| `negotiating` | Quote/schedule back-and-forth |
| `awaiting_user_decision` | Pick quote, approve time, approve $$ |
| `scheduled` | Time confirmed |
| `in_progress` | Service day |
| `settling` | Invoice / review / archive |
| `done` | Checklist complete |
| `blocked` | Needs user or external fix |
| `cancelled` | Stopped |

### Example HVAC checklist

1. Capture brief (problem vs maintenance, urgency, budget, preferred windows)  
2. Resolve **service address** + access notes (from host memory or ask user)  
3. Resolve providers (user names them, or host search—**not** Totbox directory)  
4. Draft outreach (template `hvac_outreach_v1`)  
5. User approve draft  
6. Send email/SMS  
7. Ingest reply → extract quote/availability  
8. If incomplete, draft follow-up (auto or approve)  
9. Compare options if multiple  
10. User pick + approve schedule  
11. Confirm appointment  
12. Pre-visit reminder  
13. Post-visit: invoice note, next due, optional review  

Cleaning / tree use **different templates** and required fields (priority list, Oak Wilt window, etc.).

---

## Tool surface (host-LLM-maximizing)

### Workflow control

| Tool | Purpose |
|------|---------|
| `start_job` | Create job from user intent; return checklist + next_action |
| `get_job` | Full state + checklist + pending approvals |
| `list_jobs` | Open household projects |
| `advance_job` | Explicitly move step when host finished a non-tool action |
| `resolve_block` | User answered a missing field; recompute next_action |
| `cancel_job` | Stop |

### Host-LLM collaboration (draft / extract)

| Tool | Purpose |
|------|---------|
| `get_message_template` | Template + placeholders + `instructions_for_host_llm` by service type |
| `prepare_outbound_draft` | Bind job + provider + template → skeleton + validation rules (LLM fills) |
| `submit_draft_for_approval` | Store draft; set `awaiting_user_approval`; return user-facing summary |
| `normalize_quote` | Host LLM extracted fields → validated offer terms on job |
| `suggest_next_action` | Pure PM: given state, return next_action (so host always knows what to do) |

**Principle:** Prefer tools that return **instructions_for_host_llm** over tools that try to “be smart” without the host’s memory.

### Side effects (Totbox or local adapters)

| Tool | Purpose |
|------|---------|
| `approve_and_send_message` | After user OK: send email/SMS via configured transport |
| `record_outbound` / `record_inbound` | Log messages without sending (manual paste mode) |
| `ingest_provider_message` | Body of reply → state update + extraction **hints** for host LLM |
| `propose_time_slots` | Merge household calendar constraints (when connected) |
| `confirm_appointment` | Lock scheduled time on job |
| `attach_artifact` | Invoice meta, PDF ref (local path / id—no PII in public repos) |

### Human gates (never skip without policy)

- First outbound to a new provider (default)  
- Any commitment of money / membership / cancel fee  
- Sharing home address / access codes  
- Final schedule confirm  
- Cancelling a paid visit  

Tool responses mark these as `requires_user_approval: true`.

---

## End-to-end sequence (your email example)

```text
1. User → host: "Schedule HVAC maintenance"
2. host → start_job({ intent, service_type: "hvac_maintenance" })
3. MCP → missing: address?, windows?, budget?
4. host fills from memory or asks user once
5. host → resolve_block / start_job update
6. host → prepare_outbound_draft({ template: hvac_outreach_v1, provider_email })
7. MCP → draft_skeleton + instructions_for_host_llm
8. host LLM drafts full email using memory
9. host shows user; user approves
10. host → approve_and_send_message({ job_id, body, to })
11. MCP sends, status=awaiting_provider_reply, checklist ✓ outreach
12. Provider replies (Gmail tool / paste / webhook)
13. host → ingest_provider_message({ raw_text })
14. MCP stores raw + asks host: "extract quote fields using schema X"
15. host → normalize_quote({ ...extracted })
16. If schedule proposed: host may auto-accept if within user rules, else awaiting_user_decision
17. Loop until status=done
```

**Totbox pushes the process** by always returning **`next_action`** and never leaving the host without a clear tool or user question.

---

## Templates by service type (maximize host LLM quality)

Templates live in the MCP server (versioned). Each includes:

- Required facts (HVAC: address, maintenance vs repair, system notes, urgency)  
- Optional facts (square footage, membership interest)  
- Tone / legal caution lines  
- `instructions_for_host_llm` (“Use user’s preferred service address from memory if previously confirmed; never invent gate codes.”)

Host LLM does the prose; Totbox does schema enforcement.

---

## Sending email / monitoring replies

### Local-first (early users)

| Capability | Approach |
|------------|----------|
| Send | Host LLM uses **host Gmail/Outlook tool** if available, then `record_outbound`; **or** Totbox `approve_and_send` via user-configured SMTP/Resend later |
| Receive | Host Gmail tool + `ingest_provider_message`; or user paste; or optional inbound webhook |
| Continuity | Job state in local `.data/jobs/` so a new chat session can `list_jobs` / `get_job` and resume |

**Important:** “MCP monitors 24/7 alone” usually still needs either:

- Host agent loop with periodic `suggest_next_action`, or  
- Local daemon/cron that notifies the host, or  
- Hosted worker later  

The **checklist and state** live in Totbox; the **always-on loop** is host or a small companion process.

### Hosted later

Same tools; multi-tenant jobs; optional managed send/receive; still host LLM for drafting if product is “bring your own AI.”

---

## What Totbox must own (so the LLM isn’t flaky)

| Concern | Why server-side |
|---------|-----------------|
| Durable job + checklist | Chats forget; PM doesn’t |
| Template + field validation | Consistent HVAC/cleaning packets |
| Approval audit trail | Who approved what draft |
| Idempotent send | No double-email on retry |
| next_action policy | Deterministic PM rules |
| PII boundaries | Address only after gate; never log secrets in public |

| Concern | Why host LLM |
|---------|----------------|
| Natural conversation | UX |
| User memory / history | Personalization without Totbox storing a second brain |
| Draft quality | Best model the user already pays for |
| Parsing messy provider email | Flexible NLU |
| Web search for provider contact | Discovery outside Totbox |

---

## Mapping from today’s Stage 6 tools

| Today | Evolves toward |
|-------|----------------|
| `create_service_brief` | `start_job` + brief section of job |
| `compare_options` (demo store) | `normalize_quote` + `compare_job_quotes` on **user-sourced** quotes |
| `search_services` (local seed) | Deprecate as product discovery; keep for fixtures / private rebook memory only |
| `household -- draft` | `prepare_outbound_draft` + host fill + `approve_and_send_message` |
| Smoke scripts | Job E2E: start → draft → approve (dry-run send) → ingest fake reply → done |

---

## Implementation phases (aligned with no-registry, no-FSM-first)

| Phase | Deliverable |
|-------|-------------|
| **W0** | Job model + checklist + `start_job` / `get_job` / `suggest_next_action` (persist `.data/jobs`) |
| **W1** | Templates + `prepare_outbound_draft` + `submit_draft_for_approval` (no real send) |
| **W2** | `record_outbound` / `ingest_provider_message` + host-LLM extraction schema |
| **W3** | `approve_and_send_message` dry-run + optional real send adapter (user config) |
| **W4** | Calendar propose slots + `confirm_appointment` |
| **W5** | Multi-quote compare on job; user decision gate |
| **W6** | Optional sampling; optional inbound email webhook; optional ST for partners |

---

## Design principles (summary)

1. **Host LLM = EA brain; Totbox MCP = PM system of record.**  
2. Every tool response includes **`next_action`** (or `done`).  
3. **Draft with the host; send with an explicit tool after approval.**  
4. **Discovery is external;** jobs reference providers by contact the user/host supplies.  
5. **Human gates** for money, address, access, final book.  
6. **Human channels first** for coverage; FSM later for depth only.  
7. **Local-first** state so OpenClaw/Grok Build/Claude can resume work.

---

*This is the target MCP contract. Stage 6 brief/compare seeds are scaffolding toward W0–W2, not the final product shape.*
