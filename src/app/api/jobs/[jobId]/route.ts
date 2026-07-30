import { NextRequest, NextResponse } from 'next/server';
import { dispatchMcpTool } from '@/lib/mcp-tools';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function parseTool(res: { content: Array<{ type: string; text: string }> }) {
  try {
    return JSON.parse(res.content[0].text);
  } catch {
    return { error: 'invalid tool response' };
  }
}

type Ctx = { params: Promise<{ jobId: string }> };

/** GET /api/jobs/:jobId */
export async function GET(_req: NextRequest, ctx: Ctx) {
  const { jobId } = await ctx.params;
  const data = parseTool(dispatchMcpTool('get_job', { job_id: jobId }));
  if (data.error) return NextResponse.json(data, { status: 404 });
  return NextResponse.json(data);
}

/**
 * POST /api/jobs/:jobId
 * Body: { action: string, ...args }
 * Mirrors MCP job tools so the browser console and chat hosts share one PM.
 */
export async function POST(req: NextRequest, ctx: Ctx) {
  const { jobId } = await ctx.params;
  try {
    const body = await req.json();
    const action = String(body.action || '');
    const args: Record<string, unknown> = { ...body, job_id: jobId, jobId };
    delete args.action;

    const toolMap: Record<string, string> = {
      update_facts: 'update_job_facts',
      submit_draft: 'submit_draft_for_approval',
      approve: 'record_user_approval',
      send: 'approve_and_send_message',
      ingest: 'ingest_provider_message',
      normalize_quote: 'normalize_quote',
      confirm: 'confirm_appointment',
      complete: 'record_job_completion',
      get: 'get_job',
      workflow: 'get_workflow',
    };

    const tool = toolMap[action];
    if (!tool) {
      return NextResponse.json(
        {
          error: `Unknown action: ${action}`,
          allowed: Object.keys(toolMap),
        },
        { status: 400 }
      );
    }

    if (action === 'update_facts') {
      args.service_address = args.service_address ?? args.address;
    }
    if (action === 'submit_draft') {
      args.body = args.body ?? args.draft_body;
    }
    if (action === 'approve') {
      args.kind = args.kind ?? 'send_message';
      args.summary = args.summary ?? 'User approved via household console';
      args.granted = args.granted !== false;
    }
    if (action === 'send') {
      args.dryRun = args.dryRun !== false;
    }
    if (action === 'ingest') {
      args.body = args.body ?? args.reply;
    }
    if (action === 'confirm') {
      args.scheduled_at = args.scheduled_at ?? args.scheduledAt;
    }
    if (action === 'complete') {
      args.next_due = args.next_due ?? args.nextDueAt;
      args.notes = args.notes ?? args.completionNotes;
    }

    const data = parseTool(dispatchMcpTool(tool, args));
    if (data.error) {
      const refused = String(data.error).includes('REFUSED');
      return NextResponse.json(data, { status: refused ? 403 : 400 });
    }
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'action failed' },
      { status: 500 }
    );
  }
}
