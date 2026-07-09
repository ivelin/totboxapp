# Agent instructions — totboxapp

## HARD RULE: Public repository — no sensitive data in commits

This repository is **public** (`github.com/ivelin/totboxapp`).

**Never commit, stage, or push sensitive or personally identifiable information.** This is a hard rule, not a preference.

### Forbidden in git history (examples)

- Names of private individuals (household members, partners, friends, non-public contacts)
- Email addresses, phone numbers, account IDs, auth tokens, API keys, secrets
- Street addresses, unit numbers, precise property locations, personal zip codes that re-identify a household
- Raw email/thread content, invoice PDFs, Gmail exports, research dumps with real data
- Private vendor case studies tied to a real household (“my HVAC guy at …”)
- Property-manager / HOA account details that pin a residence
- `.env` files and credentials

### Allowed (public-safe)

- Anonymized workflows, friction patterns, product specs
- Generic example prompts (no real addresses or personal zips)
- Metro-level GTM (“Austin/TX”) without private site details
- Public product/API documentation (e.g. ServiceTitan developer concepts)
- Fictional seed operators and metro-level geography in fixtures

### Before every commit

1. Review `git status` and `git diff` for secrets and PII.
2. Prefer patterns-only language in docs.
3. Keep raw research outside the repo or under gitignored `docs/research/private/`.
4. If unsure whether something is identifying — **omit it**.
5. See `docs/research/README.md` for research-specific privacy rules.

### Never

- Commit files from `~/Downloads` research logs without a full scrub
- Amend published history to “fix” PII without explicit user direction (prefer not putting it in at all)
- Bypass this rule for convenience, fixtures, logs, or “temporary” debug dumps
