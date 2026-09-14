---
name: verify-totbox
description: Drive Totbox the way a user does — local verify-stage5. Use for pstack independent verification or verify:user-path.
---

# verify-totbox

## Launch

```bash
npm ci
```

`verify:user-path` is a script, not a long-lived server.

## Doctor

`node -v` ≥ 22. Do not point the verifier at production.

## Drive

```bash
npm run verify:user-path
```

Same command as CI `user-path` (`product/scripts/verify-stage5.ts`).

## Evidence

Save stdout under `/tmp/verify-this/<claim>/`. Stamp independent with `--surface cli --command 'npm run verify:user-path'`.

## Cleanup

None beyond processes this run started.
