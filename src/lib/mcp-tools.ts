import {
  searchProviders,
  getProviderDetailsForToken,
  getAvailabilityForToken,
  createServiceBrief,
  compareOptions,
} from './store';
import type { ServiceCategory } from './types';
import {
  startJob,
  getJob,
  listJobs,
  updateJobFacts,
  submitDraftForApproval,
  recordUserApproval,
  approveAndSendMessage,
  recordOutbound,
  ingestProviderMessage,
  confirmAppointment,
  suggestNextAction,
  jobPublicView,
} from './job-pm';
import type { ServiceKind } from './job-types';

type LooseArgs = Record<string, unknown>;

function getStr(v: unknown): string | undefined {
  return v != null ? String(v) : undefined;
}

function getNum(v: unknown): number | undefined {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v);
  return undefined;
}

function getBool(v: unknown, defaultVal: boolean): boolean {
  if (typeof v === 'boolean') return v;
  if (v === 'true') return true;
  if (v === 'false') return false;
  return defaultVal;
}

function ok(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
}

function err(message: string) {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ error: message }) }] };
}

export function dispatchMcpTool(name: string, args: LooseArgs) {
  try {
    if (name === 'search_services') {
      const sliced = searchProviders({
        query: getStr(args.query),
        category: getStr(args.category),
        location: getStr(args.location),
        limit: typeof args.limit === 'number' ? args.limit : undefined,
      }, getStr(args.token));
      return ok(sliced);
    }
    if (name === 'get_provider_details') {
      const pid = getStr(args.providerId) || '';
      const t = getStr(args.token);
      const res = getProviderDetailsForToken(pid, t);
      if (!res) return err('Provider not found');
      return ok(res);
    }
    if (name === 'get_availability') {
      const pid = getStr(args.providerId) || '';
      const d = getStr(args.date) || '';
      const t = getStr(args.token);
      return ok(getAvailabilityForToken(pid, d, t));
    }
    if (name === 'create_service_brief') {
      const naturalLanguage = getStr(args.naturalLanguage) || getStr(args.text) || '';
      if (!naturalLanguage) return err('naturalLanguage required');
      const prioritiesRaw = args.priorities;
      const priorities = Array.isArray(prioritiesRaw) ? prioritiesRaw.map(String) : undefined;
      const brief = createServiceBrief({
        naturalLanguage,
        category: getStr(args.category) as ServiceCategory | undefined,
        serviceType: getStr(args.serviceType),
        priorities,
        budgetUsd: getNum(args.budgetUsd),
        location: getStr(args.location),
        dateWindow: getStr(args.dateWindow),
      });
      return ok(brief);
    }
    if (name === 'compare_options') {
      return ok(
        compareOptions({
          briefId: getStr(args.briefId),
          naturalLanguage: getStr(args.naturalLanguage) || getStr(args.text),
          category: getStr(args.category),
          location: getStr(args.location),
          budgetUsd: getNum(args.budgetUsd),
          query: getStr(args.query),
          limit: typeof args.limit === 'number' ? args.limit : undefined,
        })
      );
    }

    // --- Job PM (host-LLM-first, safety-gated) ---
    if (name === 'start_job') {
      const intent = getStr(args.intent) || getStr(args.text) || getStr(args.naturalLanguage) || '';
      if (!intent) return err('intent required');
      const facts =
        args.facts && typeof args.facts === 'object' && !Array.isArray(args.facts)
          ? (args.facts as Record<string, unknown>)
          : {};
      if (getStr(args.service_address)) facts.service_address = getStr(args.service_address);
      const providerContact =
        getStr(args.provider_email) || getStr(args.provider_phone) || getStr(args.provider_label)
          ? {
              label: getStr(args.provider_label),
              email: getStr(args.provider_email),
              phone: getStr(args.provider_phone),
            }
          : undefined;
      const job = startJob({
        intent,
        serviceKind: getStr(args.service_kind) as ServiceKind | undefined,
        facts,
        providerContact,
      });
      return ok(jobPublicView(job));
    }
    if (name === 'get_job') {
      const jobId = getStr(args.job_id) || getStr(args.jobId) || '';
      const job = getJob(jobId);
      if (!job) return err('job not found');
      return ok(jobPublicView(job));
    }
    if (name === 'list_jobs') {
      return ok(listJobs().map(jobPublicView));
    }
    if (name === 'update_job_facts') {
      const jobId = getStr(args.job_id) || getStr(args.jobId) || '';
      const facts =
        args.facts && typeof args.facts === 'object' && !Array.isArray(args.facts)
          ? { ...(args.facts as Record<string, unknown>) }
          : {};
      if (getStr(args.service_address)) facts.service_address = getStr(args.service_address);
      if (getStr(args.budgetUsd) || getNum(args.budgetUsd) != null) {
        facts.budgetUsd = getNum(args.budgetUsd) ?? getStr(args.budgetUsd);
      }
      const providerContact =
        getStr(args.provider_email) || getStr(args.provider_phone) || getStr(args.provider_label)
          ? {
              label: getStr(args.provider_label),
              email: getStr(args.provider_email),
              phone: getStr(args.provider_phone),
            }
          : undefined;
      return ok(jobPublicView(updateJobFacts(jobId, facts, providerContact)));
    }
    if (name === 'suggest_next_action') {
      const jobId = getStr(args.job_id) || getStr(args.jobId) || '';
      const res = suggestNextAction(jobId);
      return ok({ ...jobPublicView(res.job), next_action: res.nextAction, blocks: res.blocks });
    }
    if (name === 'submit_draft_for_approval') {
      const jobId = getStr(args.job_id) || getStr(args.jobId) || '';
      const body = getStr(args.body) || '';
      if (!body) return err('body required');
      return ok(
        jobPublicView(
          submitDraftForApproval({
            jobId,
            body,
            channel: getStr(args.channel) as 'email' | 'sms' | 'voice' | undefined,
            to: getStr(args.to),
          })
        )
      );
    }
    if (name === 'record_user_approval') {
      const jobId = getStr(args.job_id) || getStr(args.jobId) || '';
      const kind = getStr(args.kind) || 'general';
      const summary = getStr(args.summary) || kind;
      const granted = getBool(args.granted, true);
      return ok(
        jobPublicView(
          recordUserApproval({
            jobId,
            kind,
            summary,
            granted,
            scope: (getStr(args.scope) as 'once' | 'session' | 'always_ask') || 'once',
          })
        )
      );
    }
    if (name === 'approve_and_send_message') {
      const jobId = getStr(args.job_id) || getStr(args.jobId) || '';
      return ok(
        jobPublicView(
          approveAndSendMessage({
            jobId,
            dryRun: getBool(args.dryRun, true),
            body: getStr(args.body),
            to: getStr(args.to),
            channel: getStr(args.channel) as 'email' | 'sms' | 'voice' | undefined,
            hostPerformed: getBool(args.hostPerformed, false),
            hostResult:
              args.hostResult && typeof args.hostResult === 'object'
                ? (args.hostResult as Record<string, unknown>)
                : undefined,
          })
        )
      );
    }
    if (name === 'record_outbound') {
      const jobId = getStr(args.job_id) || getStr(args.jobId) || '';
      const body = getStr(args.body) || '';
      if (!body) return err('body required');
      return ok(
        jobPublicView(
          recordOutbound({
            jobId,
            body,
            channel: getStr(args.channel) as 'email' | 'sms' | 'voice' | undefined,
            to: getStr(args.to),
            dryRun: getBool(args.dryRun, true),
            hostResult:
              args.hostResult && typeof args.hostResult === 'object'
                ? (args.hostResult as Record<string, unknown>)
                : undefined,
          })
        )
      );
    }
    if (name === 'ingest_provider_message') {
      const jobId = getStr(args.job_id) || getStr(args.jobId) || '';
      const body = getStr(args.body) || getStr(args.text) || '';
      if (!body) return err('body required');
      return ok(
        jobPublicView(
          ingestProviderMessage({
            jobId,
            body,
            from: getStr(args.from),
            channel: getStr(args.channel) as 'email' | 'sms' | 'voice' | 'note' | undefined,
          })
        )
      );
    }
    if (name === 'confirm_appointment') {
      const jobId = getStr(args.job_id) || getStr(args.jobId) || '';
      const scheduledAt = getStr(args.scheduled_at) || getStr(args.scheduledAt) || '';
      if (!scheduledAt) return err('scheduled_at required');
      return ok(jobPublicView(confirmAppointment({ jobId, scheduledAt })));
    }

    return err('unknown tool ' + name);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return err(message);
  }
}

/** Canonical tool descriptors for HTTP tools/list */
export function listJobPmToolDescriptors() {
  return [
    {
      name: 'start_job',
      description:
        'Start a house-service job PM checklist from user intent. Returns next_action for the host LLM. Safety-first: side effects need later explicit approval. Prefer host memory/tools for address and contacts.',
      inputSchema: {
        type: 'object',
        properties: {
          intent: { type: 'string' },
          service_kind: { type: 'string' },
          service_address: { type: 'string' },
          provider_label: { type: 'string' },
          provider_email: { type: 'string' },
          provider_phone: { type: 'string' },
          facts: { type: 'object' },
        },
        required: ['intent'],
      },
    },
    {
      name: 'get_job',
      description: 'Get job status, checklist, blocks, next_action, approvals audit tail.',
      inputSchema: { type: 'object', properties: { job_id: { type: 'string' } }, required: ['job_id'] },
    },
    {
      name: 'list_jobs',
      description: 'List local household jobs.',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'update_job_facts',
      description:
        'Update job facts (e.g. service_address from host memory after user permission) and/or provider contact from host search.',
      inputSchema: {
        type: 'object',
        properties: {
          job_id: { type: 'string' },
          service_address: { type: 'string' },
          provider_label: { type: 'string' },
          provider_email: { type: 'string' },
          provider_phone: { type: 'string' },
          facts: { type: 'object' },
        },
        required: ['job_id'],
      },
    },
    {
      name: 'suggest_next_action',
      description: 'Recompute and return next_action work order for the host LLM.',
      inputSchema: { type: 'object', properties: { job_id: { type: 'string' } }, required: ['job_id'] },
    },
    {
      name: 'submit_draft_for_approval',
      description: 'Store host-LLM-filled draft; requires address+contact; sets awaiting_user_approval.',
      inputSchema: {
        type: 'object',
        properties: {
          job_id: { type: 'string' },
          body: { type: 'string' },
          channel: { type: 'string' },
          to: { type: 'string' },
        },
        required: ['job_id', 'body'],
      },
    },
    {
      name: 'record_user_approval',
      description:
        'Record user permission (send_message, share_pii, commit_money_or_time, use_host_tool). Early product: explicit every side effect. scope: once|session|always_ask.',
      inputSchema: {
        type: 'object',
        properties: {
          job_id: { type: 'string' },
          kind: { type: 'string' },
          summary: { type: 'string' },
          granted: { type: 'boolean' },
          scope: { type: 'string' },
        },
        required: ['job_id', 'kind', 'granted'],
      },
    },
    {
      name: 'approve_and_send_message',
      description:
        'After approval: dry-run record (default) or hostPerformed send. HOST-FIRST: use Gmail/SMS/voice MCP if user approved, then set hostPerformed true. Refuses without record_user_approval(send_message).',
      inputSchema: {
        type: 'object',
        properties: {
          job_id: { type: 'string' },
          dryRun: { type: 'boolean' },
          body: { type: 'string' },
          to: { type: 'string' },
          channel: { type: 'string' },
          hostPerformed: { type: 'boolean' },
          hostResult: { type: 'object' },
        },
        required: ['job_id'],
      },
    },
    {
      name: 'record_outbound',
      description: 'Record that host already sent message (still requires prior send_message approval).',
      inputSchema: {
        type: 'object',
        properties: {
          job_id: { type: 'string' },
          body: { type: 'string' },
          channel: { type: 'string' },
          to: { type: 'string' },
          dryRun: { type: 'boolean' },
          hostResult: { type: 'object' },
        },
        required: ['job_id', 'body'],
      },
    },
    {
      name: 'ingest_provider_message',
      description:
        'Record provider reply (from host Gmail tool or user paste). Advances checklist only after outreach sent. Host should extract structured quote fields.',
      inputSchema: {
        type: 'object',
        properties: {
          job_id: { type: 'string' },
          body: { type: 'string' },
          from: { type: 'string' },
          channel: { type: 'string' },
        },
        required: ['job_id', 'body'],
      },
    },
    {
      name: 'confirm_appointment',
      description: 'Confirm schedule after commit_money_or_time approval.',
      inputSchema: {
        type: 'object',
        properties: { job_id: { type: 'string' }, scheduled_at: { type: 'string' } },
        required: ['job_id', 'scheduled_at'],
      },
    },
  ];
}
