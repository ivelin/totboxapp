import { describe, it, expect } from 'vitest';
import {
  WORKFLOW_DEF_FORMAT,
  WORKFLOW_PROGRESS_FORMAT,
  WORKFLOW_FORMAT_VERSION,
  buildWorkflowDefinition,
  buildDiagrams,
  toMermaid,
  toTextDiagram,
  linearEdges,
  parseWorkflowDefinition,
  parseWorkflowProgressCore,
  WorkflowDefinitionSchema,
  type ConsumerStepId,
} from '../workflow-format';

const SPINE: {
  id: ConsumerStepId;
  label: string;
  youDo: string;
  appDoes: string;
  checklistIds: string[];
  bpmnType: 'userTask' | 'serviceTask';
  gates?: ('send_message' | 'share_pii' | 'commit_money_or_time' | 'general')[];
}[] = [
  {
    id: 'describe',
    label: 'Describe',
    youDo: 'Say what you need.',
    appDoes: 'Packages the job.',
    checklistIds: ['brief'],
    bpmnType: 'userTask',
  },
  {
    id: 'details',
    label: 'Details',
    youDo: 'Confirm address if asked.',
    appDoes: 'Uses memory when allowed.',
    checklistIds: ['address'],
    bpmnType: 'userTask',
    gates: ['share_pii'],
  },
  {
    id: 'contact',
    label: 'Contact',
    youDo: 'Choose who to contact.',
    appDoes: 'Prepares outreach draft.',
    checklistIds: ['provider_contact', 'draft_outreach'],
    bpmnType: 'userTask',
  },
  {
    id: 'send',
    label: 'Send',
    youDo: 'Approve the message.',
    appDoes: 'Sends or dry-runs.',
    checklistIds: ['send_outreach'],
    bpmnType: 'userTask',
    gates: ['send_message'],
  },
  {
    id: 'hear_back',
    label: 'Hear back',
    youDo: 'Share reply if needed.',
    appDoes: 'Records quotes.',
    checklistIds: ['provider_reply'],
    bpmnType: 'serviceTask',
  },
  {
    id: 'choose',
    label: 'Choose',
    youDo: 'Approve price and time.',
    appDoes: 'Shows options.',
    checklistIds: ['user_decision'],
    bpmnType: 'userTask',
    gates: ['commit_money_or_time'],
  },
  {
    id: 'booked',
    label: 'Booked',
    youDo: 'Be ready on the day.',
    appDoes: 'Holds appointment.',
    checklistIds: ['scheduled'],
    bpmnType: 'serviceTask',
  },
  {
    id: 'done',
    label: 'Done',
    youDo: 'Pay / note outcome.',
    appDoes: 'Closes the job.',
    checklistIds: ['settle'],
    bpmnType: 'userTask',
  },
];

describe('totbox.workflow_def', () => {
  it('builds a validated linear spine definition', () => {
    const def = buildWorkflowDefinition({
      workflow_id: 'house_service_v1',
      workflow_version: '1.0.0',
      steps: SPINE,
    });
    expect(def.format).toBe(WORKFLOW_DEF_FORMAT);
    expect(def.format_version).toBe(WORKFLOW_FORMAT_VERSION);
    expect(def.semantics).toBe('bpmn_sequence_subset');
    expect(def.topology).toBe('linear_spine');
    expect(def.steps).toHaveLength(8);
    expect(def.edges).toHaveLength(7);
    expect(def.edges[0]).toEqual({ from: 'describe', to: 'details' });
    expect(def.steps.find(s => s.id === 'send')?.gates).toContain('send_message');
    expect(def.steps.find(s => s.id === 'choose')?.type).toBe('userTask');
    expect(() => parseWorkflowDefinition(def)).not.toThrow();
  });

  it('rejects empty or oversized spines', () => {
    expect(() =>
      buildWorkflowDefinition({
        workflow_id: 'x',
        workflow_version: '1',
        steps: [],
      })
    ).toThrow(/1–8/);
  });

  it('linearEdges is pure sequence', () => {
    expect(linearEdges(['describe', 'details', 'contact'])).toEqual([
      { from: 'describe', to: 'details' },
      { from: 'details', to: 'contact' },
    ]);
  });

  it('schema rejects unknown step ids', () => {
    const def = buildWorkflowDefinition({
      workflow_id: 'house_service_v1',
      workflow_version: '1.0.0',
      steps: SPINE,
    });
    const bad = {
      ...def,
      steps: def.steps.map(s => (s.id === 'send' ? { ...s, id: 'email_blast' } : s)),
    };
    expect(WorkflowDefinitionSchema.safeParse(bad).success).toBe(false);
  });
});

describe('diagram projections', () => {
  it('toTextDiagram matches numbered arrow map', () => {
    const text = toTextDiagram(SPINE.map((s, i) => ({ n: i + 1, label: s.label })));
    expect(text).toBe(
      '1.Describe → 2.Details → 3.Contact → 4.Send → 5.Hear back → 6.Choose → 7.Booked → 8.Done'
    );
  });

  it('toMermaid emits flowchart with sequence and optional styles', () => {
    const mermaid = toMermaid({
      steps: SPINE.map(s => ({ id: s.id, label: s.label })),
      progressSteps: [
        { id: 'describe', state: 'done' },
        { id: 'details', state: 'done' },
        { id: 'contact', state: 'done' },
        { id: 'send', state: 'needs_you' },
        { id: 'hear_back', state: 'upcoming' },
      ],
    });
    expect(mermaid.startsWith('flowchart LR')).toBe(true);
    expect(mermaid).toMatch(/describe\[Describe\]/);
    expect(mermaid).toMatch(/describe --> details/);
    expect(mermaid).toMatch(/send --> hear_back/);
    expect(mermaid).toMatch(/style send /);
    expect(mermaid).toMatch(/style describe /);
    // upcoming should not get a style line
    expect(mermaid).not.toMatch(/style hear_back /);
  });

  it('buildDiagrams returns both projections', () => {
    const d = buildDiagrams({
      steps: SPINE.map((s, i) => ({ id: s.id, label: s.label, n: i + 1 })),
    });
    expect(d.text).toMatch(/Describe/);
    expect(d.mermaid).toMatch(/flowchart/);
  });
});

describe('totbox.workflow_progress core', () => {
  it('parses a minimal valid progress envelope', () => {
    const progress = parseWorkflowProgressCore({
      format: WORKFLOW_PROGRESS_FORMAT,
      format_version: WORKFLOW_FORMAT_VERSION,
      workflow_id: 'house_service_v1',
      workflow_version: '1.0.0',
      service_kind: 'hvac',
      summary: 'Send: Waiting on your approval.',
      strip: '⚠ Send',
      role_line: 'You: Approve the message.',
      current_step_id: 'send',
      steps: SPINE.map(s => ({
        id: s.id,
        label: s.label,
        state: s.id === 'send' ? 'needs_you' : s.id === 'describe' ? 'done' : 'upcoming',
        you_do: s.youDo,
        app_does: s.appDoes,
      })),
      diagrams: buildDiagrams({
        steps: SPINE.map((s, i) => ({ id: s.id, label: s.label, n: i + 1 })),
      }),
    });
    expect(progress.format).toBe(WORKFLOW_PROGRESS_FORMAT);
    expect(progress.current_step_id).toBe('send');
    expect(progress.diagrams?.mermaid).toMatch(/flowchart/);
  });
});
