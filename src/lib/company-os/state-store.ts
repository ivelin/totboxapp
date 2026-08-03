import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  appendFileSync,
} from 'fs';
import { dirname, join } from 'path';
import type { CompanyOsState, DecisionTrace } from './types';
import { defaultCompanyState } from './machine';

export interface StorePaths {
  statePath: string;
  tracesDir: string;
}

export function defaultStorePaths(repoRoot: string = process.cwd()): StorePaths {
  return {
    statePath: join(repoRoot, 'company', 'state', 'company-state.json'),
    tracesDir: join(repoRoot, 'traces', 'decisions'),
  };
}

export function ensureStoreDirs(paths: StorePaths): void {
  mkdirSync(dirname(paths.statePath), { recursive: true });
  mkdirSync(paths.tracesDir, { recursive: true });
}

export function loadState(paths: StorePaths, seedIfMissing = true): CompanyOsState {
  ensureStoreDirs(paths);
  if (!existsSync(paths.statePath)) {
    if (!seedIfMissing) {
      throw new Error(`company-os state not found at ${paths.statePath}`);
    }
    const seeded = defaultCompanyState();
    saveState(paths, seeded);
    return seeded;
  }
  const raw = readFileSync(paths.statePath, 'utf8');
  const parsed = JSON.parse(raw) as CompanyOsState;
  if (parsed.version !== 1) {
    throw new Error(
      `unsupported company-os state version: ${String((parsed as { version?: unknown }).version)}`
    );
  }
  // v2.6 dogfood: older state files may lack posture — default Strict
  if (!parsed.autonomyPosture) {
    parsed.autonomyPosture = 'strict';
  }
  return parsed;
}

export function saveState(paths: StorePaths, state: CompanyOsState): void {
  ensureStoreDirs(paths);
  writeFileSync(paths.statePath, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

export function appendTrace(paths: StorePaths, trace: DecisionTrace): string {
  ensureStoreDirs(paths);
  const file = join(paths.tracesDir, `${trace.at.slice(0, 10)}_${trace.id}.json`);
  writeFileSync(file, JSON.stringify(trace, null, 2) + '\n', 'utf8');
  const logPath = join(paths.tracesDir, 'trace-index.jsonl');
  appendFileSync(
    logPath,
    JSON.stringify({ id: trace.id, at: trace.at, file, decision: trace.decision }) + '\n',
    'utf8'
  );
  return file;
}

export function listTraceFiles(paths: StorePaths): string[] {
  if (!existsSync(paths.tracesDir)) return [];
  return readdirSync(paths.tracesDir)
    .filter((f) => f.endsWith('.json'))
    .sort();
}

/** Apply a transition result: persist state + optional trace. */
export function commitTransition(
  paths: StorePaths,
  result: { ok: boolean; state: CompanyOsState; trace?: DecisionTrace }
): { statePath: string; tracePath?: string } {
  saveState(paths, result.state);
  let tracePath: string | undefined;
  if (result.trace) {
    tracePath = appendTrace(paths, result.trace);
  }
  return { statePath: paths.statePath, tracePath };
}
