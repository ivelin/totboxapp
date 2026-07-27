import type {
  CompanyOsState,
  DecisionTrace,
  FounderApproval,
  GateStatus,
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
    scores: {
      completion: 0.86,
      notes:
        'Engineering smoke/tests strong; business Phase 1 exit (real house jobs) still open',
    },
    founderApprovals: [],
    openQuestions: [
      'What numeric Phase 1 business thresholds lock before more build scope?',
      'When will the next real household job produce a redacted stage-6 feedback note?',
    ],
    lastAction: 'seeded_default_state',
    createdAt: at,
    updatedAt: at,
  };
}

export function statusSummary(state: CompanyOsState): string {
  const jLabel = JOURNEY_PHASE_LABELS[state.journeyPhase] ?? `phase ${state.journeyPhase}`;
  const lLabel = LOOP_STAGE_LABELS[state.loopStage] ?? `stage ${state.loopStage}`;
  return [
    `company: ${state.companyId}`,
    `journey: ${state.journeyPhase}/9 — ${jLabel}`,
    `loop: ${state.loopStage}/7 — ${lLabel}`,
    `gate: ${state.gateStatus}`,
    `last: ${state.lastAction ?? '(none)'}`,
    `updated: ${state.updatedAt}`,
  ].join('\n');
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
