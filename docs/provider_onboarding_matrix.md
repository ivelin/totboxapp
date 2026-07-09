# Provider onboarding matrix (one page)

**Strategy (current):** Maximize **service-provider coverage** and **resident usefulness** with **no FSM API layer** (ServiceTitan / Jobber / Housecall Pro, etc.) as a dependency. Use **human interfaces** (phone, email, SMS, web forms) + structured Totbox profiles. Optional Google Calendar later. FSM APIs only when a multi-truck partner explicitly needs dispatch-native booking.

**Local-first:** Developers run Totbox as MCP/CLI on their own machine for household chores → prove value → optional hosted service later. See [`local_household_runbook.md`](local_household_runbook.md).

---

## Matrix: who → how we onboard → automation level

| Provider type | Typical tools today | Totbox capture channel | Data we store | Book / confirm path | Automation level | When to add FSM API |
|---------------|---------------------|------------------------|---------------|---------------------|------------------|---------------------|
| **Micro** (solo, cash/text, no software) | Phone, SMS, cash | Call / text / verbal quote → you enter profile | Name, trade, area, rough price, notes, contact method | You (or agent draft) call/text with structured brief | **Low** — capture + remind | Never required |
| **Small cleaning / maid** | Email PDF, website form, sometimes Jobber/HCP | Email + web form quote → structured offer fields | Tiers, custom priorities, cancel/recurring notes | Email “book this scope” + calendar slot if any | **Low–med** | Only if *they* insist on Jobber sync |
| **Small HVAC (1–4 trucks)** | Mix of paper, FieldEdge/HCP/Jobber, light ST | Phone/email quote + plan PDF → offer terms | Membership $, cancel fee, parts extra, windows | Human confirm; optional Calendar busy | **Med** | Prefer human first; API only if volume warrants |
| **Multi-truck HVAC** | Often ServiceTitan / FieldEdge | Still: brief via email/phone **or** later ST leads push | Same + dispatch preference | Human/email book **until** ST adapter | **Med → high** with ST | **Yes** — after they pilot and ask for it |
| **Tree / lawn / seasonal** | Phone, Yelp, seasonal flyers | Yelp/phone quote + seasonal rules note | Price range, season flags (e.g. Oak Wilt window) | Call/text confirm | **Low** | Rarely |
| **Property manager mediated** | AppFolio-style portals, email | Status brief to PM + vendor handoff notes | Site label (generic), vendor, open tickets | Forward structured status | **Low–med** | Portal APIs later if needed |
| **Dev household “my vendors”** | Whatever you already use | **CLI/MCP register** + paste offer terms yourself | Your private `.data/` on laptop | You book however you always did | **Personal** | N/A |

---

## Coverage vs depth (why no-FSM-first)

```text
                    Company COUNT                    Job VOLUME (some metros)
Human channels      ████████████████████ ~95%+        ██████████████ high
Top FSM APIs only   ████ ~15–35% digitized             ████████ solid mid/large HVAC
ST alone            ██ low single digits–teens         ████ multi-truck HVAC slice
```

- **Count of providers you can list:** human interfaces win.  
- **Depth of auto-dispatch for big HVAC:** FSM APIs win — but only for that slice.  
- **Best usefulness for early end users (you):** human capture + deterministic compare beats waiting on partner APIs.

---

## Resident usefulness by channel

| Channel | Resident sees | Latency | Reliability of “booked” |
|---------|---------------|---------|-------------------------|
| Structured profile + compare only | Options + $ terms | Instant | Soft (you still confirm offline) |
| + draft email/SMS from brief | Copy-paste outreach | Minutes | Soft until reply |
| + phone script from brief | Call checklist | Same day | High if you call |
| + Google Calendar | Busy-aware slots | Instant-ish | Medium (demo OAuth today) |
| + ServiceTitan job create | Native job in their system | Automated | High for ST shops only |

**MVP target for real household use:** top three rows + optional Calendar. Not ST.

---

## Onboarding checklist (any real provider, 10 minutes)

1. **Contact** (phone/email/web form) → get quote or plan flyer.  
2. **Enter into Totbox** (dashboard register, CLI, or seed file):  
   - category (`hvac` / `cleaning` / `tree_arborist` / …)  
   - services, metro location (not private street addresses in public repos)  
   - offer: priceFrom, membership, cancelFee, inclusions/exclusions  
   - availability rules (days/windows)  
3. **Preferred contact method** for book: phone / email / form URL (store in notes/services text for now).  
4. **Resident path:** `create_service_brief` → `compare_options` → **you** send one structured ask.  
5. **After service:** note price/outcome in records (manual until Stage 9+).

**Public repo rule:** never commit real customer addresses, personal emails, or private research dumps. Local `.data/` is gitignored.

---

## Decision rules (product)

| If… | Then… |
|-----|--------|
| You need coverage of cleaners, tree, solo HVAC | Human channel only |
| A multi-truck HVAC partner books weekly via Totbox and uses ST | Design ST adapter (Stage 10) |
| A cleaner only accepts web form | Capture form URL + draft prefilled brief |
| Dev user managing own house | Local MCP/CLI; private provider list; no hosted dependency |
| Hosted service for non-tech users (later) | Same matrix; add UX + multi-tenant; still default human book |

---

## Explicit non-goals (this phase)

- Building Jobber + ST + HCP + FieldEdge adapters before local household usefulness.  
- Requiring providers to change software to appear in Totbox.  
- Payments, marketplace bidding, or full open directory SEO.

---

*One-pager for strategy + ops. Implementation detail for local household use: [`local_household_runbook.md`](local_household_runbook.md).*
