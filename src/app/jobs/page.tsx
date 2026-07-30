import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { HouseholdJobsConsole } from '@/components/HouseholdJobsConsole';

export const metadata: Metadata = {
  title: 'Household jobs — Totbox',
  description:
    'Phase 1 household job console: cleaning / HVAC path with safety gates, progress strip, and dry-run send — same Job PM as the MCP tools.',
};

export default function JobsPage() {
  return (
    <div className="min-h-full bg-[var(--bg)]">
      <SiteHeader />
      <main>
        <HouseholdJobsConsole />
      </main>
    </div>
  );
}
