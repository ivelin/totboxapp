/**
 * House-service Job Project Manager
 * - Durable checklist + next_action for host LLM (no Totbox-side model)
 * - Safety-first: side effects require recorded user approval
 * - Host capability first, Totbox dry-run/record fallback
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  Job,
  ServiceKind,
  ChecklistItem,
  NextAction,
  Block,
  ApprovalRecord,
  AuditEvent,
} from './job-types';
import { getWorkflowProgress } from './workflow-progress';

const DATA_DIR = path.join(process.cwd(), '.data');
/** Vitest workers must not share one jobs.json (parallel clobber → "job not found"). */
const JOBS_FILE =
  process.env.TOTBOX_JOBS_FILE ||
  (process.env.VITEST
    ? path.join(DATA_DIR, `jobs-test-${process.env.VITEST_WORKER_ID || process.pid}.json`)
    : path.join(DATA_DIR, 'jobs.json'));

/** When true, never read/write disk (unit tests that call resetJobs stay isolated). */
const MEMORY_ONLY = process.env.TOTBOX_JOBS_MEMORY === '1' || !!process.env.VITEST;

let jobs: Job[] = [];

function ensureDataDir() {
  if (MEMORY_ONLY) return;
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadJobs() {
  if (MEMORY_ONLY) return;
  ensureDataDir();
  if (!fs.existsSync(JOBS_FILE)) return;
  try {
    const raw = JSON.parse(fs.readFileSync(JOBS_FILE, 'utf8'));
    if (Array.isArray(raw)) jobs = raw as Job[];
  } catch {
    /* keep in-memory */
  }
}

function saveJobs() {
  if (MEMORY_ONLY) return;
  ensureDataDir();
  fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2));
}

loadJobs();

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}_${crypto.randomBytes(5).toString('hex')}`;
}

function audit(job: Job, type: string, detail: string, meta?: Record<string, unknown>) {
  const ev: AuditEvent = { id: id('aud'), at: now(), type, detail, meta };
  job.audit.push(ev);
  job.updatedAt = now();
}

export function resetJobs() {
  jobs = [];
  saveJobs();
}

export function listJobs(): Job[] {
  loadJobs();
  return [...jobs];
}

export function getJob(jobId: string): Job | undefined {
  loadJobs();
  return jobs.find(j => j.id === jobId);
}

function upsert(job: Job) {
  const i = jobs.findIndex(j => j.id === job.id);
  if (i >= 0) jobs[i] = job;
  else jobs.push(job);
  saveJobs();
  return job;
}

function inferServiceKind(text: string): ServiceKind {
  const t = text.toLowerCase();
  if (/\b(ac|hvac|air condition|furnace|tune-?up)\b/.test(t)) return 'hvac';
  if (/\b(clean|maid|housekeep)\b/.test(t)) return 'cleaning';
  if (/\b(tree|arbor|prune|oak wilt)\b/.test(t)) return 'tree_arborist';
  return 'other';
}

function checklistFor(kind: ServiceKind): ChecklistItem[] {
  const base = (items: Array<{ id: string; label: string; required?: boolean }>): ChecklistItem[] =>
    items.map(it => ({
      id: it.id,
      label: it.label,
      required: it.required !== false,
      done: false,
    }));

  if (kind === 'hvac') {
    return base([
      { id: 'brief', label: 'Capture job brief (maintenance vs repair, urgency, budget)' },
      { id: 'address', label: 'Resolve service address (host memory → ask user)' },
      { id: 'provider_contact', label: 'Resolve provider contact (external discovery / user)' },
      { id: 'draft_outreach', label: 'Draft outreach for host LLM + user approval' },
      { id: 'send_outreach', label: 'Send outreach (host tool preferred; dry-run fallback)' },
      { id: 'provider_reply', label: 'Ingest provider reply / quote' },
      { id: 'user_decision', label: 'User approves quote/time if needed' },
      { id: 'scheduled', label: 'Appointment confirmed' },
      { id: 'settle', label: 'Note completion / invoice / next due', required: false },
    ]);
  }
  if (kind === 'cleaning') {
    return base([
      { id: 'brief', label: 'Capture cleaning brief (priorities, duration, budget)' },
      { id: 'address', label: 'Resolve service address (host memory → ask user)' },
      { id: 'provider_contact', label: 'Resolve provider contact' },
      { id: 'draft_outreach', label: 'Draft outreach with priority list' },
      { id: 'send_outreach', label: 'Send outreach after approval' },
      { id: 'provider_reply', label: 'Ingest quote / availability' },
      { id: 'user_decision', label: 'User approves option/time' },
      { id: 'scheduled', label: 'Service scheduled' },
      { id: 'settle', label: 'Post-service note', required: false },
    ]);
  }
  return base([
    { id: 'brief', label: 'Capture brief' },
    { id: 'address', label: 'Resolve address if needed' },
    { id: 'provider_contact', label: 'Resolve provider contact' },
    { id: 'draft_outreach', label: 'Draft outreach' },
    { id: 'send_outreach', label: 'Send after approval' },
    { id: 'provider_reply', label: 'Ingest reply' },
    { id: 'scheduled', label: 'Scheduled' },
  ]);
}

function markDone(job: Job, itemId: string) {
  const item = job.checklist.find(c => c.id === itemId);
  if (item && !item.done) {
    item.done = true;
    item.doneAt = now();
  }
}

function isDone(job: Job, itemId: string) {
  return !!job.checklist.find(c => c.id === itemId)?.done;
}

function templateFor(kind: ServiceKind): { id: string; skeleton: string; placeholders: Record<string, unknown> } {
  if (kind === 'cleaning') {
    return {
      id: 'cleaning_outreach_v1',
      skeleton:
        'Hi {{provider_name}},\n\nI would like to schedule a house cleaning.\nPriorities: {{priorities}}\nPreferred windows: {{windows}}\nBudget notes: {{budget}}\nService address: {{service_address}}\n\nPlease confirm availability and price.\n\nThanks',
      placeholders: {
        provider_name: null,
        priorities: null,
        windows: null,
        budget: null,
        service_address: null,
      },
    };
  }
  return {
    id: 'hvac_outreach_v1',
    skeleton:
      'Hi {{provider_name}},\n\nI am requesting an HVAC {{visit_type}} visit.\nUrgency: {{urgency}}\nNotes: {{problem_or_maintenance_notes}}\nHome/system notes: {{system_notes}}\nPreferred windows: {{windows}}\nBudget ceiling: {{budget}}\nService address: {{service_address}}\n\nPlease confirm availability, price, and what is included.\n\nThanks',
    placeholders: {
      provider_name: null,
      visit_type: 'maintenance',
      urgency: 'maintenance',
      problem_or_maintenance_notes: null,
      system_notes: null,
      windows: null,
      budget: null,
      service_address: null,
    },
  };
}

/** Recompute blocks + next_action from job facts (validation gate). */
export function recomputeNextAction(job: Job): Job {
  if (job.status === 'done' || job.status === 'cancelled') {
    job.nextAction = {
      type: 'done',
      instructionsForHostLlm: 'Job is closed. Summarize outcome for the user.',
      preferredHostTools: [],
      requiresUserApproval: false,
    };
    job.blocks = [];
    return job;
  }

  const blocks: Block[] = [];
  const facts = job.facts || {};

  // Step: brief always started at create
  if (!isDone(job, 'brief')) markDone(job, 'brief');

  // Address required before outreach for home visits
  if (!facts.service_address && !isDone(job, 'address')) {
    blocks.push({
      code: 'missing_service_address',
      message: 'Service address required before sharing with a provider.',
      askUser: true,
      askHost: true,
      field: 'service_address',
      preferHostCapability: 'memory_or_user',
    });
  } else if (facts.service_address && !isDone(job, 'address')) {
    markDone(job, 'address');
  }

  if (!job.providerContact?.email && !job.providerContact?.phone && !isDone(job, 'provider_contact')) {
    blocks.push({
      code: 'missing_provider_contact',
      message: 'Provider email or phone required (from user or host web search—not a Totbox directory).',
      askUser: true,
      askHost: true,
      field: 'provider_contact',
      preferHostCapability: 'web_search',
    });
  } else if ((job.providerContact?.email || job.providerContact?.phone) && !isDone(job, 'provider_contact')) {
    markDone(job, 'provider_contact');
  }

  // Hard block: cannot advance past address/contact until resolved
  if (blocks.some(b => b.code === 'missing_service_address' || b.code === 'missing_provider_contact')) {
    job.status = 'blocked';
    job.blocks = blocks;
    const b = blocks[0];
    job.nextAction = {
      type: 'collect_field_via_host',
      instructionsForHostLlm:
        `HOST-FIRST: Try host memory/tools for "${b.field}". If unknown, ask the user once. ` +
        `Then call resolve_block or update_job_facts with the value. Do NOT invent PII. ` +
        `Safety: sharing address requires user awareness (explicit approval on send).`,
      preferredHostTools:
        b.preferHostCapability === 'memory_or_user'
          ? ['host_memory', 'user_profile', 'ask_user']
          : b.preferHostCapability === 'web_search'
            ? ['web_search', 'ask_user']
            : ['ask_user'],
      totboxFallback: {
        mode: 'record_only',
        description: 'Totbox cannot discover city vendors; user/host must supply contact/address.',
      },
      requiresUserApproval: true,
      approvalKind: b.code === 'missing_service_address' ? 'share_pii' : 'general',
      placeholders: { field: b.field, code: b.code },
    };
    return job;
  }

  job.blocks = [];

  // Pending draft awaiting approval
  if (job.pendingDraft && job.status === 'awaiting_user_approval') {
    job.nextAction = {
      type: 'await_user_approval',
      channel: job.pendingDraft.channel,
      instructionsForHostLlm:
        'Present the pending draft to the user. On approval, call record_user_approval then approve_and_send_message (dryRun:true unless user configures real send). ' +
        'HOST-FIRST for send: if user has Gmail/SMS/voice MCP (e.g. Voximplant), ask permission to use it and return structured result via record_outbound. ' +
        'If host has no channel tool, use Totbox dry_run_record fallback.',
      preferredHostTools: ['gmail', 'email', 'sms', 'voximplant', 'voice', 'ask_user'],
      totboxFallback: {
        mode: 'dry_run_record',
        description: 'Totbox records outbound as dry-run without network send unless a local adapter is configured.',
      },
      requiresUserApproval: true,
      approvalKind: 'send_message',
      draftSkeleton: job.pendingDraft.body,
    };
    return job;
  }

  // Need draft
  if (!isDone(job, 'draft_outreach') && !job.pendingDraft) {
    const tpl = templateFor(job.serviceKind);
    job.status = 'drafting_outreach';
    const ph = { ...tpl.placeholders };
    ph.service_address = facts.service_address ?? null;
    ph.budget = facts.budgetUsd ?? facts.budget ?? null;
    ph.priorities = facts.priorities ?? null;
    ph.windows = facts.windows ?? facts.dateWindow ?? null;
    ph.provider_name = job.providerContact?.label ?? null;
    ph.urgency = facts.urgency ?? (job.serviceKind === 'hvac' ? 'maintenance' : null);
    ph.visit_type = facts.visit_type ?? 'maintenance';
    ph.problem_or_maintenance_notes = facts.notes ?? job.intent;
    ph.system_notes = facts.system_notes ?? null;

    job.nextAction = {
      type: 'draft_for_user_approval',
      channel: job.providerContact?.email ? 'email' : job.providerContact?.phone ? 'sms' : 'email',
      templateId: tpl.id,
      draftSkeleton: tpl.skeleton,
      placeholders: ph,
      instructionsForHostLlm:
        'Fill the draft skeleton using host memory and job facts. Never invent address, gate codes, or payment. ' +
        'Show the full draft to the user. Then call submit_draft_for_approval with the final body. ' +
        'Safety first: user must approve before any send.',
      preferredHostTools: ['host_memory', 'ask_user'],
      requiresUserApproval: true,
      approvalKind: 'send_message',
    };
    return job;
  }

  // Need send
  if (isDone(job, 'draft_outreach') && !isDone(job, 'send_outreach')) {
    job.status = 'awaiting_user_approval';
    job.nextAction = {
      type: 'send_via_host_or_fallback',
      channel: job.providerContact?.email ? 'email' : 'sms',
      instructionsForHostLlm:
        'HOST-FIRST: Prefer user-approved host email/SMS/voice tools. Ask user permission (once or always-ask per preference). ' +
        'After host send, call record_outbound with structured result. ' +
        'If no host channel tool, call approve_and_send_message with dryRun:true after record_user_approval(kind=send_message).',
      preferredHostTools: ['gmail', 'email', 'sms', 'voximplant', 'voice'],
      totboxFallback: {
        mode: 'dry_run_record',
        description: 'Dry-run records the message; no external send without configured adapter + approval.',
      },
      requiresUserApproval: true,
      approvalKind: 'send_message',
    };
    return job;
  }

  // Await / ingest reply
  if (isDone(job, 'send_outreach') && !isDone(job, 'provider_reply')) {
    job.status = 'awaiting_provider_reply';
    job.nextAction = {
      type: 'await_provider_reply',
      channel: 'email',
      instructionsForHostLlm:
        'HOST-FIRST: Check user email/SMS tools for a provider reply (ask permission if needed). ' +
        'Paste or pass raw text to ingest_provider_message. Extract quote/times; call normalize_quote if applicable. ' +
        'If no host mail access, ask user to paste the reply.',
      preferredHostTools: ['gmail', 'email', 'sms', 'ask_user'],
      totboxFallback: {
        mode: 'record_only',
        description: 'User can paste reply; Totbox will not poll personal email without host tools.',
      },
      requiresUserApproval: false,
    };
    return job;
  }

  // User decision if quotes present
  if (isDone(job, 'provider_reply') && !isDone(job, 'user_decision') && job.checklist.some(c => c.id === 'user_decision')) {
    if (job.quotes.length > 0 || facts.needs_user_decision) {
      job.status = 'awaiting_user_decision';
      job.nextAction = {
        type: 'user_decision',
        instructionsForHostLlm:
          'Present quote/schedule options to the user. On decision, call resolve_block or confirm_appointment. Money/time commitments need explicit approval.',
        preferredHostTools: ['ask_user'],
        requiresUserApproval: true,
        approvalKind: 'commit_money_or_time',
      };
      return job;
    }
    markDone(job, 'user_decision');
  }

  if (isDone(job, 'provider_reply') && !isDone(job, 'scheduled')) {
    job.status = 'negotiating';
    job.nextAction = {
      type: 'confirm_appointment',
      instructionsForHostLlm:
        'Confirm final time with user (approval required). Then call confirm_appointment. Prefer host calendar tools if available.',
      preferredHostTools: ['calendar', 'ask_user'],
      totboxFallback: {
        mode: 'record_only',
        description: 'Record confirmed time on the job without external calendar write.',
      },
      requiresUserApproval: true,
      approvalKind: 'commit_money_or_time',
    };
    return job;
  }

  if (isDone(job, 'scheduled') && !isDone(job, 'settle')) {
    const settle = job.checklist.find(c => c.id === 'settle');
    if (settle && !settle.required) {
      markDone(job, 'settle');
    }
  }

  // All required done?
  const requiredLeft = job.checklist.filter(c => c.required && !c.done);
  if (requiredLeft.length === 0) {
    job.status = 'done';
    job.nextAction = {
      type: 'done',
      instructionsForHostLlm: 'Job complete. Summarize for user. Suggest optional next-due reminder.',
      preferredHostTools: [],
      requiresUserApproval: false,
    };
    audit(job, 'job_done', 'All required checklist items complete');
    return job;
  }

  job.status = 'planning';
  job.nextAction = {
    type: 'collect_field_via_host',
    instructionsForHostLlm: `Continue checklist; next open item: ${requiredLeft[0].label}`,
    preferredHostTools: ['ask_user'],
    requiresUserApproval: true,
  };
  return job;
}

export function startJob(input: {
  intent: string;
  serviceKind?: ServiceKind;
  facts?: Record<string, unknown>;
  providerContact?: Job['providerContact'];
}): Job {
  const serviceKind = input.serviceKind || inferServiceKind(input.intent);
  const t = now();
  let job: Job = {
    id: id('job'),
    createdAt: t,
    updatedAt: t,
    intent: input.intent,
    serviceKind,
    status: 'intake',
    facts: { ...(input.facts || {}) },
    providerContact: input.providerContact,
    checklist: checklistFor(serviceKind),
    blocks: [],
    approvals: [],
    audit: [],
    messages: [],
    quotes: [],
    safetyPolicy: {
      requireExplicitApprovalForSideEffects: true,
      approvalScopeDefault: 'once',
    },
  };
  audit(job, 'job_started', `Started ${serviceKind} job from intent`, { intent: input.intent });
  // Parse light facts from intent
  const budget = input.intent.match(/under\s*\$?\s*(\d+)/i) || input.intent.match(/\$\s*(\d+)/);
  if (budget && job.facts.budgetUsd == null) job.facts.budgetUsd = Number(budget[1]);
  const focus = input.intent.toLowerCase().match(/focusing on ([^.]+)/);
  if (focus && !job.facts.priorities) {
    job.facts.priorities = focus[1]
      .split(/,| and /)
      .map(s => s.trim())
      .filter(Boolean);
  }
  job = recomputeNextAction(job);
  return upsert(job);
}

export function updateJobFacts(
  jobId: string,
  facts: Record<string, unknown>,
  providerContact?: Job['providerContact']
): Job {
  const job = getJob(jobId);
  if (!job) throw new Error('job not found');
  job.facts = { ...job.facts, ...facts };
  if (providerContact) {
    job.providerContact = { ...job.providerContact, ...providerContact };
  }
  audit(job, 'facts_updated', 'Job facts/contact updated', { keys: Object.keys(facts) });
  return upsert(recomputeNextAction(job));
}

export function recordUserApproval(input: {
  jobId: string;
  kind: string;
  summary: string;
  granted: boolean;
  scope?: 'once' | 'session' | 'always_ask';
}): Job {
  const job = getJob(input.jobId);
  if (!job) throw new Error('job not found');
  const rec: ApprovalRecord = {
    id: id('appr'),
    at: now(),
    kind: input.kind,
    summary: input.summary,
    granted: input.granted,
    scope: input.scope || job.safetyPolicy.approvalScopeDefault,
    actor: 'user',
  };
  job.approvals.push(rec);
  audit(job, 'user_approval', `${input.granted ? 'GRANTED' : 'DENIED'}: ${input.kind}`, {
    summary: input.summary,
    scope: rec.scope,
  });
  return upsert(recomputeNextAction(job));
}

function hasGrant(job: Job, kind: string): boolean {
  return job.approvals.some(a => a.granted && a.kind === kind);
}

export function submitDraftForApproval(input: {
  jobId: string;
  body: string;
  channel?: 'email' | 'sms' | 'voice';
  to?: string;
}): Job {
  const job = getJob(input.jobId);
  if (!job) throw new Error('job not found');
  if (!isDone(job, 'address') || !job.facts.service_address) {
    throw new Error('cannot submit draft: service_address not resolved');
  }
  if (!job.providerContact?.email && !job.providerContact?.phone && !input.to) {
    throw new Error('cannot submit draft: provider contact missing');
  }
  job.pendingDraft = {
    body: input.body,
    channel: input.channel || (job.providerContact?.email ? 'email' : 'sms'),
    to: input.to || job.providerContact?.email || job.providerContact?.phone,
    templateId: job.nextAction?.templateId,
  };
  job.status = 'awaiting_user_approval';
  markDone(job, 'draft_outreach');
  audit(job, 'draft_submitted', 'Draft submitted for user approval');
  return upsert(recomputeNextAction(job));
}

/**
 * Side-effect send path. Default dryRun=true (safety).
 * Requires recorded approval for send_message when policy requires it.
 *
 * Real network send via Totbox is NOT implemented in early product.
 * - dryRun true (default): record only, honest dry-run
 * - hostPerformed true: host/Gmail/Voximplant already sent; we only record
 * - dryRun false without hostPerformed: REFUSED (never pretend a send happened)
 */
export function approveAndSendMessage(input: {
  jobId: string;
  dryRun?: boolean;
  body?: string;
  to?: string;
  channel?: 'email' | 'sms' | 'voice';
  /** Host already sent via Gmail/Voximplant etc. */
  hostPerformed?: boolean;
  hostResult?: Record<string, unknown>;
}): Job {
  const job = getJob(input.jobId);
  if (!job) throw new Error('job not found');
  const dryRun = input.dryRun !== false; // default true
  const hostPerformed = !!input.hostPerformed;
  const policy = job.safetyPolicy.requireExplicitApprovalForSideEffects;

  if (policy && !hasGrant(job, 'send_message')) {
    throw new Error('REFUSED: send_message requires record_user_approval(granted=true) first — safety before convenience');
  }

  // Never claim a live Totbox channel send without an adapter or host execution
  if (!dryRun && !hostPerformed) {
    throw new Error(
      'REFUSED: dryRun:false without hostPerformed is not supported — Totbox has no live send adapter yet. ' +
        'Use dryRun:true (record only) or hostPerformed:true after host Gmail/SMS/voice send. Never pretend a send happened.'
    );
  }

  const body = input.body || job.pendingDraft?.body;
  if (!body) throw new Error('no message body');
  const channel = input.channel || job.pendingDraft?.channel || 'email';
  const to = input.to || job.pendingDraft?.to;

  // Message is dry-run unless host actually performed the send
  const messageIsDryRun = !hostPerformed;

  job.messages.push({
    id: id('msg'),
    at: now(),
    direction: 'outbound',
    channel,
    body,
    to,
    dryRun: messageIsDryRun,
    approved: true,
  });

  markDone(job, 'send_outreach');
  job.pendingDraft = undefined;
  audit(
    job,
    hostPerformed ? 'outbound_host' : 'outbound_dry_run',
    hostPerformed
      ? 'Host environment performed send; recorded on job'
      : 'Dry-run outbound recorded (no network send — honest record only)',
    { to, channel, hostResult: input.hostResult, dryRun: messageIsDryRun }
  );
  job.status = 'awaiting_provider_reply';
  return upsert(recomputeNextAction(job));
}

export function recordOutbound(input: {
  jobId: string;
  body: string;
  channel?: 'email' | 'sms' | 'voice';
  to?: string;
  dryRun?: boolean;
  hostResult?: Record<string, unknown>;
}): Job {
  // Alias path when host already sent — still require approval in safety mode
  return approveAndSendMessage({
    jobId: input.jobId,
    body: input.body,
    channel: input.channel,
    to: input.to,
    dryRun: input.dryRun !== false,
    hostPerformed: true,
    hostResult: input.hostResult,
  });
}

export function ingestProviderMessage(input: {
  jobId: string;
  body: string;
  from?: string;
  channel?: 'email' | 'sms' | 'voice' | 'note';
}): Job {
  const job = getJob(input.jobId);
  if (!job) throw new Error('job not found');
  if (!isDone(job, 'send_outreach')) {
    throw new Error('cannot ingest provider reply before outreach send is complete');
  }

  job.messages.push({
    id: id('msg'),
    at: now(),
    direction: 'inbound',
    channel: input.channel || 'email',
    body: input.body,
    from: input.from,
    dryRun: false,
    approved: false,
  });

  // Lightweight deterministic extract hints (host LLM does full NLU)
  const price = input.body.match(/\$\s*(\d+)/);
  if (price) {
    job.quotes.push({
      id: id('quote'),
      providerLabel: job.providerContact?.label,
      priceFromUsd: Number(price[1]),
      raw: input.body,
      notes: 'auto-extracted price token; host should validate',
    });
  }

  markDone(job, 'provider_reply');
  audit(job, 'inbound_ingested', 'Provider message recorded', {
    hasPriceHint: !!price,
  });
  job.status = 'negotiating';
  return upsert(recomputeNextAction(job));
}

export function confirmAppointment(input: {
  jobId: string;
  scheduledAt: string;
}): Job {
  const job = getJob(input.jobId);
  if (!job) throw new Error('job not found');
  // Money/time commitment is a separate gate from send_message — never substitute
  if (job.safetyPolicy.requireExplicitApprovalForSideEffects && !hasGrant(job, 'commit_money_or_time')) {
    throw new Error(
      'REFUSED: confirm_appointment requires record_user_approval(kind=commit_money_or_time, granted=true) — ' +
        'send_message approval is not sufficient for scheduling commitments'
    );
  }
  if (!isDone(job, 'provider_reply')) {
    throw new Error('cannot confirm appointment before provider reply ingested');
  }
  job.scheduledAt = input.scheduledAt;
  markDone(job, 'user_decision');
  markDone(job, 'scheduled');
  job.status = 'scheduled';
  audit(job, 'appointment_confirmed', `Scheduled at ${input.scheduledAt}`);
  return upsert(recomputeNextAction(job));
}

export function suggestNextAction(jobId: string): { job: Job; nextAction: NextAction | undefined; blocks: Block[] } {
  let job = getJob(jobId);
  if (!job) throw new Error('job not found');
  job = upsert(recomputeNextAction(job));
  return { job, nextAction: job.nextAction, blocks: job.blocks };
}

/** Public snapshot for MCP/CLI without forcing host to re-read whole file */
export function jobPublicView(job: Job) {
  const progress = getWorkflowProgress(job);
  return {
    job_id: job.id,
    status: job.status,
    service_kind: job.serviceKind,
    intent: job.intent,
    /** Consumer-facing map (mobile-friendly strip + roles). Same spine for all house services. */
    progress,
    checklist: job.checklist,
    blocks: job.blocks,
    next_action: job.nextAction,
    facts_keys: Object.keys(job.facts || {}),
    has_service_address: !!job.facts?.service_address,
    provider_contact: job.providerContact
      ? {
          label: job.providerContact.label,
          has_email: !!job.providerContact.email,
          has_phone: !!job.providerContact.phone,
        }
      : null,
    pending_draft: job.pendingDraft
      ? { channel: job.pendingDraft.channel, to: job.pendingDraft.to, body_preview: job.pendingDraft.body.slice(0, 200) }
      : null,
    approvals: job.approvals,
    audit_tail: job.audit.slice(-8),
    messages_count: job.messages.length,
    quotes: job.quotes,
    scheduled_at: job.scheduledAt,
    safety: {
      principle: 'Safety before convenience. Explicit approvals for side effects in early product iterations.',
      require_explicit_approval_for_side_effects: job.safetyPolicy.requireExplicitApprovalForSideEffects,
    },
  };
}
