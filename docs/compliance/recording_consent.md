# Recording calls & messages — product principles

**Status:** Public design principles for Totbox  
**Not legal advice.** Product counsel must validate before any production voice/SMS **content** capture. Laws change; state lists below are commonly cited and must be re-checked.

**Related:** [continuous sim eval](../eval/continuous_sim_eval.md) · [trace schema](../eval/trace_schema.md) · [AGENTS.md](../../AGENTS.md)

---

## 1. Goals

1. Improve agents via **decision traces** and (where lawful) **channel content**.  
2. Respect user control: explicit opt-in, scope, retention, revoke/delete.  
3. Prefer **one-party consent** jurisdictions for call **recording** features at launch.  
4. Keep **simulation** fully synthetic — no real third parties.  
5. Never commit real call audio, SMS bodies, or household PII to the public git repo.

---

## 2. Federal (US) — working frame

- Federal wiretap rules generally allow recording a call when **at least one party** consents.  
- Totbox’s intended party is the **household user** using the app.  
- VoIP/carrier and app-store terms may impose extra constraints — check separately.  

This is a design starting point, not a guarantee of compliance.

---

## 3. State all-party / two-party consent (commonly cited)

Many U.S. states are **one-party**. Jurisdictions **often described** as requiring **all-party** consent for call recording include (non-exhaustive; verify current law and call type):

**CA, CT, FL, IL, MD, MA, MT, NH, PA, WA** (and occasionally others depending on source and scenario).

**Product default for all-party (or unknown) jurisdictions:**

- Do **not** enable automatic voice **recording** of provider calls.  
- Still allow job PM metadata traces (tools, approvals, status).  
- User may paste their own email/SMS content they already control.  
- Optional future: dual-consent / beep flows only with counsel approval.

---

## 4. Product policy aligned with bootstrap

User product preference: **focus on one-party states**; if the **app user opts in**, do not require the non-user (provider) to approve for recording — where one-party law applies.

| Control | Policy |
|---------|--------|
| **In-app consent** | Explicit opt-in before any call content capture: purpose (quality / model improvement), retention, who can access, how to revoke |
| **Geo allowlist** | Gate voice recording on declared or detected jurisdiction ∈ one-party allowlist (counsel-maintained) |
| **Non-user (provider)** | No separate consent UI required under one-party theory; still avoid deceptive practices and platform ToS violations |
| **Email / SMS** | Prefer user-owned mailbox/SMS logs; capture only with same privacy policy and redaction pipeline |
| **Sim** | Synthetic only; `jurisdiction_policy: sim_synthetic`; no wiretap surface |
| **Datasets** | Every prod-derived sample carries consent flags; support deletion on revoke |
| **Public git** | Synthetic fixtures only |

---

## 5. Capture levels (see trace schema)

| Level | Prod default until counsel + feature flag |
|-------|-------------------------------------------|
| Tools + approvals + job status | **On** (with standard privacy policy) |
| Channel metadata (channel, time, direction) | Optional |
| Redacted bodies | Opt-in + policy |
| Full call audio / raw SMS | Opt-in + one-party allowlist + retention limits |
| Sim full fidelity | Always OK for synthetic content |

---

## 6. Practical launch wedge

1. **Sim first** — full multi-channel recording of synthetic actors (eval E2–E5).  
2. **Prod** — decision traces without third-party call audio.  
3. **Prod content capture** — only after: allowlist, UX consent, redaction, retention, DPA/subprocessors review.  
4. Private counsel memo stored **outside** the public repo.

---

## 7. What this does *not* authorize

- Recording in all-party states without a counsel-approved flow  
- Publishing real customer calls on Hugging Face public datasets  
- Training on revoked-consent data  
- Committing Gmail exports or phone dumps into `totboxapp` git history  

---

*Revisit when adding live voice adapters or multi-state marketing.*
