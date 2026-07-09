import {
  searchProviders,
  getProviderDetailsForToken,
  getAvailabilityForToken,
  createServiceBrief,
  compareOptions,
} from './store';
import type { ServiceCategory } from './types';

type LooseArgs = Record<string, unknown>;

function getStr(v: unknown): string | undefined {
  return v != null ? String(v) : undefined;
}

function getNum(v: unknown): number | undefined {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v);
  return undefined;
}

export function dispatchMcpTool(name: string, args: LooseArgs) {
  if (name === 'search_services') {
    const sliced = searchProviders({
      query: getStr(args.query),
      category: getStr(args.category),
      location: getStr(args.location),
      limit: typeof args.limit === 'number' ? args.limit : undefined,
    }, getStr(args.token));
    return { content: [{ type: 'text' as const, text: JSON.stringify(sliced, null, 2) }] };
  }
  if (name === 'get_provider_details') {
    const pid = getStr(args.providerId) || '';
    const t = getStr(args.token);
    const res = getProviderDetailsForToken(pid, t);
    if (!res) return { content: [{ type: 'text' as const, text: 'Provider not found' }] };
    return { content: [{ type: 'text' as const, text: JSON.stringify(res, null, 2) }] };
  }
  if (name === 'get_availability') {
    const pid = getStr(args.providerId) || '';
    const d = getStr(args.date) || '';
    const t = getStr(args.token);
    const res = getAvailabilityForToken(pid, d, t);
    return { content: [{ type: 'text' as const, text: JSON.stringify(res, null, 2) }] };
  }
  if (name === 'create_service_brief') {
    const naturalLanguage = getStr(args.naturalLanguage) || getStr(args.text) || '';
    if (!naturalLanguage) {
      return { content: [{ type: 'text' as const, text: JSON.stringify({ error: 'naturalLanguage required' }) }] };
    }
    const prioritiesRaw = args.priorities;
    const priorities = Array.isArray(prioritiesRaw)
      ? prioritiesRaw.map(String)
      : undefined;
    const brief = createServiceBrief({
      naturalLanguage,
      category: getStr(args.category) as ServiceCategory | undefined,
      serviceType: getStr(args.serviceType),
      priorities,
      budgetUsd: getNum(args.budgetUsd),
      location: getStr(args.location),
      dateWindow: getStr(args.dateWindow),
    });
    return { content: [{ type: 'text' as const, text: JSON.stringify(brief, null, 2) }] };
  }
  if (name === 'compare_options') {
    const res = compareOptions({
      briefId: getStr(args.briefId),
      naturalLanguage: getStr(args.naturalLanguage) || getStr(args.text),
      category: getStr(args.category),
      location: getStr(args.location),
      budgetUsd: getNum(args.budgetUsd),
      query: getStr(args.query),
      limit: typeof args.limit === 'number' ? args.limit : undefined,
    });
    return { content: [{ type: 'text' as const, text: JSON.stringify(res, null, 2) }] };
  }
  return { content: [{ type: 'text' as const, text: JSON.stringify({ error: 'unknown tool ' + name }) }] };
}
