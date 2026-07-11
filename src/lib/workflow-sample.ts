/**
 * Demo snapshots for consumer workflow transparency UI.
 * Built with the same progress helpers as live jobs — no fake alternate logic.
 */

import type { Job } from './job-types';
import {
  WORKFLOW_ID,
  WORKFLOW_VERSION,
  getWorkflowProgress,
  getWorkflowTemplate,
  describeWorkflow,
  HOUSE_SERVICE_V1_STEPS,
} from './workflow-progress';

/** In-memory demo job mid-flight: user must approve the outreach email. */
export function buildDemoJobNeedsSendApproval(): Job {
  const t = new Date().toISOString();
  return {
    id: 'job_demo_hvac_sample',
    createdAt: t,
    updatedAt: t,
    workflowId: WORKFLOW_ID,
    workflowVersion: WORKFLOW_VERSION,
    intent: 'AC maintenance under $300 in the next 2 weeks',
    serviceKind: 'hvac',
    status: 'awaiting_user_approval',
    facts: {
      budgetUsd: 300,
      service_address: 'ON_FILE', // value not shown in consumer progress strip
      dateWindow: 'next_2_weeks',
    },
    providerContact: {
      label: 'Demo Metro Air Care',
      email: 'demo@example.com',
    },
    checklist: [
      { id: 'brief', label: 'Capture job brief', required: true, done: true, doneAt: t },
      { id: 'address', label: 'Resolve service address', required: true, done: true, doneAt: t },
      { id: 'provider_contact', label: 'Resolve provider contact', required: true, done: true, doneAt: t },
      { id: 'draft_outreach', label: 'Draft outreach', required: true, done: true, doneAt: t },
      { id: 'send_outreach', label: 'Send outreach', required: true, done: false },
      { id: 'provider_reply', label: 'Ingest provider reply', required: true, done: false },
      { id: 'user_decision', label: 'User approves quote/time', required: true, done: false },
      { id: 'scheduled', label: 'Appointment confirmed', required: true, done: false },
      { id: 'settle', label: 'Post-service note', required: false, done: false },
    ],
    blocks: [],
    nextAction: {
      type: 'await_user_approval',
      channel: 'email',
      instructionsForHostLlm: 'Present draft to user; on approve call record_user_approval then send.',
      preferredHostTools: ['gmail', 'ask_user'],
      requiresUserApproval: true,
      approvalKind: 'send_message',
      draftSkeleton: 'Hi Demo Metro Air Care, …',
    },
    pendingDraft: {
      body: 'Hi Demo Metro Air Care,\n\nI would like to schedule an HVAC maintenance visit in the next 2 weeks, budget around $300. Please confirm availability and what is included.\n\nThanks',
      channel: 'email',
      to: 'demo@example.com',
      templateId: 'hvac_outreach_v1',
    },
    approvals: [],
    audit: [
      {
        id: 'aud_demo_1',
        at: t,
        type: 'job_started',
        detail: 'Demo sample job for workflow UI',
      },
    ],
    messages: [],
    quotes: [],
    safetyPolicy: {
      requireExplicitApprovalForSideEffects: true,
      approvalScopeDefault: 'once',
    },
  };
}

/** Sample bundle for the public demo page + host LLM examples. */
export function getConsumerWorkflowSample() {
  const template = getWorkflowTemplate({ service_kind: 'hvac' });
  const job = buildDemoJobNeedsSendApproval();
  const progress = getWorkflowProgress(job);
  const instance = describeWorkflow({ job, scope: 'instance' });

  return {
    title: 'Your house service — always visible',
    subtitle: 'Same simple path for AC, cleaning, tree work, and more. Tap a step to see your role and the app’s role.',
    template: {
      workflow_id: template.workflow_id,
      workflow_version: template.workflow_version,
      diagram: template.diagram,
      strip: template.strip,
      steps: template.steps,
      principles: template.principles,
      service_profile: template.service_profile,
    },
    sample_job: {
      job_id: job.id,
      intent: job.intent,
      service_kind: job.serviceKind,
      // Consumer-safe instance inspect (address redacted)
      inspect: instance,
      progress,
      /** Friendly draft preview for the “Send” step sample (no real send) */
      draft_preview: {
        to: 'Demo Metro Air Care',
        channel: 'email',
        subject: 'HVAC maintenance request',
        body: job.pendingDraft?.body,
        note: 'Sample only — nothing is sent until you approve on a real job.',
      },
    },
    legend: {
      done: 'Finished',
      needs_you: 'Needs your OK',
      current: 'In progress',
      upcoming: 'Not yet',
      blocked: 'Waiting on missing info',
    },
    step_count: HOUSE_SERVICE_V1_STEPS.length,
    doc: 'docs/workflows/house_service_v1.md',
  };
}
