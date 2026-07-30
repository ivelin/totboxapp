'use client';

type StepState = 'done' | 'current' | 'upcoming' | 'needs_you' | 'blocked';

export type ProgressStep = {
  id: string;
  label: string;
  state: StepState;
  n?: number;
  you_do?: string;
  app_does?: string;
};

function stateClass(state: StepState) {
  switch (state) {
    case 'done':
      return {
        ring: 'border-[var(--success)]/50 bg-[var(--success-soft)] text-[var(--success)]',
        badge: 'bg-[var(--success)] text-white',
      };
    case 'needs_you':
      return {
        ring: 'border-[var(--warn)] bg-[var(--warn-soft)] text-[var(--fg)] shadow-sm',
        badge: 'bg-[var(--warn)] text-[var(--warn-fg)]',
      };
    case 'blocked':
      return {
        ring: 'border-[var(--danger)] bg-[var(--danger-soft)] text-[var(--danger)]',
        badge: 'bg-[var(--danger)] text-white',
      };
    case 'current':
      return {
        ring: 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--fg)] shadow-sm',
        badge: 'bg-[var(--accent)] text-[var(--accent-fg)]',
      };
    default:
      return {
        ring: 'border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg-subtle)]',
        badge: 'bg-[var(--bg-subtle)] text-[var(--fg-muted)]',
      };
  }
}

export function JobProgressStrip({
  steps,
  strip,
  selectedId,
  onSelect,
}: {
  steps: ProgressStep[];
  strip?: string;
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[var(--text-xs)] font-medium uppercase tracking-wide text-[var(--fg-subtle)]">
        Your path
      </p>
      <div className="-mx-1 flex gap-2 overflow-x-auto pb-2 pt-1 [scrollbar-width:thin]">
        {steps.map((step, i) => {
          const st = stateClass(step.state);
          const active = selectedId === step.id;
          const Comp = onSelect ? 'button' : 'div';
          return (
            <Comp
              key={step.id}
              type={onSelect ? 'button' : undefined}
              onClick={onSelect ? () => onSelect(step.id) : undefined}
              className={`flex min-w-[4.5rem] flex-col items-center gap-1.5 rounded-[var(--radius-lg)] border px-2 py-3 transition duration-[var(--motion-quick)] ${st.ring} ${
                active ? 'ring-2 ring-[var(--accent)]/40 ring-offset-2 ring-offset-[var(--bg)]' : ''
              } ${onSelect ? 'cursor-pointer' : ''}`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${st.badge}`}
              >
                {step.state === 'done' ? '✓' : i + 1}
              </span>
              <span className="text-center text-[11px] font-semibold leading-tight">{step.label}</span>
            </Comp>
          );
        })}
      </div>
      {strip ? (
        <p className="mt-1 font-mono text-[10px] leading-relaxed text-[var(--fg-subtle)] sm:text-xs">
          {strip}
        </p>
      ) : null}
    </div>
  );
}
