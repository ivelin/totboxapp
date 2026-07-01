import { searchProviders, getProviderDetailsForToken, getAvailabilityForToken } from './store';

type LooseArgs = Record<string, unknown>;

function getStr(v: unknown): string | undefined {
  return v != null ? String(v) : undefined;
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
    const res = getProviderDetailsForToken(getStr(args.providerId)!, getStr(args.token));
    if (!res) return { content: [{ type: 'text' as const, text: 'Provider not found' }] };
    return { content: [{ type: 'text' as const, text: JSON.stringify(res, null, 2) }] };
  }
  if (name === 'get_availability') {
    const res = getAvailabilityForToken(getStr(args.providerId)!, getStr(args.date)!, getStr(args.token));
    return { content: [{ type: 'text' as const, text: JSON.stringify(res, null, 2) }] };
  }
  return { content: [{ type: 'text' as const, text: JSON.stringify({ error: 'unknown tool ' + name }) }] };
}
