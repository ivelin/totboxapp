import { describe, it, expect, beforeEach } from 'vitest';
import {
  resetJobs,
  startJob,
  updateJobFacts,
  submitDraftForApproval,
  recordUserApproval,
  approveAndSendMessage,
  ingestProviderMessage,
  confirmAppointment,
  getJob,
  suggestNextAction,
} from '../job-pm';

describe('Job PM safety-gated workflow', () => {
  beforeEach(() => {
    resetJobs();
  });

  it('starts HVAC job with checklist and next_action; blocks without address', () => {
    const job = startJob({
      intent: 'Find AC maintenance under $300 next 2 weeks',
    });
    expect(job.id).toMatch(/^job_/);
    expect(job.serviceKind).toBe('hvac');
    expect(job.checklist.length).toBeGreaterThan(3);
    expect(job.facts.budgetUsd).toBe(300);
    expect(job.nextAction).toBeDefined();
    expect(job.nextAction?.type).toBe('collect_field_via_host');
    expect(job.blocks.some(b => b.code === 'missing_service_address')).toBe(true);
    expect(job.nextAction?.preferredHostTools?.length).toBeGreaterThan(0);
  });

  it('starts cleaning job and extracts priorities', () => {
    const job = startJob({
      intent: 'Priority clean focusing on blinds, windows, under beds',
    });
    expect(job.serviceKind).toBe('cleaning');
    expect(Array.isArray(job.facts.priorities)).toBe(true);
    expect((job.facts.priorities as string[]).join(' ')).toMatch(/blinds/);
  });

  it('refuses send without approval (safety first)', () => {
    const job = startJob({ intent: 'AC tune-up under $200' });
    updateJobFacts(
      job.id,
      { service_address: '123 Demo Lane (fixture)' },
      { label: 'Demo HVAC', email: 'demo-hvac@example.com' }
    );
    submitDraftForApproval({
      jobId: job.id,
      body: 'Hi, please schedule AC tune-up.',
      channel: 'email',
    });
    expect(() =>
      approveAndSendMessage({ jobId: job.id, dryRun: true })
    ).toThrow(/REFUSED|approval/i);
  });

  it('HVAC path: draft → approve → dry-run send → ingest → confirm', () => {
    let job = startJob({ intent: 'AC maintenance under $300' });
    job = updateJobFacts(
      job.id,
      { service_address: '500 Example St (test fixture only)' },
      { label: 'Neighborhood HVAC', email: 'hvac-demo@example.com' }
    );
    expect(job.nextAction?.type).toBe('draft_for_user_approval');
    expect(job.nextAction?.templateId).toMatch(/hvac/);

    job = submitDraftForApproval({
      jobId: job.id,
      body: 'Hi Neighborhood HVAC, please quote AC maintenance under $300 at 500 Example St.',
      channel: 'email',
      to: 'hvac-demo@example.com',
    });
    expect(job.status).toBe('awaiting_user_approval');
    expect(job.checklist.find(c => c.id === 'draft_outreach')?.done).toBe(true);

    job = recordUserApproval({
      jobId: job.id,
      kind: 'send_message',
      summary: 'User approved HVAC outreach email dry-run',
      granted: true,
      scope: 'once',
    });
    expect(job.approvals.some(a => a.granted && a.kind === 'send_message')).toBe(true);

    job = approveAndSendMessage({ jobId: job.id, dryRun: true });
    expect(job.messages.some(m => m.direction === 'outbound' && m.dryRun && m.approved)).toBe(true);
    expect(job.checklist.find(c => c.id === 'send_outreach')?.done).toBe(true);
    expect(job.nextAction?.type).toBe('await_provider_reply');

    job = ingestProviderMessage({
      jobId: job.id,
      body: 'We can do Tuesday 9am for $245 including inspection.',
      from: 'hvac-demo@example.com',
    });
    expect(job.checklist.find(c => c.id === 'provider_reply')?.done).toBe(true);
    expect(job.quotes.length).toBeGreaterThan(0);

    job = recordUserApproval({
      jobId: job.id,
      kind: 'commit_money_or_time',
      summary: 'User accepts $245 Tuesday slot',
      granted: true,
    });
    job = confirmAppointment({ jobId: job.id, scheduledAt: '2026-07-15T09:00:00Z' });
    expect(job.scheduledAt).toBe('2026-07-15T09:00:00Z');
    expect(job.checklist.find(c => c.id === 'scheduled')?.done).toBe(true);

    const snap = suggestNextAction(job.id);
    expect(snap.job.audit.length).toBeGreaterThan(3);
    // After schedule, remaining optional settle may complete to done
    const final = getJob(job.id)!;
    expect(['scheduled', 'done', 'negotiating', 'awaiting_user_decision', 'settling']).toContain(final.status);
  });

  it('cleaning path: full dry-run loop with host-first instructions', () => {
    let job = startJob({
      intent: '3hr priority clean focusing on blinds, windows, corners',
    });
    job = updateJobFacts(
      job.id,
      { service_address: '500 Example St (test fixture only)', priorities: ['blinds', 'windows', 'corners'] },
      { label: 'Demo Clean', email: 'clean-demo@example.com' }
    );
    expect(job.nextAction?.instructionsForHostLlm).toMatch(/HOST|host|memory|Fill/i);

    job = submitDraftForApproval({
      jobId: job.id,
      body: 'Please schedule priority clean focusing on blinds, windows, corners.',
    });
    job = recordUserApproval({
      jobId: job.id,
      kind: 'send_message',
      summary: 'Approve cleaning outreach',
      granted: true,
    });
    job = approveAndSendMessage({
      jobId: job.id,
      dryRun: true,
      hostPerformed: false,
    });
    job = ingestProviderMessage({
      jobId: job.id,
      body: 'Available Friday $180',
    });
    expect(job.serviceKind).toBe('cleaning');
    expect(job.messages.filter(m => m.direction === 'inbound').length).toBe(1);
    expect(job.nextAction).toBeDefined();
  });

  it('cannot ingest reply before send', () => {
    const job = startJob({ intent: 'AC fix' });
    updateJobFacts(job.id, { service_address: 'x' }, { email: 'a@example.com' });
    expect(() => ingestProviderMessage({ jobId: job.id, body: 'hi' })).toThrow(/before outreach/i);
  });

  it('confirmAppointment REFUSED with only send_message grant (needs commit_money_or_time)', () => {
    let job = startJob({ intent: 'AC maintenance under $300' });
    job = updateJobFacts(
      job.id,
      { service_address: '500 Example St (test fixture only)' },
      { label: 'Neighborhood HVAC', email: 'hvac-demo@example.com' }
    );
    job = submitDraftForApproval({
      jobId: job.id,
      body: 'Please quote AC maintenance.',
      channel: 'email',
    });
    job = recordUserApproval({
      jobId: job.id,
      kind: 'send_message',
      summary: 'Approve outreach only',
      granted: true,
    });
    job = approveAndSendMessage({ jobId: job.id, dryRun: true });
    job = ingestProviderMessage({
      jobId: job.id,
      body: 'Tuesday 9am for $245',
    });
    // Only send_message is on file — scheduling must still refuse
    expect(job.approvals.some(a => a.kind === 'send_message' && a.granted)).toBe(true);
    expect(job.approvals.some(a => a.kind === 'commit_money_or_time' && a.granted)).toBe(false);
    expect(() =>
      confirmAppointment({ jobId: job.id, scheduledAt: '2026-07-15T09:00:00Z' })
    ).toThrow(/REFUSED: confirm_appointment requires record_user_approval\(kind=commit_money_or_time/);
  });

  it('refuses dryRun:false without hostPerformed (never pretend a send)', () => {
    let job = startJob({ intent: 'AC maintenance under $200' });
    job = updateJobFacts(
      job.id,
      { service_address: '500 Example St (test fixture only)' },
      { email: 'hvac-demo@example.com' }
    );
    job = submitDraftForApproval({ jobId: job.id, body: 'Hi, schedule AC please.' });
    job = recordUserApproval({
      jobId: job.id,
      kind: 'send_message',
      summary: 'Approve send',
      granted: true,
    });
    expect(() =>
      approveAndSendMessage({ jobId: job.id, dryRun: false, hostPerformed: false })
    ).toThrow(/REFUSED: dryRun:false without hostPerformed|Never pretend/i);
    // dry-run still works
    job = approveAndSendMessage({ jobId: job.id, dryRun: true });
    expect(job.messages.some(m => m.direction === 'outbound' && m.dryRun === true)).toBe(true);
  });
});
