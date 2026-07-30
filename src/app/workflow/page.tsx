import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { WorkflowProgressSample } from '@/components/WorkflowProgressSample';
import { getConsumerWorkflowSample } from '@/lib/workflow-sample';

export const metadata: Metadata = {
  title: 'Your house service path — Totbox',
  description:
    'Simple, transparent path for any house service: see where you are, what you do, and what the app does. Mobile-friendly sample.',
};

/**
 * Public sample of consumer workflow transparency.
 * Same progress model as live jobs / MCP get_workflow.
 */
export default function WorkflowSamplePage() {
  const sample = getConsumerWorkflowSample();
  return (
    <div className="min-h-full bg-[var(--bg)]">
      <SiteHeader />
      <main className="min-h-full">
        <WorkflowProgressSample sample={sample} />
      </main>
    </div>
  );
}
