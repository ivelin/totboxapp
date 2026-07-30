'use client';

import React, { useState } from 'react';
import { SiteHeader } from '@/components/SiteHeader';

type Registered = {
  id: string;
  name: string;
  location: string;
  services: string[];
  token: string;
  category?: string;
  calendarConnected?: boolean;
};

export default function ProviderDashboard() {
  const [form, setForm] = useState({
    name: '',
    location: '',
    services: 'HVAC tune-up, Filter change',
    rules: 'Tue,Thu,Sat 09:00-17:00',
  });
  const [registered, setRegistered] = useState<Registered | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadToken, setLoadToken] = useState('');

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('totbox_current_provider');
      if (saved) setRegistered(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('calendar_connected') && registered) {
      const updated = { ...registered, calendarConnected: true };
      persistCurrent(updated);
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [registered]);

  function persistCurrent(r: Registered | null) {
    setRegistered(r);
    try {
      if (r) localStorage.setItem('totbox_current_provider', JSON.stringify(r));
      else localStorage.removeItem('totbox_current_provider');
    } catch {
      /* ignore */
    }
  }

  const mcpUrl = 'http://localhost:3001/mcp';

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const servicesArr = form.services.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name || 'New Provider',
          location: form.location || 'Local Area',
          services: servicesArr,
          rules: {
            availability: {
              days: form.rules.split(/\s+/)[0]?.split(',') || ['Mon', 'Tue'],
              windows: [form.rules.split(/\s+/)[1] || '09:00-17:00'],
            },
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Registration failed');
      persistCurrent(data.provider);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }

  async function regenerate() {
    if (!registered) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/rotate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: registered.id }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || 'rotate failed');
      persistCurrent({ ...registered, token: d.token });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }

  function connectCalendar() {
    if (!registered) return;
    const startUrl = `/api/calendar/connect/start?id=${encodeURIComponent(registered.id)}`;
    window.location.href = startUrl;
  }

  return (
    <div className="min-h-full bg-[var(--bg)]">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[var(--text-2xl)] font-semibold tracking-tight text-[var(--fg)]">
              Provider dashboard
            </h1>
            <p className="mt-1 text-[var(--text-sm)] text-[var(--fg-muted)]">
              Register · MCP token · calendar connect (Phase 2 path)
            </p>
          </div>
          <div className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1 text-[var(--text-xs)] font-medium text-[var(--fg-muted)]">
            Operators later
          </div>
        </div>

        <div className="mb-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
          <div className="mb-1 text-[var(--text-sm)] text-[var(--fg-muted)]">
            Load existing registration by token
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className="flex-1 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] p-2.5 text-[var(--text-sm)] text-[var(--fg)]"
              placeholder="paste your secret token"
              value={loadToken}
              onChange={(e) => setLoadToken(e.target.value)}
            />
            <button
              type="button"
              onClick={async () => {
                if (!loadToken) return;
                setLoading(true);
                setError(null);
                try {
                  const r = await fetch(`/api/lookup?token=${encodeURIComponent(loadToken)}`);
                  const d = await r.json();
                  if (!r.ok) throw new Error(d.error || 'not found');
                  persistCurrent({ ...d.provider, token: loadToken });
                } catch (e: unknown) {
                  setError(e instanceof Error ? e.message : 'Failed');
                } finally {
                  setLoading(false);
                }
              }}
              className="rounded-full border border-[var(--border-strong)] px-4 py-2 text-[var(--text-sm)] font-medium text-[var(--fg)]"
            >
              Load
            </button>
          </div>
        </div>

        <form
          onSubmit={onRegister}
          className="mb-8 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6"
        >
          <h2 className="mb-4 text-[var(--text-lg)] font-semibold text-[var(--fg)]">
            Register your service
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <div className="mb-1 text-[var(--text-sm)] text-[var(--fg-subtle)]">Business name</div>
              <input
                className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] p-2.5 text-[var(--text-sm)] text-[var(--fg)]"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Demo Hill Country Comfort"
                required
              />
            </label>
            <label className="block">
              <div className="mb-1 text-[var(--text-sm)] text-[var(--fg-subtle)]">Location</div>
              <input
                className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] p-2.5 text-[var(--text-sm)] text-[var(--fg)]"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Austin, TX"
                required
              />
            </label>
            <label className="block md:col-span-2">
              <div className="mb-1 text-[var(--text-sm)] text-[var(--fg-subtle)]">
                Services (comma separated)
              </div>
              <input
                className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] p-2.5 text-[var(--text-sm)] text-[var(--fg)]"
                value={form.services}
                onChange={(e) => setForm({ ...form, services: e.target.value })}
              />
            </label>
            <label className="block md:col-span-2">
              <div className="mb-1 text-[var(--text-sm)] text-[var(--fg-subtle)]">
                Availability (e.g. Tue,Thu,Sat 09:00-17:00)
              </div>
              <input
                className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] p-2.5 text-[var(--text-sm)] text-[var(--fg)]"
                value={form.rules}
                onChange={(e) => setForm({ ...form, rules: e.target.value })}
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-full bg-[var(--fg)] px-5 py-2.5 text-[var(--text-sm)] font-semibold text-[var(--bg)] disabled:opacity-60"
          >
            {loading ? 'Registering…' : 'Register & get MCP token'}
          </button>
          {error && <div className="mt-2 text-[var(--text-sm)] text-[var(--danger)]">{error}</div>}
        </form>

        {registered && (
          <div className="mb-8 rounded-[var(--radius-xl)] border border-[var(--success)]/30 bg-[var(--bg-elevated)] p-6">
            <h2 className="text-[var(--text-lg)] font-semibold text-[var(--fg)]">
              Registration complete — {registered.name}
            </h2>
            <p className="mb-4 text-[var(--text-sm)] text-[var(--fg-muted)]">
              Token shown here for demo (copy it now).
            </p>

            <div className="mb-4">
              <div className="mb-1 text-[var(--text-sm)] text-[var(--fg-subtle)]">Your MCP endpoint</div>
              <div className="break-all rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] p-3 font-mono text-[var(--text-sm)] text-[var(--fg)]">
                {mcpUrl}
              </div>
            </div>

            <div className="mb-4">
              <div className="mb-1 flex items-center gap-2 text-[var(--text-sm)] text-[var(--fg-subtle)]">
                Secret token
                <button type="button" onClick={regenerate} className="text-[var(--text-xs)] underline">
                  Regenerate
                </button>
              </div>
              <div className="break-all rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--fg)] p-3 font-mono text-[var(--text-sm)] text-[var(--success)]">
                {registered.token}
              </div>
            </div>

            <div className="mb-4">
              <div className="mb-1 text-[var(--text-sm)] text-[var(--fg-subtle)]">Services</div>
              <div className="text-[var(--text-sm)] text-[var(--fg)]">{registered.services.join(', ')}</div>
            </div>

            <div className="mb-4">
              <div className="mb-1 text-[var(--text-sm)] text-[var(--fg-subtle)]">Calendar</div>
              {registered.calendarConnected ? (
                <div className="text-[var(--text-sm)] text-[var(--success)]">Google Calendar connected</div>
              ) : (
                <button
                  type="button"
                  onClick={connectCalendar}
                  className="rounded-full border border-[var(--border-strong)] bg-[var(--bg)] px-3 py-1.5 text-[var(--text-sm)] font-medium text-[var(--fg)]"
                >
                  Connect Google Calendar
                </button>
              )}
              <div className="mt-1 text-[var(--text-xs)] text-[var(--fg-subtle)]">
                Demo flow sets connected + dummy token
              </div>
            </div>
          </div>
        )}

        <p className="text-[var(--text-xs)] text-[var(--fg-subtle)]">
          Household Phase 1 jobs need no provider token. Operator pilots are Phase 2 after shadow PMF.
        </p>
      </div>
    </div>
  );
}
