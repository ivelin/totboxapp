'use client';

import { useMemo, useState } from 'react';

type StepState = 'done' | 'current' | 'upcoming' | 'needs_you' | 'blocked';

type Step = {
  id: string;
  label: string;
  state?: StepState;
  n?: number;
  you_do?: string;
  app_does?: string;
};

type SamplePayload = {
  title: string;
  subtitle: string;
  template: {
    workflow_id: string;
    workflow_version: string;
    diagram: string;
    strip: string;
    steps: Step[];
    principles: Record<string, string>;
    service_profile: { label: string; field_hints: string[]; outreach_notes: string };
  };
  sample_job: {
    job_id: string;
    intent: string;
    service_kind: string;
    progress: {
      strip: string;
      summary: string;
      role_line: string;
      current_step_id: string;
      steps: Array<Step & { state: StepState; you_do: string; app_does: string }>;
    };
    draft_preview: {
      to: string;
      channel: string;
      subject: string;
      body?: string;
      note: string;
    };
  };
  legend: Record<string, string>;
};

function stateStyles(state: StepState | undefined) {
  switch (state) {
    case 'done':
      return {
        ring: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200',
        badge: 'bg-emerald-500 text-white',
        mark: '✓',
      };
    case 'needs_you':
      return {
        ring: 'border-amber-500 bg-amber-500/15 text-amber-950 dark:text-amber-100 shadow-md shadow-amber-500/20',
        badge: 'bg-amber-500 text-white',
        mark: '!',
      };
    case 'blocked':
      return {
        ring: 'border-rose-500 bg-rose-500/10 text-rose-900 dark:text-rose-100',
        badge: 'bg-rose-500 text-white',
        mark: '⛔',
      };
    case 'current':
      return {
        ring: 'border-sky-500 bg-sky-500/15 text-sky-950 dark:text-sky-100 shadow-md shadow-sky-500/20',
        badge: 'bg-sky-500 text-white',
        mark: '●',
      };
    default:
      return {
        ring: 'border-zinc-300/80 bg-zinc-50 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400',
        badge: 'bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200',
        mark: '○',
      };
  }
}

export function WorkflowProgressSample({ sample }: { sample: SamplePayload }) {
  const steps = sample.sample_job.progress.steps;
  const defaultId = sample.sample_job.progress.current_step_id;
  const [selectedId, setSelectedId] = useState(defaultId);
  const [tab, setTab] = useState<'job' | 'template'>('job');

  const selected = useMemo(
    () => steps.find(s => s.id === selectedId) || steps.find(s => s.state === 'needs_you') || steps[0],
    [steps, selectedId]
  );

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8 sm:py-12">
      <header className="mb-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
          Totbox · house_service_v1
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          {sample.title}
        </h1>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{sample.subtitle}</p>
      </header>

      {/* Tab: this job vs how it always works */}
      <div className="mb-5 flex rounded-full bg-zinc-100 p-1 dark:bg-zinc-900">
        <button
          type="button"
          onClick={() => setTab('job')}
          className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${
            tab === 'job'
              ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          This job
        </button>
        <button
          type="button"
          onClick={() => setTab('template')}
          className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${
            tab === 'template'
              ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          How it always works
        </button>
      </div>

      {tab === 'job' ? (
        <>
          {/* Job card */}
          <section className="mb-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-1 flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-zinc-500">Sample HVAC request</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{sample.sample_job.intent}</p>
              </div>
              <span className="shrink-0 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-200">
                Needs you
              </span>
            </div>
            <p className="mt-3 text-sm font-medium text-zinc-800 dark:text-zinc-100">
              {sample.sample_job.progress.summary}
            </p>
            <p className="mt-1 text-sm text-amber-800 dark:text-amber-200/90">
              {sample.sample_job.progress.role_line}
            </p>
          </section>

          {/* Interactive step strip — horizontal scroll on narrow screens */}
          <section className="mb-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Your path · tap a step
            </p>
            <div className="-mx-1 flex gap-2 overflow-x-auto pb-2 pt-1 [scrollbar-width:thin]">
              {steps.map((step, i) => {
                const st = stateStyles(step.state);
                const active = selected?.id === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setSelectedId(step.id)}
                    className={`flex min-w-[4.5rem] flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 transition ${st.ring} ${
                      active ? 'scale-[1.03] ring-2 ring-offset-2 ring-sky-400/60 dark:ring-offset-zinc-950' : ''
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${st.badge}`}
                    >
                      {step.state === 'done' ? '✓' : i + 1}
                    </span>
                    <span className="text-center text-[11px] font-semibold leading-tight">{step.label}</span>
                  </button>
                );
              })}
            </div>
            {/* Compact strip text for accessibility / copy */}
            <p className="mt-1 font-mono text-[10px] leading-relaxed text-zinc-400 sm:text-xs">
              {sample.sample_job.progress.strip}
            </p>
          </section>

          {/* Selected step detail */}
          {selected && (
            <section className="mb-4 space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold text-white ${stateStyles(selected.state).badge}`}>
                  {selected.label}
                </span>
                <span className="text-xs text-zinc-500">{sample.legend[selected.state]}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-amber-500/10 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
                    You
                  </p>
                  <p className="mt-1 text-sm leading-snug text-zinc-800 dark:text-zinc-100">{selected.you_do}</p>
                </div>
                <div className="rounded-xl bg-sky-500/10 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-sky-800 dark:text-sky-300">
                    App + your AI
                  </p>
                  <p className="mt-1 text-sm leading-snug text-zinc-800 dark:text-zinc-100">{selected.app_does}</p>
                </div>
              </div>
            </section>
          )}

          {/* Draft preview when on Send */}
          {selected?.id === 'send' && sample.sample_job.draft_preview && (
            <section className="mb-4 rounded-2xl border border-dashed border-amber-400/50 bg-amber-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
                Message ready for your OK
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                To: {sample.sample_job.draft_preview.to} · {sample.sample_job.draft_preview.channel}
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {sample.sample_job.draft_preview.subject}
              </p>
              <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                {sample.sample_job.draft_preview.body}
              </pre>
              <p className="mt-2 text-xs text-zinc-500">{sample.sample_job.draft_preview.note}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-zinc-900 px-3 py-2.5 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
                >
                  Approve &amp; continue
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-zinc-300 px-3 py-2.5 text-sm font-medium dark:border-zinc-700"
                >
                  Edit
                </button>
              </div>
            </section>
          )}
        </>
      ) : (
        <>
          <section className="mb-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs text-zinc-500">
              {sample.template.workflow_id} · v{sample.template.workflow_version}
            </p>
            <p className="mt-2 font-mono text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-sm">
              {sample.template.diagram}
            </p>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              Same path for <strong>{sample.template.service_profile.label}</strong> and every other house
              service. Only the details under each step change.
            </p>
          </section>
          <section className="space-y-2">
            {sample.template.steps.map(step => (
              <div
                key={step.id}
                className="rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {step.n}. {step.label}
                </p>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium text-amber-800 dark:text-amber-300">You:</span> {step.you_do}
                </p>
                <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium text-sky-800 dark:text-sky-300">App:</span> {step.app_does}
                </p>
              </div>
            ))}
          </section>
          <section className="mt-4 space-y-2 rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Promises</p>
            {Object.entries(sample.template.principles).map(([k, v]) => (
              <p key={k} className="text-sm leading-snug text-zinc-700 dark:text-zinc-300">
                <span className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
                  {k.replace(/_/g, ' ')}:
                </span>{' '}
                {v}
              </p>
            ))}
          </section>
        </>
      )}

      <footer className="mt-8 space-y-2 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-500 dark:border-zinc-800">
        <p>You stay in control. Approve send, address sharing, and money/time.</p>
        <p className="font-mono text-[10px] text-zinc-400">
          Sample job {sample.sample_job.job_id} · MCP: get_workflow / get_job
        </p>
        <p>
          <a href="/" className="text-sky-600 underline-offset-2 hover:underline dark:text-sky-400">
            Home
          </a>
          {' · '}
          <a href="/dashboard" className="text-sky-600 underline-offset-2 hover:underline dark:text-sky-400">
            Dashboard
          </a>
        </p>
      </footer>
    </div>
  );
}
