# User-research ROUND 1-r5 report — Totbox ICPs

**Label:** `SYNTHETIC ONLY`  
**Round:** 1-r5  
**Prior round:** [ROUND 1-r4](ROUND_1-r4_report.md) (founder `iterate` — KEEP single-DM + dual as re-scored peers; DROP condo-HOA, B2B2C operator, phone-native + all prior weak_fits; eight NEW never-tried diversity seats)  
**slate_n:** `10`  
**AI ready_for_real_world (skeptic):** `false`  
**Ranking sound:** `true` (recommended order matches scorecard + bootstrap learning physics under Company OS reward/risk)  
**Diversity ok:** `true` (each NEW seat claims a unique diversity_value cell; caps honored)  
**Actionable binary:** only `strong_fit` | `weak_fit` — no promote_lean / hold / demote / poor_fit / unclear middle states  
**Real-test shortlist:** ranks 1–2 (`strong_fit`) only; ranks 3–10 (`weak_fit`) out of near-term real tests

This report is a **Company OS synthetic filter**. It is **not** real-world proof, PMF, LOI, or permission to lock READY_FOR_REAL_WORLD. Founder gate only; AI never locks primary focus from synthetic alone. Pack correctly does **not** claim LOI or READY_FOR_REAL_WORLD.

---

## Executive summary

Round **1-r5** re-ran the synthetic filter as a **slate_n=10 diversity sample** after founder iterate: **KEEP** both strong_fit peers (`household-single-decision-maker-recurring`, `household-dual-income-recurring`) as re-scored Shape A owner-occupant peers (not automatic winners); **DROP** all prior weak_fits without rename-recycle (condo-HOA, B2B2C operator, phone-native, aging-in-place, portal-native, white-glove, move-in, landlord, emergency HVAC, remote-care, seasonal-tree, operator-agentic, SMS-grounds); introduce **eight NEVER-TRIED** seats each claiming a unique diversity_value cell to fill post-1-r4 landscape gaps (employer_b2b2c, property_mgr, second_home_snowbird, str_host, new_build_warranty, phone_first rural/after-hours, multi_gen_household, restoration_claim). Caps: 0 pure operator_payer, 0 pure emergency, 1 phone_first.

**Ranked verdict (all 10 ICPs)** — columns: Rank | ICP | seat_role | Synthetic verdict | Rationale  
**Binary only:** `strong_fit` = real-test shortlist eligible · `weak_fit` = drop from near-term real tests

| Rank | ICP | seat_role | Synthetic verdict | Rationale |
|------|-----|-----------|-------------------|-----------|
| 1 | Single decision-maker household (recurring home-service PM) | user | **strong_fit** | Keep — one person can decide fast; we still need proof they will actually use and pay. |
| 2 | Busy dual-income household (HVAC + cleaning chore PM) | user | **strong_fit** | Keep — messy partner + calendar pain is real; risk that the second person never approves. |
| 3 | Multi-home snowbird / second-home seasonal PM | user | weak_fit | Out — fits the product idea, but too few jobs a year and hard to support two homes. |
| 4 | Multi-generation one-roof shared-home coordinator | user | weak_fit | Out — too many people under one roof must agree; jobs will stall. |
| 5 | New-build warranty / punch-list service window | user | weak_fit | Out — only a short warranty window; builders push their own vendors. |
| 6 | Short-term rental host turnover coordinator | user | weak_fit | Out — hosts already use other apps; same-day turnovers fight our approve-before-send step. |
| 7 | Mid-portfolio residential property manager | payer_hybrid | weak_fit | Out — feels like big property software; slow first customer, many parties to please. |
| 8 | Insurance-claim restoration home-service coordinator | user | weak_fit | Out — one-off claims, not recurring home care; insurance people slow everything down. |
| 9 | Corporate relocation / employer-paid home-service seat | payer_hybrid | weak_fit | Out — companies pay relocation firms, not a small job checklist tool. |
| 10 | Rural / after-hours home-service household | user | weak_fit | Out — mostly phone, not email; sparse areas push “find anyone available” marketplaces. |

**Only two seats make the real-test shortlist (`strong_fit`):** single decision-maker (#1) and dual-income (#2). The other eight were new ideas we had not tried before; all came back **weak_fit** (out for now). That is useful: we stress-tested different customers without renaming old failures.

**Not ready for real-world yet** (AI flag still false). This round is a paper filter only. We still need real house jobs with numbers before claiming product-market fit.

**What you do next:** edit [`FOUNDER_FEEDBACK.md`](FOUNDER_FEEDBACK.md) with `iterate`, `agree_ready`, or `kill`. If you pick real tests, only shortlist #1 (main) and maybe #2 (partner-household compare). Count emails/calls before vs after, keep human approve-before-send, and do not build a vendor directory.

---

## Diversity map

Proves each NEW seat claims a **unique** `diversity_value` cell. Axes used this round: buyer_seat | cadence | channel | monetization | vertical | ops_context. Caps: max 1 operator_payer (0 used), max 1 emergency (0 used), max 1 phone_first (1 used = rural).

| diversity_value | ICP id | prior_status | diversity_axis |
|-----------------|--------|--------------|----------------|
| single_dm | `household-single-decision-maker-recurring` | keep | buyer_seat |
| dual_household | `household-dual-income-recurring` | keep | buyer_seat |
| second_home_snowbird | `multi-home-snowbird-second-home` | new | ops_context |
| multi_gen_household | `multi-gen-household-shared-home` | new | ops_context |
| new_build_warranty | `new-build-warranty-punch-window` | new | ops_context |
| str_host | `short-term-rental-host-turnover` | new | buyer_seat |
| property_mgr | `mid-portfolio-property-manager` | new | buyer_seat |
| restoration_claim | `insurance-claim-restoration-coordinator` | new | vertical |
| employer_b2b2c | `corporate-relocation-employer-paid` | new | monetization |
| phone_first | `rural-after-hours-home-service` | new | channel |

**Landscape map (founder label → ICP id):**

| Landscape label | ICP id |
|-----------------|--------|
| employer_b2b2c | corporate-relocation-employer-paid |
| property_mgr | mid-portfolio-property-manager |
| second_home_snowbird | multi-home-snowbird-second-home |
| str_host | short-term-rental-host-turnover |
| new_build_warranty | new-build-warranty-punch-window |
| phone_first | rural-after-hours-home-service |
| multi_gen_household | multi-gen-household-shared-home |
| restoration_claim | insurance-claim-restoration-coordinator |

No two NEW seats share a diversity_value cell. No renaming of past weak_fits.

---

## Method

### What this round is

- **Company OS synthetic filter** (scorecards + adversarial dialogues + fail-closed skeptic).
- Slate of **exactly ten peer ICPs** under founder iterate (`slate_n=10` diversity sampling):
  - **Retained peers (re-scored, prior_status=keep):** single-DM + dual-income (not automatic winners; dual remains current beachhead hypothesis)
  - **Eight NEW challengers (never slate members):** corporate-relocation-employer-paid; mid-portfolio-property-manager; multi-home-snowbird-second-home; short-term-rental-host-turnover; new-build-warranty-punch-window; rural-after-hours-home-service; multi-gen-household-shared-home; insurance-claim-restoration-coordinator
- **Dropped (1-r4 + prior, not re-proposed as NEW):** condo-HOA, B2B2C operator, phone-native low-email, aging-in-place, portal-native, white-glove, move-in, landlord, emergency HVAC, remote-care, seasonal-tree, operator-agentic, SMS-grounds
- Shape A job-PM only; hard no-directory; public-safe composites; caps: 0 pure operator_payer, 0 pure emergency, 1 phone_first
- Ranking is **fail-closed and adversarial**: prefer weak_fit when uncertain; single-DM vs dual topology A/B; diversity stresses are filter signals not multi-ICP GTM expansion
- **Public-safe composites only** — no named people, addresses, emails, phones, or private archives as multi-N proof

### Tried-exclusion note (anti-infinite similar weak_fits)

This round **must not** reintroduce already-falsified weak_fits under new labels. Explicitly excluded / already tried:

| Tried / dropped seat | Why not recycled as NEW |
|----------------------|-------------------------|
| condo-HOA common-area | 1-r4 weak_fit; association multi-party |
| B2B2C operator partnership | 1-r4 weak_fit; operator_payer / later acquisition |
| phone-native low-email metro HVAC+cleaning | 1-r4 weak_fit; channel kill on same verticals |
| aging-in-place adult-child | 1-r3 weak_fit; remote care topology |
| membership-portal-native | 1-r3 weak_fit; residual thin |
| white-glove concierge | 1-r3 weak_fit; thin reach / EA substitutes |
| new-homeowner move-in burst | 1-r2 weak_fit; episodic LTV (distinct from new_build_warranty punch) |
| small landlord / tenant-split | 1-r2 weak_fit (distinct from mid-portfolio PM) |
| emergency HVAC repair | 1-r2 weak_fit; emergency cap |
| remote-care / multi-site coordinator | Round 1 weak_fit (distinct from self-owned snowbird) |
| seasonal tree / arborist | Round 1 weak_fit; vertical swap |
| operator-agentic Shape B | Round 1 weak_fit; Shape B |
| SMS/phone-native grounds (lawn/pest) | Round 1 weak_fit; vertical + channel |

NEW seats are **distinct cells**, not renames: snowbird ≠ remote-care (self-owned vs care-for-others); multi-gen ≠ dual-income and ≠ aging-in-place remote; new-build warranty ≠ general move-in; mid-portfolio PM ≠ small landlord ≠ condo-HOA; STR host ≠ white-glove; rural phone_first ≠ metro phone-native; restoration claim ≠ emergency HVAC; employer-paid ≠ operator_payer.

### What this round is not

- Not multi-household external interview proof  
- Not instrumented touchpoint measurement  
- Not willingness-to-pay or LOI evidence  
- Not primary-focus promotion or PMF  
- Not permission to write `READY_FOR_REAL_WORLD.md` without founder `agree_ready`  
- Not calibrated multi-N validation of ~0.xx scorecard precision  
- Not a beachhead swap to snowbird / STR / PM / claim / employer-paid / rural phone from synthetic alone  
- Not multi-ICP GTM expansion across weak_fit seats  
- Not Phase-2 operator GTM before household shadow evidence  

### Thesis under test

Totbox bootstraps as **Shape A**: household home-service **job project manager** (host LLM = EA; Totbox MCP = durable checklist PM with safety gates, dry-run send, quote paste → money/time approve → confirm → complete + next-due + transparent `house_service_v1` progress). Beachhead verticals: recurring HVAC preventive/membership + house cleaning. Discovery stays external (Google/Maps/Yelp/AI search/user-sourced vendors) — **hard no** public directory, city inventory, or ranking marketplace. Default channels: human email/SMS/form (+ calendar depth); ServiceTitan-class FSMs optional later adapters only with cash/LOI — not a coverage layer. Shape B operator “Agentic Ready” inbound only after shadow PMF; Shape C multi-level platform deferred. Contrarian edge: coordination friction (quote loops, partner approve, calendar, next-due, invoice chaos) is the product — not “who exists.” Success = **fewer touchpoints on real jobs**, not provider count or marketplace GMV. **Kill if** shadow jobs fail to cut touchpoints **or** directory/marketplace is required for value. Company state: journeyPhase 6 (build), loopStage 4 (test); engineering strong, Phase 1 business exit (instrumented real house jobs) still open. Synthetic research is a filter only; real-world still required before primary-focus promotion.

---

## Ranked verdict table

Canonical ranked verdict table is in the **Executive summary** above (`Rank | ICP | seat_role | Synthetic verdict | Rationale` only — no promote_lean). If repeated elsewhere, columns and content must match.

---

## Full scorecard table (numeric scores)

| ICP id | Name | seat_role | pain | pay_or_act | channel_fit | reach | risk | time_to_signal | synthetic_verdict |
|--------|------|-----------|------|------------|-------------|-------|------|----------------|-------------------|
| `household-single-decision-maker-recurring` | Single DM (recurring home-service PM) | user | 0.76 | **0.62** | 0.87 | **0.72** | **0.54** | **0.78** | **strong_fit** |
| `household-dual-income-recurring` | Busy dual-income (HVAC + cleaning chore PM) | user | 0.82 | 0.58 | **0.88** | 0.68 | 0.58 | 0.74 | **strong_fit** |
| `multi-home-snowbird-second-home` | Multi-home snowbird / second-home seasonal PM | user | 0.84 | **0.64** | 0.80 | 0.50 | 0.70 | 0.50 | weak_fit |
| `multi-gen-household-shared-home` | Multi-generation one-roof shared-home | user | 0.85 | 0.55 | 0.80 | 0.58 | 0.70 | 0.60 | weak_fit |
| `new-build-warranty-punch-window` | New-build warranty / punch-list window | user | 0.85 | 0.57 | 0.74 | 0.50 | 0.76 | 0.60 | weak_fit |
| `short-term-rental-host-turnover` | STR host turnover coordinator | user | 0.86 | 0.59 | 0.67 | 0.50 | 0.76 | 0.52 | weak_fit |
| `mid-portfolio-property-manager` | Mid-portfolio residential PM | payer_hybrid | 0.86 | 0.56 | 0.70 | 0.43 | 0.86 | 0.38 | weak_fit |
| `insurance-claim-restoration-coordinator` | Insurance-claim restoration coordinator | user | **0.89** | 0.55 | 0.66 | 0.44 | 0.86 | 0.40 | weak_fit |
| `corporate-relocation-employer-paid` | Corporate relocation / employer-paid | payer_hybrid | 0.85 | 0.51 | 0.68 | 0.40 | 0.84 | 0.38 | weak_fit |
| `rural-after-hours-home-service` | Rural / after-hours home-service | user | 0.74 | 0.44 | **0.35** | 0.42 | 0.82 | 0.48 | weak_fit |

Scores are **AI judgment composites** (~0.xx precision is not multi-N calibrated proof). Risk: lower is better for solo bootstrap. Possible soft over-scores noted in skeptic (multi-gen channel 0.80 under phone hybrid; snowbird pay 0.64 in-window ≠ off-season SaaS; STR channel 0.67 under same-day SMS; corporate employer job-PM seat vs RMC packaging speculative).

### Per-ICP one-liners

1. **Single-DM** — **strong_fit.** Strongest Shape A bootstrap learning seat: self-approve money/time, best reach/risk/TTS among peers, near-parity channel_fit with dual. Soft WTP and standing-cleaner/portal falsifiers remain open for real tests.
2. **Dual-income** — **strong_fit.** Highest multi-party pain and channel_fit among owner-occupant seats; soft underbelly is dual-gate unfinished jobs and household WTP. Topology A/B peer — not automatic #1 by beachhead history.
3. **Snowbird second-home** — **weak_fit.** Self-owned multi-home maps Shape A tightly, but two-metro reach, access liability, few jobs/year, property-care SaaS gravity. Out of near-term shortlist.
4. **Multi-gen one-roof** — **weak_fit.** N≥3 co-resident multi-party stress; unfinished N-gate + soft multi-wallet pay + family-chore gravity. Later dual-expand only.
5. **New-build warranty punch** — **weak_fit.** Hard clock episodic coordination; builder preferred-vendor directory pull; thin mid-window recruit. Filter challenger not beachhead.
6. **STR host turnover** — **weak_fit.** Continuous cadence pain but Turno/Guesty gravity, same-day approve lag, access risk. Out of near-term shortlist.
7. **Mid-portfolio PM** — **weak_fit.** High multi-unit pain; PM-SaaS gravity, triple stall, thin reach/slow TTS. Later adversarial only if top-2 stall.
8. **Insurance-claim restoration** — **weak_fit.** Highest slate pain but episodic claim LTV, adjuster stall, claims-SaaS gravity. Off beachhead.
9. **Corporate relocation employer-paid** — **weak_fit.** Employer budget via RMC not greenfield job-PM SaaS; triple stall; episodic LTV; BD-heavy reach.
10. **Rural after-hours phone_first** — **weak_fit.** Channel_fit 0.35 structural kill for email/PDF dry-run gates; directory/after-hours inventory pull; founder-relay risk.

---

## Ranked top 3 (why)

### 1) `household-single-decision-maker-recurring` — Single decision-maker household (recurring home-service PM)

**Why #1 (best solo bootstrap learning seat):** Self-approve money/time without partner dual-gate; pay_or_act ~0.62; reach ~0.72; risk ~0.54 (lowest in slate); TTS ~0.78; near-parity channel_fit (0.87 vs dual 0.88). Slightly lower multi-party pain than dual is a **feature** for solo-founder signal speed — not a product flaw. Thesis-aligned job map: structured brief → gated outreach → quote normalize → self-approve → confirm → complete → next-due with `house_service_v1` progress; hard no directory. Cleanest Shape A learning seat and dual-approve unfinished-job control.

**Soft underbelly:** Mid pay_or_act (~0.62); competence pride + free calendar/chat AI; standing cleaner + HVAC membership/portal autopilot may thin residual to exceptions only; phone-only trades force human relay. Synthetic only — no measured touchpoint drop or unfinished-job advantage over dual on real jobs.

### 2) `household-dual-income-recurring` — Busy dual-income household (HVAC + cleaning chore PM)

**Why #2 (strong_fit peer; topology A/B):** Highest multi-party pain (0.82) and channel_fit (0.88) from dual-approve + two calendars. If shadow jobs cut touchpoints **and** dual completes jobs, multi-party household is a durable beachhead feature. If dual only stalls on second approver while single-DM converts, partner gates are a liability — not a feature.

**Why not #1:** Soft pay_or_act (0.58); dual-gate unfinished-job risk slows learning vs single-DM; beachhead retention narrative must not override dimensional bootstrap physics. Re-scored as peer, not automatic winner. Synthetic would-try partly assumes next-due memory, dual-calendar merge, light partner async gate — build hypotheses, not current product proof.

### 3) `multi-home-snowbird-second-home` — Multi-home snowbird / second-home seasonal PM

**Why #3 (weak_fit challenger — not beachhead swap):** Cleanest self-owned multi-site remote-coordination seat on the unfilled landscape (not caregiver/eldercare). Pain is access/async timing and forgotten seasonal HVAC start-stop + turn-down/reopen cleaning — not discovery. Buyer=owner=self-approve money/time; high in-window stakes; useful multi-site next-due stress **after** owner-occupant beachhead evidence.

**Why not higher / not promote:** Two-metro reach (~0.50); access/keys liability while traveling; few jobs/year → slow TTS and thin habit/LTV; product gravity toward multi-site property-care SaaS or “who can get in while away” marketplace; substitutes (HOA/resort care, house-sitter, standing PM, portals); soft continuous software pay (in-window act ≠ off-season SaaS). Use only as adversarial falsifier if beachhead stalls — not multi-ICP GTM expansion now.

*(Ranks 4–10 are also **weak_fit**. Real-test shortlist remains strong_fit only — ranks 1–2.)*

---

## Primary recommendation + kill criteria

### Primary recommendation

**Real-test shortlist = strong_fit only:** single-DM as primary shadow learning seat; dual-income as topology A/B second.  
**weak_fit (ranks 3–10):** out of near-term real tests — history/adversarial notes only, not multi-ICP GTM. No weak-seat diversion before Phase-1 beachhead exit.

Do **not** claim PMF or write `READY_FOR_REAL_WORLD.md` until founder `agree_ready` + real sample + re-rank. Do **not** open all-ten real GTM. Do **not** treat snowbird, multi-gen, STR, PM, claim, employer-paid, new-build, or rural phone as beachhead from synthetic alone.

**Sequence:**

1. Founder gate this pack (`iterate` / `agree_ready` / `kill`) with **explicit 1–2 ICP pick** from **strong_fit** only (recommend single-DM primary + dual A/B).  
2. If `agree_ready` for real tests: instrumented shadow jobs only on the picked strong_fit seat(s) — HVAC preventive/membership + cleaning exception/rebook; hard no-directory; dry-run + human approve-before-send mandatory; pre-write metrics (touchpoints, unfinished-job rate, completion TTS, behavioral pay-or-act).  
3. Design standing-cleaner + HVAC portal residual falsifier explicitly.  
4. Weak-fit seats (snowbird, multi-gen, new-build, STR, mid-portfolio PM, claim, employer-paid, rural) **only if** top-2 real tests stall or founder explicitly expands — residual optional later stresses only.  
5. Re-rank after real sample — synthetic filter alone does not open READY_FOR_REAL_WORLD.

### Kill criteria (shared Shape A + per-ICP)

**Thesis-level kill:** no meaningful touchpoint drop on real jobs, **or** directory/marketplace proves required for value.

**Single-DM** — Kill / flip to weak_fit if: fair instrumented shadow jobs fail to cut human touchpoints vs one-inbox status quo on recurring HVAC preventive/membership and cleaning rebook/exception flows; product value requires a public vendor directory, city inventory, or ranking marketplace; users refuse human safety gates or demand unsupervised send as default; near-zero pay-or-act / behavior change after a fair try; solo free tools (calendar + chat AI + membership portals) are “good enough” with no reported cognitive-load or follow-through relief; standing cleaner + HVAC portal/membership autopilot collapses continuous PM pain with no residual exception/lumpy work; safety, access, or money incidents make solo ops untenable.

**Dual-income** — Same touchpoint / directory / gates / safety kills, plus: partner dual-approve permanently blocks completion at high rate; near-zero pay-or-act after fair exposure; standing cleaner + HVAC portal/autopilot collapses continuous PM with no residual; phone-only hybrid forces permanent human dispatcher.

**Snowbird second-home** — Fair shadow seasonal HVAC open/close or reopen-cleaning jobs fail to cut documented touchpoints; value requires public vendor directory, access-while-away ranking, or multi-site care marketplace; refuse dry-run/approve-before-send or demand unsupervised send of access instructions; access/trust/safety permanently blocks use; demand maps to multi-property PM SaaS / resort-HOA care / eldercare not household Shape A; near-zero pay_or_act after fair in-window try; standing PM/house-sitter/portal collapses residual seasonal PM to ~0; cannot recruit live seasonal-window pipeline; pursuing this seat delays Phase 1 instrumented exit on email-fit owner-occupant seats.

**Multi-gen shared-home** — Shadow jobs fail to cut multi-resident thrash; value requires directory/marketplace; multi-resident money/time/access approve permanently blocks completion (N≥3 unfinished rate); near-zero pay-or-act; demand maps to family chore OS / eldercare / multi-property remote-care PM; standing cleaner + HVAC portal collapses residual; phone-first generational hybrid forces permanent human dispatcher; safety/privacy/consent incidents; refuse gates or demand unsupervised send; pursuing multi-gen starves Phase 1 single-DM/dual exit.

**New-build warranty punch** — Shadow warranty-window jobs fail to cut touchpoints; value requires builder-approved vendor directory/city inventory/ranking; refuse human gates or demand unsupervised send; near-zero pay-or-act; post-window no residual next-due/rebook habit; builder portal/phone forces permanent human dispatcher; scope/warranty/access incidents or drift into builder-ops/warranty-claim SaaS; mid-window recruiting systematically impossible; pursuing this seat starves Phase 1 single-DM/dual jobs.

**STR host turnover** — Fair instrumented turnover/HVAC jobs fail to cut host touchpoints; value requires public cleaner directory, ranking marketplace, or live availability GMV; refuse dry-run/approve-before-send or demand unsupervised same-day send as default; standing cleaner + simple auto-schedule (or existing STR ops stack) collapses continuous PM with no residual; near-zero pay-or-act; access/key-code/guest-window or money incidents; demand maps to multi-unit PMS/channel-manager suite rather than Shape A household-style job PM; pursuing this seat delays Phase 1 household exit.

**Mid-portfolio PM** — Shadow multi-unit jobs fail to cut manager touchpoints; value requires public vendor directory or full multi-unit PM suite; owner+manager dual/triple approve permanently leaves jobs unfinished; near-zero pay-or-act; refuse dry-run/human approve-before-send or demand unsupervised multi-unit send; preferred-vendor list becomes the product; portal/standing-contract residual collapses continuous job-PM need; COI/access/tenant-safety incidents; solo founder cannot recruit mid-portfolio pipeline without becoming PM consultant and starving Phase 1 household jobs.

**Insurance-claim restoration** — Shadow claim jobs fail instrumented homeowner touchpoint cut; value requires directory/live tech inventory or full claims-management/restoration SaaS; adjuster+GC unfinished-job rate kills learning loops; demand maps to public-adjuster/claim-file tools not Shape A house job PM; near-zero pay-or-act for coordination layer; refuse human gates or demand unsupervised send to carrier/vendors; legal/coverage overclaim, claim-doc privacy, or safety incidents; post-close residual habit zero; chasing episodic claims stalls Phase-1 beachhead (HVAC+cleaning) instrumented house-job exit.

**Corporate relocation employer-paid** — Fair instrumented relocation-window jobs fail to cut touchpoints; value requires public vendor directory/city inventory/ranking/live availability; household or benefits admin refuse dry-run/money-time human gates or demand unsupervised multi-send; near-zero pay-or-act (no employer-sponsored seat/LOI and no household completion behavior); dual/triple approve permanently leaves jobs unfinished past hard start date; only workable packaging is full RMC/relocation-concierge suite rather than Shape A job PM; access, empty-house, consent, or employee-privacy incidents; pursuing this seat starves Phase 1 real-house-job exit on single-DM/dual beachhead seats.

**Rural after-hours phone_first** — Durable channel stays call/SMS/voicemail and Shape A only works via permanent human phone relay; dry-run/quote-paste/calendar depth systematically fail for lack of artifacts; fair hybrid shadow shows no touchpoint drop vs call/text/voicemail thrash; value requires vendor directory, live after-hours availability inventory, or ranking marketplace; refuse money/time gates or demand unsupervised dial/send; near-zero pay-or-act; SMS/telephony legal, consent, or safety incidents; after-hours becomes unscalable founder-on-call SLA; pursuing this seat starves instrumented Phase 1 exit on email-fit single-DM/dual; silent vertical swap into lawn/pest/grounds or pure emergency dispatch to chase phone density.

---

## Skeptic section

### AI ready_for_real_world

**`false`** (fail-closed under Company OS ranking/promotion rules).

ROUND 1-r5 ranking is sound and diversity_ok under Company OS reward/risk, but real-world open is fail-closed: soft pay, open residual falsifiers, no real instrumented jobs, no LOI. Company OS requires synthetic + real + manageable solo risk before primary-focus lock. Top two **strong_fit** seats are high-quality enough to design **careful post-founder-gate shadows** — not to declare AI-ready real-world open or PMF. `strong_fit` means real-test shortlist eligible — **not** PMF or READY_FOR_REAL_WORLD. Pack correctly does **not** claim LOI or READY_FOR_REAL_WORLD from synthetic alone.

### Ranking sound

**`true`.** Under Company OS reward/risk, single-DM wins bootstrap learning physics (pay_or_act 0.62, reach 0.72, risk 0.54, TTS 0.78, channel ~parity with dual) without crowning dual by beachhead narrative; dual stays strong_fit topology A/B peer (pain 0.82, channel 0.88) with dual-approve unfinished-job and soft WTP underbelly. Eight never-tried diversity challengers correctly land **weak_fit** (out of real-test shortlist) for orthogonal reasons — none overturn ranks 1–2.

### Diversity ok

**`true`.** Each of the eight NEW seats claims a unique diversity_value cell (employer_b2b2c, property_mgr, second_home_snowbird, str_host, new_build_warranty, phone_first, multi_gen_household, restoration_claim). Caps honored (0 operator_payer, 0 emergency, 1 phone_first). No rename of past weak_fits. 1-r4 landscape gaps filled and **falsified** this round as near-term shortlist seats.

### Overclaims — synthetic ROUND 1-r5 does **NOT** support

1. **Measured single-DM unfinished-job / TTS edge over dual on real jobs** — hypothesized bootstrap physics only; no measured advantage yet.  
2. **Calibrated multi-N WTP** — pay ~0.58–0.62 is judgment only; not multi-N or LOI.  
3. **Instrumented touchpoint drop vs status quo** on any seat — not measured.  
4. **Dual would-try under assumed dual-calendar merge, next-due memory, light partner async gate** as current product proof — build hypotheses labeled as such.  
5. **`strong_fit` as PMF, primary-focus, or READY_FOR_REAL_WORLD** — strong_fit is shortlist-only; real proof still open; fail-closed.  
6. **~0.xx score dimensions as multi-N statistical proof** — AI judgment composites only.  
7. **Possible soft over-scores (do not treat as calibrated):** multi-gen channel_fit 0.80 under phone hybrid; snowbird pay_or_act 0.64 in-window ≠ off-season SaaS retention; STR channel_fit 0.67 under same-day SMS thrash; corporate employer job-PM seat vs RMC packaging speculative.  
8. **Standing-cleaner + portal residual magnitude either way** — open falsifier.  
9. **Employer-sponsored seat LOI, mid-portfolio suite residual pay, claim post-close habit, or rural phone product fit** — all untested / weak_fit this round.  
10. **Any weak_fit seat as near-term real-test shortlist or multi-ICP GTM expansion** — ranks 3–10 out this round.

### Missing challengers / residual landscape

**1-r4 landscape gaps filled and falsified this round.** Residual optional later stresses only if top-2 real tests stall (do **not** expand multi-ICP GTM now):

- pure high_wtp monetization (non-white-glove)  
- explicit channel=hybrid (email+phone deliberate mix as primary axis)  
- pure cadence=seasonal or continuous_service as primary axis  
- nonprofit_facility  

Caps exclude operator_payer / emergency as near-term diversions. **No missing seat overturns ranks 1–2.**

Previously tried and not re-run: remote-care/multi-site; seasonal-tree/arborist; operator-agentic Shape B inbound; SMS/phone-native grounds (lawn/pest); move-in burst; small-landlord tenant-split; emergency HVAC; aging-in-place adult-child; membership-portal-native; white-glove concierge; condo-HOA; B2B2C operator; metro phone-native low-email.

### Open falsifiers

- Standing-cleaner autopilot collapse (continuous cleaning PM)  
- HVAC membership/portal autopilot thinning residual  
- Partner dual-approve stall (dual) vs solo self-approve (single-DM)  
- Free email/calendar/chat AI status-quo “good enough”  
- Soft household pay_or_act (~0.58–0.62) never converting after felt try  
- Directory/marketplace pull under any seat  
- (If later opened) snowbird access liability / seasonal LTV; multi-gen N≥3 unfinished; STR Turno/Guesty gravity; PM-SaaS gravity; claim adjuster stall; employer RMC packaging; rural phone channel kill  

### Conditions before any real tests

1. Founder gate **`agree_ready` only for thin plan** + **explicit 1–2 ICP pick** (recommend single-DM primary shadow + dual-income topology A/B only — not all ten).  
2. **Pre-write instrumented metrics:** touchpoints, unfinished-job rate, completion TTS, behavioral pay-or-act.  
3. **Hard no-directory** + dry-run / approve-before-send; user-sourced providers only.  
4. **Design standing-cleaner + HVAC portal residual falsifier** — do not claim continuous cleaning PMF.  
5. **No weak-seat diversion** before Phase-1 beachhead exit on single-DM/dual.  
6. **Public-safe recruitment — zero PII.**  
7. **Re-rank after real sample;** only strong_fit seats stay on real-test shortlist until synthetic + real + manageable risk.  
8. **Do not write** `READY_FOR_REAL_WORLD.md` or promote primary focus from this filter alone.

---

## What real-world tests should do next

### Scope (after founder gate)

- **Primary:** single-DM shadow/concierge on next real HVAC preventive/membership window + any cleaning exception/rebook.  
- **A/B:** dual-income on same verticals with lightweight partner approve path — compare completion, unfinished-job rate, and TTS.  
- **Not yet:** snowbird, multi-gen, new-build punch, STR, mid-portfolio PM, claim restoration, employer-paid relocation, or rural phone_first builds unless founder expands or top-2 real tests stall.  
- **No LOI assumed** from synthetic; no directory packaging.

### Concierge / shadow design (public-safe)

- User-sourced providers only (last-year shop, Google/Maps/Yelp/AI search) — **no Totbox inventory**.  
- Host chat + job checklist: brief → dry-run draft → human approve-before-send → quote paste/normalize → money/time gate → book → complete → next-due.  
- Cleaning: exception/rebook/rescope only when standing slot already works — do not sell continuous cleaning autopilot as PMF.  
- Dual path: partner share/approve must stay low-friction (not another full app); measure unfinished jobs if second adult never opens.  
- Public-safe composites only — zero real names, emails, phones, street addresses, personal zips.

### Metrics (instrument every job)

| Metric | Pass signal (directional) | Kill / weak_fit signal |
|--------|---------------------------|------------------------|
| Human touchpoints status-quo vs tool | Meaningful drop after fair try | No cut |
| Unfinished-job rate | Completes without permanent stall | Dual partner never opens; jobs die |
| Completion TTS | Faster finished loops than status quo (esp. single-DM vs dual A/B) | No improvement or dual systematically slower with no learning value |
| Gate acceptance | Dry-run + approve-before-send used | Refuse gates / demand unsupervised send |
| Directory demand | Value works with user-sourced providers | “Find me who is available” / city inventory as core need |
| Act signals | Repeat next-due, rebook without re-research, referral, waitlist friction | Near-zero after fair try |
| Pay signals | Soft price talk **after** felt drop | Subscription demand pre-felt value forever free |
| Cleaning segment | Exception residual still valuable | Continuous pain already zero; no residual |
| Standing-cleaner + portal residual | Cross-provider / exception / lumpy HVAC still needs PM | Autopilot closes loop; residual ≈0 |
| Safety/access/privacy | Zero serious incidents | Wrong send / access mishap under solo ops |
| Channel mix | Email/SMS/form path works on email-fit seats | Phone-only forces permanent human relay on primary seats |

### Explicit non-goals for real tests

- Provider count or marketplace GMV as success  
- Multi-ICP GTM or primary-focus lock across weak_fit seats  
- Phase-2 operator GTM before household instrumented evidence  
- Deep ServiceTitan/FSM portal replace pre-cash/LOI  
- Early telephony/SMS compliance platform for rural phone_first as Phase-1 focus  
- Claiming READY_FOR_REAL_WORLD or LOI from AI/synthetic alone  
- Diverting to STR / PM / claim / employer-paid / snowbird before beachhead exit  

---

## Synthetic dialogue evidence (filter-only summaries)

| ICP | synthetic_verdict | Would try (synth) | Would pay/act (synth) | Key say-no / falsifier |
|-----|-------------------|-------------------|----------------------|------------------------|
| Single-DM | strong_fit | Yes free/low-friction on lumpy HVAC + cleaning exceptions if gates + no directory | Soft pay (~0.62); act better than dual via self-approve | Free status quo; standing cleaner + HVAC autopilot; unsupervised send; directory |
| Dual-income | strong_fit | Yes next HVAC window + cleaning exceptions if gates + light partner path | Act plausible; pay soft (~0.58) until felt drop | Partner never engages; standing cleaner collapses cleaning; directory as core |
| Snowbird second-home | weak_fit | Conditional free/shadow next leave/return window if gates + user-sourced vendors | Act in-window; continuous pay soft | Access liability; off-season pay; multi-site SaaS / marketplace gravity; sitter/portal residual |
| Multi-gen one-roof | weak_fit | Free/shadow if low setup + human gates | Soft (~0.55); multi-wallet fragments payer | N≥3 unfinished gates; family-chore OS gravity; phone hybrid; privacy of shared logs |
| New-build warranty | weak_fit | Try interest if gates stay light and no builder directory | Soft episodic; refuse ongoing post-punch | Builder preferred list; super phone path; warranty-claim tooling; unsupervised call |
| STR host turnover | weak_fit | Free/low-friction if cuts rebook thrash without city cleaner list | Soft pure job-PM pay; will pay cleaners/SaaS | Turno/Guesty gravity; same-day unsupervised send demand; standing cleaner residual ≈0 |
| Mid-portfolio PM | weak_fit | Free shadow residual beside existing portal only | Soft hybrid; owners reimburse field not MCP | PM suite gravity; triple stall; unsupervised multi-unit send; preferred list as product |
| Claim restoration | weak_fit | Free shadow only if no unsupervised carrier send + private docs | Soft residual/pay post-close | Adjuster stall; claims SaaS gravity; emergency directory pull; LTV dies at close |
| Corporate relocation | weak_fit | Household would try if every send stays human-gated | Employer RMC package more likely than job-PM SaaS | Triple stall past start date; marketplace gravity; post-arrival pay collapse; full RMC packaging |
| Rural after-hours | weak_fit | Soft hybrid try | Near-zero durable pay (~0.44) | Phone-only artifacts; permanent relay; after-hours board/directory; founder-on-call SLA |

All dialogue content is **SYNTHETIC ONLY** — personas are metro-level composites, not real people. Staged assumed capabilities (e.g. next-due memory, dual-calendar merge, light partner async gate) are labeled build hypotheses — not current product proof.

---

## Explicit label

# SYNTHETIC ONLY

This pack is a **Company OS synthetic filter**. It does **not** prove PMF, household WTP, touchpoint reduction, LOI, or READY_FOR_REAL_WORLD. AI `ready_for_real_world=false`. Actionable binary only: ranks 1–2 **strong_fit** (real-test shortlist); ranks 3–10 **weak_fit** (out). Ranking_sound=`true`; diversity_ok=`true`; slate_n=10. Founder gate required. No PII. Public-safe composites only. Pack correctly does **not** claim LOI or READY_FOR_REAL_WORLD from synthetic alone.

---

## Artifact links

- Founder gate: [`FOUNDER_FEEDBACK.md`](FOUNDER_FEEDBACK.md)  
- Prior rounds: [`ROUND_1-r4_report.md`](ROUND_1-r4_report.md), [`ROUND_1-r3_report.md`](ROUND_1-r3_report.md), [`ROUND_1-r2_report.md`](ROUND_1-r2_report.md), [`ROUND_1_report.md`](ROUND_1_report.md)  
- Index: [`README.md`](README.md)  
- Top ICP briefs (strong_fit only): [`household-single-decision-maker-recurring.md`](household-single-decision-maker-recurring.md), [`household-dual-income-recurring.md`](household-dual-income-recurring.md)  
