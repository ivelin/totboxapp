# Continuous multi-actor eval + sandboxed simulation

**Status:** Parallel-track design (public-safe)  
**Date:** 2026-07  
**Product north star:** [bootstrap PMF + agentic gap](../strategy/bootstrap_pmf_and_agentic_gap.md) — this doc does **not** replace Phase 1 household job PM.  
**Related:** [scenario format](scenario_format.md) · [trace schema](trace_schema.md) · [recording consent principles](../compliance/recording_consent.md) · [host safety](../host_llm_safety.md) · [job PM architecture](../mcp_workflow_architecture.md)

---

## 1. Why this exists

Unit tests and `npm run smoke:job` prove deterministic job-PM transitions (fixture paste, dry-run send, gates). They do **not** prove:

- A host LLM follows `next_action` under ambiguity  
- Providers reply realistically across phone / SMS / email / web form  
- Safety refusals hold under adversarial prompts  
- Recovery after no-reply, bad quotes, dual-approver households  
- **Config parity:** what we evaluate ≈ what we deploy  

We need **continuous eval** in a **tight sandbox** that approximates production topology, stays isolated from real people/networks in test, and feeds **decision traces + lawfully captured real-world artifacts** into labeled datasets (e.g. private Hugging Face org repos).

---

## 2. Principles

| Principle | Meaning |
|-----------|---------|
| **Multi-actor** | Synthetic household manager, synthetic providers, Totbox consumer agent(s); later optional Totbox provider agent(s) |
| **Channel-real** | Simulated email, SMS, voice, web form — not only JSON tool stubs |
| **Prod-shaped** | Same MCP contract, job PM, safety policy, workflow strip; adapters swap sim ↔ prod |
| **Hard isolation** | Sim cannot open real SMTP/SMS/phone/Gmail; separate secrets; egress policy |
| **Minimal prod delta** | `TOTBOX_ENV=sim\|prod` (or adapter registry); ship = config + credentials, not a rewrite |
| **Trace-first** | Tool calls, approvals, redacted model turns, channel messages, job outcome |
| **Closing the loop** | Prod traces → sanitize → dataset → harder scenarios → regression gates |
| **Fragmented chores** | Home / local **coordination** with multi-turn human messaging — not e-com checkout |

### Domain inclusion test

Prefer scenarios where **all** hold:

1. Multi-turn human messaging is still common  
2. Money / time / scope approval matters  
3. No dominant one-tap booking graph for the long tail  
4. Recurring or high ticket (rebook, next-due, membership language)  
5. Clear who might pay (household pain or operator admin)

**In v1 library:** HVAC, cleaning, tree, bike shop repair estimate, salon reschedule, handyman, lawn.  
**Out:** e-commerce cart/checkout.  
**Restaurant booking:** **excluded from product beachhead and primary sim library** (platform concentration + single-shot jobs + weak monetization vs house services). Optional **late, eval-only** phone scenario for channel stress (`eval_channel_only`) is allowed — never as GTM. Full rationale lives in the session strategy discussion; summary: *too much distraction for not enough reward under bootstrap.*

---

## 3. Actor model (household-centered)

```text
                    ┌─────────────────────────────┐
                    │  Simulation Orchestrator    │
                    │  scenarios · clocks · seeds │
                    └─────────────┬───────────────┘
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐
│ Household       │    │ Totbox plane    │    │ Provider plane      │
│ Manager persona │◄──►│ MCP job PM +    │◄──►│ Synthetic shops     │
│ (+ co-approver) │    │ host-LLM agent  │    │ (HVAC, clean, bike, │
└────────┬────────┘    │ (consumer)      │    │  salon, …)          │
         │             └────────┬────────┘    └──────────┬──────────┘
         └────────── channel bus (sim email/SMS/voice/web) ──────────┘
```

### Household manager

- Profile: goals, budget sensitivity, calendar constraints, style, tech literacy  
- Policy: scripted and/or LLM-driven (tier-dependent)  
- Actions: intent, approve/deny send and money/time, forward sim inbox, abandon, escalate to partner  
- Hierarchy: primary manager; optional co-approver; later PM handoff  

### Service provider (synthetic)

- Profile: category, channel preference, quote style, latency, no-show, upsell  
- Channels: sim mailbox, SMS queue, voice script/LLM+STT/TTS (sim-only audio), web form → inbound lead  
- **Eval inventory only** — never a public metro directory product  

### Totbox consumer agent

- Production MCP tools (`start_job`, approvals, ingest, confirm, `record_job_completion`, …)  
- Host LLM under test  
- Scored on success, safety, process honesty, touchpoints  

### Totbox provider agent — later

- Solicit / qualify / schedule on provider side after consumer sim is stable  

---

## 4. Topology: sim ≈ prod

```text
Control plane (sim-only)
  scenario runner · personas · channel bus · clock · gold labels · egress block
           │ same application APIs
App plane (shared code)
  job-pm · mcp-tools · workflow-progress · safety
  adapters: email | sms | voice | calendar | (later FSM)
  impl: Sim*  vs  Prod*  via config
           │
Data plane
  decision traces · redaction · HF/private datasets · CI reports
```

| Concern | Sim | Prod |
|---------|-----|------|
| Job PM + MCP | same package | same |
| Safety policy | same defaults | same |
| Email | `SimMailAdapter` | host Gmail / `hostPerformed` |
| SMS / voice | Sim queues | real vendors when shipped |
| Calendar | mock busy + record confirm | Google OAuth when wired |
| Data dir | `.data-sim/` | `.data/` / hosted DB |
| Network | deny egress except allowlisted model API | normal |
| Watermark | `X-Totbox-Sim: 1` on synthetic messages | none |

**Push to production:** flip env + secrets; do not dual-maintain job logic.

---

## 5. Eval tiers

| Tier | What | Gate |
|------|------|------|
| **T0** | Unit + `npm run smoke:job` | PR required |
| **T1** | Deterministic sim: scripted providers, fixed replies, no host LLM | PR / nightly |
| **T2** | Host-LLM agent vs scripted providers | Nightly / pre-release |
| **T3** | LLM providers + noisy channels | Weekly |
| **T4** | Adversarial (skip approval, invent PII, double-book) | Weekly + release |
| **T5** | Replay **redacted** prod traces | Batch continuous |

### Metrics

- Task success (Booked/Done per gold criteria)  
- Touchpoint compression vs baseline  
- Safety: no unapproved send; no money/time without gate; no invented PII  
- Honesty: dry-run vs hostPerformed; progress strip matches state  
- Cost/latency (agent tiers)  
- Human override rate  

### Continuous loop

```text
scenario → sim (T1–T4) → score → CI fail or ticket
    ▲                              │
    └──── labeled hard cases ◄─────┘
              ▲
              │ redacted traces (+ consent)
         production (opt-in)
```

---

## 6. Scenario library (v1 seeds)

Synthetic only; see [scenario_format.md](scenario_format.md).

1. HVAC preventive under budget + membership confusion  
2. Priority clean + partner approval mid-thread  
3. Tree / seasonal constraint  
4. Bike shop repair estimate + parts delay  
5. Salon reschedule over SMS  
6. Handyman scope-creep quote  
7. No-reply chase + second vendor  
8. Wrong-number / wrong-email recovery  

---

## 7. Datasets (Hugging Face or equivalent)

| Asset | Guidance |
|-------|----------|
| Scenarios | Versioned pack `totbox-eval-scenarios@vN` (can be public if fully synthetic) |
| Traces | **Private** org dataset; consent + jurisdiction fields required for prod-derived rows |
| Labels | success/fail, safety tags, channel quality, needs_human |
| Real calls/messages | Only with lawful capture (see [recording consent](../compliance/recording_consent.md)); never commit raw audio/PII to git |
| Alternatives | S3+DVC, W&B Artifacts, Langfuse/Phoenix export |

Public git: synthetic fixtures only ([AGENTS.md](../../AGENTS.md)).

---

## 8. Isolation

- Namespace/project `totbox-sim`  
- Block real messaging gateways; optional model API via proxy  
- Keys separate from prod  
- Deterministic clock + seed for T1  
- Rate limits if a real adapter is mis-bound  

---

## 9. Relationship to current code

| Existing | Role |
|----------|------|
| `src/lib/job-pm.ts`, `mcp-tools.ts` | App plane under test |
| `npm run smoke:job` | T0 |
| `scripts/eval/run-eval.ts` | Seed for T1 expansion or gradual replace |
| Safety + `house_service_v1` strip | Gold properties |

---

## 10. Delivery phases (eval system)

| Phase | Deliverable | Notes |
|-------|-------------|--------|
| **E0** | These design docs | Now |
| **E1** | Trace recorder sink (opt-in file) on job PM path | Small |
| **E2** | Channel bus + SimMail + scripted provider + scenario runner (T1) | Medium |
| **E3** | Host-LLM harness → `dispatchMcpTool` (T2) | Medium |
| **E4** | Private dataset packaging + nightly T1 CI | Medium |
| **E5** | Voice/SMS sim + adversarial (T3–T4) | Larger |
| **E6** | Prod redacted export + consent + replay (T5) | Counsel |
| **E7** | Provider-side agents | After consumer sim stable |

**Bootstrap discipline:** E0–E2 parallel Phase 1; E6 must not block household PMF.

---

## 11. Open questions

1. CI host LLM cost vs policy-mock agent for T1 only  
2. Scripted IVR vs full STT/TTS in voice sim  
3. Users in all-party recording states; providers elsewhere  
4. HF vs internal object store for audio volume  
5. Default prod capture: tools/approvals only until counsel sign-off on content  

---

## 12. One-sentence stance

Build a **prod-shaped, multi-actor sandbox** that continuously scores Totbox’s household job agent on fragmented local coordination — feeding harder synthetic and **consent-clean** real traces back into eval — without becoming a restaurant or e-com booking platform.
