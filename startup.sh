#!/bin/sh
set -eu
cd /workspace
mkdir -p .data /tmp

# Primary app (preview) on 8080
if ! curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  npm run dev >>/tmp/app-startup.log 2>&1 &
fi

# Optional standalone MCP on 3001 for local CLI
if ! curl -sf -o /dev/null --max-time 2 http://127.0.0.1:3001/; then
  npm run dev:mcp >>/tmp/mcp-startup.log 2>&1 &
fi

# Public tunnel so Grok cloud can reach /mcp (sandbox preview hosts are not public)
start_tunnel() {
  CF_BIN=""
  if [ -x /tmp/cloudflared ]; then
    CF_BIN=/tmp/cloudflared
  elif command -v cloudflared >/dev/null 2>&1; then
    CF_BIN=$(command -v cloudflared)
  fi
  [ -n "$CF_BIN" ] || return 0

  # Already have a live public URL?
  if [ -f .data/public-mcp-url.txt ]; then
    URL=$(cat .data/public-mcp-url.txt)
    if curl -sf -o /dev/null --max-time 5 "$URL"; then
      return 0
    fi
  fi

  # Start quick tunnel if not running
  if ! pgrep -f 'cloudflared tunnel --url' >/dev/null 2>&1; then
    "$CF_BIN" tunnel --url http://127.0.0.1:8080 >>/tmp/cf-tunnel.log 2>&1 &
    # Wait for trycloudflare URL
    i=0
    while [ "$i" -lt 30 ]; do
      i=$((i + 1))
      HOST=$(grep -oE 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com' /tmp/cf-tunnel.log 2>/dev/null | tail -1 || true)
      if [ -n "$HOST" ]; then
        echo "${HOST}/mcp" > .data/public-mcp-url.txt
        echo "[startup] public MCP: ${HOST}/mcp"
        return 0
      fi
      sleep 1
    done
  else
    HOST=$(grep -oE 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com' /tmp/cf-tunnel.log 2>/dev/null | tail -1 || true)
    if [ -n "$HOST" ]; then
      echo "${HOST}/mcp" > .data/public-mcp-url.txt
    fi
  fi
}

start_tunnel || true

exit 0
