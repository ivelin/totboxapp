# Local household runbook (developers / power users)

**Audience:** People who clone the repo (OpenClaw, Hermes, Grok Build, Claude Code/Cowork, terminal).  
**Thesis:** Totbox helps **schedule and coordinate** home services—not discover who exists in your city. Discovery is Google / AI search. See [`product_thesis.md`](product_thesis.md).

**Goal:** Run Totbox **locally** as **MCP and/or CLI** for **your** chores: structure the job, track quotes, draft outreach, compare terms, remember rebooks—**without** a hosted account and **without** FSM APIs.

---

## 1. Install (once)

```bash
git clone https://github.com/ivelin/totboxapp.git
cd totboxapp
npm install
```

Data: **`.data/`** (gitignored). Optional private notes about *your* vendors for rebook—not a public registry.

---

## 2. Mental model (real house use)

```text
1. You (or your chat app) find candidates via Google / memory
2. Totbox: create_service_brief  →  clear job package
3. You send draft outreach (email/SMS) or call using the brief
4. Quotes come back → enter/compare terms in Totbox
5. Totbox: propose times / calendar awareness (when wired)
6. You confirm offline; Totbox tracks status / next due (evolving)
```

Demo seeds (`npm run seed`) exist only so tools have data in CI/dev. **Production personal use = your jobs + your quote notes**, not “search Totbox’s city directory.”

---

## 3. MCP (agent hosts)

```bash
npm run dev:mcp
# → http://localhost:3001/mcp
```

| Tool | Real household meaning |
|------|-------------------------|
| `get_workflow` | See the process (general, by service type, or this job’s “where am I?” strip) |
| `start_job` / `get_job` / `list_jobs` | Run and inspect house-service job instances |
| `create_service_brief` | Package the chore (legacy helper; prefer `start_job`) |
| `compare_options` | Rank **options you care about** (fixtures; target: user-sourced quotes) |
| `search_services` | Query **your local notes/fixtures**—not Google |
| `get_provider_details` / `get_availability` | Detail + windows for parties on the job |

Matchmaking code is **deterministic**. Chat models only orchestrate tools if you use a host.

---

## 4. CLI

```bash
npm run household -- help

# Optional demo fixtures for learning the UI of the tools
npm run household -- seed-demo
npm run smoke:house-owner

# Private rebook memory (optional): vendors YOU already chose externally
npm run household -- add --name "Preferred AC Co" --category hvac --location "Austin, TX" \
  --price 245 --membership "Bi-annual" --contact "phone/email (local only)"

npm run household -- compare --text "AC maintenance under \$300 next 2 weeks"
npm run household -- draft --text "AC tune-up next week" --provider-id <id>
# → copy draft to email/SMS; book on their channel
```

`add` = **your CRM for rebook**, not onboarding the metro’s suppliers into Totbox.

---

## 5. Fast path for a real job this week

1. Decide the job in plain language.  
2. `create_service_brief` / `household -- compare` with that text (or draft first).  
3. Find 1–3 companies via **Google or chat search** (outside Totbox).  
4. Contact them with **`household -- draft`** or your own words + brief details.  
5. When quotes return, store terms (CLI add/update or future quote-intake) and compare.  
6. Pick one; schedule by phone/email/form; note confirmation.  

No provider “signup” required.

---

## 6. What is / isn’t automated

| Step | Now |
|------|-----|
| Discover vendors in the city | **External** (search / AI / referral) |
| Structure job | Yes |
| Compare directory listings | Demo/local notes only—not the product goal |
| Compare quotes you collected | Target core (partially via local offer fields) |
| Send email for you | Draft only |
| FSM dispatch | No (intentional) |
| Payments | No |

---

## 7. Roadmap implication

Prefer building **quote intake + job status + calendar + drafts** over **provider acquisition / registry SEO**.

Hosted multi-user product later can stay workflow-centric (bring-your-own providers via search), not marketplace inventory.

---

## 8. Privacy

- Do not commit real addresses, personal emails, or private research.  
- `.data/` is local and gitignored.  
- [`AGENTS.md`](../AGENTS.md), [`research/README.md`](research/README.md).

---

*Related: [`product_thesis.md`](product_thesis.md) · [`provider_onboarding_matrix.md`](provider_onboarding_matrix.md)*
