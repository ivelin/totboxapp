'use client';

import { useEffect, useState } from 'react';

export function McpConnectPanel({ compact = false }: { compact?: boolean }) {
  const [endpoint, setEndpoint] = useState('');
  const [copied, setCopied] = useState<'url' | 'cmd' | null>(null);
  const [toolCount, setToolCount] = useState<number | null>(null);
  const [probeOk, setProbeOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/mcp`;
    setEndpoint(url);

    fetch('/mcp', { method: 'GET' })
      .then(async (r) => {
        if (!r.ok) throw new Error('bad status');
        const data = await r.json();
        setToolCount(Array.isArray(data.tools) ? data.tools.length : null);
        setProbeOk(true);
      })
      .catch(() => setProbeOk(false));
  }, []);

  const grokCmd = endpoint
    ? `grok mcp add --transport http totbox ${endpoint}`
    : 'grok mcp add --transport http totbox <endpoint>';

  async function copy(text: string, which: 'url' | 'cmd') {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <section
      id="connect-mcp"
      className={
        compact
          ? 'surface p-4 text-left'
          : 'border-y border-[var(--border)] bg-[var(--bg-elevated)] py-12'
      }
    >
      <div className={compact ? '' : 'mx-auto max-w-6xl px-4 sm:px-6'}>
        <div className={compact ? '' : 'mx-auto max-w-3xl'}>
          <p className="text-[var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-[var(--accent-strong)]">
            Connect Grok · MCP
          </p>
          <h2 className="mt-2 text-[var(--text-xl)] font-semibold tracking-tight text-[var(--fg)]">
            Totbox MCP endpoint
          </h2>
          <p className="mt-2 text-[var(--text-sm)] leading-relaxed text-[var(--fg-muted)]">
            Household job PM needs <strong className="text-[var(--fg)]">no token</strong>. Add this
            HTTP URL in Grok, then ask it to call get_workflow or start_job.
          </p>

          <div className="mt-5 space-y-3">
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="text-[var(--text-xs)] font-medium text-[var(--fg-subtle)]">
                  MCP URL (Streamable HTTP)
                </span>
                {probeOk === true && (
                  <span className="text-[var(--text-xs)] font-medium text-[var(--success)]">
                    Live{toolCount != null ? ` · ${toolCount} tools` : ''}
                  </span>
                )}
                {probeOk === false && (
                  <span className="text-[var(--text-xs)] font-medium text-[var(--danger)]">
                    Endpoint not responding
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                <code
                  data-testid="mcp-endpoint-url"
                  className="input-field flex-1 break-all font-mono text-[var(--text-xs)] sm:text-[var(--text-sm)]"
                >
                  {endpoint || 'Resolving…'}
                </code>
                <button
                  type="button"
                  disabled={!endpoint}
                  onClick={() => copy(endpoint, 'url')}
                  className="btn btn-primary shrink-0"
                >
                  {copied === 'url' ? 'Copied' : 'Copy URL'}
                </button>
              </div>
            </div>

            <div>
              <div className="mb-1.5 text-[var(--text-xs)] font-medium text-[var(--fg-subtle)]">
                Grok CLI
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                <code
                  data-testid="mcp-grok-cmd"
                  className="input-field flex-1 break-all font-mono text-[10px] sm:text-[var(--text-xs)]"
                >
                  {grokCmd}
                </code>
                <button
                  type="button"
                  disabled={!endpoint}
                  onClick={() => copy(grokCmd, 'cmd')}
                  className="btn btn-secondary shrink-0"
                >
                  {copied === 'cmd' ? 'Copied' : 'Copy command'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { t: '1. Add', d: 'Paste the URL as an HTTP MCP server named totbox.' },
              { t: '2. Restart', d: 'Reload the Grok session so tools appear.' },
              {
                t: '3. Try',
                d: '“Using Totbox: get_workflow, then start_job for a deep clean.”',
              },
            ].map((s) => (
              <div
                key={s.t}
                className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] p-3"
              >
                <p className="text-[var(--text-xs)] font-semibold text-[var(--fg)]">{s.t}</p>
                <p className="mt-1 text-[var(--text-xs)] leading-relaxed text-[var(--fg-muted)]">{s.d}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[var(--text-xs)] leading-relaxed text-[var(--fg-subtle)]">
            Local-only alternative: npm run dev:mcp → http://localhost:3001/mcp (same machine as Grok
            CLI). This panel shows the public endpoint for this running instance.
          </p>
        </div>
      </div>
    </section>
  );
}
