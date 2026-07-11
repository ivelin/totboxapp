import { describe, it, expect, beforeEach } from 'vitest';
import {
  resetJobs,
  startJob,
  updateJobFacts,
  submitDraftForApproval,
  recordUserApproval,
  approveAndSendMessage,
  jobPublicView,
} from '../job-pm';
import {
  WORKFLOW_ID,
  HOUSE_SERVICE_V1_STEPS,
  formatProgressAscii,
  getHouseServiceDefinition,
  getWorkflowTemplate,
  WORKFLOW_PROGRESS_FORMAT,
  WORKFLOW_DEF_FORMAT,
  parseWorkflowProgressCore,
} from '../workflow-progress';

describe('house_service_v1 consumer progress', () => {
  beforeEach(() => {
    resetJobs();
  });

  it('exposes the same 8-step spine for HVAC and cleaning', () => {
    const hvac = startJob({ intent: 'AC maintenance under $300' });
    const clean = startJob({ intent: 'priority clean focusing on blinds' });
    const ph = jobPublicView(hvac).progress;
    const pc = jobPublicView(clean).progress;
    expect(ph.workflow_id).toBe(WORKFLOW_ID);
    expect(pc.workflow_id).toBe(WORKFLOW_ID);
    expect(ph.steps.map(s => s.id)).toEqual(HOUSE_SERVICE_V1_STEPS.map(s => s.id));
    expect(pc.steps.map(s => s.id)).toEqual(ph.steps.map(s => s.id));
    expect(ph.steps).toHaveLength(8);
    expect(ph.strip.length).toBeLessThan(200);
    expect(ph.summary.length).toBeGreaterThan(0);
    expect(ph.role_line.length).toBeGreaterThan(0);
  });

  it('marks Details as blocked/needs_you until address is set', () => {
    const job = startJob({
      intent: 'AC tune-up',
      providerContact: { email: 'x@example.com', label: 'X' },
    });
    const p = jobPublicView(job).progress;
    expect(['details', 'contact'].includes(p.current_step_id)).toBe(true);
    const focus = p.steps.find(s => s.id === p.current_step_id)!;
    expect(['blocked', 'needs_you', 'current']).toContain(focus.state);
    expect(p.developer.internal_status).toBeDefined();
    expect(p.developer.doc).toMatch(/house_service_v1/);
  });

  it('moves toward Send after details+contact ready, needs approval before send', () => {
    let job = startJob({ intent: 'AC maintenance under $200' });
    job = updateJobFacts(
      job.id,
      { service_address: '500 Example St (fixture)' },
      { email: 'h@example.com', label: 'Demo' }
    );
    const p1 = jobPublicView(job).progress;
    expect(p1.current_step_id).toBe('contact');
    expect(p1.steps.find(s => s.id === 'describe')?.state).toBe('done');
    expect(p1.steps.find(s => s.id === 'details')?.state).toBe('done');

    job = submitDraftForApproval({ jobId: job.id, body: 'Please schedule AC maintenance.' });
    const p2 = jobPublicView(job).progress;
    expect(p2.current_step_id).toBe('send');
    expect(p2.steps.find(s => s.id === 'send')?.state).toBe('needs_you');
    expect(p2.role_line.toLowerCase()).toMatch(/you|approv/);
  });

  it('after dry-run send shows Hear back; ascii render is non-empty', () => {
    let job = startJob({ intent: 'AC maintenance under $200' });
    job = updateJobFacts(
      job.id,
      { service_address: '500 Example St (fixture)' },
      { email: 'h@example.com' }
    );
    job = submitDraftForApproval({ jobId: job.id, body: 'Hi' });
    job = recordUserApproval({
      jobId: job.id,
      kind: 'send_message',
      summary: 'ok',
      granted: true,
    });
    job = approveAndSendMessage({ jobId: job.id, dryRun: true });
    const p = jobPublicView(job).progress;
    expect(p.current_step_id).toBe('hear_back');
    const ascii = formatProgressAscii(job);
    expect(ascii).toMatch(/house_service_v1/);
    expect(ascii).toMatch(/Hear back|Send|Describe/);
  });

  it('includes developer drill-down without removing consumer fields', () => {
    const job = startJob({ intent: 'cleaning focusing on kitchen' });
    const view = jobPublicView(job);
    expect(view.progress.steps.every(s => s.you_do && s.app_does)).toBe(true);
    expect(view.progress.developer.next_action_type || view.progress.developer.internal_status).toBeTruthy();
    expect(view.checklist).toBeDefined();
    expect(view.next_action).toBeDefined();
  });

  it('emits totbox.workflow_progress envelope with Mermaid projection', () => {
    const job = startJob({ intent: 'AC maintenance under $200' });
    const p = jobPublicView(job).progress;
    expect(p.format).toBe(WORKFLOW_PROGRESS_FORMAT);
    expect(p.format_version).toBe('1.0');
    expect(p.diagrams.text).toMatch(/Describe/);
    expect(p.diagrams.mermaid).toMatch(/flowchart LR/);
    expect(p.diagrams.mermaid).toMatch(/describe --> details/);
    // Core fields validate against interchange schema (developer is free-form)
    expect(() =>
      parseWorkflowProgressCore({
        format: p.format,
        format_version: p.format_version,
        workflow_id: p.workflow_id,
        workflow_version: p.workflow_version,
        service_kind: p.service_kind,
        summary: p.summary,
        strip: p.strip,
        role_line: p.role_line,
        current_step_id: p.current_step_id,
        steps: p.steps,
        diagrams: p.diagrams,
        developer: { internal_status: p.developer.internal_status },
      })
    ).not.toThrow();
  });

  it('template includes validated definition and diagrams', () => {
    const t = getWorkflowTemplate({ service_kind: 'hvac' });
    expect(t.format).toBe(WORKFLOW_DEF_FORMAT);
    expect(t.definition.workflow_id).toBe(WORKFLOW_ID);
    expect(t.definition.steps).toHaveLength(8);
    expect(t.definition.edges).toHaveLength(7);
    expect(t.diagrams.mermaid).toMatch(/send --> hear_back/);
    expect(t.diagram).toBe(t.diagrams.text);
    expect(getHouseServiceDefinition().steps.map(s => s.id)).toEqual(
      HOUSE_SERVICE_V1_STEPS.map(s => s.id)
    );
    expect(t.steps.find(s => s.id === 'send')?.gates).toContain('send_message');
  });
});
