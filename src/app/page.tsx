export default function TotboxHome() {
  return (
    <div className="min-h-screen bg-white font-sans dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-black dark:bg-white" />
            <span className="font-semibold tracking-tight text-xl">Totbox</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#families" className="hover:underline">For Families</a>
            <a href="#providers" className="hover:underline">For Providers</a>
            <a href="#quickstart" className="hover:underline">Quick Start</a>
            <a href="/dashboard" className="rounded-full border px-4 py-1.5 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-900">Provider Dashboard</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-xs tracking-[2px] uppercase mb-6">
            MCP + Chat Apps • 2026
          </div>
          <h1 className="text-6xl sm:text-7xl font-semibold tracking-tighter leading-none mb-6">
            Disappear the logistics<br />of family life.
          </h1>
          <p className="max-w-2xl mx-auto text-2xl text-zinc-600 dark:text-zinc-400 mb-10">
            Families book activities, care, and home services in one chat.<br />
            Small local operators spend less time on the phone and more time delivering great experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#quickstart" className="inline-flex h-12 items-center justify-center rounded-full bg-black px-8 text-white dark:bg-white dark:text-black font-medium hover:opacity-90">
              Try it in your chat app
            </a>
            <a href="#providers" className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-8 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900">
              For small operators
            </a>
          </div>
          <p className="mt-4 text-sm text-zinc-500">No new app. Works with Grok, Claude, ChatGPT via MCP.</p>
        </section>

        {/* For Families */}
        <section id="families" className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-semibold tracking-tight mb-4">For busy families</h2>
                <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-6">
                  Open your favorite chat app and ask naturally.
                </p>
                <ul className="space-y-3 text-lg">
                  <li>“Find weekend birthday party options for an 8-year-old in Austin under $300”</li>
                  <li>“Book 2 HVAC tune-ups next week and after-school care”</li>
                  <li>“Compare 3 tutors for 5th grade math this month”</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 text-sm font-mono text-zinc-600 dark:text-zinc-400">
                Agent uses Totbox MCP → discovers providers → compares availability, price, reviews → you confirm → booked.
              </div>
            </div>
          </div>
        </section>

        {/* For Providers */}
        <section id="providers" className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-4xl font-semibold tracking-tight mb-4">For small local operators</h2>
            <p className="max-w-2xl text-xl text-zinc-600 dark:text-zinc-400 mb-8">
              Add one MCP endpoint in your chat app. Connect your existing calendar. Inbound requests get qualified and booked with almost no manual work.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Add MCP Endpoint", desc: "One URL + token in Claude / ChatGPT / Grok." },
                { step: "2", title: "Connect Calendar", desc: "Google Calendar OAuth (read availability). Rules for your hours." },
                { step: "3", title: "Focus on delivery", desc: "AI assists qualification & slot suggestion. Confirmed bookings sync to your tools." },
              ].map((s) => (
                <div key={s.step} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                  <div className="text-xs uppercase tracking-widest text-zinc-500 mb-3">STEP {s.step}</div>
                  <div className="font-semibold text-xl mb-2">{s.title}</div>
                  <div className="text-zinc-600 dark:text-zinc-400">{s.desc}</div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm">Onboarding typically takes under 10 minutes. Starting verticals: kids’ activities & entertainment centers, HVAC, tutoring, childcare, sports programs, recurring home maintenance.</p>
            <a href="/dashboard" className="mt-4 inline-block text-sm underline">Open provider dashboard →</a>
          </div>
        </section>

        {/* Architecture teaser (ASCII from README) */}
        <section className="border-y border-zinc-200 dark:border-zinc-800 py-12 bg-zinc-50 dark:bg-black/30">
          <div className="mx-auto max-w-4xl px-6">
            <pre className="text-xs md:text-sm overflow-auto p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded">
{`Consumer Families
       |
       v
Chat Apps (Grok / Claude / ChatGPT)
       |
       |  MCP
       v
+-----------------------------+
|        Totbox Platform      |
|  - MCP Endpoint Generator   |
|  - Onboarding & OAuth       |
|  - Core Orchestration       |
|  - Inbound Automation       |
+-----------------------------+
       |
       |  Webhooks / OAuth
       v
Small Local Providers (Entertainment Centers, HVAC, Tutoring...)`}
            </pre>
          </div>
        </section>

        {/* Quick Start */}
        <section id="quickstart" className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-3xl font-semibold mb-6 tracking-tight">Quick Start</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="uppercase text-xs tracking-widest mb-2 text-zinc-500">Families</div>
                <p className="font-medium mb-2">Just ask in your chat app.</p>
                <p className="text-sm text-zinc-600">Connect the Totbox MCP endpoint (coming in Stage 3) and start with natural language.</p>
              </div>
              <div>
                <div className="uppercase text-xs tracking-widest mb-2 text-zinc-500">Providers</div>
                <p className="font-medium mb-2">Add the MCP endpoint + connect calendar.</p>
                <p className="text-sm text-zinc-600">See full instructions in the dashboard after you register (Stage 4+).</p>
              </div>
            </div>
            <p className="mt-10 text-xs text-zinc-500">Full product plan: <a href="docs/totbox_product_spec.md" className="underline">docs/totbox_product_spec.md</a></p>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-10 text-center text-xs text-zinc-500">
        Built to make family life logistics disappear. Apache-2.0 • <a href="https://github.com/ivelin/totboxapp" className="underline">github.com/ivelin/totboxapp</a>
      </footer>
    </div>
  );
}
