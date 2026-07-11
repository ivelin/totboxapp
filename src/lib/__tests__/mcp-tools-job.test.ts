import { describe, it, expect, beforeEach } from 'vitest';
import { dispatchMcpTool, listJobPmToolDescriptors } from '../mcp-tools';
import { resetJobs } from '../job-pm';

function parse(res: { content: Array<{ text: string }> }) {
  return JSON.parse(res.content[0].text);
}

describe('MCP job PM tools (shipped dispatch)', () => {
  beforeEach(() => {
    resetJobs();
  });

  it('lists job PM tools including start_job and safety tools', () => {
    const names = listJobPmToolDescriptors().map(t => t.name);
    expect(names).toContain('start_job');
    expect(names).toContain('record_user_approval');
    expect(names).toContain('approve_and_send_message');
    expect(names).toContain('ingest_provider_message');
  });

  it('start_job returns progress map house_service_v1', () => {
    const r = parse(dispatchMcpTool('start_job', { intent: 'AC maintenance under $250' }));
    expect(r.job_id).toMatch(/^job_/);
    expect(r.workflow_id).toBe('house_service_v1');
    expect(r.workflow_version).toBeTruthy();
    expect(r.progress.workflow_id).toBe('house_service_v1');
    expect(r.progress.steps).toHaveLength(8);
    expect(r.progress.strip).toMatch(/Describe/);
    expect(r.next_action).toBeDefined();
  });

  it('approve_and_send without approval returns REFUSED error payload', () => {
    const started = parse(dispatchMcpTool('start_job', { intent: 'AC under $200' }));
    const r = parse(
      dispatchMcpTool('approve_and_send_message', { job_id: started.job_id, dryRun: true })
    );
    expect(r.error).toMatch(/REFUSED|approval/i);
  });

  it('get_workflow returns general template without job_id', () => {
    const r = parse(dispatchMcpTool('get_workflow', {}));
    expect(r.kind).toBe('workflow_template');
    expect(r.workflow_id).toBe('house_service_v1');
    expect(r.steps).toHaveLength(8);
    expect(r.diagram).toMatch(/Describe/);
    expect(r.principles.consumer_control).toBeTruthy();
    expect(r.principles.privacy).toBeTruthy();
  });

  it('get_workflow with service_kind includes profile deltas', () => {
    const r = parse(dispatchMcpTool('get_workflow', { service_kind: 'hvac' }));
    expect(r.service_profile.label).toMatch(/HVAC/i);
    expect(r.service_profile.field_hints.length).toBeGreaterThan(0);
  });

  it('get_workflow with job_id returns instance progress without leaking address value', () => {
    const started = parse(
      dispatchMcpTool('start_job', {
        intent: 'AC under $200',
        service_address: '500 Example St (fixture only)',
        provider_email: 'x@example.com',
      })
    );
    const r = parse(dispatchMcpTool('get_workflow', { job_id: started.job_id }));
    expect(r.kind).toBe('workflow_instance');
    expect(r.progress.steps).toHaveLength(8);
    expect(r.privacy.address_value_redacted).toBe(true);
    expect(r.privacy.has_service_address).toBe(true);
    expect(JSON.stringify(r)).not.toMatch(/500 Example St/);
    expect(r.control.you_are_in_control).toBe(true);
  });

  it('list_jobs includes progress strips', () => {
    parse(dispatchMcpTool('start_job', { intent: 'cleaning focusing on kitchen' }));
    const r = parse(dispatchMcpTool('list_jobs', {}));
    expect(r.kind).toBe('job_list');
    expect(r.jobs.length).toBeGreaterThan(0);
    expect(r.jobs[0].progress_strip).toMatch(/Describe/);
  });
});
