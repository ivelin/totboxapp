# Product

What Totbox **ships** to users (job PM, MCP, UI).

| Path | Role |
|------|------|
| [`../src/`](../src/) | Next.js app (UI, API routes, `src/lib` job PM) — stays at repo root for Next conventions |
| [`../public/`](../public/) | Static assets (Next) |
| [`server/`](server/) | MCP HTTP server (`npm run dev:mcp`) |
| [`scripts/`](scripts/) | Product smokes, seed, verify helpers |

Company OS runtime is **not** here — see [`../company/`](../company/) and [`../docs/company-os/`](../docs/company-os/).
