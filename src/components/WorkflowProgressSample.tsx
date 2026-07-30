'use client';

import { useMemo, useState } from 'react';
import { JobProgressStrip, type ProgressStep } from './JobProgressStrip';

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
    format?: string;
    format_version?: string;
    diagram: string;
    diagrams?: { text: string; mermaid: string };
    strip: string;
    steps: Step[];
    principles: Record<string, string>;
    service_profile: { label: string; field_hints: string[]; outreach_notes: string };
    format_doc?: string;
  };
  sample_job: {
    job_id: string;
    intent: string;
    service_kind: string;
    progress: {
      format?: string;
      strip: string;
      summary: string;
      role_line: string;
      current_step_id: string;
      diagrams?: { text: string; mermaid: string };
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

export function WorkflowProgressSample({ sample }: { sample: SamplePayload }) {
  const steps = sample.sample_job.progress.steps as ProgressStep[];
  const defaultId = sample.sample_job.progress.current_step_id;
  const [selectedId, setSelectedId] = useState(defaultId);
  const [tab, setTab] = useState<'job' | 'template'>('job');

  const selected = useMemo(
    () => steps.find((s) => s.id === selectedId) || steps.find((s) => s.state === 'needs_you') || steps[0],
    [steps, selectedId]
  );

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8 text-[var(--fg)] sm:py-12">
      <header className="mb-6 space-y-2">
        <p className="text-[var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-[var(--accent-strong)]">
          Totbox · house_service_v1
        </p>
        <h1 className="text-[var(--text-2xl)] font-semibold tracking-tight text-[var(--fg)]">
          {sample.title}
        </h1>
        <p className="text-[var(--text-sm)] leading-relaxed text-[var(--fg-muted)]">{sample.subtitle}</p>
      </header>

      <div className="mb-5 flex rounded-full bg-[var(--bg-subtle)] p-1">
        <button
          type="button"
          onClick={() => setTab('job')}
          className={`flex-1 rounded-full px-3 py-2 text-[var(--text-sm)] font-medium transition ${
            tab === 'job'
              ? 'bg-[var(--bg-elevated)] text-[var(--fg)] shadow-sm'
              : 'text-[var(--fg-subtle)] hover:text-[var(--fg)]'
          }`}
        >
          This job
        </button>
        <button
          type="button"
          onClick={() => setTab('template')}
          className={`flex-1 rounded-full px-3 py-2 text-[var(--text-sm)] font-medium transition ${
            tab === 'template'
              ? 'bg-[var(--bg-elevated)] text-[var(--fg)] shadow-sm'
              : 'text-[var(--fg-subtle)] hover:text-[var(--fg)]'
          }`}
        >
          How it always works
        </button>
      </div>

      {tab === 'job' ? (
        <>
          <section className="surface mb-4 p-4">
            <div className="mb-1 flex items-start justify-between gap-2">
              <div>
                <p className="text-[var(--text-xs)] text-[var(--fg-subtle)]">Sample HVAC request</p>
                <p className="font-medium text-[var(--fg)]">{sample.sample_job.intent}</p>
              </div>
              <span className="shrink-0 rounded-full bg-[var(--warn-soft)] px-2.5 py-1 text-[var(--text-xs)] font-semibold text-[var(--warn)]">
                Needs you
              </span>
            </div>
            <p className="mt-3 text-[var(--text-sm)] font-medium text-[var(--fg)]">
              {sample.sample_job.progress.summary}
            </p>
            <p className="mt-1 text-[var(--text-sm)] text-[var(--warn)]">{sample.sample_job.progress.role_line}</p>
          </section>

          <section className="mb-4">
            <JobProgressStrip
              steps={steps}
              strip={sample.sample_job.progress.strip}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </section>

          {selected && (
            <section className="surface mb-4 space-y-3 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-[var(--text-xs)] font-bold text-[var(--accent-fg)]">
                  {selected.label}
                </span>
                <span className="text-[var(--text-xs)] text-[var(--fg-subtle)]">
                  {sample.legend[selected.state]}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[var(--radius-md)] bg-[var(--warn-soft)] p-3">
                  <p className="text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--warn)]">
                    You
                  </p>
                  <p className="mt-1 text-[var(--text-sm)] leading-snug text-[var(--fg)]">{selected.you_do}</p>
                </div>
                <div className="rounded-[var(--radius-md)] bg-[var(--accent-soft)] p-3">
                  <p className="text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--accent-strong)]">
                    App + your AI
                  </p>
                  <p className="mt-1 text-[var(--text-sm)] leading-snug text-[var(--fg)]">{selected.app_does}</p>
                </div>
              </div>
            </section>
          )}

          {selected?.id === 'send' && sample.sample_job.draft_preview && (
            <section className="mb-4 rounded-[var(--radius-xl)] border border-dashed border-[var(--warn)] bg-[var(--warn-soft)] p-4">
              <p className="text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--warn)]">
                Message ready for your OK
              </p>
              <p className="mt-1 text-[var(--text-xs)] text-[var(--fg-subtle)]">
                To: {sample.sample_job.draft_preview.to} · {sample.sample_job.draft_preview.channel}
              </p>
              <p className="mt-2 text-[var(--text-sm)] font-medium text-[var(--fg)]">
                {sample.sample_job.draft_preview.subject}
              </p>
              <pre className="mt-2 whitespace-pre-wrap rounded-[var(--radius-md)] bg-[var(--bg-elevated)] p-3 text-[var(--text-xs)] leading-relaxed text-[var(--fg-muted)]">
                {sample.sample_job.draft_preview.body}
              </pre>
              <p className="mt-2 text-[var(--text-xs)] text-[var(--fg-subtle)]">
                {sample.sample_job.draft_preview.note}
              </p>
              <div className="mt-3 flex gap-2">
                <a href="/jobs" className="btn btn-primary flex-1 no-underline">
                  Run live console
                </a>
                <button type="button" className="btn btn-secondary">
                  Sample only
                </button>
              </div>
            </section>
          )}
        </>
      ) : (
        <>
          <section className="surface mb-4 p-4">
            <p className="text-[var(--text-xs)] text-[var(--fg-subtle)]">
              {sample.template.workflow_id} · v{sample.template.workflow_version}
              {sample.template.format ? (
                <>
                  {' '}
                  · {sample.template.format} {sample.template.format_version}
                </>
              ) : null}
            </p>
            <p className="mt-2 font-mono text-[var(--text-xs)] leading-relaxed text-[var(--fg-muted)] sm:text-[var(--text-sm)]">
              {sample.template.diagram}
            </p>
            <p className="mt-3 text-[var(--text-sm)] text-[var(--fg-muted)]">
              Same path for <strong className="text-[var(--fg)]">{sample.template.service_profile.label}</strong>{' '}
              and every other house service. Only the details under each step change.
            </p>
            {sample.template.diagrams?.mermaid ? (
              <details className="mt-3">
                <summary className="cursor-pointer text-[var(--text-xs)] font-medium text-[var(--fg-subtle)] hover:text-[var(--fg)]">
                  Mermaid projection (for docs / rich hosts)
                </summary>
                <pre className="mt-2 overflow-x-auto rounded-[var(--radius-md)] bg-[var(--bg-subtle)] p-3 font-mono text-[10px] leading-relaxed text-[var(--fg-muted)] sm:text-xs">
                  {sample.template.diagrams.mermaid}
                </pre>
              </details>
            ) : null}
          </section>
          <section className="space-y-2">
            {sample.template.steps.map((step) => (
              <div key={step.id} className="surface p-3">
                <p className="text-[var(--text-sm)] font-semibold text-[var(--fg)]">
                  {step.n}. {step.label}
                </p>
                <p className="mt-1 text-[var(--text-xs)] text-[var(--fg-muted)]">
                  <span className="font-medium text-[var(--warn)]">You:</span> {step.you_do}
                </p>
                <p className="mt-0.5 text-[var(--text-xs)] text-[var(--fg-muted)]">
                  <span className="font-medium text-[var(--accent-strong)]">App:</span> {step.app_does}
                </p>
              </div>
            ))}
          </section>
          <section className="mt-4 space-y-2 rounded-[var(--radius-xl)] bg-[var(--bg-subtle)] p-4">
            <p className="text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--fg-subtle)]">
              Promises
            </p>
            {Object.entries(sample.template.principles).map(([k, v]) => (
              <p key={k} className="text-[var(--text-sm)] leading-snug text-[var(--fg-muted)]">
                <span className="font-medium capitalize text-[var(--fg)]">{k.replace(/_/g, ' ')}:</span> {v}
              </p>
            ))}
          </section>
        </>
      )}

      <footer className="mt-8 space-y-2 border-t border-[var(--border)] pt-6 text-center text-[var(--text-xs)] text-[var(--fg-subtle)]">
        <p>You stay in control. Approve send, address sharing, and money/time.</p>
        <p className="font-mono text-[10px]">
          Sample job {sample.sample_job.job_id} · MCP: get_workflow / get_job
        </p>
        <p>
          <a href="/jobs" className="font-medium text-[var(--accent-strong)] underline-offset-2 hover:underline">
            Household jobs
          </a>
          {' · '}
          <a href="/" className="font-medium text-[var(--accent-strong)] underline-offset-2 hover:underline">
            Home
          </a>
        </p>
      </footer>
    </div>
  );
}
