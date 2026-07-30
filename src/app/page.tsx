import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { McpConnectPanel } from '@/components/McpConnectPanel';
import {
  getPublicMcpEndpoint,
  getPublicOrigin,
  isLocalOnlyMcpUrl,
} from '@/lib/public-origin';

export const dynamic = 'force-dynamic';

export default async function TotboxHome() {
  const mcpEndpoint = await getPublicMcpEndpoint();
  const originEndpoint = `${await getPublicOrigin()}/mcp`;
  const localOnly = isLocalOnlyMcpUrl(mcpEndpoint);

  return (
    <div className="min-h-full bg-[var(--bg)] text-[var(--fg)]">
      <SiteHeader />

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-12 pt-14 text-center sm:px-6 sm:pt-20">
          <div className="chip mb-6">Job PM · MCP · Grok / Claude / ChatGPT</div>
          <h1 className="mx-auto max-w-4xl text-[var(--text-3xl)] font-semibold tracking-[-0.03em] leading-[1.05] text-[var(--fg)]">
            Disappear the logistics
            <br className="hidden sm:block" /> of family life.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[var(--text-lg)] leading-relaxed text-[var(--fg-muted)]">
            Totbox is the project manager for home-service jobs — HVAC, cleaning, tree work —
            inside the chat apps you already use. You stay in control of send, money, and time.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#connect-mcp" className="btn btn-primary">
              Get MCP URL for Grok
            </a>
            <Link href="/jobs" className="btn btn-secondary">
              Try household jobs
            </Link>
          </div>
          <p className="mt-4 break-all font-mono text-[var(--text-xs)] text-[var(--fg-subtle)] sm:text-[var(--text-sm)]">
            {mcpEndpoint}
          </p>
        </section>

        <McpConnectPanel
          endpoint={mcpEndpoint}
          originEndpoint={originEndpoint}
          localOnly={localOnly}
        />

        <section className="border-b border-[var(--border)] bg-[var(--bg)] py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-[var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-[var(--accent-strong)]">
              Phase 1 beachhead
            </p>
            <h2 className="mt-2 max-w-xl text-[var(--text-xl)] font-semibold tracking-tight text-[var(--fg)]">
              Recurring home services in Austin — cleaning first, HVAC next.
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--text-base)] leading-relaxed text-[var(--fg-muted)]">
              Not a vendor directory. You pick who to contact (Google, AI search, memory).
              Totbox runs the checklist: draft, approve, paste quotes, book, next-due.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: 'Host LLM is the EA',
                  body: 'Grok, Claude, or ChatGPT drafts and uses your Gmail, SMS, and memory. Totbox returns next_action work orders.',
                },
                {
                  title: 'Safety before convenience',
                  body: 'Explicit approval before send or money/time. Dry-run default. Full audit trail. Never invents your address.',
                },
                {
                  title: 'Same path every job',
                  body: 'Describe → Details → Contact → Send → Hear back → Choose → Booked → Done. Transparent strip in chat or browser.',
                },
              ].map((c) => (
                <div key={c.title} className="surface p-5">
                  <h3 className="text-[var(--text-base)] font-semibold text-[var(--fg)]">{c.title}</h3>
                  <p className="mt-2 text-[var(--text-sm)] leading-relaxed text-[var(--fg-muted)]">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-start gap-10 md:grid-cols-2">
              <div>
                <h2 className="text-[var(--text-xl)] font-semibold tracking-tight text-[var(--fg)]">
                  Ask naturally
                </h2>
                <ul className="mt-6 space-y-3 text-[var(--text-base)] text-[var(--fg-muted)]">
                  {[
                    'Deep clean this week — blinds, under beds, corners. Share options before I confirm.',
                    'AC maintenance under $300 in the next 2 weeks with my usual tech.',
                    'Live-oak pruning quotes and flag Oak Wilt season constraints.',
                  ].map((q) => (
                    <li key={q} className="surface px-4 py-3 text-left">
                      “{q}”
                    </li>
                  ))}
                </ul>
              </div>
              <div className="surface p-6 font-mono text-[var(--text-xs)] leading-relaxed text-[var(--fg-muted)] sm:text-[var(--text-sm)]">
                <p className="text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--fg-subtle)]">
                  Chat → MCP loop
                </p>
                <pre className="mt-3 whitespace-pre-wrap text-[var(--fg)]">{`start_job
  → update_job_facts (address)
  → submit_draft_for_approval
  → record_user_approval (send)
  → approve_and_send_message (dry-run)
  → ingest_provider_message
  → record_user_approval (money/time)
  → confirm_appointment
  → record_job_completion`}</pre>
                <Link
                  href="/jobs"
                  className="mt-4 inline-block text-[var(--text-sm)] font-semibold text-[var(--accent-strong)] no-underline hover:underline"
                >
                  Run it in the household console →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="providers" className="border-t border-[var(--border)] bg-[var(--bg-elevated)] py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-[var(--text-xl)] font-semibold tracking-tight text-[var(--fg)]">
              For small operators
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--text-base)] text-[var(--fg-muted)]">
              Phase 2 after household shadow PMF. Today: register, get an MCP token, connect calendar
              (demo).
            </p>
            <Link
              href="/dashboard"
              className="mt-8 inline-block text-[var(--text-sm)] font-semibold text-[var(--accent-strong)] no-underline hover:underline"
            >
              Open provider dashboard →
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-10 text-center text-[var(--text-xs)] text-[var(--fg-subtle)]">
        Built to make family life logistics disappear. Apache-2.0 ·{' '}
        <a
          href="https://github.com/ivelin/totboxapp"
          className="font-medium text-[var(--fg-muted)] underline-offset-2 hover:underline"
        >
          github.com/ivelin/totboxapp
        </a>
      </footer>
    </div>
  );
}
