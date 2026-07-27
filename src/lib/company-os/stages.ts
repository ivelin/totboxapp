/**
 * Minimal orchestration for live loop stages.
 * Framework: pure TypeScript stage runner (no LangGraph/Python sidecar for v1).
 * See docs/company-os/instance/ORCHESTRATION.md
 */

import type { CompanyOsState, TransitionResult } from './types';
import { LOOP_STAGE_LABELS } from './types';
import { runStageWork } from './machine';

// TransitionResult used as return type of orchestrateCurrentStage

export interface StageContext {
  /** Optional product signal, e.g. last test command exit summary */
  productSignal?: string;
}

/**
 * Run the current loop stage's computable path.
 * Stage 4 uses productSignal (tests) when provided.
 */
export function orchestrateCurrentStage(
  state: CompanyOsState,
  ctx: StageContext = {}
): TransitionResult {
  const stage = state.loopStage;
  const label = LOOP_STAGE_LABELS[stage] ?? `stage ${stage}`;

  switch (stage) {
    case 1:
      return runStageWork(state, {
        summary:
          `Synthetic research pass: review research/icps and challenger groups. ${ctx.productSignal ?? ''}`.trim(),
        label: 'synthetic',
        scorePatch: { problemEvidence: state.scores.problemEvidence ?? 0.5 },
      });
    case 2:
      return runStageWork(state, {
        summary:
          `Validation: re-check reward/risk for primary ICP; do not promote without real evidence. ${ctx.productSignal ?? ''}`.trim(),
        label: 'synthetic',
      });
    case 3:
      return runStageWork(state, {
        summary:
          `Build note: keep slice EDD-scoped; product job PM remains separate. ${ctx.productSignal ?? ''}`.trim(),
        label: 'mixed',
      });
    case 4:
      return runStageWork(state, {
        summary:
          ctx.productSignal ??
          'Testing stage: run npm test / smoke:job and record completion/extraction proxies on scoreboard.',
        label: 'synthetic',
        scorePatch: {
          completion: state.scores.completion ?? 0.8,
          traceCompleteness: 0.7,
        },
      });
    case 5:
      return runStageWork(state, {
        summary:
          `Evaluation: compare scores to thresholds; recommend Advance/Iterate/Hold/Kill for founder. ${ctx.productSignal ?? ''}`.trim(),
        label: 'mixed',
        scorePatch: {
          earlyRevenueAttractiveness: state.scores.earlyRevenueAttractiveness ?? 0.3,
        },
      });
    case 6:
      return runStageWork(state, {
        summary:
          ctx.productSignal ??
          'Real feedback: ingest redacted household/pilot notes only (no PII in git). Label traces real.',
        label: 'real',
      });
    case 7:
      return runStageWork(state, {
        summary:
          `Memory update: version personas/hypotheses, update open questions, set next stage-1 focus. ${ctx.productSignal ?? ''}`.trim(),
        label: 'mixed',
        scorePatch: {
          notes: `stage7_memory_${new Date().toISOString().slice(0, 10)}`,
        },
      });
    default:
      return runStageWork(state, {
        summary: `Unknown stage ${stage} (${label})`,
        label: 'mixed',
      });
  }
}
