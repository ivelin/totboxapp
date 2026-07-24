# Local MCP connect (Grok, Hermes, curl)

**Purpose:** Point a chat host at a Totbox instance running on your machine so you can exercise the **household job PM** path without shipping code to a cloud host.

**Endpoint:** Streamable HTTP — `http://localhost:3001/mcp`  
**Auth:** None required for job PM tools. Optional `token` on search/availability is Stage 4 **provider scoping** only (dashboard register) — skip for personal house testing.

**Related:** [household runbook](local_household_runbook.md) (consumer tool sequence) · [bootstrap strategy](strategy/bootstrap_pmf_and_agentic_gap.md) · [host safety](host_llm_safety.md)

---

## 1. Start Totbox MCP

```bash
cd /path/to/totboxapp
npm install          # once
npm run dev:mcp
# → [Totbox] MCP server listening on http://localhost:3001/mcp
```

Leave this process running. Jobs persist under **`.data/jobs.json`** (gitignored).

Optional UI: `npm run dev` → `:3000` (`/workflow`, `/dashboard`) — not required for MCP.

---

## 2. Sanity check (no chat host)

```bash
curl -s http://localhost:3001/ | head -c 600

curl -s -X POST http://localhost:3001/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Expect tool names including `start_job`, `get_workflow`, `get_job`, `record_user_approval`, `approve_and_send_message`, `ingest_provider_message`, `confirm_appointment`, `record_job_completion`.

Full fixture path without a host:

```bash
npm run smoke:job
```

---

## 3. Grok Build / Grok CLI (same machine)

`localhost` works only when Grok and Totbox run on the **same machine**.

```bash
grok mcp add --transport http totbox http://localhost:3001/mcp
grok mcp list
grok mcp doctor totbox
```

Or in `~/.grok/config.toml`:

```toml
[mcp_servers.totbox]
url = "http://localhost:3001/mcp"
enabled = true
```

Project-scoped (repo only):

```bash
cd /path/to/totboxapp
grok mcp add --scope project --transport http totbox http://localhost:3001/mcp
```

Restart the Grok session so tools reload. Sample prompt:

> Using Totbox MCP: call `get_workflow` with no args, then `start_job` with intent “AC maintenance under $300 next 2 weeks” and a demo provider email. Show the progress strip and follow `next_action`.

Then follow [runbook §4](local_household_runbook.md) (facts → draft → approve send → paste reply → money/time → confirm → completion).

### Cloud Grok app / phone

Cloud clients **cannot** reach your laptop’s `localhost`. Options:

1. Prefer **Grok CLI/TUI on the same machine** as Totbox (simplest for Phase 1).  
2. Temporary **tunnel** (ngrok, Cloudflare Tunnel, etc.) and point the host at `https://…/mcp` — do not commit tunnel URLs or secrets.  
3. Only if the consumer app supports **custom HTTP MCP URLs** at all; many only list vendor-catalog connectors.

---

## 4. Hermes (or similar agent hosts)

Exact UI labels vary. Prefer native **HTTP / Streamable HTTP** MCP:

| Field | Value |
|-------|--------|
| URL | `http://localhost:3001/mcp` |
| Name | `totbox` |

If the host only supports **stdio**:

1. Keep `npm run dev:mcp` running on `:3001`.  
2. Register a stdio bridge that proxies to that URL (e.g. community `mcp-remote` or equivalent):  
   `npx -y mcp-remote http://localhost:3001/mcp`  
3. Do **not** expect Totbox’s default entrypoint to be a pure stdio MCP server without a bridge — shipped path is HTTP.

After connect, ask the host to list tools and call `get_workflow`.

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

**Expected refusals (safety):** send without `send_message` approval; confirm without `commit_money_or_time` approval; `dryRun: false` without `hostPerformed`.

---

## 6. Gotchas

- Server must be up before the host connects.  
- URL must include **`/mcp`**.  
- Household path needs **no** dashboard token.  
- Never commit real addresses, vendor threads, or tokens (see [AGENTS.md](../AGENTS.md)).  
- Optional provider register at `/dashboard` is for fixture/operator scoping experiments — not required for Phase 1 personal jobs.

---

## 7. Privacy

Use fixture or placeholder contacts in shared logs. Real house details stay in local `.data/` and your private chat history only.
