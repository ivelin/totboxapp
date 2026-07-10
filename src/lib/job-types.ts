// House-service job PM types (host-LLM-first, safety-gated)

import { z } from 'zod';

export const JobStatusSchema = z.enum([
  'intake',
  'planning',
  'drafting_outreach',
  'awaiting_user_approval',
  'outbound_sent',
  'awaiting_provider_reply',
  'negotiating',
  'awaiting_user_decision',
  'scheduled',
  'in_progress',
  'settling',
  'done',
  'blocked',
  'cancelled',
]);
export type JobStatus = z.infer<typeof JobStatusSchema>;

export const ServiceKindSchema = z.enum(['hvac', 'cleaning', 'tree_arborist', 'other']);
export type ServiceKind = z.infer<typeof ServiceKindSchema>;

export const ChecklistItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  required: z.boolean().default(true),
  done: z.boolean().default(false),
  doneAt: z.string().optional(),
});
export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;

export const BlockSchema = z.object({
  code: z.string(),
  message: z.string(),
  askUser: z.boolean().default(true),
  askHost: z.boolean().default(true),
  field: z.string().optional(),
  /** Prefer host tools first (memory, Gmail, Voximplant, etc.) */
  preferHostCapability: z
    .enum([
      'memory_or_user',
      'email',
      'sms',
      'voice_call',
      'calendar',
      'web_search',
      'none',
    ])
    .default('none'),
});
export type Block = z.infer<typeof BlockSchema>;

export const NextActionSchema = z.object({
  type: z.enum([
    'collect_field_via_host',
    'draft_for_user_approval',
    'await_user_approval',
    'send_via_host_or_fallback',
    'await_provider_reply',
    'ingest_and_extract',
    'user_decision',
    'confirm_appointment',
    'mark_done',
    'done',
  ]),
  channel: z.enum(['email', 'sms', 'voice', 'none']).optional(),
  instructionsForHostLlm: z.string(),
  /** Host should try these tools first if available in user environment */
  preferredHostTools: z.array(z.string()).default([]),
  /** If host lacks tools, Totbox fallback mode */
  totboxFallback: z
    .object({
      mode: z.enum(['dry_run_record', 'record_only', 'unavailable']),
      description: z.string(),
    })
    .optional(),
  requiresUserApproval: z.boolean().default(true),
  templateId: z.string().optional(),
  draftSkeleton: z.string().optional(),
  placeholders: z.record(z.unknown()).optional(),
  approvalKind: z
    .enum([
      'share_pii',
      'send_message',
      'commit_money_or_time',
      'use_host_tool',
      'general',
    ])
    .optional(),
});
export type NextAction = z.infer<typeof NextActionSchema>;

export const ApprovalRecordSchema = z.object({
  id: z.string(),
  at: z.string(),
  kind: z.string(),
  summary: z.string(),
  granted: z.boolean(),
  scope: z.enum(['once', 'session', 'always_ask']).default('once'),
  actor: z.literal('user').default('user'),
});
export type ApprovalRecord = z.infer<typeof ApprovalRecordSchema>;

export const AuditEventSchema = z.object({
  id: z.string(),
  at: z.string(),
  type: z.string(),
  detail: z.string(),
  meta: z.record(z.unknown()).optional(),
});
export type AuditEvent = z.infer<typeof AuditEventSchema>;

export const JobMessageSchema = z.object({
  id: z.string(),
  at: z.string(),
  direction: z.enum(['outbound', 'inbound']),
  channel: z.enum(['email', 'sms', 'voice', 'note']),
  body: z.string(),
  to: z.string().optional(),
  from: z.string().optional(),
  dryRun: z.boolean().default(false),
  approved: z.boolean().default(false),
});
export type JobMessage = z.infer<typeof JobMessageSchema>;

export const JobQuoteSchema = z.object({
  id: z.string(),
  providerLabel: z.string().optional(),
  priceFromUsd: z.number().optional(),
  notes: z.string().optional(),
  raw: z.string().optional(),
});
export type JobQuote = z.infer<typeof JobQuoteSchema>;

export const JobSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  intent: z.string(),
  serviceKind: ServiceKindSchema,
  status: JobStatusSchema,
  /** Facts collected (address, etc.) — local only */
  facts: z.record(z.unknown()).default({}),
  providerContact: z
    .object({
      label: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  checklist: z.array(ChecklistItemSchema),
  blocks: z.array(BlockSchema).default([]),
  nextAction: NextActionSchema.optional(),
  pendingDraft: z
    .object({
      body: z.string(),
      channel: z.enum(['email', 'sms', 'voice']),
      to: z.string().optional(),
      templateId: z.string().optional(),
    })
    .optional(),
  approvals: z.array(ApprovalRecordSchema).default([]),
  audit: z.array(AuditEventSchema).default([]),
  messages: z.array(JobMessageSchema).default([]),
  quotes: z.array(JobQuoteSchema).default([]),
  scheduledAt: z.string().optional(),
  safetyPolicy: z
    .object({
      /** Early product: always explicit approvals for side effects */
      requireExplicitApprovalForSideEffects: z.boolean().default(true),
      approvalScopeDefault: z.enum(['once', 'session', 'always_ask']).default('once'),
    })
    .default({
      requireExplicitApprovalForSideEffects: true,
      approvalScopeDefault: 'once',
    }),
});
export type Job = z.infer<typeof JobSchema>;
