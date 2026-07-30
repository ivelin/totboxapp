'use client';

import { useEffect, useState } from 'react';

type Props = {
  /** Server-resolved absolute MCP URL (preferred). Client falls back to origin. */
  endpoint: string;
  compact?: boolean;
};

export function McpConnectPanel({ endpoint: serverEndpoint, compact = false }: Props) {
  const [endpoint, setEndpoint] = useState(serverEndpoint);
  const [copied, setCopied] = useState<'url' | 'cmd' | null>(null);
  const [toolCount, setToolCount] = useState<number | null>(null);
  const [probeOk, setProbeOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const live = `${window.location.origin}/mcp`;
      if (live && live !== endpoint) setEndpoint(live);
    }
    fetch('/mcp', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error('bad status');
        const data = await r.json();
        setToolCount(Array.isArray(data.tools) ? data.tools.length : null);
        setProbeOk(true);
      })
      .catch(() => setProbeOk(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const display = endpoint || serverEndpoint;
  const grokCmd = `grok mcp add --transport http totbox ${display}`;

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
            Household job PM needs <strong className="text-[var(--fg)]">no token</strong>. Use{' '}
            <strong className="text-[var(--fg)]">Streamable HTTP</strong> (not SSE-legacy alone). No auth.
          </p>

          <div className="mt-5 space-y-3">
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="text-[var(--text-xs)] font-medium text-[var(--fg-subtle)]">
                  MCP URL · Streamable HTTP
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
                  {display}
                </code>
                <button
                  type="button"
                  disabled={!display}
                  onClick={() => copy(display, 'url')}
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
                  disabled={!display}
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
              {
                t: '1. Connector',
                d: 'Add server → HTTP / Streamable HTTP → paste URL. Leave auth empty.',
              },
              { t: '2. Restart', d: 'Reload Grok so tools reload after connect succeeds.' },
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
            Fixed: responses now use <code className="text-[var(--fg-muted)]">text/event-stream</code> SSE
            (required by Grok). If connect still fails, confirm the host can reach this URL from the
            internet (preview URLs must be public).
          </p>
        </div>
      </div>
    </section>
  );
}
