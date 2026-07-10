# Host LLM first · Safety before convenience

**Principle (Tesla FSD analogy):** Totbox **must not do harm**. Prefer explicit user approvals and validation over silent automation. Convenience increases only after we record how approvals actually work in the wild.

## Maximize the host environment

When a job needs **address**, **email send**, **SMS/call**, or **inbox check**, Totbox MCP returns a **`next_action`** that tells the **host LLM** (Grok app, Grok Build, Claude Cowork, Codex, OpenClaw, …):

1. **Prefer host tools the user already configured** (memory/profile, Gmail, Voximplant/voice, calendar, web search).  
2. **Ask the user for permission** (once / session / always-ask — recorded on the job).  
3. **Return structured results** via Totbox tools (`update_job_facts`, `record_outbound`, `ingest_provider_message`, …).  
4. **Fall back** to Totbox **dry-run / record-only** when the host has no channel tool — never pretend a send happened.

Totbox does **not** replace the host’s brain. The host LLM drafts, remembers, and drives tools; Totbox is the **project manager** (checklist, gates, audit).

## Safety gates (early product: more friction on purpose)

| Action | Required before side effect |
|--------|----------------------------|
| Share service address with provider | User awareness; send approval covers reviewed draft |
| Send email / SMS / place call | `record_user_approval(kind=send_message, granted=true)` |
| Commit money / appointment time | `record_user_approval(kind=commit_money_or_time)` |
| Use host voice/SMS MCP | Host asks user; then `record_outbound` / `hostPerformed` |

`approve_and_send_message` **refuses** without approval. Default `dryRun: true` (no network send).

## Validation between steps

- Missing address/contact → status `blocked`, typed `blocks[]`, no outreach.  
- Cannot ingest provider reply before outreach send completes.  
- Cannot confirm appointment without decision approval + prior reply.  
- Every transition audited on the job (`audit` / `approvals`).

## Learning to remove friction later

All approvals and audit events are stored on the job (local `.data/jobs.json`). Future versions may offer fewer prompts **only** where history shows safe patterns — never by deleting the audit trail or skipping gates by default in early iterations.

## Quick exercise

```bash
npm run smoke:job    # HVAC + cleaning: start → approve → dry-run → ingest
npm run dev:mcp      # expose start_job, record_user_approval, …
```

See also: [`mcp_workflow_architecture.md`](mcp_workflow_architecture.md), [`product_thesis.md`](product_thesis.md).
