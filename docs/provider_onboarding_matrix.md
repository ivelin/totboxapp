# Coordination channel matrix (one page)

**Thesis:** Totbox is a **scheduling / coordination workflow** product, not a vendor discovery registry.  
Discovery is already free via SEO, Maps, Yelp, and AI chat. See [`product_thesis.md`](product_thesis.md).

**Strategy:** Maximize **job completion usefulness** with **human interfaces** (phone, email, SMS, web forms). Optional Calendar. **No FSM API dependency** for coverage. FSM only for selective dispatch depth later.

**Local-first:** Developers run Totbox as MCP/CLI for household chores. See [`local_household_runbook.md`](local_household_runbook.md).

---

## What we capture (per job), not “city inventory”

| Input | Source | Totbox stores |
|-------|--------|----------------|
| Job intent | Resident natural language | Service brief |
| Candidate providers | Google / chat / “my usual guy” (external) | Ephemeral party on the job, or optional **private** rebook memory |
| Quotes / plan PDFs | Email, form, phone notes | Normalized offer terms for compare |
| Availability | Resident calendar + provider reply | Proposed windows, confirmed slot |
| Confirmation | Their email/SMS/phone | Job status |
| Invoice / next due | Attachment or note | Records / recurring |

**We do not** maintain a public competing directory of “all HVAC in Austin.”

---

## Matrix: provider situation → how scheduling works (no registry)

| Provider situation | How resident finds them | Totbox’s job | Confirm channel | Automation | FSM API? |
|--------------------|-------------------------|--------------|-----------------|------------|----------|
| **Micro** (solo, cash/text) | Search / referral / AI chat | Brief + call/text script + time proposals | Phone / SMS | Low | Never |
| **Small cleaning** | SEO / website / prior hire | Brief + priority list + compare quotes pasted in | Email / web form | Low–med | Rare |
| **Small HVAC** | Search / review sites | Brief + plan/terms normalizer + calendar windows | Email / phone | Med | Only if they demand it |
| **Multi-truck HVAC (often ST)** | Same external discovery | Same workflow; optional later: push job into ST | Email → later ST | Med → high | **Selective later** |
| **Tree / seasonal** | Search + season rules | Brief + seasonal guidance + schedule window | Phone / email | Low | Rare |
| **PM-mediated** | PM relationship | Status brief + vendor handoff tracking | Email / portal | Low–med | Later if needed |
| **Personal rebook** | “Same cleaner as last time” | Private memory of **your** past vendor (not public SEO) | Whatever worked last time | Med | N/A |

---

## Coverage vs depth (reframed)

```text
Need                              Solution
----------------------------------------------------------------
Find who exists                   Google / Maps / Yelp / AI search  (NOT Totbox)
Get on their calendar             Human channels + calendar helpers (Totbox core)
Normalize 3 quotes I already have Totbox compare (user-sourced quotes)
Multi-truck auto-dispatch         Optional FSM API later (slice of market only)
```

---

## Resident usefulness (workflow stages)

| Stage | Pain without Totbox | Totbox focus |
|-------|---------------------|--------------|
| Discover | Mostly solved | Pass-through / out of scope |
| Scope & quote | Multi-turn email | Brief + term capture |
| Household decide | Forwards / delay | Share / approval (later) |
| Schedule | Phone tag | Propose slots, calendar merge |
| Confirm | Lost threads | Status on job |
| After / again | Forgot invoice & due date | Records + rebook |

---

## “Onboarding” checklist (per job or first contact — not city sales)

1. **Find provider externally** (or rebook from private memory).  
2. **Create service brief** in Totbox (CLI/MCP).  
3. **Attach or enter quote terms** when they reply (price, cancel, inclusions).  
4. **Compare** if multiple quotes.  
5. **Draft** schedule ask / confirmation.  
6. **Mark confirmed** + optional next-due.  

No requirement that the provider “signs up for Totbox” to complete a job.

---

## Decision rules

| If… | Then… |
|-----|--------|
| Building a public provider database | **Stop** — wrong product |
| User pastes 2 quotes from email | Normalize + compare — **core** |
| User only has a phone number from Google | Brief + call script + log outcome — **core** |
| Multi-truck partner wants auto job create | Consider ST/Jobber adapter — **later, selective** |
| Dev wants local household tool | MCP/CLI + private `.data/` — **now** |

---

## Explicit non-goals

- Public SEO directory, provider acquisition funnel as inventory  
- Ranking “best HVAC” as a Yelp substitute  
- Requiring provider accounts before scheduling help works  
- FSM APIs as the path to “coverage”

---

*Supersedes earlier “onboard providers into a registry for discovery” framing.*
