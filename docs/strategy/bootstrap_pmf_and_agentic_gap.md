# Bootstrap PMF and the agentic gap (physical services vs e‑commerce)

**Status:** Strategy decision log (public-safe)  
**Date:** 2026-07  
**Audience:** founders/maintainers; agents implementing Totbox  
**Related:** [product thesis](../product_thesis.md) · [product spec](../totbox_product_spec.md) · [ST annex](../research/servicetitan_integration.md) · [household runbook](../local_household_runbook.md) · [local MCP connect](../local_mcp_connect.md)

This document freezes **why** Totbox does not bootstrap as a multi-level “Shopify for field services” agent platform, and **what** we ship first for product–market fit under capital and team constraints.

It does **not** cover every engineering track (reliability, multi-tenant tenancy, eval harness depth, etc.). Those are valid **parallel discussions**; this file is product identity + sequencing only.

---

## 1. Product identity (one paragraph)

Totbox is a **job project manager** for home-service chores (beachhead: HVAC preventive + house cleaning). Discovery of *who* to call stays external (Google, Maps, AI search, “my usual guy”). The host LLM (Grok, Claude, Hermes, OpenClaw, …) is the executive assistant; Totbox MCP is the PM — checklist, safety gates, audit, transparent `house_service_v1` progress. Default coordination channels are **human** (email/SMS/phone/form); Calendar is Tier 1 depth; ServiceTitan-class FSMs are **optional later adapters**, not the coverage layer and not a city directory.

---

## 2. Research: why e‑commerce has multi-level agent MCP and field services do not

### 2.1 What e‑commerce platforms already look like (pattern)

Major commerce platforms invested in **agent-ready commerce surfaces**: structured catalog/search, cart, checkout, customer account, and emerging standards (e.g. UCP-style bindings + MCP tool layers). That concentration lets third-party products sit **on top** of platform primitives (e.g. retention / next-best-action engines that activate via the merchant’s ESP *and* agent sessions) without inventing cart or identity.

**Analogy only (no partnership claim):** “Agentic readiness” for online stores means scoring catalog quality, wiring authenticated customer path, and measuring agent-assisted revenue — on a **single dominant SoR**.

### 2.2 What physical / field services look like

| Dimension | E‑commerce | Home / field service |
|-----------|------------|----------------------|
| Fulfillment | SKU + logistics | Human + truck + parts + weather |
| Uncertainty | Stock / shipping | Scope often unknown until on site |
| Settlement | Instant checkout | Quote loops, change orders, memberships |
| Capacity | Inventory + ads | Calendar + tech routing + drive time |
| Liability | Chargebacks / returns | Home access, property damage, license |
| System of record | Concentrated platform | ST / Jobber / HCP / Calendar / phone / SMS |
| Agent standards | Emerging multi-layer MCP + UCP | **No shared “service UCP”** |
| Long tail | Still on-platform | Many operators never connect any API |

### 2.3 Why the gap is structural (not just “they’re late to AI”)

1. **Transaction physics** — agents thrive when state is complete online; services leave state incomplete until a visit.  
2. **Platform concentration** — one commerce OS can ship Catalog/Cart/Checkout MCP once; FSMs optimize **dispatch and AR**, not third-party chat agents comparing three HVAC shops.  
3. **Incentives** — platforms want agent discovery/conversion; FSMs want techs utilized inside their UI.  
4. **Standards lag** — no industry-wide service-brief → quote → book → status interchange across vendors.  
5. **Technical capability distribution** — many solo/cleaning/tree operators are SMS-and-calendar businesses, not App-Store-native SaaS teams.  
6. **Safety surface** — wrong promo is bad; wrong access code + wrong day + wrong scope is worse. Early product must prefer explicit approvals and dry-run (see [host_llm_safety.md](../host_llm_safety.md)).

**Conclusion:** Whitespace for agentic coordination of physical services is real **because the problem is hard**. Treating it as “copy Shopify MCP levels for HVAC” underestimates integration tax, liability, and dual-sided cold start.

---

## 3. Venture shapes (choose one primary)

| Shape | Analogy | Totbox fit | Bootstrap? |
|-------|---------|------------|------------|
| **A. Household chore agent / job PM** | Shopper agent + durable job state | **Strong** — current code and thesis | **Yes — primary** |
| **B. Provider “Agentic Ready” (thin)** | App *on* a platform: structured inbound + calendar/FSM adapter | Medium — needs pilots + sales | **After** shadow PMF + revenue path |
| **C. Platform / UCP-for-services** | Become Shopify/ST for agents | Capital + trust + multi-FSM war | **No** as near-term mission |

**Decision:** Bootstrap as **A**. Optionally sell **B** as depth for paying operators. Do not build **C** pre-PMF.

---

## 4. Bootstrap roadmap (north star)

Every stage must either **(a)** complete more household jobs / cut touchpoints, or **(b)** convert proof into revenue. Everything else is deferred.

| Phase | Focus | Exit |
|-------|--------|------|
| **0** | Foundation: job PM, safety gates, `house_service_v1`, Calendar OAuth scaffold, ST **design** annex | Done on `main` — stop format yak-shaving |
| **1 — now** | Shadow PMF: real HVAC/cleaning jobs via MCP; quote-from-paste; confirm; explicit completion + next-due | ≥5 jobs with documented touchpoint drop; runbook works for a real house (local data only) |
| **2** | First $: structured inbound for local operators (Calendar/email) — **or** household sub if faster | 1–3 paid pilots / LOIs |
| **3** | Stickiness from pilot feedback (quote harden, calendar, rebook) | Retention + case study |
| **4** | Adjacent **only with cash/LOI**: ST private pilot, Agentic Ready packaging, second vertical/metro | Demand-funded adapters |

**Explicit non-goals until Phase 2+ exit:**

- City provider directory / ranking marketplace  
- Multi-FSM integration matrix pre-revenue  
- Viral dual-sided referral GTM as the primary motion  
- Kids/FEC vertical GTM  
- Claiming a full multi-level field-services agent commerce platform  
- Always-on daemon / live SMS vendor as product identity  

Mirror tables live in [README](../../README.md) and [product spec](../totbox_product_spec.md); this doc is the **rationale**.

---

## 5. Monetization under bootstrap

| Stage | Who pays | What they buy |
|-------|----------|---------------|
| Phase 1 | Nobody | Learning (shadow runs) |
| Phase 2 | Operators (preferred) | Structured inbound briefs + less quote ping-pong |
| Phase 2 alt | Households | Chore PM subscription (if ops sales lag) |
| Phase 3+ | Same | Retention (rebook, next-due, better compare) |
| Phase 4a+ | Larger ST shops | Deeper adapter + status |

**Bias:** Prefer **operator revenue** once household proof exists — operators already buy SaaS. Do **not** depend on marketplace take-rate for year-one survival.

---

## 6. Risk–benefit of chasing multi-level provider MCP early

| Upside if done later (thin adapters) | Downside if done as bootstrap identity |
|--------------------------------------|----------------------------------------|
| Closes last mile for multi-truck HVAC | Dual-sided cold start before household value is proven |
| Higher ACV operators | Integration tax (ST access, scopes, multi-tenant secrets) |
| Optional “Agentic Ready” packaging | Thesis dilution into directory/marketplace gravity |
| Complements job PM (same brief → ST push) | Liability of auto-book; claim-ahead marketing |

**Net:** Best risk-adjusted path is **household complete loop first**, then thin provider pipes **funded** by pilots.

---

## 7. Decision framework (when tempted to expand)

Proceed only if **all** hold; first “no” defers the work:

1. **PMF path:** Increases completed jobs or paid pilot conversion within ~90 days.  
2. **Effort:** Fits current stack (MCP job PM, human channels, Calendar) without a new platform.  
3. **Risk:** One-sided value still works if the other side flakes (no required city inventory).  
4. **Revenue:** Generates $ or a sales artifact (case study, LOI).  
5. **Option value:** Does not block later ST/Agentic Ready; preferably makes them adapters.

Shape C (“be Shopify for services”) fails (2), (3), and bootstrap capital tests.

---

## 8. License decision

**Stay Apache License 2.0** for bootstrap (see root [`LICENSE`](../../LICENSE) and README).

Rationale:

- Early users are households, agents, and design partners who need zero license friction.  
- Value today is product loop and learning, not preventing competitive multi-tenant hosting.  
- Source-available options (e.g. BUSL-style “no competitive hosting”) remain available for **new** code later if hosted multi-tenant Totbox is a real product and free-rider risk is live. Do not claim a restrictive license while the tree is Apache.

---

## 9. Local verification (pointer)

- Automated fixture path: `npm run smoke:job`  
- Personal house (placeholders in git; real data only local): [local_household_runbook.md](../local_household_runbook.md)  
- Connect Grok / Hermes / curl: [local_mcp_connect.md](../local_mcp_connect.md)

---

## 10. Parallel tracks (not owned by this doc)

Essential work may proceed **in parallel** without rewriting this north star, for example:

- Reliability, persistence, multi-device resume  
- Security, auth, multi-tenant isolation (when hosted)  
- **Continuous multi-actor sim + eval** — design: [`../eval/continuous_sim_eval.md`](../eval/continuous_sim_eval.md) (channel sandbox, traces, HF datasets, consent principles)  
- UX of progress strip in host UIs  
- Calendar write-path inside the job loop  
- Operator dashboard polish for Phase 2  

Those discussions should **not** silently reintroduce a city directory, restaurant/e-com booking GTM, or pre-PMF multi-FSM platform as the company bet.

---

## 11. One-sentence stance

Totbox bootstraps as the **agentic job PM for home-service chores** (host LLM + safety + workflow); revenue funds **optional agent-ready pipes** into Calendar then FSMs. Full multi-level “Shopify for field services” is neither required for PMF nor survivable as a pre-revenue goal.
