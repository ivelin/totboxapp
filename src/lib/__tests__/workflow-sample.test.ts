import { describe, it, expect } from 'vitest';
import { getConsumerWorkflowSample, buildDemoJobNeedsSendApproval } from '../workflow-sample';
import { getWorkflowProgress } from '../workflow-progress';

describe('consumer workflow sample', () => {
  it('builds template + mid-job instance using real progress helpers', () => {
    const sample = getConsumerWorkflowSample();
    expect(sample.template.steps).toHaveLength(8);
    expect(sample.template.diagram).toMatch(/Describe/);
    expect(sample.sample_job.progress.steps).toHaveLength(8);
    expect(sample.sample_job.progress.current_step_id).toBe('send');
    expect(sample.sample_job.progress.steps.find(s => s.id === 'send')?.state).toBe('needs_you');
    expect(sample.sample_job.draft_preview.body).toMatch(/maintenance/i);
    expect(sample.template.principles.consumer_control).toBeTruthy();
  });

  it('demo job maps through the same getWorkflowProgress as live jobs', () => {
    const job = buildDemoJobNeedsSendApproval();
    const p = getWorkflowProgress(job);
    expect(p.workflow_id).toBe('house_service_v1');
    expect(p.strip).toMatch(/Send/);
    expect(p.role_line.toLowerCase()).toMatch(/you|approv|message/);
  });
});
