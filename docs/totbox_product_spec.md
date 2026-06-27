# Totbox Product Spec

**Version:** 2.0 (June 27, 2026)  
**Prepared by:** Grok (Co-Founder)  
**Product Vision:** Totbox helps small local operators in family life services reduce back-office admin and booking hassle so they can focus on in-person customer experiences. At the same time, it helps busy families cut the chore of researching, comparing, and booking these services. We start with high-frequency, high-pain categories and expand from there using MCP + chat agents for minimal friction.

## Executive Summary
Totbox is a thin orchestration layer that makes small family-oriented service providers discoverable and bookable by consumer AI agents (via MCP) while automating inbound coordination. 

**Initial Focus (High-Impact Beachhead):** Family life services — starting with Family Entertainment Centers, kids' activities, childcare/after-school, tutoring, sports/extracurricular programs, and recurring family home maintenance (HVAC tune-ups, plumbing, cleaning).

**Key Value:**
- **Providers (small operators):** Less time on phones/forms/admin → more time delivering great in-person experiences.
- **Families:** One conversational interface to discover, compare, and book across multiple providers without multiple forms/calls.

**Key UX Principle:** Leverage major chat apps (Grok, Claude, ChatGPT with MCP) to avoid new app fatigue. Simple MCP endpoint + OAuth onboarding for both consumers and providers. Hybrid channels (chat primary for consumers, voice/SMS + chat for providers).

## User Research & Insights (Grounded)
- Families with kids face constant coordination friction: researching options, multiple provider forms, scheduling conflicts, no-shows, and last-minute changes. High frequency for activities, childcare, and recurring home needs.
- Small local providers (entertainment centers, tutors, coaches, maintenance techs) spend significant time on manual booking/admin, which takes away from in-person delivery. They want tools that reduce hassle without forcing new complex systems.
- High-pain, high-urgency categories with good conversion potential: Kids' activities/entertainment, childcare/after-school, tutoring, sports programs, and recurring family home maintenance (HVAC maintenance, plumbing, cleaning).
- MCP + chat agents align with 2026 trends: Major platforms support MCP natively; consumers prefer conversational interfaces for discovery and booking; providers want low-friction automation that integrates with existing calendars/tools.

## Ideal Customer Profiles (ICPs)

**Consumer ICP – Busy Family/Household:**
- Parents juggling work, kids' schedules, and household needs.
- High pain: Researching multiple providers, filling forms, coordinating calendars, dealing with no-shows or availability issues.
- Wants: Simple conversational discovery + booking across trusted local options.

**Provider ICP – Small Local Operator (High-Pain, High-Conversion Potential):**
- Solo or small-team operators running Family Entertainment Centers, activity classes, childcare/after-school programs, tutoring, sports coaching, or recurring home maintenance services.
- Pain: Manual booking, phone/email admin, no-shows, difficulty standing out for discovery.
- Wants: Reduce back-office time so they can focus on in-person customer/kid interactions. Willing to adopt simple tools that integrate with their existing calendar/scheduling.

## Problem & Solution
**Problem:** Families waste hours on fragmented research, forms, calls, and scheduling for frequent services. Small providers lose time (and revenue) to manual admin and missed opportunities, taking focus away from delivering great in-person experiences.

**Solution:** Totbox provides MCP-powered discoverability and lightweight automation so both sides can handle discovery, quoting, availability, and booking through conversational interfaces (chat + voice/SMS fallback) with minimal new tooling.

## Prioritized Service Categories (High Frequency + High Pain + Good Conversion)
Start narrow for quick wins, then expand:

1. **Kids' Activities & Family Entertainment Centers** (Core starting vertical)
   - Birthday parties, play centers, trampoline parks, classes (art, music, sports), camps, zoos/museums.
   - High frequency & pain for families; providers are often small operators who want more in-person time.

2. **Childcare, Babysitting & After-School Programs**
   - High recurring need and coordination pain.

3. **Tutoring & Educational Enrichment**
   - Frequent for school-age kids; high research/scheduling friction.

4. **Sports & Extracurricular Programs / Coaching**
   - Leagues, private coaching, team activities.

5. **Recurring Family Home Maintenance** (Bridge to earlier HVAC work)
   - HVAC tune-ups, plumbing, house cleaning — recurring and high urgency when issues arise.

These categories share common pain (discovery + scheduling friction) and have small local providers who benefit from reduced admin.

## Frictionless User Flows per ICP

**Consumer Flow (Family/Household):**
- Open preferred chat app (Grok/Claude/ChatGPT).
- Natural language query: “Find weekend birthday party options for 8-year-old in Austin under $300” or “Book 2 HVAC tune-ups next week and after-school pickup for the kids.”
- Agent uses Totbox MCP endpoint to discover relevant providers.
- Parallel comparison of availability, reviews, pricing.
- Confirm and book best options directly in chat.
- Ongoing management: Reschedule, reminders, multi-provider coordination.

**Provider Flow (Small Operator):**
- Add Totbox MCP endpoint to their chat/voice setup.
- Simple OAuth connect to existing tools (Google Calendar, basic scheduling system, or Jobber-style tool).
- Inbound leads/requests routed automatically.
- AI assists with qualification, quoting, and slot suggestion.
- Confirmed bookings sync back to their system.
- They focus on in-person delivery; admin is minimized.
- Hybrid support: Voice/SMS fallback for those less chat-native.

**Onboarding (Both Sides – <10 minutes):**
- Add Totbox MCP endpoint in their chat app.
- OAuth connect to calendar/scheduling tools.
- Quick verification (phone for consumers; basic business checks for providers to maintain trust).
- Set preferences/rules (availability windows, pricing templates, service types).
- Activate and test with a sample query/booking.

## Integration Philosophy (Minimal Friction)
- Zero (or near-zero) migration — read from existing tools, write back confirmed bookings.
- Tier 1 connectors: Google Calendar, basic scheduling tools, Jobber-style FSMs.
- MCP as the abstraction layer so any compatible chat/agent can discover and use providers.
- Read-first where possible + webhook real-time sync for availability.

## MVP Scope & Features (Quick Wins Focus)
**MVP Vertical:** Family Entertainment Centers + kids' activities + select recurring home maintenance (HVAC tune-ups as bridge).

**Core Features:**
- MCP endpoint generation per provider.
- Consumer conversational discovery & multi-provider booking in chat apps.
- Provider inbound automation (qualification + slot suggestion + booking sync).
- Basic rules engine for availability/pricing.
- Simple provider dashboard + chat/voice interfaces.
- Trust layer (reviews, basic verification).

**Out of Scope for MVP:** Full open marketplace bidding, payments processing, advanced AI quoting.

## GTM Strategy (High-Impact Beachhead)
- **Initial Market:** Austin/TX area family-focused providers (entertainment centers, activity providers, tutors, HVAC maintenance techs serving families).
- **Channels:** Local Facebook groups for parents and small business owners, Reddit (r/Austin, parenting subs), targeted content on coordination pain points.
- **Messaging:** “Make family logistics disappear. Book activities, care, and home services in one chat conversation.”
- **Pricing:** Provider tiers ($199–$599/mo) based on volume/features. Consumer freemium or per-booking convenience fee.
- **Validation Path:** Landing page + outreach to 10–20 local providers → pilots → testimonials → paid acquisition.

## MVP Roadmap
**Week 0–1:** Update repo + landing page with new vision. Validate with 5–10 providers and families.
**Week 1–4:** Core build (MCP endpoints, basic connectors for Calendar + simple scheduling, chat integration, consumer query flow).
**Week 3–6:** Onboard pilots (entertainment/activity providers first). Iterate on flows.
**Week 5+:** Expand to tutoring/childcare. Launch publicly.

## Success Metrics
- Onboarding completion >80% in <10 min.
- Pilot-to-paid conversion >40%.
- Bookings completed via platform / time saved for providers.
- Family NPS and repeat usage.
- Churn <10% in first 3 months.

## Tech Notes for Grok Build
- MCP as canonical interface for discovery and tool calling.
- Prioritize OAuth + webhook patterns for Tier 1 tools (Google Calendar, basic schedulers).
- Reusable MCP server templates per provider type.
- Chat optimization for major AI hosts.
- Security: Scoped permissions, verification layer for providers, audit logs.
- Start with read-first architecture to keep friction low.

This spec is now aligned with building on the original totboxapp repo while expanding scope to the highest-impact family life services. It maintains focus on small operators who want less admin and more in-person time, plus families who want less chore in selection and booking.

**End of Spec**