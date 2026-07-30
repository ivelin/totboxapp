#!/bin/sh
set -eu
cd /workspace

# Primary app (preview) on 8080
if ! curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  npm run dev >>/tmp/app-startup.log 2>&1 &
fi

# Optional standalone MCP on 3001 for local CLI (UI also serves /mcp on 8080)
if ! curl -sf -o /dev/null --max-time 2 http://127.0.0.1:3001/; then
  npm run dev:mcp >>/tmp/mcp-startup.log 2>&1 &
fi

exit 0
