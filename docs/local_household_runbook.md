# Local household runbook (developers / power users)

**Audience:** People who can clone a repo and run Node (OpenClaw, Hermes, Grok Build, Claude Code/Cowork, plain terminal).  
**Goal:** Use Totbox **on your machine** as an **MCP server and/or CLI** to manage **your** home-service chores—compare options, keep structured provider notes, draft outreach—**without** ServiceTitan/Jobber and **without** a hosted Totbox account.

**Strategy:** [No FSM API first](provider_onboarding_matrix.md) for maximum provider coverage. You capture real vendors via phone/email/web forms into a **local** store.

---

## 1. Install (once)

```bash
git clone https://github.com/ivelin/totboxapp.git
cd totboxapp
npm install
```

Requires Node 20+ recommended. Data lives in **`.data/`** (gitignored)—safe for private local provider lists.

---

## 2. Seed demo operators (optional)

Fictional HVAC/cleaning samples to learn the loop:

```bash
npm run seed
npm run smoke:house-owner
```

Expect multi-provider compare with prices/terms. When ready for **real** vendors, skip relying on demo IDs and register your own (below).

---

## 3. Run as MCP (chat agents)

```bash
npm run dev:mcp
# → http://localhost:3001/mcp
```

Point your agent host (Grok / Claude / Cursor / OpenClaw / etc.) at that MCP URL when the host supports custom MCP endpoints.

**Tools (Stage 6):**

| Tool | Household use |
|------|----------------|
| `create_service_brief` | Turn “AC under $300 next 2 weeks” into structured job |
| `compare_options` | Rank local providers by category/budget/terms |
| `search_services` | Find providers by text/category/location |
| `get_provider_details` | Full record (offer, rules) |
| `get_availability` | Rule windows (+ calendar busy if connected) |

Matchmaking is **deterministic code** (no LLM inside Totbox). The chat model only orchestrates tool calls if you use a chat host.

---

## 4. Run as CLI (no chat required)

```bash
# Help
npm run household -- help

# List providers in local store
npm run household -- list

# Register a REAL local vendor you already use (private to your machine)
npm run household -- add \
  --name "My Preferred AC Co" \
  --category hvac \
  --location "Austin, TX" \
  --services "Tune-up,Membership" \
  --price 245 \
  --membership "Bi-annual plan" \
  --cancel-fee 120 \
  --inclusions "Inspection,Coil clean" \
  --contact "phone or email you use (local only)"

# House-owner style compare
npm run household -- compare --text "Find AC maintenance under \$300 in Austin next 2 weeks"
npm run household -- compare --text "Priority clean focusing on blinds, windows, under beds" --category cleaning

# Draft outreach email body from a brief (you send it)
npm run household -- draft --text "AC tune-up under \$300 next week" --provider-id prov_xxx
```

Replace demo names with **your** vendors. Do **not** push `.data/` or real PII to public git.

---

## 5. Real house services as fast as possible (checklist)

1. **List 3–5 vendors** you already trust or would call (HVAC, cleaner, tree).  
2. **`npm run household -- add …`** for each with best-known price/terms (from last invoice or quote).  
3. **`npm run household -- compare --text "…"`** for the job you need this week.  
4. **`npm run household -- draft …`** → copy into email/SMS/phone notes.  
5. **Book offline** the way they already accept (phone/form).  
6. After service: update price/notes with another `add` or edit `.data/providers.json` carefully.

Optional UI: `npm run dev` → `/dashboard` to register providers in browser (same local store).

Optional Calendar: dashboard “Connect Google Calendar” is **demo** OAuth today—useful for merge logic testing; production OAuth needs your own client IDs later.

---

## 6. What is / isn’t automated

| Step | Automated now? |
|------|----------------|
| Parse job → brief | Yes (rules/regex) |
| Compare multi-provider terms | Yes (deterministic score) |
| Call ServiceTitan / Jobber | **No** (by design this phase) |
| Send email/SMS for you | Draft text only; you send |
| Live accurate capacity | Only if you maintain rules/calendar |
| Payments | No |

---

## 7. Path to hosted service (later)

If local use proves useful:

1. Keep **human book** as default for coverage.  
2. Add multi-tenant hosting + simple consumer UI.  
3. Add FSM APIs only for partners who need dispatch-native jobs (see matrix).

---

## 8. Privacy

- Public repo: no personal addresses, family emails, or private research dumps.  
- Local `.data/` is yours; gitignored.  
- See [`AGENTS.md`](../AGENTS.md) and [`research/README.md`](research/README.md).

---

*Related: [`provider_onboarding_matrix.md`](provider_onboarding_matrix.md) · product spec · `npm run smoke:house-owner`*
