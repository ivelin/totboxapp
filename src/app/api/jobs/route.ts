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

/** GET /api/jobs — list household jobs */
export async function GET() {
  const data = parseTool(dispatchMcpTool('list_jobs', {}));
  if (data.error) return NextResponse.json(data, { status: 400 });
  return NextResponse.json(data);
}

/** POST /api/jobs — start a new job (Phase 1 household path) */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = parseTool(
      dispatchMcpTool('start_job', {
        intent: body.intent,
        service_kind: body.service_kind,
        service_address: body.service_address,
        provider_label: body.provider_label,
        provider_email: body.provider_email,
        provider_phone: body.provider_phone,
        facts: body.facts,
      })
    );
    if (data.error) return NextResponse.json(data, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'failed to start job' },
      { status: 500 }
    );
  }
}
