import type {
  CompanyOsState,
  DecisionTrace,
  FounderApproval,
  GateStatus,
  ReadyForHumanEyes,
  ReadyForHumanEyesStatus,
  TraceLabel,
  TransitionResult,
} from './types';
import {
  JOURNEY_PHASE_LABELS,
  JOURNEY_PHASE_MAX,
  JOURNEY_PHASE_MIN,
  LOOP_STAGE_LABELS,
  LOOP_STAGE_MAX,
  LOOP_STAGE_MIN,
} from './types';

function nowIso(): string {
  return new Date().toISOString();
}

function id(prefix: string): string {
  return `${prefix}_${Math.random().toString(16).slice(2, 10)}`;
}

/** Seed state for Totbox living instance (public-safe; not market gospel). */
export function defaultCompanyState(companyId = 'totboxapp'): CompanyOsState {
  const at = nowIso();
  return {
    version: 1,
    companyId,
    // Product Phase 1 loop is largely built; journey 6 = EDD build, loop 4 = testing
    journeyPhase: 6,
    loopStage: 4,
    gateStatus: 'open',
    autonomyPosture: 'strict',
    readyForHumanEyes: {
      status: 'unknown',
      happyPath:
        'Cold user can complete thin household job path on a shareable surface without founder babysitting',
    },
    scores: {
      completion: 0.86,
      notes:
        'Engineering smoke/tests strong; business Phase 1 exit (real house jobs) still open',
    },
    founderApprovals: [],
    openQuestions: [
      'What numbers must a real job hit before we build more?',
      'When is the next real household job, with a short honest write-up after?',
      'When is the next weekly “where do we stand?” check-in?',
      'Is Ready for human eyes green before any mentor “try this product” ask?',
    ],
    lastAction: 'seeded default company state',
    createdAt: at,
    updatedAt: at,
  };
}

/** Plain-English posture lines for founders (no cryptic jargon). */
const POSTURE_PLAIN: Record<string, string> = {
  strict: 'Strict — AI may only draft and dry-run; you approve send, spend, and big moves',
  auto: 'Auto — AI may do safe internal work; you still approve send, spend, and big moves',
  dangerous: 'Dangerous — almost no pauses (easy to mess up; avoid early)',
};

const GATE_PLAIN: Record<string, string> = {
  open: 'Open — you can keep going',
  ready_for_review: 'Ready for your review — a decision is waiting',
  blocked: 'Blocked — something is stuck',
  waiting_for_founder: 'Waiting for you — system will not advance without your OK',
};

const HUMAN_EYES_PLAIN: Record<ReadyForHumanEyesStatus, string> = {
  unknown:
    'Unknown — do not ask mentors/users to try a product link until a cold happy path is checked',
  blocked:
    'Blocked — cold happy path failed; fix blockers before external product-test asks',
  green:
    'Green — cold happy path passed (not demand or PMF); external product-test asks OK',
};

function readyEyesLine(state: CompanyOsState): string {
  const r = state.readyForHumanEyes ?? { status: 'unknown' as const };
  const base = HUMAN_EYES_PLAIN[r.status] ?? HUMAN_EYES_PLAIN.unknown;
  const bits: string[] = [`  ${base}`];
  if (r.checkedAt) bits.push(`  Last checked: ${r.checkedAt.slice(0, 10)}`);
  if (r.blockers && r.blockers.length > 0) {
    bits.push(`  Blockers: ${r.blockers.join('; ')}`);
  }
  if (r.evidencePath) bits.push(`  Evidence: ${r.evidencePath}`);
  return bits.join('\n');
}

/**
 * Founder-facing "Where do we stand?" board.
 * Hard rule: plain language, easy to scan, no cryptic dumps.
 */
export function statusSummary(state: CompanyOsState): string {
  const jLabel = JOURNEY_PHASE_LABELS[state.journeyPhase] ?? `phase ${state.journeyPhase}`;
  const lLabel = LOOP_STAGE_LABELS[state.loopStage] ?? `stage ${state.loopStage}`;
  const posture = state.autonomyPosture ?? 'strict';
  const postureLine = POSTURE_PLAIN[posture] ?? posture;
  const gateLine = GATE_PLAIN[state.gateStatus] ?? state.gateStatus;
  const snapshot =
    state.lastSnapshotAt != null && state.lastSnapshotAt !== ''
      ? state.lastSnapshotAt.slice(0, 10)
      : 'never — do a weekly check-in';
  const scores = state.scores;
  const scoreLines: string[] = [];
  if (scores.completion != null) {
    scoreLines.push(
      `  · Finish rate (engineering tests): ${scores.completion} — not the same as “customers love it”`
    );
  }
  if (scores.traceCompleteness != null) {
    scoreLines.push(
      `  · Did we write down why we decided things?: ${scores.traceCompleteness}`
    );
  }
  if (scores.notes) {
    scoreLines.push(`  · Note: ${scores.notes}`);
  }
  const scoreBlock =
    scoreLines.length > 0 ? scoreLines.join('\n') : '  · (none yet — fill honest scores)';
  const questions =
    state.openQuestions.length > 0
      ? state.openQuestions.map((q, i) => `  ${i + 1}. ${q}`).join('\n')
      : '  (none)';
  // lastAction may be machine-ish; show as-is but never as the only story
  const last = state.lastAction ?? '(none)';
  const eyes = state.readyForHumanEyes?.status ?? 'unknown';

  return [
    '══════════════════════════════════════',
    '  WHERE DO WE STAND?  (company snapshot)',
    '══════════════════════════════════════',
    `Company:  ${state.companyId}`,
    '',
    `Slow clock — proving the business:  step ${state.journeyPhase} of 9`,
    `  ${jLabel}`,
    `Fast clock — learning this week:    step ${state.loopStage} of 7`,
    `  ${lLabel}`,
    '',
    `How free is the AI?`,
    `  ${postureLine}`,
    `Next gate`,
    `  ${gateLine}`,
    `Ready for human eyes?`,
    readyEyesLine(state),
    `Last weekly check-in:  ${snapshot}`,
    `Last action:           ${last}`,
    '',
    'Scores (be honest — green tests ≠ product-market fit):',
    scoreBlock,
    '',
    'Top open questions:',
    questions,
    '──────────────────────────────────────',
    `One-line read: slow clock step · fast clock step · gate · human-eyes ${eyes} · what proof is still missing.`,
    'Ask anytime: “Where are we?” — answer from this board in plain words.',
  ].join('\n');
}

/**
 * OS v2.8 — set Ready for human eyes ship gate.
 * green requires a note or evidence path (what cold path passed).
 */
export function setReadyForHumanEyes(
  state: CompanyOsState,
  status: ReadyForHumanEyesStatus,
  opts: {
    note?: string;
    evidencePath?: string;
    blockers?: string[];
    happyPath?: string;
    url?: string;
  } = {}
): TransitionResult {
  if (status === 'green' && !opts.note && !opts.evidencePath) {
    return {
      ok: false,
      state,
      error: 'READY_FOR_HUMAN_EYES_GREEN_NEEDS_EVIDENCE',
      message:
        'REFUSED: marking Ready for human eyes green needs --note or --evidence (what cold path passed).',
    };
  }
  if (status === 'blocked' && (!opts.blockers || opts.blockers.length === 0) && !opts.note) {
    return {
      ok: false,
      state,
      error: 'READY_FOR_HUMAN_EYES_BLOCKED_NEEDS_REASON',
      message:
        'REFUSED: marking blocked needs --note or --blockers (plain-language why cold path failed).',
    };
  }

  const prev = state.readyForHumanEyes ?? { status: 'unknown' as const };
  // blocked: keep reasons; green/unknown: clear blockers unless explicitly passed
  const blockers =
    status === 'blocked'
      ? opts.blockers ?? (opts.note ? [opts.note] : prev.blockers)
      : opts.blockers;

  const ready: ReadyForHumanEyes = {
    status,
    checkedAt: nowIso(),
    evidencePath: opts.evidencePath ?? (status === 'green' ? prev.evidencePath : undefined),
    blockers,
    happyPath: opts.happyPath ?? prev.happyPath,
    url: opts.url ?? prev.url,
  };

  const approvals = [...state.founderApprovals];
  if (status === 'green') {
    const approval: FounderApproval = {
      id: id('ap'),
      kind: 'ready_for_human_eyes',
      granted: true,
      at: nowIso(),
      note: opts.note ?? opts.evidencePath,
    };
    approvals.push(approval);
  }

  const next: CompanyOsState = touch(
    {
      ...state,
      readyForHumanEyes: ready,
      founderApprovals: approvals,
    },
    `ready_for_human_eyes:${status}`
  );

  const trace = makeTrace(
    next,
    'ready_for_human_eyes',
    `Set Ready for human eyes to ${status}`,
    opts.note ??
      (blockers?.length ? blockers.join('; ') : opts.evidencePath ?? status),
    status === 'green'
      ? 'External product-test asks allowed (not PMF)'
      : status === 'blocked'
        ? 'Fix cold-path blockers; re-run gate before mentor/user product asks'
        : 'Run cold happy path before external product-test asks',
    'mixed'
  );

  return {
    ok: true,
    state: next,
    trace,
    message:
      status === 'green'
        ? 'Ready for human eyes: GREEN (cold path evidence recorded — not demand/PMF).'
        : status === 'blocked'
          ? 'Ready for human eyes: BLOCKED — do not draft external product-test asks.'
          : 'Ready for human eyes: UNKNOWN — cold path not yet verified.',
  };
}

function makeTrace(
  state: CompanyOsState,
  decision: string,
  why: string,
  observed: string,
  next: string,
  label: TraceLabel
): DecisionTrace {
  return {
    id: id('tr'),
    at: nowIso(),
    journeyPhase: state.journeyPhase,
    loopStage: state.loopStage,
    decision,
    why,
    observed,
    next,
    label,
  };
}

function touch(state: CompanyOsState, lastAction: string): CompanyOsState {
  return { ...state, lastAction, updatedAt: nowIso() };
}

/**
 * Start or restart a live loop cycle at stage 1 without changing journey phase.
 */
export function startLoop(
  state: CompanyOsState,
  opts: { note?: string; label?: TraceLabel } = {}
): TransitionResult {
  const next: CompanyOsState = touch(
    {
      ...state,
      loopStage: LOOP_STAGE_MIN,
      gateStatus: 'open',
    },
    'start_loop'
  );
  const approval: FounderApproval = {
    id: id('ap'),
    kind: 'start_loop',
    granted: true,
    at: nowIso(),
    note: opts.note ?? 'start or restart live loop at stage 1',
  };
  next.founderApprovals = [...state.founderApprovals, approval];
  const trace = makeTrace(
    next,
    'start_loop',
    opts.note ?? 'Begin live runtime loop at synthetic research',
    `loopStage set to ${LOOP_STAGE_MIN}`,
    'Run stage 1 work or continue when ready',
    opts.label ?? 'mixed'
  );
  return {
    ok: true,
    state: next,
    trace,
    message: `Started live loop at stage ${LOOP_STAGE_MIN}. Journey remains ${next.journeyPhase}/9.`,
  };
}

/**
 * Advance one live loop stage (1→7). After stage 7, wraps to stage 1 (new cycle)
 * without journey advance.
 */
export function continueLoopStage(
  state: CompanyOsState,
  opts: { note?: string; label?: TraceLabel; founderOk?: boolean } = {}
): TransitionResult {
  if (state.gateStatus === 'blocked') {
    return {
      ok: false,
      state,
      error: 'GATE_BLOCKED',
      message: 'Gate is blocked; clear block before continuing the loop.',
    };
  }
  if (state.gateStatus === 'waiting_for_founder' && !opts.founderOk) {
    return {
      ok: false,
      state,
      error: 'WAITING_FOR_FOUNDER',
      message: 'Gate is waiting for founder decision; pass founderOk or resolve the gate.',
    };
  }

  let nextStage = state.loopStage + 1;
  let wrapped = false;
  if (nextStage > LOOP_STAGE_MAX) {
    nextStage = LOOP_STAGE_MIN;
    wrapped = true;
  }

  const next: CompanyOsState = touch(
    {
      ...state,
      loopStage: nextStage,
      gateStatus: 'open',
    },
    wrapped ? 'continue_loop_wrap' : 'continue_loop_stage'
  );

  const trace = makeTrace(
    next,
    wrapped ? 'loop_cycle_complete_restart' : 'advance_loop_stage',
    opts.note ??
      (wrapped ? 'Closed stage 7; started new cycle at stage 1' : 'Advance one live loop stage'),
    `loopStage ${state.loopStage} → ${nextStage}`,
    LOOP_STAGE_LABELS[nextStage] ?? `stage ${nextStage}`,
    opts.label ?? 'mixed'
  );

  return {
    ok: true,
    state: next,
    trace,
    message: wrapped
      ? `Loop cycle complete; restarted at stage ${nextStage}/7. Journey still ${next.journeyPhase}/9.`
      : `Advanced loop stage to ${nextStage}/7 — ${LOOP_STAGE_LABELS[nextStage]}.`,
  };
}

/**
 * Advance journey phase. REFUSES without explicit founder approval.
 */
export function advanceJourneyPhase(
  state: CompanyOsState,
  opts: {
    explicitApproval?: boolean;
    note?: string;
    label?: TraceLabel;
  } = {}
): TransitionResult {
  const target = state.journeyPhase + 1;
  if (target > JOURNEY_PHASE_MAX) {
    return {
      ok: false,
      state,
      error: 'JOURNEY_COMPLETE',
      message: 'Already at journey phase 9; cannot advance further.',
    };
  }

  const hasPriorApproval = state.founderApprovals.some(
    (a) =>
      a.granted &&
      a.kind === 'journey_advance' &&
      (a.targetJourneyPhase === target || a.note?.includes(`authorize_phase_${target}`))
  );

  if (!opts.explicitApproval && !hasPriorApproval) {
    const blocked: CompanyOsState = touch(
      { ...state, gateStatus: 'waiting_for_founder' },
      'journey_advance_refused'
    );
    return {
      ok: false,
      state: blocked,
      error: 'REFUSED_SILENT_JOURNEY_ADVANCE',
      message:
        `REFUSED: cannot advance journey to phase ${target} without explicit founder approval. ` +
        `Call with explicitApproval:true (founder-gated) or record approval note authorize_phase_${target}.`,
    };
  }

  const approvals = [...state.founderApprovals];
  if (opts.explicitApproval) {
    approvals.push({
      id: id('ap'),
      kind: 'journey_advance',
      granted: true,
      at: nowIso(),
      note: opts.note ?? `authorize_phase_${target}`,
      targetJourneyPhase: target,
    });
  }

  const next: CompanyOsState = touch(
    {
      ...state,
      journeyPhase: target,
      gateStatus: 'open',
      founderApprovals: approvals,
    },
    'journey_advance'
  );

  const trace = makeTrace(
    next,
    'advance_journey_phase',
    opts.note ?? `Founder-approved advance to journey phase ${target}`,
    `journeyPhase ${state.journeyPhase} → ${target}`,
    JOURNEY_PHASE_LABELS[target] ?? `phase ${target}`,
    opts.label ?? 'real'
  );

  return {
    ok: true,
    state: next,
    trace,
    message: `Journey advanced to ${target}/9 — ${JOURNEY_PHASE_LABELS[target]}.`,
  };
}

export function setGateStatus(
  state: CompanyOsState,
  gateStatus: GateStatus,
  note?: string
): TransitionResult {
  const next = touch({ ...state, gateStatus }, 'set_gate');
  const trace = makeTrace(
    next,
    'set_gate_status',
    note ?? `gate → ${gateStatus}`,
    `gateStatus=${gateStatus}`,
    'Continue when appropriate',
    'mixed'
  );
  return { ok: true, state: next, trace, message: `Gate set to ${gateStatus}.` };
}

export function updateScores(
  state: CompanyOsState,
  scores: Partial<CompanyOsState['scores']>,
  note?: string
): TransitionResult {
  const next = touch({ ...state, scores: { ...state.scores, ...scores } }, 'update_scores');
  const trace = makeTrace(
    next,
    'update_scores',
    note ?? 'Scoreboard update',
    JSON.stringify(scores),
    'Re-evaluate gates',
    'mixed'
  );
  return { ok: true, state: next, trace, message: 'Scores updated.' };
}

/**
 * Record stage work without auto-advancing journey.
 */
export function runStageWork(
  state: CompanyOsState,
  opts: {
    summary: string;
    label?: TraceLabel;
    scorePatch?: Partial<CompanyOsState['scores']>;
  }
): TransitionResult {
  let next = touch(state, `run_stage_${state.loopStage}`);
  if (opts.scorePatch) {
    next = { ...next, scores: { ...next.scores, ...opts.scorePatch } };
  }
  const stageName = LOOP_STAGE_LABELS[state.loopStage] ?? String(state.loopStage);
  const trace = makeTrace(
    next,
    'run_stage_work',
    `Stage ${state.loopStage} (${stageName})`,
    opts.summary,
    'continue loop stage when ready; founder gate for journey',
    opts.label ?? 'synthetic'
  );
  return {
    ok: true,
    state: next,
    trace,
    message: `Recorded work for loop stage ${state.loopStage}/7 (${stageName}).`,
  };
}

export function assertPhaseBounds(phase: number, stage: number): void {
  if (phase < JOURNEY_PHASE_MIN || phase > JOURNEY_PHASE_MAX) {
    throw new Error(`journeyPhase out of range: ${phase}`);
  }
  if (stage < LOOP_STAGE_MIN || stage > LOOP_STAGE_MAX) {
    throw new Error(`loopStage out of range: ${stage}`);
  }
}
