# ServiceTitan Integration Annex (Totbox)

**Status:** Design note for product plan v3.1+ (not production code)  
**Source:** Anonymized home-services coordination research + public ServiceTitan developer materials  
**Portal:** [developer.servicetitan.io](https://developer.servicetitan.io/)  
**Related:** [`home_services_email_insights.md`](home_services_email_insights.md), [`../totbox_product_spec.md`](../totbox_product_spec.md)

---

## 1. Why ServiceTitan

Email research on Austin HVAC / multi-trade operators shows a large share of **estimates, invoices, tech dispatch, reminders, and post-service review requests** flowing through ServiceTitan-generated messages. Totbox should not replace that system of record for providers; it should act as **agentic middleware**: structured inbound from chat agents, status back to households, less email ping-pong on both sides.

**Tiering:** Google Calendar remains **Tier 1 (MVP)**. ServiceTitan is **Tier 2** — design now, pilot after calendar + service-brief loops work.

---

## 2. Capability map (research chore → API surface → Totbox)

| Household / ops chore (research) | ServiceTitan surface (V2 / integrations) | Totbox product surface |
|----------------------------------|------------------------------------------|------------------------|
| Book from structured brief | Leads Integration Platform bookings push; and/or `POST /v2/jobs` | `book_with_brief` / `create_job_from_brief` |
| Availability / scheduling | Jobs + appointments list/filter; reschedule | `get_availability` (ST adapter + Calendar fallback) |
| Job updates / cancel / hold | Job PATCH / cancel / complete / hold; notes & attachments | Booking lifecycle tools + human gates |
| Invoice archive / PM forward | `GET /v2/invoices` (and related accounting) | `record_service` / `get_invoice` |
| Real-time status | Webhooks (booking/job created, completed, payment posted, session events) | Webhook receiver → chat/status |
| Price / service catalog | Pricebook | Hybrid compare (offer schema + partial ST) |
| Lead qualification | CRM customers/locations; structured booking payload | Service brief schema |
| Parts / equipment context | Equipment, inventory namespaces | Optional later (HVAC memberships/parts) |

**Core namespaces (reference):** Dispatch (jobs, appointments, projects), Accounting (invoices, payments), CRM (customers, leads, bookings), Equipment, Settings (technicians), Pricebook, Payroll.

---

## 3. Auth & provider onboarding (design)

- **Flow:** OAuth 2.0 **client credentials** (server-to-server) — suitable for middleware; no household Gmail required.
- **App setup (provider / Totbox operator):** Developer portal → request Integration Environment → create app → choose tenants → granular scopes → App Key → exchange client id/secret for access token (include App Key on requests).
- **Public vs private apps:** Private (single-customer pilot) first; public multi-tenant may require ServiceTitan review.
- **Onboarding UX target:** Dashboard “Connect ServiceTitan” with least-privilege scopes; document ~10–15 min path for operators who already subscribe to ST.
- **Totbox responsibilities:** Per-tenant connection store, secure token storage, scope audit, disconnect/rotate.

**Suggested least-privilege start scopes (refine with portal docs):**
- Jobs / appointments: view + modify (booking path)
- Invoices: view (records / archive)
- Bookings / leads integration: create (inbound from agents)
- Avoid broad payroll/admin scopes unless required later

---

## 4. Preferred integration sequence

1. **Leads / bookings push** — agent captures service brief → push qualified booking into provider tenant (external-agent pattern).
2. **Jobs / appointments read** — availability-ish signals for connected tenants (parallel MCP calls across providers).
3. **Webhooks** — booking confirmed, job completed, payment posted → household status without polling.
4. **Invoice pull** — post-service archive + optional forward draft (property-manager workflows later).
5. **Pricebook / deeper ops** — only after pilot proves inbound + status loop.

**Quote gap:** Membership PDFs and multi-turn “what’s included / cancel fee / parts extra” often start outside ST (forms, email, chat). Totbox keeps **hybrid quote/compare** (structured offer schema + external sources); ST is not assumed to own full quote UX on day one.

---

## 5. MCP wrapper proposals (Tier 2)

Totbox MCP (or provider-facing connector tools) should abstract ST so chat hosts never see raw ST auth:

| Wrapper | Intent |
|---------|--------|
| `create_job_from_brief(brief, location, window)` | Map service brief → ST job or leads booking |
| `get_availability(tenant, service_type, window)` | Read appointments/jobs; fall back to Calendar adapter |
| `get_invoice(job_id)` | Post-service records |
| `subscribe_webhook(events, url)` | Totbox-managed subscription (ops, not end-user) |
| Existing: `book_with_brief`, `get_availability`, `record_service` | Stay stable; ST is one backend adapter |

**Fallbacks for non-ST providers:** Google Calendar + manual/MCP onboarding + structured brief over email/chat — same consumer UX, thinner provider automation.

---

## 6. Architecture notes

```
Chat agent → Totbox MCP → Orchestration
                              |
              +---------------+---------------+
              |                               |
     Calendar adapter (Tier 1)      ServiceTitan adapter (Tier 2)
              |                               |
         OAuth user calendar          Client credentials + App Key
                                              |
                                    Webhooks → Totbox event bus
```

- **Multi-tenant:** One Totbox connection record per provider ST tenant.
- **Rate limits / pagination:** Handle in adapter; never block chat turn on unbounded list pulls.
- **Idempotency:** Booking pushes should be safe to retry (client keys / dedupe).
- **Security:** Scoped tokens, no household mailbox access, audit logs for writes.

---

## 7. Phased rollout (aligned to product roadmap)

| Phase | Deliverable |
|-------|-------------|
| **10a** | Design freeze + sandbox access checklist + connection model in store/types |
| **10b** | Prototype connector: bookings/jobs create-read + webhook stub; MCP wrappers behind feature flag |
| **10c** | Pilot 1–2 ST operators; invoice pull for records path |
| **Later** | Public multi-tenant app review; pricebook-assisted compare; PM-forward automation |

**Prereqs before 10b code:** ServiceTitan developer / integration environment access; confirm which endpoints are available in sandbox for chosen scopes.

---

## 8. Pros, limits, open questions

**Pros**
- Matches observed HVAC ops reality (dispatch, invoices, review nags).
- Webhooks + leads platform fit agentic inbound.
- Providers keep ST as system of record (low migration).

**Limits**
- Access not fully self-serve; partner/process friction.
- Quotes/estimates may remain hybrid.
- Per-tenant complexity and rate limits.
- API access packaging/cost should be confirmed with pilot operators.

**Open questions**
1. Private app pilot vs early public app application?
2. Exact booking payload fields for high-quality HVAC/cleaning briefs?
3. Can appointment capacity be inferred reliably enough for multi-provider compare, or is ST status + Calendar still dual-path?
4. Webhook signing/verification requirements for production?
5. How to represent membership plans (bi-annual, cancel fees) if not first-class in ST job create?

---

## 9. Persona value (ST-connected path)

**Resident:** Chat books with brief → status via webhooks → invoice lands in records without hunting PDFs.  
**Provider:** Pre-qualified jobs land in ST; less Yelp/email clarification; dispatch/billing stay native.  
**Viral (Stage 11+):** Post-success resident share + provider peer invite — see product spec GTM; not required for ST pilot correctness.

---

## 10. Explicit non-goals (this annex)

- Replacing ServiceTitan UI for technicians.
- Requiring every pilot provider to be on ST (Calendar path remains valid).
- Storing or replaying household Gmail.
- Hard-coding private household addresses into seeds or fixtures.

---

*Update this annex when sandbox access or pilot learnings land; keep PII out of the public repo.*
