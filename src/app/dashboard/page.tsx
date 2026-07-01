'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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
    services: 'Birthday parties, Open play',
    rules: 'Tue,Thu,Sat 09:00-17:00',
  });
  const [registered, setRegistered] = useState<Registered | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadToken, setLoadToken] = useState('');

  // Basic "session" persist for registered view across reloads (Stage 4)
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('totbox_current_provider');
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRegistered(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Handle calendar connect callback redirect params (Stage 5)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('calendar_connected') && registered) {
      const updated = { ...registered, calendarConnected: true };
      persistCurrent(updated);
      // clean url
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [registered]); // run after load

  function persistCurrent(r: Registered | null) {
    setRegistered(r);
    try {
      if (r) localStorage.setItem('totbox_current_provider', JSON.stringify(r));
      else localStorage.removeItem('totbox_current_provider');
    } catch {}
  }

  const mcpUrl = 'http://localhost:3001/mcp';

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const servicesArr = form.services.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name || 'New Provider',
          location: form.location || 'Local Area',
          services: servicesArr,
          rules: { availability: { days: form.rules.split(/\s+/)[0]?.split(',') || ['Mon','Tue'], windows: [form.rules.split(/\s+/)[1] || '09:00-17:00'] } },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Registration failed');
      persistCurrent(data.provider);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  async function regenerate() {
    if (!registered) return;
    setLoading(true); setError(null);
    try {
      const r = await fetch('/api/rotate', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id: registered.id }) });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || 'rotate failed');
      const updated = { ...registered, token: d.token };
      persistCurrent(updated);
    } catch (e: unknown) { setError((e as Error).message); } finally { setLoading(false); }
  }

  function connectCalendar() {
    if (!registered) return;
    // Stage 5 minimal connect: hits start which redirects to callback (demo or real)
    const startUrl = `/api/calendar/connect/start?id=${encodeURIComponent(registered.id)}`;
    window.location.href = startUrl;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-sm text-zinc-500 hover:underline">← Back to Totbox</Link>
            <h1 className="text-3xl font-semibold tracking-tight mt-1">Provider Dashboard</h1>
            <p className="text-zinc-600 dark:text-zinc-400">Stage 4: Register + MCP Endpoint Generator</p>
          </div>
          <div className="text-xs px-3 py-1 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">Stage 4</div>
        </div>

        {/* Basic session: load previous registration by token (persists via localStorage + server lookup) */}
        <div className="mb-4 p-4 border rounded bg-white dark:bg-zinc-900">
          <div className="text-sm mb-1">Load existing registration by token (demo session)</div>
          <div className="flex gap-2">
            <input className="flex-1 rounded border p-2 text-sm" placeholder="paste your secret token" value={loadToken} onChange={e=>setLoadToken(e.target.value)} />
            <button type="button" onClick={async () => {
              if (!loadToken) return;
              setLoading(true); setError(null);
              try {
                const r = await fetch(`/api/lookup?token=${encodeURIComponent(loadToken)}`);
                const d = await r.json();
                if (!r.ok) throw new Error(d.error || 'not found');
                // restore with token for owner actions
                persistCurrent({ ...d.provider, token: loadToken });
              } catch (e: unknown) { setError((e as Error).message); } finally { setLoading(false); }
            }} className="px-3 py-1 border rounded text-sm">Load</button>
          </div>
        </div>

        {/* Registration form */}
        <form onSubmit={onRegister} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 mb-8">
          <h2 className="font-semibold text-lg mb-4">Register your service</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm mb-1">Business / Service Name</div>
              <input className="w-full rounded border p-2 bg-white dark:bg-black" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Austin Kids Play Center" required />
            </label>
            <label className="block">
              <div className="text-sm mb-1">Location</div>
              <input className="w-full rounded border p-2 bg-white dark:bg-black" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} placeholder="Austin, TX" required />
            </label>
            <label className="block md:col-span-2">
              <div className="text-sm mb-1">Services (comma separated)</div>
              <input className="w-full rounded border p-2 bg-white dark:bg-black" value={form.services} onChange={e=>setForm({...form, services:e.target.value})} />
            </label>
            <label className="block md:col-span-2">
              <div className="text-sm mb-1">Basic Availability Rules (e.g. Tue,Thu,Sat 09:00-17:00)</div>
              <input className="w-full rounded border p-2 bg-white dark:bg-black" value={form.rules} onChange={e=>setForm({...form, rules:e.target.value})} />
            </label>
          </div>
          <button type="submit" disabled={loading} className="mt-4 px-5 py-2 rounded bg-black text-white dark:bg-white dark:text-black disabled:opacity-60">
            {loading ? 'Registering...' : 'Register & Get MCP Token'}
          </button>
          {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
        </form>

        {/* Post-registration: MCP Endpoint Generator */}
        {registered && (
          <div className="rounded-xl border border-emerald-200 bg-white dark:bg-zinc-900 p-6 mb-8">
            <h2 className="font-semibold text-lg mb-1">Registration complete — {registered.name}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Token shown once here for demo (in real flow you copy it now).</p>

            <div className="mb-4">
              <div className="text-sm mb-1">Your MCP Endpoint</div>
              <div className="font-mono text-sm bg-zinc-100 dark:bg-black p-3 rounded border break-all">{mcpUrl}</div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm mb-1">
                Secret Token (copy now)
                <button onClick={regenerate} className="text-xs underline">Regenerate</button>
              </div>
              <div className="font-mono text-sm bg-black text-emerald-400 p-3 rounded border break-all">{registered.token}</div>
            </div>

            <div className="mb-4">
              <div className="text-sm mb-1">Services</div>
              <div className="text-sm">{registered.services.join(', ')}</div>
            </div>

            {/* Stage 5: Connect Google Calendar (minimal) */}
            <div className="mb-4">
              <div className="text-sm mb-1">Calendar</div>
              {registered.calendarConnected ? (
                <div className="text-sm text-emerald-600">✓ Google Calendar connected</div>
              ) : (
                <button
                  type="button"
                  onClick={connectCalendar}
                  className="text-sm px-3 py-1 rounded border bg-white dark:bg-zinc-800 hover:bg-zinc-100"
                >
                  Connect Google Calendar
                </button>
              )}
              <div className="text-xs text-zinc-500 mt-1">(demo flow sets connected + dummy token)</div>
            </div>

            <div>
              <div className="text-sm mb-1">Add to your chat app (example)</div>
              <pre className="text-xs bg-zinc-100 dark:bg-black p-3 rounded overflow-auto">{`MCP remote: ${mcpUrl}
Token: ${registered.token}

Claude / ChatGPT / Grok config snippet (pass token in tool args):
  tools call search_services with query is kids token is ${registered.token}
(or in JSON tool call: {"name":"search_services", "arguments":{"query":"kids", "token":"${registered.token}"}} )`}</pre>
            </div>

            <p className="mt-4 text-xs text-zinc-500">Use this token when calling tools for scoped results (only your provider).</p>
          </div>
        )}

        <div className="text-xs text-zinc-500">
          Stage 4 demo. Registration creates a provider + token (persisted to .data for process sharing). Use the token in MCP calls for scoping.
        </div>
      </div>
    </div>
  );
}
