/**
 * house_service_v1 — consumer-facing progress map for any house-service job.
 * Stable spine; service kind only affects copy, not step ids.
 */

import type { Job, JobStatus } from './job-types';

export const WORKFLOW_ID = 'house_service_v1';
export const WORKFLOW_VERSION = '1.0.0';

export type ConsumerStepId =
  | 'describe'
  | 'details'
  | 'contact'
  | 'send'
  | 'hear_back'
  | 'choose'
  | 'booked'
  | 'done';

export type StepVisualState = 'done' | 'current' | 'upcoming' | 'needs_you' | 'blocked';

export interface WorkflowStepDef {
  id: ConsumerStepId;
  /** Short label for mobile strip */
  label: string;
  /** One line: what the homeowner does */
  youDo: string;
  /** One line: what the app / AI helper does */
  appDoes: string;
  /** Internal checklist item ids that complete this step */
  checklistIds: string[];
}

/** Top-level consumer map — keep ≤8 steps for any screen */
export const HOUSE_SERVICE_V1_STEPS: WorkflowStepDef[] = [
  {
    id: 'describe',
    label: 'Describe',
    youDo: 'Say what service you need and any budget or timing.',
    appDoes: 'Turns your words into a clear job package.',
    checklistIds: ['brief'],
  },
  {
    id: 'details',
    label: 'Details',
    youDo: 'Confirm address or access if asked (we never invent it).',
    appDoes: 'Uses host memory when allowed; blocks send until required facts exist.',
    checklistIds: ['address'],
  },
  {
    id: 'contact',
    label: 'Contact',
    youDo: 'Choose who to contact (search or someone you already know).',
    appDoes: 'Prepares the outreach draft with the right fields for this service type.',
    checklistIds: ['provider_contact', 'draft_outreach'],
  },
  {
    id: 'send',
    label: 'Send',
    youDo: 'Review and approve the message before anything goes out.',
    appDoes: 'Sends via your tools or records a dry-run; never silent auto-send early on.',
    checklistIds: ['send_outreach'],
  },
  {
    id: 'hear_back',
    label: 'Hear back',
    youDo: 'Share the reply if your inbox tools do not auto-import it.',
    appDoes: 'Records quotes and times; prompts the next follow-up if needed.',
    checklistIds: ['provider_reply'],
  },
  {
    id: 'choose',
    label: 'Choose',
    youDo: 'Approve price and time (money/time needs your OK).',
    appDoes: 'Shows options; will not lock a commitment without approval.',
    checklistIds: ['user_decision'],
  },
  {
    id: 'booked',
    label: 'Booked',
    youDo: 'Be ready on the service day.',
    appDoes: 'Holds the confirmed appointment on the job.',
    checklistIds: ['scheduled'],
  },
  {
    id: 'done',
    label: 'Done',
    youDo: 'Pay / note how it went if you want.',
    appDoes: 'Closes the job; can remind you next time (later).',
    checklistIds: ['settle'],
  },
];

function checklistDone(job: Job, ids: string[]): boolean {
  const relevant = job.checklist.filter(c => ids.includes(c.id));
  if (relevant.length === 0) {
    // Step not in this service profile → treat as N/A done so spine still advances
    return true;
  }
  // Required items must be done; optional (required:false) ok if missing or done
  return relevant.every(c => !c.required || c.done);
}

function stepIndexForJob(job: Job): number {
  if (job.status === 'cancelled') return 0;
  if (job.status === 'done') return HOUSE_SERVICE_V1_STEPS.length - 1;

  // First step that is not fully complete
  for (let i = 0; i < HOUSE_SERVICE_V1_STEPS.length; i++) {
    const step = HOUSE_SERVICE_V1_STEPS[i];
    if (!checklistDone(job, step.checklistIds)) return i;
  }
  return HOUSE_SERVICE_V1_STEPS.length - 1;
}

function statusHint(status: JobStatus): string {
  switch (status) {
    case 'blocked':
      return 'Something is missing before we can continue.';
    case 'awaiting_user_approval':
      return 'Waiting on your approval.';
    case 'awaiting_user_decision':
      return 'Waiting on your choice (price/time).';
    case 'awaiting_provider_reply':
      return 'Waiting to hear back from the provider.';
    case 'outbound_sent':
      return 'Message recorded as sent (or dry-run).';
    case 'scheduled':
      return 'Appointment is on the job.';
    case 'done':
      return 'This job is complete.';
    case 'cancelled':
      return 'This job was cancelled.';
    default:
      return 'In progress.';
  }
}

/**
 * Consumer + developer progress snapshot for any job instance.
 * Safe to show `consumer` fields to non-technical users.
 */
export function getWorkflowProgress(job: Job) {
  const idx = stepIndexForJob(job);
  const blocked = job.status === 'blocked' || (job.blocks && job.blocks.length > 0);
  const needsYou =
    job.status === 'awaiting_user_approval' ||
    job.status === 'awaiting_user_decision' ||
    (job.nextAction?.requiresUserApproval === true &&
      (job.nextAction.type === 'await_user_approval' ||
        job.nextAction.type === 'user_decision' ||
        job.nextAction.type === 'draft_for_user_approval' ||
        job.nextAction.type === 'collect_field_via_host'));

  const steps = HOUSE_SERVICE_V1_STEPS.map((def, i) => {
    let state: StepVisualState = 'upcoming';
    if (job.status === 'done' || i < idx) state = 'done';
    else if (i === idx) {
      if (blocked && (def.id === 'details' || def.id === 'contact')) state = 'blocked';
      else if (needsYou) state = 'needs_you';
      else state = 'current';
    }
    // If step has no required checklist items left undone but we're past — already handled
    if (checklistDone(job, def.checklistIds) && i <= idx && job.status === 'done') state = 'done';
    if (checklistDone(job, def.checklistIds) && i < idx) state = 'done';
    if (checklistDone(job, def.checklistIds) && i === idx && job.status !== 'done' && !blocked) {
      // e.g. optional settle still open but required work done — still current until done
      if (def.id !== 'done') {
        // if all required checklist on job done except this step's optional-only, advance handled by idx
      }
    }

    return {
      id: def.id,
      label: def.label,
      state,
      you_do: def.youDo,
      app_does: def.appDoes,
    };
  });

  // Normalize: only one current/needs_you/blocked
  let seenFocus = false;
  for (const s of steps) {
    if (s.state === 'current' || s.state === 'needs_you' || s.state === 'blocked') {
      if (seenFocus) s.state = 'upcoming';
      else seenFocus = true;
    }
  }

  const current = steps.find(s => s.state === 'current' || s.state === 'needs_you' || s.state === 'blocked') || steps[steps.length - 1];

  const strip = steps
    .map(s => {
      const mark =
        s.state === 'done' ? '✓' : s.state === 'needs_you' ? '⚠' : s.state === 'blocked' ? '⛔' : s.state === 'current' ? '●' : '○';
      return `${mark} ${s.label}`;
    })
    .join(' · ');

  const roleLine =
    current.state === 'needs_you' || current.state === 'blocked'
      ? `You: ${current.you_do}`
      : current.state === 'done' && job.status === 'done'
        ? 'This job is finished.'
        : `App: ${current.app_does}`;

  return {
    workflow_id: WORKFLOW_ID,
    workflow_version: WORKFLOW_VERSION,
    service_kind: job.serviceKind,
    /** One line for mobile header */
    summary: `${current.label}: ${statusHint(job.status)}`,
    /** Compact strip for any screen */
    strip,
    /** Role caption under the strip */
    role_line: roleLine,
    current_step_id: current.id,
    steps,
    /** Developer drill-down (same payload, separate key for UIs) */
    developer: {
      internal_status: job.status,
      checklist: job.checklist,
      blocks: job.blocks,
      next_action_type: job.nextAction?.type,
      next_action: job.nextAction,
      open_checklist: job.checklist.filter(c => c.required && !c.done).map(c => c.id),
      doc: 'docs/workflows/house_service_v1.md',
    },
  };
}

/** ASCII multi-line diagram for CLI / logs */
export function formatProgressAscii(job: Job): string {
  const p = getWorkflowProgress(job);
  const lines = [
    `Workflow ${p.workflow_id} v${p.workflow_version} · ${p.service_kind}`,
    p.strip,
    p.summary,
    p.role_line,
    '',
    'Steps:',
  ];
  for (const s of p.steps) {
    const mark =
      s.state === 'done' ? '[x]' : s.state === 'needs_you' ? '[!]' : s.state === 'blocked' ? '[#]' : s.state === 'current' ? '[>]' : '[ ]';
    lines.push(`  ${mark} ${s.label} — You: ${s.you_do}`);
    lines.push(`       App: ${s.app_does}`);
  }
  return lines.join('\n');
}
