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
import { WORKFLOW_ID, HOUSE_SERVICE_V1_STEPS, formatProgressAscii } from '../workflow-progress';

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
});
