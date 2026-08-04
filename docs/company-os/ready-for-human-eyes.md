# Ready for human eyes — portable checklist

**Part of:** [Company Operating System](operating-system.md) **v2.8+**  
**Purpose:** Fail-closed gate before asking mentors, betas, or strangers to use a product link.  
**Not:** Proof of demand, payment, or product–market fit.  
**Template edits:** Approval-gated — see [`README.md`](README.md#template-change-policy-standing-rule).

---

## Founder fills this in (~2 minutes)

| Field | Your answer |
|-------|-------------|
| **Who** (one line) | |
| **Happy path** (plain steps) | |
| **Done means** | |
| **URL** (public or stable preview — not localhost-only) | |
| **Date** | |

---

## Evidence pack (agent or founder — check all that apply)

Run in a **cold** context: sandbox browser, natural-language synthetic first-time user, and/or another device / incognito / phone.

| # | Check | Pass? | Notes |
|---|--------|-------|-------|
| 1 | Cold URL opens without founder-only session | ☐ | |
| 2 | Happy path reaches success end state | ☐ | |
| 3 | No blocking console / critical network errors on path | ☐ | |
| 4 | If embedded (iframe), scripts and interactivity actually run | ☐ | |
| 5 | Third-party auth / permissions (if any) grant and return work once | ☐ | |
| 6 | Optional: founder cold confirm on another device | ☐ | |

**Gate status:** ☐ unknown · ☐ blocked · ☐ **green**

If **blocked**, list blockers in plain language (one line each):

1.  
2.  
3.  

---

## Evidence artifact (when green)

Copy into your company runtime (e.g. `product/READY_FOR_HUMAN_EYES.md` or `evals/ready-for-human-eyes/REPORT.md`):

```markdown
# Ready for human eyes

**Status:** green  
**Date:** YYYY-MM-DD  
**URL:** https://…  
**Happy path:** …  
**How verified:** sandbox browser / synthetic cold user / other device (pick)  
**Blockers found then fixed:** none | list  
**What this is not:** demand, PMF, or willingness to pay  

## Steps that passed
1. …
2. …
```

Update company state: `readyForHumanEyes.status = green` (CLI or agent).  
Only **then** draft “please try this” / mentor beta messages.

---

## AI / workflow rules (summary)

1. If status is not **green**, refuse to draft external product-test asks; offer to run this checklist.  
2. Prefer automated cold path (sandbox browser + synthetic user) so founders stay on product vision.  
3. Explicit founder override to share a known-broken path requires a **decision trace** (why, risks, what not to judge).  
4. Green expires when the happy path or deploy surface changes materially — re-run before the next external ask.

---

## Two gates (do not mix)

| Artifact | Question |
|----------|----------|
| Ready for real-world *research* | ICP filter honest enough for real problem conversations? |
| **Ready for human eyes** | Cold person can complete the *product* happy path? |

---

*Vehicle, not curriculum. Founders state path; harness proves cold path.*
