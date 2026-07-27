#!/usr/bin/env tsx
/**
 * Company OS CLI — real entry for status / start / continue / journey / run-stage.
 *
 * Usage:
 *   npm run company-os -- status
 *   npm run company-os -- start [--note "..."]
 *   npm run company-os -- continue
 *   npm run company-os -- advance-journey            # refuses without --approve
 *   npm run company-os -- advance-journey --approve
 *   npm run company-os -- run-stage [--signal "..."]
 *   npm run company-os -- set-gate open|blocked|waiting_for_founder|ready_for_review
 *
 * Entry: company/scripts/company-os.ts
 * State: company/state/company-state.json
 * Traces: traces/decisions/
 */

import { resolve } from 'path';
import {
  advanceJourneyPhase,
  commitTransition,
  continueLoopStage,
  defaultStorePaths,
  loadState,
  orchestrateCurrentStage,
  setGateStatus,
  startLoop,
  statusSummary,
  type GateStatus,
} from '../../src/lib/company-os';

function usage(): never {
  console.error(`Usage: npm run company-os -- <command> [flags]

Commands:
  status
  start [--note TEXT]
  continue
  advance-journey [--approve] [--note TEXT]
  run-stage [--signal TEXT]
  set-gate <open|blocked|waiting_for_founder|ready_for_review>
`);
  process.exit(2);
}

function parseArgs(argv: string[]) {
  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--approve') flags.approve = true;
    else if (a === '--note' || a === '--signal') {
      flags[a.slice(2)] = argv[++i] ?? '';
    } else if (a.startsWith('--')) {
      flags[a.slice(2)] = true;
    } else {
      positional.push(a);
    }
  }
  return { flags, positional };
}

function main() {
  const { flags, positional } = parseArgs(process.argv.slice(2));
  const cmd = positional[0];
  if (!cmd) usage();

  const repoRoot = resolve(process.cwd());
  const paths = defaultStorePaths(repoRoot);
  // status seeds if missing so "where are we?" always works
  const state = loadState(paths, true);

  if (cmd === 'status') {
    console.log(statusSummary(state));
    console.log('scores:', JSON.stringify(state.scores));
    console.log('open_questions:', state.openQuestions.join(' | ') || '(none)');
    console.log('state_path:', paths.statePath);
    process.exit(0);
  }

  if (cmd === 'start') {
    const result = startLoop(state, { note: String(flags.note || '') || undefined });
    commitTransition(paths, result);
    console.log(result.message);
    console.log(statusSummary(result.state));
    process.exit(result.ok ? 0 : 1);
  }

  if (cmd === 'continue') {
    const result = continueLoopStage(state, {
      founderOk: Boolean(flags.approve),
    });
    // Even refused transitions that update gate (waiting) should persist
    commitTransition(paths, result);
    console.log(result.message);
    if (result.error) console.error('error:', result.error);
    console.log(statusSummary(result.state));
    process.exit(result.ok ? 0 : 1);
  }

  if (cmd === 'advance-journey') {
    const result = advanceJourneyPhase(state, {
      explicitApproval: Boolean(flags.approve),
      note: String(flags.note || '') || undefined,
    });
    commitTransition(paths, result);
    console.log(result.message);
    if (result.error) console.error('error:', result.error);
    console.log(statusSummary(result.state));
    process.exit(result.ok ? 0 : 1);
  }

  if (cmd === 'run-stage') {
    const result = orchestrateCurrentStage(state, {
      productSignal: String(flags.signal || '') || undefined,
    });
    commitTransition(paths, result);
    console.log(result.message);
    if (result.trace) {
      console.log('trace:', result.trace.decision, '—', result.trace.observed.slice(0, 200));
    }
    console.log(statusSummary(result.state));
    process.exit(result.ok ? 0 : 1);
  }

  if (cmd === 'set-gate') {
    const g = positional[1] as GateStatus | undefined;
    const allowed: GateStatus[] = [
      'open',
      'blocked',
      'waiting_for_founder',
      'ready_for_review',
    ];
    if (!g || !allowed.includes(g)) usage();
    const result = setGateStatus(state, g);
    commitTransition(paths, result);
    console.log(result.message);
    console.log(statusSummary(result.state));
    process.exit(0);
  }

  usage();
}

main();
