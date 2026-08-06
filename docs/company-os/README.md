# Bootstrap OS for Solo Founders — Totbox instance

> **Portable template (source of truth):** [github.com/ivelin/bootstrap](https://github.com/ivelin/bootstrap) (`company-os/`)  
> **This folder:** Totbox’s **live instance** plus a **convenience copy** of blueprint files. Prefer upstream for template installs and template edits. Do not treat dual copies as two SoTs forever.

**What it is:** the starter system for solo, non-technical founders going from zero to a running company without a team or funding. A **preflight check for your company** — inventory skills, constraints, customers, and cash before you load tools and AI agents.

*For the technical-minded: the founder's BIOS. Basic inventory, then handoff to the full company system.*

Totbox is one **application** of Bootstrap OS — not the definition of the system. Mentees: **steal process and control**, not Totbox’s home-service market.

*(Folder path remains `docs/company-os/` and CLI remains `npm run company-os` until a deliberate code rename.)*

| Path | What it is |
|------|------------|
| **Upstream template** | [ivelin/bootstrap](https://github.com/ivelin/bootstrap) — blueprint, live-runtime, AI instructions, ready-for-human-eyes, blank `templates/` |
| [`applied-here.md`](applied-here.md) | **Instance only** — Totbox hypothesis, architecture, gap analysis |
| [`instance/`](instance/) | Living Totbox instance index — scores, thesis, orchestration |
| Local copies of `operating-system.md`, `live-runtime.md`, `ai-instructions.md`, `ready-for-human-eyes.md` | May lag bootstrap; **do not edit** unless promoting an approved template delta upstream first |
| CLI | `npm run company-os -- status` — durable state (`company/state/`) |
| Workflows | `.grok/workflows/` — company-operating-loop, user-research, ready-for-human-eyes (instance-oriented) |

---

## Mental model (two minutes)

```text
BLUEPRINT (how to decide)          LIVE RUNTIME (how to learn every week)
upstream: ivelin/bootstrap         company/state + this instance/
  journey phases 1–9                 persistent state, scores, gates
  founder gates + honest evidence    stages 1→7 loop → memory → back
```

---

## Template change policy (standing rule)

Portable template lives in **`ivelin/bootstrap`**, not in this product repo.

As **this product repo (Totbox)** evolves, useful patterns may emerge. Treat promotion into the **Bootstrap OS template** as rare, deliberate work — not a continuous sync from product PRs.

| Layer | Default when Totbox changes |
|-------|-----------------------------|
| **Instance** — `applied-here.md`, `instance/`, product docs, app code | Update freely as Totbox learns (public-safe; no PII) |
| **Template** — files under [ivelin/bootstrap](https://github.com/ivelin/bootstrap) | **Do not change** unless the founder **explicitly approves** a portable edit in that repo |
| **Local blueprint copies** in this folder | Prefer pull/sync from bootstrap after approved template releases; avoid silent drift |

### When extraction from Totbox → bootstrap is allowed

1. **Slow** — Prefer many product iterations before one template change.  
2. **Methodical** — Name the pattern, why it is domain-agnostic, and how mentees might misuse it.  
3. **Thoughtful** — Prefer principle + checklist over markets, stacks, or workflows unique to one product.  
4. **Approval-gated** — Propose a short template delta in bootstrap (what / why / where); wait for explicit approval.  
5. **Instance-first** — Keep Totbox-specific application here even when a portable principle is approved.

### Anti-patterns

- Auto-promoting every product win into the OS  
- Copying MCP, a beachhead market, or pricing into the blueprint “because we use them”  
- Silent template edits inside Totbox product PRs without bootstrap approval  
- Pointing mentees only at Totbox as if it were the portable pack  

**Agents:** Default to **instance** docs for Totbox work. For portable OS installs, point founders at **ivelin/bootstrap**. Do not edit local blueprint copies or bootstrap template without founder approval for that change.

---

## For mentees

1. Prefer the portable pack: [github.com/ivelin/bootstrap](https://github.com/ivelin/bootstrap).  
2. Optionally skim [`applied-here.md`](applied-here.md) to see **one** real project’s gap analysis (illustration only).  
3. Paste thin rules from bootstrap `company-os/ai-instructions.md` into your AI tool.  
4. Before mentor/user “try my link” asks, use ready-for-human-eyes (bootstrap checklist or Totbox workflow).  
5. **Do not** copy Totbox’s product thesis, customer group, or stack. Copy the *method*.  
6. Start with markdown state + a weekly loop before adopting agent frameworks.

---

## For AI agents pointed at this repo

When a founder says: *“Take the Bootstrap OS from this repo and apply what’s useful to my startup”*:

1. Prefer **[ivelin/bootstrap](https://github.com/ivelin/bootstrap)** blueprint + live-runtime over Totbox product files.  
2. Use **`applied-here.md` only as an illustration** — never as the mentee’s default market or feature list.  
3. Product files under `docs/strategy/`, workflows, root `README.md`, etc. are **one company’s product runtime**.  
4. Instantiate **their** thesis, customer groups, state, journey phase, loop stage, and tiny slice.  
5. Recommend frameworks only when they reduce pain vs git + scripts.  
6. Respect public-repo privacy norms (`AGENTS.md`); mentees’ private customer data stays private.  
7. Respect the **Template change policy** above.

---

## Versioning

| Doc | Notes |
|-----|--------|
| Portable template | See [ivelin/bootstrap](https://github.com/ivelin/bootstrap) (currently v2.8 lineage) |
| Totbox instance | Evolves freely in `applied-here.md` + `company/state/` |

Local blueprint copies in this folder may lag. When in doubt, trust **bootstrap**.

---

*Principles travel. Product details stay in Totbox docs.*
