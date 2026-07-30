'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { JobProgressStrip, type ProgressStep } from './JobProgressStrip';

type JobView = {
  job_id: string;
  status: string;
  service_kind: string;
  intent: string;
  progress?: {
    strip?: string;
    summary?: string;
    role_line?: string;
    current_step_id?: string;
    steps?: ProgressStep[];
  };
  next_action?: {
    type: string;
    instructionsForHostLlm?: string;
    draftSkeleton?: string;
    requiresUserApproval?: boolean;
    approvalKind?: string;
  };
  checklist?: Array<{ id: string; label: string; done: boolean }>;
  blocks?: Array<{ code: string; message: string }>;
  has_service_address?: boolean;
  provider_contact?: { label?: string; has_email?: boolean; has_phone?: boolean } | null;
  pending_draft?: { channel?: string; to?: string; body_preview?: string } | null;
  approvals?: Array<{ kind: string; granted: boolean; summary: string; at: string }>;
  quotes?: Array<{
    id: string;
    priceFromUsd?: number;
    proposedWindow?: string;
    providerLabel?: string;
    notes?: string;
  }>;
  scheduled_at?: string;
  next_due?: string | null;
  completion_notes?: string | null;
  messages_count?: number;
  safety?: { principle?: string };
  audit_tail?: Array<{ type: string; detail: string; at: string }>;
};

type ListItem = {
  job_id: string;
  intent: string;
  service_kind: string;
  status: string;
  progress_summary?: string;
  progress_strip?: string;
  role_line?: string;
  current_step_id?: string;
};

const DEMO_CLEANING = {
  intent:
    '3hr deep clean: blinds, under beds, corners — cleaner canceled last week; need options this week before I confirm',
  provider_label: 'River Oak Cleaning (demo)',
  provider_email: 'cleaner@example.com',
  service_address: '500 Example St, Austin TX (demo — not a real home)',
};

const DEMO_REPLY =
  'Thanks for reaching out. We can do a 3hr deep clean focusing on blinds, under beds, and corners for $185 this Friday 10am. Please confirm.';

async function apiJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data as T;
}

export function HouseholdJobsConsole() {
  const [jobs, setJobs] = useState<ListItem[]>([]);
  const [active, setActive] = useState<JobView | null>(null);
  const [selectedStep, setSelectedStep] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  // Form state for guided steps
  const [intent, setIntent] = useState(DEMO_CLEANING.intent);
  const [providerLabel, setProviderLabel] = useState(DEMO_CLEANING.provider_label);
  const [providerEmail, setProviderEmail] = useState(DEMO_CLEANING.provider_email);
  const [address, setAddress] = useState(DEMO_CLEANING.service_address);
  const [draftBody, setDraftBody] = useState('');
  const [replyBody, setReplyBody] = useState(DEMO_REPLY);
  const [scheduledAt, setScheduledAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [nextDue, setNextDue] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [notes, setNotes] = useState('Deep clean complete; blinds done (demo)');

  const refreshList = useCallback(async () => {
    const data = await apiJson<{ jobs: ListItem[] }>('/api/jobs');
    setJobs(data.jobs || []);
  }, []);

  const loadJob = useCallback(async (jobId: string) => {
    const data = await apiJson<JobView>(`/api/jobs/${jobId}`);
    setActive(data);
    setSelectedStep(data.progress?.current_step_id);
    if (data.next_action?.draftSkeleton && !draftBody) {
      setDraftBody(
        data.next_action.draftSkeleton
          .replace(/\{\{provider_name\}\}/g, providerLabel)
          .replace(/\{\{priorities\}\}/g, 'blinds, under beds, corners')
          .replace(/\{\{windows\}\}/g, 'this week')
          .replace(/\{\{budget\}\}/g, 'under $250')
          .replace(/\{\{service_address\}\}/g, address)
      );
    }
    return data;
  }, [address, draftBody, providerLabel]);

  useEffect(() => {
    refreshList().catch((e) => setError(e.message));
  }, [refreshList]);

  const run = async (fn: () => Promise<void>, okMsg?: string) => {
    setBusy(true);
    setError(null);
    setFlash(null);
    try {
      await fn();
      if (okMsg) setFlash(okMsg);
      await refreshList();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  const startDemoJob = () =>
    run(async () => {
      const job = await apiJson<JobView>('/api/jobs', {
        method: 'POST',
        body: JSON.stringify({
          intent,
          provider_label: providerLabel,
          provider_email: providerEmail,
        }),
      });
      setActive(job);
      setSelectedStep(job.progress?.current_step_id);
      // Prefill draft from skeleton once address is set
      const sk = job.next_action?.draftSkeleton || '';
      if (sk) {
        setDraftBody(
          sk
            .replace(/\{\{provider_name\}\}/g, providerLabel)
            .replace(/\{\{priorities\}\}/g, 'blinds, under beds, corners')
            .replace(/\{\{windows\}\}/g, 'this week')
            .replace(/\{\{budget\}\}/g, 'under $250')
            .replace(/\{\{service_address\}\}/g, address)
        );
      }
    }, 'Job started — confirm details next');

  const saveAddress = () =>
    run(async () => {
      if (!active) return;
      const job = await apiJson<JobView>(`/api/jobs/${active.job_id}`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'update_facts',
          service_address: address,
          provider_label: providerLabel,
          provider_email: providerEmail,
        }),
      });
      setActive(job);
      setSelectedStep(job.progress?.current_step_id);
      const sk = job.next_action?.draftSkeleton || draftBody;
      setDraftBody(
        sk
          .replace(/\{\{provider_name\}\}/g, providerLabel)
          .replace(/\{\{priorities\}\}/g, 'blinds, under beds, corners')
          .replace(/\{\{windows\}\}/g, 'this week')
          .replace(/\{\{budget\}\}/g, 'under $250')
          .replace(/\{\{service_address\}\}/g, address)
      );
    }, 'Address saved — review outreach draft');

  const submitDraft = () =>
    run(async () => {
      if (!active) return;
      const job = await apiJson<JobView>(`/api/jobs/${active.job_id}`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'submit_draft',
          body: draftBody,
          channel: 'email',
          to: providerEmail,
        }),
      });
      setActive(job);
      setSelectedStep(job.progress?.current_step_id);
    }, 'Draft ready — your approval required before send');

  const approveAndDryRunSend = () =>
    run(async () => {
      if (!active) return;
      await apiJson(`/api/jobs/${active.job_id}`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'approve',
          kind: 'send_message',
          summary: 'OK to dry-run send this outreach',
          granted: true,
        }),
      });
      const job = await apiJson<JobView>(`/api/jobs/${active.job_id}`, {
        method: 'POST',
        body: JSON.stringify({ action: 'send', dryRun: true }),
      });
      setActive(job);
      setSelectedStep(job.progress?.current_step_id);
    }, 'Dry-run send recorded — no live email left the system');

  const ingestReply = () =>
    run(async () => {
      if (!active) return;
      const job = await apiJson<JobView>(`/api/jobs/${active.job_id}`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'ingest',
          body: replyBody,
          from: providerEmail,
        }),
      });
      setActive(job);
      setSelectedStep(job.progress?.current_step_id);
    }, 'Quote extracted from paste');

  const approveBook = () =>
    run(async () => {
      if (!active) return;
      await apiJson(`/api/jobs/${active.job_id}`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'approve',
          kind: 'commit_money_or_time',
          summary: 'I accept the quoted price and window',
          granted: true,
        }),
      });
      const iso = new Date(scheduledAt).toISOString();
      const job = await apiJson<JobView>(`/api/jobs/${active.job_id}`, {
        method: 'POST',
        body: JSON.stringify({ action: 'confirm', scheduled_at: iso }),
      });
      setActive(job);
      setSelectedStep(job.progress?.current_step_id);
    }, 'Appointment booked — money/time gate passed');

  const completeJob = () =>
    run(async () => {
      if (!active) return;
      const job = await apiJson<JobView>(`/api/jobs/${active.job_id}`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'complete',
          notes,
          next_due: nextDue,
        }),
      });
      setActive(job);
      setSelectedStep(job.progress?.current_step_id);
    }, 'Job closed with next-due reminder');

  const na = active?.next_action?.type;
  const phase = useMemo(() => {
    if (!active) return 'start';
    if (active.status === 'done') return 'done';
    if (na === 'collect_field_via_host') return 'details';
    if (na === 'draft_for_user_approval') return 'draft';
    if (na === 'await_user_approval' || active.status === 'awaiting_user_approval') return 'approve_send';
    if (na === 'await_provider_reply') return 'hear_back';
    if (na === 'user_decision' || na === 'ingest_and_extract') return 'choose';
    if (na === 'confirm_appointment') return 'choose';
    if (na === 'mark_done') return 'complete';
    return 'active';
  }, [active, na]);

  const selected = active?.progress?.steps?.find((s) => s.id === selectedStep);

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr]">
      {/* Sidebar job list */}
      <aside className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[var(--text-sm)] font-semibold text-[var(--fg)]">Jobs</h2>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setActive(null);
              setError(null);
              setFlash(null);
            }}
            className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--text-xs)] font-medium text-[var(--fg-muted)] hover:text-[var(--fg)]"
          >
            New
          </button>
        </div>
        <ul className="space-y-2">
          {jobs.length === 0 && (
            <li className="rounded-[var(--radius-md)] border border-dashed border-[var(--border)] p-3 text-[var(--text-xs)] text-[var(--fg-subtle)]">
              No jobs yet. Start a Phase 1 cleaning path.
            </li>
          )}
          {jobs.map((j) => (
            <li key={j.job_id}>
              <button
                type="button"
                onClick={() => run(async () => { await loadJob(j.job_id); })}
                className={`w-full rounded-[var(--radius-md)] border p-3 text-left transition ${
                  active?.job_id === j.job_id
                    ? 'border-[var(--fg)]/20 bg-[var(--bg-elevated)]'
                    : 'border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                <p className="line-clamp-2 text-[var(--text-sm)] font-medium text-[var(--fg)]">
                  {j.intent}
                </p>
                <p className="mt-1 text-[var(--text-xs)] text-[var(--fg-subtle)]">
                  {j.service_kind} · {j.status}
                </p>
              </button>
            </li>
          ))}
        </ul>
        <p className="text-[10px] leading-relaxed text-[var(--fg-subtle)]">
          Demo uses fixture address and dry-run send only. Real homes stay out of git.
        </p>
      </aside>

      {/* Main panel */}
      <div className="min-w-0 space-y-4">
        <header className="space-y-1">
          <p className="text-[var(--text-xs)] font-semibold uppercase tracking-wider text-[var(--accent-strong)]">
            Phase 1 · single-DM cleaning shadow path
          </p>
          <h1 className="text-[var(--text-2xl)] font-semibold tracking-tight text-[var(--fg)]">
            Household job console
          </h1>
          <p className="max-w-2xl text-[var(--text-sm)] leading-relaxed text-[var(--fg-muted)]">
            Same Job PM the chat MCP uses — checklist, safety gates, and progress strip.
            Walk a fair cleaning exception end-to-end without leaving the browser.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="rounded-[var(--radius-md)] border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-4 py-3 text-[var(--text-sm)] text-[var(--danger)]"
          >
            {error}
          </div>
        )}
        {flash && (
          <div className="rounded-[var(--radius-md)] border border-[var(--success)]/30 bg-[var(--success-soft)] px-4 py-3 text-[var(--text-sm)] text-[var(--success)]">
            {flash}
          </div>
        )}

        {!active ? (
          <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-5 sm:p-6">
            <h2 className="text-[var(--text-lg)] font-semibold text-[var(--fg)]">Start a cleaning job</h2>
            <p className="mt-1 text-[var(--text-sm)] text-[var(--fg-muted)]">
              Prefills a residual-mess scenario (cancel / deep clean) — not standing-Tuesday autopilot.
            </p>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[var(--text-xs)] font-medium text-[var(--fg-subtle)]">
                  What do you need?
                </span>
                <textarea
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  rows={3}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-[var(--text-sm)] text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--accent-strong)]/40"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[var(--text-xs)] font-medium text-[var(--fg-subtle)]">
                    Your cleaner (you chose them)
                  </span>
                  <input
                    value={providerLabel}
                    onChange={(e) => setProviderLabel(e.target.value)}
                    className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-[var(--text-sm)] text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--accent-strong)]/40"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[var(--text-xs)] font-medium text-[var(--fg-subtle)]">
                    Contact email
                  </span>
                  <input
                    value={providerEmail}
                    onChange={(e) => setProviderEmail(e.target.value)}
                    className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-[var(--text-sm)] text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--accent-strong)]/40"
                  />
                </label>
              </div>
              <button
                type="button"
                disabled={busy || !intent.trim()}
                onClick={startDemoJob}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--fg)] px-6 text-[var(--text-sm)] font-semibold text-[var(--bg)] transition active:scale-[0.98] disabled:opacity-50"
              >
                {busy ? 'Starting…' : 'Start job'}
              </button>
            </div>
          </section>
        ) : (
          <>
            {/* Job summary + strip */}
            <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[var(--text-xs)] text-[var(--fg-subtle)]">
                    {active.service_kind} · {active.status} · {active.job_id}
                  </p>
                  <p className="mt-1 font-medium text-[var(--fg)]">{active.intent}</p>
                  {active.progress?.summary && (
                    <p className="mt-2 text-[var(--text-sm)] text-[var(--fg-muted)]">
                      {active.progress.summary}
                    </p>
                  )}
                  {active.progress?.role_line && (
                    <p className="mt-1 text-[var(--text-sm)] font-medium text-[var(--warn)]">
                      {active.progress.role_line}
                    </p>
                  )}
                </div>
                {active.status !== 'done' && (
                  <span className="shrink-0 rounded-full bg-[var(--warn-soft)] px-2.5 py-1 text-[var(--text-xs)] font-semibold text-[var(--warn)]">
                    {phase === 'approve_send' || phase === 'choose' ? 'Needs you' : 'In progress'}
                  </span>
                )}
                {active.status === 'done' && (
                  <span className="shrink-0 rounded-full bg-[var(--success-soft)] px-2.5 py-1 text-[var(--text-xs)] font-semibold text-[var(--success)]">
                    Done
                  </span>
                )}
              </div>

              {active.progress?.steps && (
                <JobProgressStrip
                  steps={active.progress.steps}
                  strip={active.progress.strip}
                  selectedId={selectedStep}
                  onSelect={setSelectedStep}
                />
              )}

              {selected && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[var(--radius-md)] bg-[var(--warn-soft)] p-3">
                    <p className="text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--warn)]">
                      You
                    </p>
                    <p className="mt-1 text-[var(--text-sm)] text-[var(--fg)]">{selected.you_do}</p>
                  </div>
                  <div className="rounded-[var(--radius-md)] bg-[var(--accent-soft)] p-3">
                    <p className="text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--accent-strong)]">
                      App + your AI
                    </p>
                    <p className="mt-1 text-[var(--text-sm)] text-[var(--fg)]">{selected.app_does}</p>
                  </div>
                </div>
              )}
            </section>

            {/* Guided action panel by phase */}
            {phase === 'details' && (
              <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
                <h3 className="font-semibold text-[var(--fg)]">Details</h3>
                <p className="mt-1 text-[var(--text-sm)] text-[var(--fg-muted)]">
                  Address is never invented. Confirm a fixture address for the demo.
                </p>
                <label className="mt-4 block">
                  <span className="mb-1.5 block text-[var(--text-xs)] font-medium text-[var(--fg-subtle)]">
                    Service address
                  </span>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-[var(--text-sm)] text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--accent-strong)]/40"
                  />
                </label>
                <button
                  type="button"
                  disabled={busy || !address.trim()}
                  onClick={saveAddress}
                  className="mt-4 inline-flex h-11 items-center rounded-full bg-[var(--fg)] px-5 text-[var(--text-sm)] font-semibold text-[var(--bg)] disabled:opacity-50"
                >
                  Save details
                </button>
              </section>
            )}

            {phase === 'draft' && (
              <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
                <h3 className="font-semibold text-[var(--fg)]">Contact draft</h3>
                <p className="mt-1 text-[var(--text-sm)] text-[var(--fg-muted)]">
                  Edit the outreach, then submit for your approval.
                </p>
                <textarea
                  value={draftBody}
                  onChange={(e) => setDraftBody(e.target.value)}
                  rows={8}
                  className="mt-4 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 font-mono text-[var(--text-xs)] leading-relaxed text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--accent-strong)]/40 sm:text-[var(--text-sm)]"
                />
                <button
                  type="button"
                  disabled={busy || !draftBody.trim()}
                  onClick={submitDraft}
                  className="mt-4 inline-flex h-11 items-center rounded-full bg-[var(--fg)] px-5 text-[var(--text-sm)] font-semibold text-[var(--bg)] disabled:opacity-50"
                >
                  Submit for approval
                </button>
              </section>
            )}

            {phase === 'approve_send' && (
              <section className="rounded-[var(--radius-xl)] border border-dashed border-[var(--warn)]/50 bg-[var(--warn-soft)] p-5">
                <h3 className="font-semibold text-[var(--fg)]">Approve send</h3>
                <p className="mt-1 text-[var(--text-sm)] text-[var(--fg-muted)]">
                  Safety gate: nothing sends without your OK. Demo uses dry-run only.
                </p>
                {active.pending_draft && (
                  <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] p-3">
                    <p className="text-[var(--text-xs)] text-[var(--fg-subtle)]">
                      To: {active.pending_draft.to} · {active.pending_draft.channel}
                    </p>
                    <pre className="mt-2 whitespace-pre-wrap font-mono text-[var(--text-xs)] text-[var(--fg)]">
                      {active.pending_draft.body_preview}
                      {(active.pending_draft.body_preview?.length || 0) >= 200 ? '…' : ''}
                    </pre>
                  </div>
                )}
                <button
                  type="button"
                  disabled={busy}
                  onClick={approveAndDryRunSend}
                  className="mt-4 inline-flex h-11 items-center rounded-full bg-[var(--fg)] px-5 text-[var(--text-sm)] font-semibold text-[var(--bg)] disabled:opacity-50"
                >
                  Approve & dry-run send
                </button>
              </section>
            )}

            {phase === 'hear_back' && (
              <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
                <h3 className="font-semibold text-[var(--fg)]">Hear back</h3>
                <p className="mt-1 text-[var(--text-sm)] text-[var(--fg-muted)]">
                  Paste the vendor reply. Price and windows are extracted when present.
                </p>
                <textarea
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  rows={5}
                  className="mt-4 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-[var(--text-sm)] text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--accent-strong)]/40"
                />
                <button
                  type="button"
                  disabled={busy || !replyBody.trim()}
                  onClick={ingestReply}
                  className="mt-4 inline-flex h-11 items-center rounded-full bg-[var(--fg)] px-5 text-[var(--text-sm)] font-semibold text-[var(--bg)] disabled:opacity-50"
                >
                  Ingest reply
                </button>
              </section>
            )}

            {phase === 'choose' && (
              <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
                <h3 className="font-semibold text-[var(--fg)]">Choose & book</h3>
                <p className="mt-1 text-[var(--text-sm)] text-[var(--fg-muted)]">
                  Separate money/time gate — send approval is not enough to book.
                </p>
                {active.quotes && active.quotes.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {active.quotes.map((q) => (
                      <li
                        key={q.id}
                        className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] px-3 py-3"
                      >
                        <p className="font-medium text-[var(--fg)]">
                          {q.priceFromUsd != null ? `$${q.priceFromUsd}` : 'Price TBD'}
                          {q.proposedWindow ? ` · ${q.proposedWindow}` : ''}
                        </p>
                        <p className="text-[var(--text-xs)] text-[var(--fg-subtle)]">
                          {q.providerLabel || 'Provider'} {q.notes ? `· ${q.notes}` : ''}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                <label className="mt-4 block">
                  <span className="mb-1.5 block text-[var(--text-xs)] font-medium text-[var(--fg-subtle)]">
                    Scheduled time
                  </span>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full max-w-xs rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-[var(--text-sm)] text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--accent-strong)]/40"
                  />
                </label>
                <button
                  type="button"
                  disabled={busy}
                  onClick={approveBook}
                  className="mt-4 inline-flex h-11 items-center rounded-full bg-[var(--fg)] px-5 text-[var(--text-sm)] font-semibold text-[var(--bg)] disabled:opacity-50"
                >
                  Approve price/time & book
                </button>
              </section>
            )}

            {phase === 'complete' && (
              <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
                <h3 className="font-semibold text-[var(--fg)]">Mark done</h3>
                <p className="mt-1 text-[var(--text-sm)] text-[var(--fg-muted)]">
                  Explicit completion + optional next-due. No silent auto-close.
                </p>
                <label className="mt-4 block">
                  <span className="mb-1.5 block text-[var(--text-xs)] font-medium text-[var(--fg-subtle)]">
                    Notes
                  </span>
                  <input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-[var(--text-sm)] text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--accent-strong)]/40"
                  />
                </label>
                <label className="mt-3 block">
                  <span className="mb-1.5 block text-[var(--text-xs)] font-medium text-[var(--fg-subtle)]">
                    Next due
                  </span>
                  <input
                    type="date"
                    value={nextDue}
                    onChange={(e) => setNextDue(e.target.value)}
                    className="w-full max-w-xs rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-[var(--text-sm)] text-[var(--fg)] outline-none focus:ring-2 focus:ring-[var(--accent-strong)]/40"
                  />
                </label>
                <button
                  type="button"
                  disabled={busy}
                  onClick={completeJob}
                  className="mt-4 inline-flex h-11 items-center rounded-full bg-[var(--fg)] px-5 text-[var(--text-sm)] font-semibold text-[var(--bg)] disabled:opacity-50"
                >
                  Complete job
                </button>
              </section>
            )}

            {phase === 'done' && (
              <section className="rounded-[var(--radius-xl)] border border-[var(--success)]/30 bg-[var(--success-soft)] p-5">
                <h3 className="font-semibold text-[var(--success)]">Job complete</h3>
                <p className="mt-2 text-[var(--text-sm)] text-[var(--fg)]">
                  {active.completion_notes || 'Closed with explicit completion record.'}
                </p>
                {active.next_due && (
                  <p className="mt-1 text-[var(--text-sm)] text-[var(--fg-muted)]">
                    Next due: <span className="font-medium text-[var(--fg)]">{active.next_due}</span>
                  </p>
                )}
                <p className="mt-3 text-[var(--text-xs)] text-[var(--fg-subtle)]">
                  After a real house run: answer the 5 pass/kill questions in scores.md and leave a redacted stage-6 note.
                </p>
              </section>
            )}

            {/* Audit + safety footer */}
            <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg)] p-4">
              <p className="text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--fg-subtle)]">
                Safety & audit
              </p>
              <p className="mt-1 text-[var(--text-sm)] text-[var(--fg-muted)]">
                {active.safety?.principle ||
                  'Safety before convenience. Explicit approvals for send and money/time.'}
              </p>
              {active.approvals && active.approvals.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {active.approvals.map((a, i) => (
                    <li key={i} className="font-mono text-[10px] text-[var(--fg-subtle)] sm:text-xs">
                      {a.granted ? 'GRANTED' : 'DENIED'} · {a.kind} · {a.summary}
                    </li>
                  ))}
                </ul>
              )}
              {active.audit_tail && active.audit_tail.length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-[var(--text-xs)] text-[var(--fg-subtle)]">
                    Recent audit ({active.audit_tail.length})
                  </summary>
                  <ul className="mt-2 space-y-1">
                    {active.audit_tail.map((ev, i) => (
                      <li key={i} className="font-mono text-[10px] text-[var(--fg-subtle)]">
                        {ev.type}: {ev.detail}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
