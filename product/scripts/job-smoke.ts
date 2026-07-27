/**
 * House-job PM smoke: full consumer path for HVAC + cleaning
 * start → facts → draft → approve → dry-run send → ingest quote → money/time approval →
 * confirm → record_job_completion (next-due)
 * Safety: refuses send without approval (unit tests); this path records approvals.
 */

import { resetJobs } from '../../src/lib/job-pm';
import { dispatchMcpTool } from '../../src/lib/mcp-tools';

function parse(res: { content: Array<{ text: string }> }) {
  return JSON.parse(res.content[0].text);
}

function must(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg);
}

async function runOne(
  label: string,
  intent: string,
  providerEmail: string,
  reply: string,
  scheduledAt: string,
  nextDue: string
) {
  console.log(`\n=== ${label} ===`);
  let r = parse(
    dispatchMcpTool('start_job', {
      intent,
      provider_email: providerEmail,
      provider_label: `${label} Provider`,
    })
  );
  must(r.job_id, 'job_id');
  must(r.next_action, 'next_action');
  console.log('started', r.job_id, r.status, r.next_action?.type);

  must(r.next_action?.type === 'collect_field_via_host' || r.blocks?.length, 'expected address block');

  r = parse(
    dispatchMcpTool('update_job_facts', {
      job_id: r.job_id,
      service_address: '500 Example St (fixture only — not a real home)',
    })
  );
  console.log('after address', r.next_action?.type);
  must(r.next_action?.type === 'draft_for_user_approval', 'expected draft work order');
  must(r.next_action?.instructionsForHostLlm, 'host instructions');

  r = parse(
    dispatchMcpTool('submit_draft_for_approval', {
      job_id: r.job_id,
      body: `Hi, please help with: ${intent}. Address on file after user approval.`,
      channel: 'email',
      to: providerEmail,
    })
  );
  must(r.status === 'awaiting_user_approval', 'awaiting approval');

  r = parse(
    dispatchMcpTool('record_user_approval', {
      job_id: r.job_id,
      kind: 'send_message',
      summary: `User approved ${label} outreach (dry-run)`,
      granted: true,
      scope: 'once',
    })
  );
  must(
    r.approvals?.some((a: { granted: boolean; kind: string }) => a.granted && a.kind === 'send_message'),
    'approval recorded'
  );

  r = parse(
    dispatchMcpTool('approve_and_send_message', {
      job_id: r.job_id,
      dryRun: true,
    })
  );
  must(r.next_action?.type === 'await_provider_reply', 'await reply');
  console.log('dry-run send ok; messages', r.messages_count);

  r = parse(
    dispatchMcpTool('ingest_provider_message', {
      job_id: r.job_id,
      body: reply,
      from: providerEmail,
    })
  );
  must(r.checklist?.find((c: { id: string; done: boolean }) => c.id === 'provider_reply')?.done, 'reply ingested');
  must(Array.isArray(r.quotes) && r.quotes.length > 0, 'quote visible after paste');
  must(r.quotes.some((q: { priceFromUsd?: number }) => q.priceFromUsd != null), 'price extracted from paste');
  must(r.progress?.workflow_id === 'house_service_v1', 'consumer progress map');
  must(r.progress?.strip, 'mobile strip');
  console.log('progress strip after ingest:', r.progress.strip);
  console.log('quotes:', JSON.stringify(r.quotes));

  r = parse(
    dispatchMcpTool('record_user_approval', {
      job_id: r.job_id,
      kind: 'commit_money_or_time',
      summary: `User accepts ${label} quote/time`,
      granted: true,
      scope: 'once',
    })
  );
  must(
    r.approvals?.some(
      (a: { granted: boolean; kind: string }) => a.granted && a.kind === 'commit_money_or_time'
    ),
    'money/time approval'
  );

  r = parse(
    dispatchMcpTool('confirm_appointment', {
      job_id: r.job_id,
      scheduled_at: scheduledAt,
    })
  );
  must(r.scheduled_at === scheduledAt, 'scheduled_at set');
  must(r.status === 'scheduled', 'status scheduled (Booked)');
  must(r.next_action?.type === 'mark_done', 'next is explicit completion');
  must(r.progress?.strip, 'strip after book');
  console.log('booked strip:', r.progress.strip);

  r = parse(
    dispatchMcpTool('record_job_completion', {
      job_id: r.job_id,
      notes: `${label} service completed (smoke fixture)`,
      next_due: nextDue,
    })
  );
  must(r.status === 'done', 'status done');
  must(r.next_due === nextDue, 'next_due on public view');
  must(r.progress?.summary?.toLowerCase().includes('done') || r.status === 'done', 'done progress');
  const doneStep = r.progress?.steps?.find((s: { id: string; state: string }) => s.id === 'done');
  must(doneStep?.state === 'done', 'Done step marked done on strip');
  console.log('done strip:', r.progress.strip);
  console.log('next_due:', r.next_due);

  const wf = parse(dispatchMcpTool('get_workflow', { job_id: r.job_id }));
  must(wf.kind === 'workflow_instance', 'get_workflow instance');
  must(wf.progress?.strip, 'get_workflow strip');
  must(wf.control?.you_are_in_control === true, 'consumer control flag');

  console.log('OK', label, r.job_id);
}

function assertTemplate() {
  const t = parse(dispatchMcpTool('get_workflow', {}));
  must(t.kind === 'workflow_template', 'template kind');
  must(t.steps?.length === 8, 'template 8 steps');
  must(t.format === 'totbox.workflow_def', 'template format envelope');
  const hvac = parse(dispatchMcpTool('get_workflow', { service_kind: 'hvac' }));
  must(hvac.service_profile?.field_hints?.length > 0, 'hvac profile');
  console.log('get_workflow template OK');
}

async function main() {
  console.log('=== Job PM smoke (full path → Booked → Done + next-due) ===');
  resetJobs();
  assertTemplate();
  await runOne(
    'HVAC',
    'AC maintenance under $300 next 2 weeks',
    'hvac-demo@example.com',
    'We can do Tuesday 9am for $245 including inspection.',
    '2026-07-15T09:00:00Z',
    '2027-01-15'
  );
  await runOne(
    'CLEANING',
    '3hr priority clean focusing on blinds, windows, under beds',
    'clean-demo@example.com',
    'Friday 10am works, $180.',
    '2026-07-18T10:00:00Z',
    '2026-08-18'
  );

  const { listJobPmToolDescriptors } = await import('../../src/lib/mcp-tools');
  const names = listJobPmToolDescriptors().map(t => t.name);
  for (const n of [
    'start_job',
    'record_user_approval',
    'approve_and_send_message',
    'ingest_provider_message',
    'normalize_quote',
    'confirm_appointment',
    'record_job_completion',
  ]) {
    must(names.includes(n), `missing tool ${n}`);
  }
  console.log('\nJOB SMOKE PASSED');
}

main().catch(e => {
  console.error('JOB SMOKE FAILED', e);
  process.exit(1);
});
