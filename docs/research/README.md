# Research docs (public)

These notes capture **product insights** for Totbox. They are intended for a **public** repository.

## Privacy rules (required)

**Do not commit personally identifiable information (PII), including:**

- Real names of household members, partners, friends, or non-public individuals  
- Email addresses, phone numbers, account IDs  
- Street addresses, unit numbers, or precise property locations  
- Specific personal zip codes when they re-identify a household (use metro-level or fictional examples)  
- Named private providers as “my vendor” case studies tied to a real household  
- Raw email/thread content, invoice PDFs, or attachment dumps  
- Property-manager account details or HOA identifiers that pin a residence  

**OK to commit (patterns only):**

- Anonymized workflows, friction lists, and category rankings  
- Generic example chat prompts (no real addresses)  
- Public product/API docs (e.g. ServiceTitan developer portal concepts)  
- Metro-level GTM focus (e.g. “Austin/TX”) without private site details  

**Local raw research** (Gmail exports, full research logs with PII) must stay **outside** the repo or under a gitignored path such as `docs/research/private/`.

If you are unsure whether something is identifying, **omit it**.

---

## Public research & strategy index

| Doc | What it is |
|-----|------------|
| [`home_services_email_insights.md`](home_services_email_insights.md) | Anonymized coordination friction patterns (home services) |
| [`servicetitan_integration.md`](servicetitan_integration.md) | ST design annex (Tier 2; not bootstrap) |
| [`../strategy/bootstrap_pmf_and_agentic_gap.md`](../strategy/bootstrap_pmf_and_agentic_gap.md) | **Why** services lag e‑com agent MCP; bootstrap phases; what not to build |
| [`../eval/continuous_sim_eval.md`](../eval/continuous_sim_eval.md) | Multi-actor sandbox + continuous eval design |
| [`../eval/scenario_format.md`](../eval/scenario_format.md) | Scenario YAML sketch |
| [`../eval/trace_schema.md`](../eval/trace_schema.md) | Decision trace envelope |
| [`../compliance/recording_consent.md`](../compliance/recording_consent.md) | Call/message capture principles (not legal advice) |
| [`../local_mcp_connect.md`](../local_mcp_connect.md) | Local host connect (Grok / Hermes / curl) |
| [`../local_household_runbook.md`](../local_household_runbook.md) | Consumer Phase 1 job path |
