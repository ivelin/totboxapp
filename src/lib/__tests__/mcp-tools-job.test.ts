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
});
