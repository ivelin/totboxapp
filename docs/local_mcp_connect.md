# Local MCP connect (Grok, Hermes, curl)

**Purpose:** Point a chat host at a Totbox instance so you can exercise the **household job PM** path.

| Where Totbox runs | MCP URL |
|-------------------|---------|
| **This app UI (preview / `npm run dev`)** | **`{origin}/mcp`** — shown on the home page under **Connect Grok · MCP** (copy button) |
| Standalone process | `http://localhost:3001/mcp` via `npm run dev:mcp` |

**Auth:** None required for job PM tools. Optional `token` on search/availability is Stage 4 **provider scoping** only (dashboard register) — skip for personal house testing.

**Related:** [household runbook](local_household_runbook.md) · [bootstrap strategy](strategy/bootstrap_pmf_and_agentic_gap.md) · [host safety](host_llm_safety.md)

---

## 1. Easiest path — same process as the UI

```bash
npm run dev
# open the home page → “Connect Grok · MCP”
# copy the absolute MCP URL (e.g. https://<preview-host>/mcp or http://localhost:8080/mcp)
```

Sanity check:

```bash
curl -s http://localhost:8080/mcp | head -c 600

curl -s -X POST http://localhost:8080/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Expect tool names including `start_job`, `get_workflow`, `get_job`, `record_user_approval`, `approve_and_send_message`, `ingest_provider_message`, `confirm_appointment`, `record_job_completion`.

---

## 2. Standalone MCP process (optional)

```bash
npm run dev:mcp
# → http://localhost:3001/mcp
```

Jobs persist under **`.data/jobs.json`** (gitignored). UI and `/mcp` share the same Job PM library.

Full fixture path without a host:

```bash
npm run smoke:job
```

---

## 3. Grok

### Same machine (CLI / TUI)

```bash
# Prefer the URL from the home page, or:
grok mcp add --transport http totbox http://localhost:8080/mcp
# or standalone:
# grok mcp add --transport http totbox http://localhost:3001/mcp

grok mcp list
grok mcp doctor totbox
```

Or in `~/.grok/config.toml`:

```toml
[mcp_servers.totbox]
url = "http://localhost:8080/mcp"
enabled = true
```

### Cloud Grok / preview host

If Totbox is running in a **public preview** (e.g. Grok Build sandbox), copy the **absolute URL** from the home page panel (`https://…/mcp`). Paste that into Grok’s MCP HTTP connector. Do **not** commit ephemeral preview URLs into git.

Sample prompt after connect:

> Using Totbox MCP: call `get_workflow` with no args, then `start_job` with intent “AC maintenance under $300 next 2 weeks” and a demo provider email. Show the progress strip and follow `next_action`.

Then follow [runbook §4](local_household_runbook.md).

---

## 4. Hermes (or similar agent hosts)

| Field | Value |
|-------|--------|
| URL | `{origin}/mcp` or `http://localhost:3001/mcp` |
| Name | `totbox` |
| Auth | none for household PM |

If the host only supports **stdio**, bridge to HTTP (e.g. `npx -y mcp-remote http://localhost:8080/mcp`).

---

## 5. What success looks like

| Step | Tool | Signal |
|------|------|--------|
| Process map | `get_workflow` | 8 consumer steps |
| Start job | `start_job` | `job_id` + progress strip |
| Address | `update_job_facts` | draft work order |
| Send (safe) | `record_user_approval` + `approve_and_send_message` (`dryRun: true`) | await provider reply |
| Paste quote | `ingest_provider_message` | `quotes[]` visible |
| Book | `commit_money_or_time` + `confirm_appointment` | `status: scheduled` |
| Done | `record_job_completion` | `status: done`, optional `next_due` |

---

## 6. Privacy

Do not put real addresses, personal emails, or tokens into public git. Fixture emails (`@example.com`) only in docs and demos. See root `AGENTS.md`.
