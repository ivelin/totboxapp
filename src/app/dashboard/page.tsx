export default function ProviderDashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/" className="text-sm text-zinc-500 hover:underline">← Back to Totbox</a>
            <h1 className="text-3xl font-semibold tracking-tight mt-1">Provider Dashboard</h1>
            <p className="text-zinc-600 dark:text-zinc-400">Stage 1 placeholder • Full flows in later stages</p>
          </div>
          <div className="text-xs px-3 py-1 rounded bg-amber-100 text-amber-900 border border-amber-200">MVP WIP</div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
            <h3 className="font-semibold mb-3">Your MCP Endpoint (coming Stage 4)</h3>
            <div className="font-mono text-sm bg-zinc-100 dark:bg-black p-3 rounded border">https://your-totbox.example/mcp</div>
            <p className="mt-2 text-sm text-zinc-600">You will receive a unique token + instructions to add this to your chat app.</p>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
            <h3 className="font-semibold mb-3">Quick Links (will be real)</h3>
            <ul className="space-y-2 text-sm">
              <li>→ Connect Google Calendar (Stage 5)</li>
              <li>→ Set availability rules (Stage 7)</li>
              <li>→ View inbound bookings (Stage 6+)</li>
              <li>→ Test MCP queries</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-xs text-zinc-500">
          This page will become the real provider onboarding and management UI. See the plan in <code>plan.md</code> (session) or the product spec.
        </div>
      </div>
    </div>
  );
}
