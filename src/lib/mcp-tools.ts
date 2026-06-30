import { searchProviders, getProviderDetailsForToken, getAvailabilityForToken } from './store';

export function dispatchMcpTool(name: string, args: any) {
  if (name === 'search_services') {
    const sliced = searchProviders(args, args.token ? String(args.token) : undefined);
    return { content: [{ type: 'text' as const, text: JSON.stringify(sliced, null, 2) }] };
  }
  if (name === 'get_provider_details') {
    const res = getProviderDetailsForToken(args.providerId, args.token ? String(args.token) : undefined);
    if (!res) return { content: [{ type: 'text' as const, text: 'Provider not found' }] };
    return { content: [{ type: 'text' as const, text: JSON.stringify(res, null, 2) }] };
  }
  if (name === 'get_availability') {
    const res = getAvailabilityForToken(args.providerId, args.date, args.token ? String(args.token) : undefined);
    return { content: [{ type: 'text' as const, text: JSON.stringify(res, null, 2) }] };
  }
  return { content: [{ type: 'text' as const, text: JSON.stringify({ error: 'unknown tool ' + name }) }] };
}
