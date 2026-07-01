/**
 * MCP transcript helper for honest server-side logging during verification.
 * Writes ONLY when MCP_TRANSCRIPT_PATH env var is explicitly set.
 * No writes, no fallbacks, no hardcoded paths otherwise.
 */
import * as fs from 'fs';

export function appendMcpTranscript(line: string): void {
  const p = process.env.MCP_TRANSCRIPT_PATH;
  if (!p) return;
  try {
    fs.appendFileSync(p, line + '\n');
  } catch {
    // ignore
  }
}