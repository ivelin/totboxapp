# Ready for human eyes (Totbox instance)

**Status:** `unknown` — not green  
**OS:** Bootstrap OS v2.8 ship gate ([portable checklist](../docs/company-os/ready-for-human-eyes.md))  
**Date:** 2026-08-04  

## What this means

We have **not** yet recorded a cold-user happy path on a shareable surface for external mentor/user product-test asks.

Engineering smoke (`npm run smoke:job`, unit tests) is **not** the same as Ready for human eyes.

## Target happy path (hypothesis)

Cold user (or host LLM + MCP) can complete a thin household job path without founder babysitting: intent → structured facts → draft → human approval gate visible → progress strip.

## How to go green

1. Run cold-path check (workflow `ready-for-human-eyes` mode=`check`, or manual incognito / another device).  
2. Fill evidence below; set blockers if any.  
3. CLI:

```bash
npm run company-os -- set-ready-for-eyes green \
  --note "Cold path passed: …" \
  --evidence product/READY_FOR_HUMAN_EYES.md \
  --url "https://…"
```

## Evidence (fill when checked)

| Field | Value |
|-------|--------|
| URL | *(none yet)* |
| How verified | sandbox browser / synthetic cold user / other device |
| Blocking console clean? | |
| Auth / embed OK? | |
| Blockers | |

## What green is not

Demand, PMF, willingness to pay, or Phase 1 business exit.
