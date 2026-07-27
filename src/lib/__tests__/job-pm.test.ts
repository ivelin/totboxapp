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
  recordJobCompletion,
  normalizeJobQuote,
  extractQuoteHints,
  getJob,
  suggestNextAction,
} from '../job-pm';
import { dispatchMcpTool } from '../mcp-tools';

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
    expect(job.status).toBe('scheduled');
    expect(job.nextAction?.type).toBe('mark_done');
    // Settle is NOT auto-skipped — stays Booked until explicit completion
    expect(job.checklist.find(c => c.id === 'settle')?.done).toBe(false);

    job = recordJobCompletion({
      jobId: job.id,
      notes: 'Visit completed; filter changed',
      nextDueAt: '2027-01-15',
    });
    expect(job.status).toBe('done');
    expect(job.nextDueAt).toBe('2027-01-15');
    expect(job.completionNotes).toMatch(/filter/i);
    expect(job.checklist.find(c => c.id === 'settle')?.done).toBe(true);

    const snap = suggestNextAction(job.id);
    expect(snap.job.audit.length).toBeGreaterThan(3);
    expect(getJob(job.id)!.status).toBe('done');
  });

  it('extractQuoteHints pulls price and weekday window from paste', () => {
    const h = extractQuoteHints('We can do Tuesday 9am for $245 including inspection.');
    expect(h.priceFromUsd).toBe(245);
    expect(h.proposedWindow?.toLowerCase()).toMatch(/tuesday/);
  });

  it('normalize_quote corrects price on job after ingest', () => {
    let job = startJob({ intent: 'AC maintenance under $300' });
    job = updateJobFacts(
      job.id,
      { service_address: '500 Example St (test fixture only)' },
      { label: 'Neighborhood HVAC', email: 'hvac-demo@example.com' }
    );
    job = submitDraftForApproval({ jobId: job.id, body: 'Please quote.' });
    job = recordUserApproval({
      jobId: job.id,
      kind: 'send_message',
      summary: 'ok',
      granted: true,
    });
    job = approveAndSendMessage({ jobId: job.id, dryRun: true });
    job = ingestProviderMessage({
      jobId: job.id,
      body: 'We can come by next week, call for price.',
    });
    expect(job.quotes.some(q => q.priceFromUsd == null)).toBe(true);
    job = normalizeJobQuote({
      jobId: job.id,
      quoteId: job.quotes[0].id,
      priceFromUsd: 260,
      proposedWindow: 'next week morning',
    });
    expect(job.quotes[0].priceFromUsd).toBe(260);
    expect(job.quotes[0].proposedWindow).toMatch(/next week/);
  });

  it('MCP dispatch full HVAC consumer path with public view fields', () => {
    resetJobs();
    const parse = (res: { content: Array<{ text: string }> }) => JSON.parse(res.content[0].text);
    let r = parse(
      dispatchMcpTool('start_job', {
        intent: 'AC maintenance under $300 next 2 weeks',
        provider_email: 'hvac-demo@example.com',
        provider_label: 'Fixture HVAC',
      })
    );
    r = parse(
      dispatchMcpTool('update_job_facts', {
        job_id: r.job_id,
        service_address: '500 Example St (fixture only — not a real home)',
      })
    );
    r = parse(
      dispatchMcpTool('submit_draft_for_approval', {
        job_id: r.job_id,
        body: 'Please quote AC maintenance under $300.',
        channel: 'email',
        to: 'hvac-demo@example.com',
      })
    );
    r = parse(
      dispatchMcpTool('record_user_approval', {
        job_id: r.job_id,
        kind: 'send_message',
        summary: 'Approve dry-run outreach',
        granted: true,
      })
    );
    r = parse(dispatchMcpTool('approve_and_send_message', { job_id: r.job_id, dryRun: true }));
    r = parse(
      dispatchMcpTool('ingest_provider_message', {
        job_id: r.job_id,
        body: 'Tuesday 9am for $245 including inspection.',
        from: 'hvac-demo@example.com',
      })
    );
    expect(r.quotes.length).toBeGreaterThan(0);
    expect(r.quotes[0].priceFromUsd).toBe(245);
    expect(r.progress.strip).toBeTruthy();
    r = parse(
      dispatchMcpTool('record_user_approval', {
        job_id: r.job_id,
        kind: 'commit_money_or_time',
        summary: 'Accept $245 Tuesday',
        granted: true,
      })
    );
    r = parse(
      dispatchMcpTool('confirm_appointment', {
        job_id: r.job_id,
        scheduled_at: '2026-07-15T09:00:00Z',
      })
    );
    expect(r.scheduled_at).toBe('2026-07-15T09:00:00Z');
    expect(r.status).toBe('scheduled');
    r = parse(
      dispatchMcpTool('record_job_completion', {
        job_id: r.job_id,
        notes: 'Done',
        next_due: '2027-01-15',
      })
    );
    expect(r.status).toBe('done');
    expect(r.next_due).toBe('2027-01-15');
    expect(r.progress.steps.find((s: { id: string }) => s.id === 'done').state).toBe('done');
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
