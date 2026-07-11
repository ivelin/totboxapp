/**
 * House-job PM smoke: start → draft → approve → dry-run send → ingest (HVAC + cleaning)
 * Safety: refuses send without approval (covered in unit tests); this path records approvals.
 */

import { resetJobs } from '../src/lib/job-pm';
import { dispatchMcpTool } from '../src/lib/mcp-tools';

function parse(res: { content: Array<{ text: string }> }) {
  return JSON.parse(res.content[0].text);
}

function must(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg);
}

async function runOne(label: string, intent: string, providerEmail: string, reply: string) {
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

  // Still blocked on address
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
  must(
    (r.next_action?.preferredHostTools || []).length > 0 || r.next_action?.instructionsForHostLlm.includes('memory'),
    'host-first hints'
  );

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
  must(r.approvals?.some((a: { granted: boolean; kind: string }) => a.granted && a.kind === 'send_message'), 'approval recorded');

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
  must(r.audit_tail?.length > 0, 'audit trail');
  must(r.progress?.workflow_id === 'house_service_v1', 'consumer progress map');
  must(r.workflow_id === 'house_service_v1', 'job pins workflow_id');
  must(r.progress?.steps?.length === 8, '8 consumer steps');
  must(r.progress?.strip, 'mobile strip');
  must(r.progress?.developer?.doc, 'developer drill-down doc');
  console.log('progress strip:', r.progress.strip);
  console.log('progress summary:', r.progress.summary);

  const wf = parse(dispatchMcpTool('get_workflow', { job_id: r.job_id }));
  must(wf.kind === 'workflow_instance', 'get_workflow instance');
  must(wf.progress?.strip, 'get_workflow strip');
  must(wf.control?.you_are_in_control === true, 'consumer control flag');
  must(wf.privacy?.address_value_redacted === true, 'address redacted on inspect');

  console.log('ingest ok; status', r.status, 'next', r.next_action?.type);
  console.log('OK', label, r.job_id);
}

function assertTemplate() {
  const t = parse(dispatchMcpTool('get_workflow', {}));
  must(t.kind === 'workflow_template', 'template kind');
  must(t.steps?.length === 8, 'template 8 steps');
  must(t.principles?.transparency, 'transparency principle');
  const hvac = parse(dispatchMcpTool('get_workflow', { service_kind: 'hvac' }));
  must(hvac.service_profile?.field_hints?.length > 0, 'hvac profile');
  console.log('get_workflow template OK:', t.diagram);
}

async function main() {
  console.log('=== Job PM smoke (safety dry-run + workflow visibility) ===');
  resetJobs();
  assertTemplate();
  await runOne(
    'HVAC',
    'AC maintenance under $300 next 2 weeks',
    'hvac-demo@example.com',
    'We can do Tuesday 9am for $245 including inspection.'
  );
  await runOne(
    'CLEANING',
    '3hr priority clean focusing on blinds, windows, under beds',
    'clean-demo@example.com',
    'Friday 10am works, $180.'
  );

  // MCP dispatch tool presence
  const { listJobPmToolDescriptors } = await import('../src/lib/mcp-tools');
  const names = listJobPmToolDescriptors().map(t => t.name);
  for (const n of ['start_job', 'record_user_approval', 'approve_and_send_message', 'ingest_provider_message']) {
    must(names.includes(n), `missing tool ${n}`);
  }
  console.log('\nJOB SMOKE PASSED');
}

main().catch(e => {
  console.error('JOB SMOKE FAILED', e);
  process.exit(1);
});
