# Product thesis: scheduling workflow, not vendor discovery

## The insight

Service providers already invest in **SEO, Google Business, Yelp, websites, and AI-chat discoverability**. Residents can find HVAC, cleaning, and tree companies in seconds via search engines or chat apps.

**Totbox should not maintain a competing public vendor registry.** That duplicates Google/Yelp and creates cold-start and freshness problems without solving the real pain.

**The friction is the scheduling and coordination workflow**, not “who exists in my city.”

Evidence from household email research (anonymized): multi-turn quote loops, inclusions/exclusions, partner approval, calendar negotiation, cancel/membership terms, invoice archive, recurring/seasonal reminders—not “I can’t find an HVAC company.”

---

## What Totbox owns vs what the world already owns

| Layer | Owned by | Totbox role |
|-------|----------|-------------|
| **Discover who to call** | Google, Maps, Yelp, SEO, AI chat web search | **Out of scope** as a directory product |
| **Structure the job** | Fragmented emails/forms | **Core** — service brief from natural language |
| **Compare quotes in hand** | Spreadsheets / mental load | **Core** — normalize terms (price, cancel, parts, inclusions) |
| **Household alignment** | Forwarded emails | **Core** — share options / approval gates (later stage) |
| **Propose times / hold calendar** | Phone tag | **Core** — calendar-aware suggestions, busy merge |
| **Outreach & follow-up** | Manual typing | **Core** — draft emails/SMS from brief; chase status |
| **Recurring / seasonal** | Forgotten | **Core** — next-due, Oak Wilt / preventive cadence |
| **Records** | Inbox chaos | **Core** — archive invoice meta, rebook last vendor |
| **Provider back-office FSM** | ServiceTitan, Jobber, … | **Optional later**, not the coverage layer |

---

## Product shape (local-first)

```text
Resident (chat / CLI / MCP)
        |
        |  job intent + optional: "I got 3 quotes" or "use last AC guy"
        v
+------------------------------------------+
|  Totbox orchestration (local or hosted)  |
|  - Service brief                         |
|  - Quote/option normalizer (user-sourced)|
|  - Schedule negotiation helpers          |
|  - Household approval (later)            |
|  - Calendar integration                  |
|  - Drafts: email/SMS/phone scripts       |
|  - Recurring + records                   |
+------------------------------------------+
        |
        |  human channels (default)
        v
Providers (phone, email, web form, SMS)
  [optional later: FSM API for a few partners]
```

**Providers are inputs to a job, not a marketplace inventory.**

- Discovery: user or their AI host finds candidates externally.  
- Totbox: turns candidates + quotes + calendar into a **managed chore**.  
- Optional **personal memory** (“vendors I’ve used”) is a private cache for rebook—not a public registry.

---

## Implications for current code

| Current artifact | Reinterpret as |
|------------------|----------------|
| `search_services` / seeded “Demo …” providers | **Dev fixtures** + temporary scaffolding—not the product north star |
| `compare_options` against store | Evolve toward **compare quotes I attached / pasted**, not “search our directory” |
| `beachheadSampleProviders` | Demo/eval only |
| `household -- add` | **Personal CRM / rebook memory**, optional—not “onboard the city’s cleaners” |
| Provider dashboard register | **Local household memory** or future provider-side tool—not SEO competitor |
| No FSM-first strategy | Still correct: book via phone/email/form for coverage |

---

## Success metrics (workflow, not marketplace)

- Time / touchpoints from “I need AC” to **confirmed appointment**  
- Touchpoints collapsed on **quote clarification + scheduling**  
- % of jobs with structured brief + calendar proposal  
- Recurring rebook without re-research  
- **Not:** number of providers listed in Totbox; not GMV marketplace take rate (early)

---

## What we will not build (for now)

- Public provider directory, SEO landing pages for “best HVAC in Austin”  
- Cold-start campaigns to “sign up 500 providers” as inventory  
- Ranking/trust graph as a Yelp substitute  
- Requiring providers to create Totbox accounts before a resident can schedule a job

## What we will build (priority)

1. **Job + checklist PM** in MCP — durable state, `next_action` for the host LLM (see [`mcp_workflow_architecture.md`](mcp_workflow_architecture.md)).  
2. **Full workflow visibility** — stable `house_service_v1` map; `get_workflow` / `get_job` / `list_jobs` so users always see process, position, and roles ([`workflows/house_service_v1.md`](workflows/house_service_v1.md)).  
3. **Host-LLM-maximizing tools** — templates + draft specs the host fills from memory; user approval; then send/record.  
4. **Quote intake** — paste/email → host extracts → Totbox normalizes/compares on the job.  
5. **Schedule workflow** — propose windows, calendar merge, confirmation tracking.  
6. **Human-channel outreach** — email/SMS/phone scripts; no provider registry.  
7. **Rebook memory** — optional private “last vendor,” not a city directory.  
8. **Local MCP/CLI** first; hosted later.

**Division of labor:** Host LLM = executive assistant (draft, parse, memory). Totbox MCP = project manager (checklist, gates, side effects, transparent progress).

---

## Alignment with “no FSM API first”

FSM integrations help **dispatch-native booking** for shops that already live in ST/Jobber. They do **not** solve discovery and they do **not** cover the long tail.

Under this thesis:

- **Default:** human interfaces for outreach and confirmation (universal).  
- **Later:** FSM only where it shortens the last mile of scheduling for high-volume partners.  
- **Never:** use FSM onboarding as the way to “fill the registry.”

---

*This thesis supersedes earlier “dual-sided marketplace directory” framing for MVP. Marketplace language may return only if a hosted network effect is deliberate—not as a discovery substitute for Google.*
