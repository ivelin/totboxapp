/**
 * house_service_v1 — consumer-facing progress map for any house-service job.
 * Stable spine; service kind only affects copy, not step ids.
 * Interchange: docs/workflows/format.md · schemas in workflow-format.ts
 */

import type { Job, JobStatus } from './job-types';
import {
  type ConsumerStepId,
  type StepVisualState,
  type BpmnStepType,
  type WorkflowGate,
  type WorkflowDefinition,
  type WorkflowDiagrams,
  WORKFLOW_PROGRESS_FORMAT,
  WORKFLOW_FORMAT_VERSION,
  buildWorkflowDefinition,
  buildDiagrams,
} from './workflow-format';

export type { ConsumerStepId, StepVisualState } from './workflow-format';
export {
  WORKFLOW_DEF_FORMAT,
  WORKFLOW_PROGRESS_FORMAT,
  WORKFLOW_FORMAT_VERSION,
  toMermaid,
  toTextDiagram,
  buildDiagrams,
  parseWorkflowDefinition,
  parseWorkflowProgressCore,
} from './workflow-format';

export const WORKFLOW_ID = 'house_service_v1';
export const WORKFLOW_VERSION = '1.0.0';

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
  /** BPMN-aligned activity type (semantic dialect) */
  bpmnType: BpmnStepType;
  /** Safety gates that may apply at this step */
  gates: WorkflowGate[];
}

/** Top-level consumer map — keep ≤8 steps for any screen */
export const HOUSE_SERVICE_V1_STEPS: WorkflowStepDef[] = [
  {
    id: 'describe',
    label: 'Describe',
    youDo: 'Say what service you need and any budget or timing.',
    appDoes: 'Turns your words into a clear job package.',
    checklistIds: ['brief'],
    bpmnType: 'userTask',
    gates: [],
  },
  {
    id: 'details',
    label: 'Details',
    youDo: 'Confirm address or access if asked (we never invent it).',
    appDoes: 'Uses host memory when allowed; blocks send until required facts exist.',
    checklistIds: ['address'],
    bpmnType: 'userTask',
    gates: ['share_pii'],
  },
  {
    id: 'contact',
    label: 'Contact',
    youDo: 'Choose who to contact (search or someone you already know).',
    appDoes: 'Prepares the outreach draft with the right fields for this service type.',
    checklistIds: ['provider_contact', 'draft_outreach'],
    bpmnType: 'userTask',
    gates: [],
  },
  {
    id: 'send',
    label: 'Send',
    youDo: 'Review and approve the message before anything goes out.',
    appDoes: 'Sends via your tools or records a dry-run; never silent auto-send early on.',
    checklistIds: ['send_outreach'],
    bpmnType: 'userTask',
    gates: ['send_message'],
  },
  {
    id: 'hear_back',
    label: 'Hear back',
    youDo: 'Share the reply if your inbox tools do not auto-import it.',
    appDoes: 'Records quotes and times; prompts the next follow-up if needed.',
    checklistIds: ['provider_reply'],
    bpmnType: 'serviceTask',
    gates: [],
  },
  {
    id: 'choose',
    label: 'Choose',
    youDo: 'Approve price and time (money/time needs your OK).',
    appDoes: 'Shows options; will not lock a commitment without approval.',
    checklistIds: ['user_decision'],
    bpmnType: 'userTask',
    gates: ['commit_money_or_time'],
  },
  {
    id: 'booked',
    label: 'Booked',
    youDo: 'Be ready on the service day.',
    appDoes: 'Holds the confirmed appointment on the job.',
    checklistIds: ['scheduled'],
    bpmnType: 'serviceTask',
    gates: [],
  },
  {
    id: 'done',
    label: 'Done',
    youDo: 'Pay / note how it went if you want.',
    appDoes: 'Closes the job; can remind you next time (later).',
    checklistIds: ['settle'],
    bpmnType: 'userTask',
    gates: [],
  },
];

/** Validated `totbox.workflow_def` for the stable house_service_v1 spine. */
export function getHouseServiceDefinition(): WorkflowDefinition {
  return buildWorkflowDefinition({
    workflow_id: WORKFLOW_ID,
    workflow_version: WORKFLOW_VERSION,
    steps: HOUSE_SERVICE_V1_STEPS,
  });
}

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

  const diagrams: WorkflowDiagrams = buildDiagrams({
    steps: HOUSE_SERVICE_V1_STEPS.map((s, i) => ({ id: s.id, label: s.label, n: i + 1 })),
    progressSteps: steps.map(s => ({ id: s.id, state: s.state })),
  });

  return {
    /** Interchange envelope — docs/workflows/format.md */
    format: WORKFLOW_PROGRESS_FORMAT,
    format_version: WORKFLOW_FORMAT_VERSION,
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
    /** Text + Mermaid projections (JSON steps remain source of truth) */
    diagrams,
    /** Developer drill-down (same payload, separate key for UIs) */
    developer: {
      internal_status: job.status,
      checklist: job.checklist,
      blocks: job.blocks,
      next_action_type: job.nextAction?.type,
      next_action: job.nextAction,
      open_checklist: job.checklist.filter(c => c.required && !c.done).map(c => c.id),
      doc: 'docs/workflows/house_service_v1.md',
      format_doc: 'docs/workflows/format.md',
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

/** Service-kind profile deltas (same spine; different fields/copy hints). */
export function getServiceProfile(serviceKind?: string) {
  const kind = (serviceKind || 'general').toLowerCase();
  const profiles: Record<
    string,
    { label: string; field_hints: string[]; outreach_notes: string }
  > = {
    hvac: {
      label: 'HVAC / AC',
      field_hints: ['maintenance vs repair', 'urgency', 'system notes', 'budget', 'preferred windows'],
      outreach_notes: 'Ask price, inclusions, cancel/membership terms, available slots.',
    },
    cleaning: {
      label: 'House cleaning',
      field_hints: ['priority rooms/surfaces', 'duration or package', 'budget', 'preferred windows'],
      outreach_notes: 'Send priority list; confirm price and access.',
    },
    tree_arborist: {
      label: 'Tree / arborist',
      field_hints: ['what to prune/remove', 'season constraints (e.g. Oak Wilt)', 'budget'],
      outreach_notes: 'Confirm season rules and cleanup inclusions.',
    },
    general: {
      label: 'House service (general)',
      field_hints: ['what you need', 'budget', 'timing'],
      outreach_notes: 'Confirm scope, price, and schedule.',
    },
  };
  return profiles[kind] || profiles.general;
}

/**
 * Stable workflow template (no instance). For host LLM to explain the process
 * before or during a job — mobile-friendly structured payload.
 */
export function getWorkflowTemplate(opts?: { service_kind?: string }) {
  const profile = getServiceProfile(opts?.service_kind);
  const definition = getHouseServiceDefinition();
  const steps = definition.steps.map(s => ({
    n: s.n,
    id: s.id,
    label: s.label,
    type: s.type,
    you_do: s.you_do,
    app_does: s.app_does,
    gates: s.gates,
  }));
  const strip = steps.map(s => `○ ${s.label}`).join(' · ');
  const diagrams = buildDiagrams({
    steps: HOUSE_SERVICE_V1_STEPS.map((s, i) => ({ id: s.id, label: s.label, n: i + 1 })),
  });
  /** @deprecated prefer diagrams.text — kept for existing hosts/tests */
  const diagram = diagrams.text;

  return {
    kind: 'workflow_template' as const,
    format: definition.format,
    format_version: definition.format_version,
    workflow_id: WORKFLOW_ID,
    workflow_version: WORKFLOW_VERSION,
    service_kind: opts?.service_kind || null,
    service_profile: profile,
    /** Validated totbox.workflow_def (source of truth for the spine) */
    definition,
    /** One-line map for any screen */
    diagram,
    /** Text + Mermaid projections */
    diagrams,
    strip,
    steps,
    principles: {
      consumer_control: 'You approve send, address sharing, and money/time. The app does not go dark on you.',
      transparency: 'Ask anytime: general workflow, this service type, or this job id.',
      privacy: 'Address and contacts stay local; never invent PII; no public vendor directory.',
      safety: 'Safety before convenience — more explicit approvals in early product.',
      host_first: 'Your host AI uses your memory and tools first; Totbox is the checklist PM.',
    },
    how_to_inspect: {
      general: 'Call get_workflow (no args) or get_workflow({ scope: "template" })',
      by_service: 'Call get_workflow({ service_kind: "hvac" | "cleaning" | "tree_arborist" })',
      instance: 'Call get_workflow({ job_id }) or get_job({ job_id }) — see progress strip + roles',
      list: 'Call list_jobs — each item includes progress.summary and progress.strip',
    },
    doc: 'docs/workflows/house_service_v1.md',
    format_doc: 'docs/workflows/format.md',
    /** Host LLM: render strip + current role_line to the user on mobile/desktop */
    host_render_hint:
      'Show the strip on one line. Below it, show role_line (You: … / App: …). Prefer progress.diagrams.mermaid or definition when the host can render diagrams. Offer “Where am I?” anytime via get_workflow(job_id).',
  };
}

/** Redact street-level address from nested next_action payloads (consumer inspect). */
function redactDeveloperForInspect(dev: ReturnType<typeof getWorkflowProgress>['developer']) {
  const na = dev.next_action;
  if (!na) return { ...dev, next_action: na };
  const placeholders = na.placeholders
    ? {
        ...na.placeholders,
        service_address:
          na.placeholders.service_address != null && na.placeholders.service_address !== ''
            ? '[on_file]'
            : na.placeholders.service_address,
      }
    : na.placeholders;
  const draftSkeleton =
    typeof na.draftSkeleton === 'string'
      ? na.draftSkeleton.replace(/Service address:\s*.*$/gim, 'Service address: [on_file]')
      : na.draftSkeleton;
  return {
    ...dev,
    next_action: {
      ...na,
      placeholders,
      draftSkeleton,
    },
  };
}

/**
 * Unified inspect API: template, service-kind template, or job instance progress.
 * Prefer this for host LLM “show me the workflow” questions.
 */
export function describeWorkflow(opts?: {
  job_id?: string;
  service_kind?: string;
  scope?: 'template' | 'instance' | 'auto';
  /** When resolving instance, pass the job object */
  job?: Job;
}):
  | ReturnType<typeof getWorkflowTemplate>
  | {
      kind: 'workflow_instance';
      workflow_id: string;
      workflow_version: string;
      job_id: string;
      intent: string;
      service_kind: string;
      progress: ReturnType<typeof getWorkflowProgress>;
      privacy: {
        note: string;
        has_service_address: boolean;
        address_value_redacted: true;
      };
      control: {
        you_are_in_control: true;
        next_needs_you: boolean;
        can_cancel: true;
      };
      host_render_hint: string;
    } {
  const scope = opts?.scope || (opts?.job_id || opts?.job ? 'instance' : 'template');

  if (scope === 'instance' || opts?.job) {
    const job = opts?.job;
    if (!job) {
      throw new Error('job required for instance scope');
    }
    const progressRaw = getWorkflowProgress(job);
    const progress = {
      ...progressRaw,
      developer: redactDeveloperForInspect(progressRaw.developer),
    };
    const needsYou = progress.steps.some(s => s.state === 'needs_you' || s.state === 'blocked');
    return {
      kind: 'workflow_instance',
      workflow_id: WORKFLOW_ID,
      workflow_version: WORKFLOW_VERSION,
      job_id: job.id,
      intent: job.intent,
      service_kind: job.serviceKind,
      progress,
      privacy: {
        note: 'Full street address is not echoed here — only whether it is on file. Host may use update_job_facts/get_job only after user intent; never paste address into chat unless user is reviewing a send draft.',
        has_service_address: !!job.facts?.service_address,
        address_value_redacted: true,
      },
      control: {
        you_are_in_control: true,
        next_needs_you: needsYou,
        can_cancel: true,
      },
      host_render_hint:
        'Show progress.strip and progress.role_line prominently. If next_needs_you, highlight the approval the user must give. Optional: progress.diagrams.mermaid for hosts that render Mermaid. Offer developer drill-down only if user asks “under the hood”. Do not display raw street address from tools unless user is approving a draft that intentionally includes it.',
    };
  }

  return getWorkflowTemplate({ service_kind: opts?.service_kind });
}
