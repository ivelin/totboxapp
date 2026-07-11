/**
 * totbox.workflow_def / totbox.workflow_progress — interchange formats.
 * JSON is source of truth; Mermaid and text diagrams are projections.
 * @see docs/workflows/format.md
 */

import { z } from 'zod';

/** Interchange format ids (not the product workflow_id). */
export const WORKFLOW_DEF_FORMAT = 'totbox.workflow_def' as const;
export const WORKFLOW_PROGRESS_FORMAT = 'totbox.workflow_progress' as const;
/** Schema / envelope version for both formats. */
export const WORKFLOW_FORMAT_VERSION = '1.0' as const;

export const ConsumerStepIdSchema = z.enum([
  'describe',
  'details',
  'contact',
  'send',
  'hear_back',
  'choose',
  'booked',
  'done',
]);
export type ConsumerStepId = z.infer<typeof ConsumerStepIdSchema>;

export const StepVisualStateSchema = z.enum([
  'done',
  'current',
  'upcoming',
  'needs_you',
  'blocked',
]);
export type StepVisualState = z.infer<typeof StepVisualStateSchema>;

/** BPMN-aligned activity type (subset — not full BPMN). */
export const BpmnStepTypeSchema = z.enum(['userTask', 'serviceTask', 'none']);
export type BpmnStepType = z.infer<typeof BpmnStepTypeSchema>;

/** Safety approval kinds that may apply at a step (see host_llm_safety). */
export const WorkflowGateSchema = z.enum([
  'send_message',
  'share_pii',
  'commit_money_or_time',
  'general',
]);
export type WorkflowGate = z.infer<typeof WorkflowGateSchema>;

export const WorkflowDefStepSchema = z.object({
  n: z.number().int().positive(),
  id: ConsumerStepIdSchema,
  label: z.string().min(1),
  type: BpmnStepTypeSchema,
  you_do: z.string().min(1),
  app_does: z.string().min(1),
  checklist_ids: z.array(z.string()),
  gates: z.array(WorkflowGateSchema).default([]),
});
export type WorkflowDefStep = z.infer<typeof WorkflowDefStepSchema>;

export const WorkflowEdgeSchema = z.object({
  from: ConsumerStepIdSchema,
  to: ConsumerStepIdSchema,
});
export type WorkflowEdge = z.infer<typeof WorkflowEdgeSchema>;

export const WorkflowDefinitionSchema = z.object({
  format: z.literal(WORKFLOW_DEF_FORMAT),
  format_version: z.literal(WORKFLOW_FORMAT_VERSION),
  workflow_id: z.string().min(1),
  workflow_version: z.string().min(1),
  semantics: z.literal('bpmn_sequence_subset'),
  topology: z.literal('linear_spine'),
  steps: z.array(WorkflowDefStepSchema).min(1).max(8),
  edges: z.array(WorkflowEdgeSchema),
});
export type WorkflowDefinition = z.infer<typeof WorkflowDefinitionSchema>;

export const WorkflowProgressStepSchema = z.object({
  id: ConsumerStepIdSchema,
  label: z.string().min(1),
  state: StepVisualStateSchema,
  you_do: z.string().min(1),
  app_does: z.string().min(1),
});
export type WorkflowProgressStep = z.infer<typeof WorkflowProgressStepSchema>;

export const WorkflowDiagramsSchema = z.object({
  /** One-line arrow map */
  text: z.string(),
  /** Mermaid flowchart source (projection) */
  mermaid: z.string(),
});
export type WorkflowDiagrams = z.infer<typeof WorkflowDiagramsSchema>;

/**
 * Core consumer progress fields. `developer` stays loosely typed so job PM
 * can evolve checklist/next_action without breaking the format envelope.
 */
export const WorkflowProgressCoreSchema = z.object({
  format: z.literal(WORKFLOW_PROGRESS_FORMAT),
  format_version: z.literal(WORKFLOW_FORMAT_VERSION),
  workflow_id: z.string().min(1),
  workflow_version: z.string().min(1),
  service_kind: z.string().optional(),
  summary: z.string(),
  strip: z.string(),
  role_line: z.string(),
  current_step_id: ConsumerStepIdSchema,
  steps: z.array(WorkflowProgressStepSchema).min(1).max(8),
  diagrams: WorkflowDiagramsSchema.optional(),
  developer: z.record(z.unknown()).optional(),
});
export type WorkflowProgressCore = z.infer<typeof WorkflowProgressCoreSchema>;

/** Linear sequence edges from ordered step ids. */
export function linearEdges(stepIds: ConsumerStepId[]): WorkflowEdge[] {
  const edges: WorkflowEdge[] = [];
  for (let i = 0; i < stepIds.length - 1; i++) {
    edges.push({ from: stepIds[i], to: stepIds[i + 1] });
  }
  return edges;
}

export interface StepDefInput {
  id: ConsumerStepId;
  label: string;
  youDo: string;
  appDoes: string;
  checklistIds: string[];
  bpmnType: BpmnStepType;
  gates?: WorkflowGate[];
}

/** Build a validated workflow definition from ordered step defs. */
export function buildWorkflowDefinition(opts: {
  workflow_id: string;
  workflow_version: string;
  steps: StepDefInput[];
}): WorkflowDefinition {
  if (opts.steps.length === 0 || opts.steps.length > 8) {
    throw new Error('workflow spine must have 1–8 steps');
  }
  const steps: WorkflowDefStep[] = opts.steps.map((s, i) => ({
    n: i + 1,
    id: s.id,
    label: s.label,
    type: s.bpmnType,
    you_do: s.youDo,
    app_does: s.appDoes,
    checklist_ids: s.checklistIds,
    gates: s.gates ?? [],
  }));
  const def: WorkflowDefinition = {
    format: WORKFLOW_DEF_FORMAT,
    format_version: WORKFLOW_FORMAT_VERSION,
    workflow_id: opts.workflow_id,
    workflow_version: opts.workflow_version,
    semantics: 'bpmn_sequence_subset',
    topology: 'linear_spine',
    steps,
    edges: linearEdges(steps.map(s => s.id)),
  };
  return WorkflowDefinitionSchema.parse(def);
}

/** One-line text diagram: `1.Describe → 2.Details → …` */
export function toTextDiagram(steps: { n?: number; label: string }[]): string {
  return steps
    .map((s, i) => `${s.n ?? i + 1}.${s.label}`)
    .join(' → ');
}

/** Safe Mermaid node id (already constrained to snake_case step ids). */
function mermaidNodeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Mermaid flowchart projection. Optional progress steps color the focus node.
 * Not a second source of truth — regenerate from definition/progress.
 */
export function toMermaid(opts: {
  steps: { id: string; label: string }[];
  /** If provided, style focus states on the graph */
  progressSteps?: { id: string; state: StepVisualState }[];
  direction?: 'LR' | 'TD';
}): string {
  const direction = opts.direction ?? 'LR';
  const lines: string[] = [`flowchart ${direction}`];

  for (const s of opts.steps) {
    const nid = mermaidNodeId(s.id);
    // Escape brackets in labels for Mermaid node text
    const label = s.label.replace(/[[\]]/g, '');
    lines.push(`  ${nid}[${label}]`);
  }

  for (let i = 0; i < opts.steps.length - 1; i++) {
    const a = mermaidNodeId(opts.steps[i].id);
    const b = mermaidNodeId(opts.steps[i + 1].id);
    lines.push(`  ${a} --> ${b}`);
  }

  if (opts.progressSteps?.length) {
    const byId = new Map(opts.progressSteps.map(s => [s.id, s.state]));
    for (const s of opts.steps) {
      const state = byId.get(s.id);
      if (!state || state === 'upcoming') continue;
      const nid = mermaidNodeId(s.id);
      if (state === 'done') {
        lines.push(`  style ${nid} fill:#d1fae5,stroke:#059669`);
      } else if (state === 'needs_you') {
        lines.push(`  style ${nid} fill:#fef3c7,stroke:#d97706`);
      } else if (state === 'blocked') {
        lines.push(`  style ${nid} fill:#fee2e2,stroke:#dc2626`);
      } else if (state === 'current') {
        lines.push(`  style ${nid} fill:#dbeafe,stroke:#2563eb`);
      }
    }
  }

  return lines.join('\n');
}

/** Build both diagram projections from ordered labels + optional progress. */
export function buildDiagrams(opts: {
  steps: { id: string; label: string; n?: number }[];
  progressSteps?: { id: string; state: StepVisualState }[];
}): WorkflowDiagrams {
  return {
    text: toTextDiagram(opts.steps),
    mermaid: toMermaid({
      steps: opts.steps,
      progressSteps: opts.progressSteps,
    }),
  };
}

export function parseWorkflowDefinition(data: unknown): WorkflowDefinition {
  return WorkflowDefinitionSchema.parse(data);
}

export function parseWorkflowProgressCore(data: unknown): WorkflowProgressCore {
  return WorkflowProgressCoreSchema.parse(data);
}
