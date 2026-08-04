/**
 * Company Operating System — durable state types (Totbox instance + portable shape).
 * Journey phases 1–9 and live loop stages 1–7 match docs/company-os/operating-system.md.
 */

export const JOURNEY_PHASE_MIN = 1;
export const JOURNEY_PHASE_MAX = 9;
export const LOOP_STAGE_MIN = 1;
export const LOOP_STAGE_MAX = 7;

export type GateStatus =
  | 'open'
  | 'ready_for_review'
  | 'blocked'
  | 'waiting_for_founder';

/** How much the system may do alone (OS v2.6). Default for early solo: strict. */
export type AutonomyPosture = 'strict' | 'auto' | 'dangerous';

export type TraceLabel = 'synthetic' | 'real' | 'mixed';

export type FounderApprovalKind =
  | 'journey_advance'
  | 'journey_kill'
  | 'stage_advance'
  | 'start_loop'
  | 'monetization_path'
  | 'autonomy_posture'
  /** @deprecated use autonomy_posture */
  | 'autonomy_level'
  /** OS v2.8 — mark Ready for human eyes green (or override to share anyway) */
  | 'ready_for_human_eyes'
  | 'other';

/** OS v2.8 — may we ask cold humans to try a product URL? */
export type ReadyForHumanEyesStatus = 'unknown' | 'blocked' | 'green';

export interface ReadyForHumanEyes {
  status: ReadyForHumanEyesStatus;
  /** ISO time of last check or status change */
  checkedAt?: string;
  /** Path to evidence report (e.g. product/READY_FOR_HUMAN_EYES.md) */
  evidencePath?: string;
  /** Plain-language blockers when blocked */
  blockers?: string[];
  /** Happy path one-liner or scenario id */
  happyPath?: string;
  /** URL that was checked (public-safe; no secrets) */
  url?: string;
}

export interface FounderApproval {
  id: string;
  kind: FounderApprovalKind;
  granted: boolean;
  at: string;
  note?: string;
  /** Journey phase this approval authorizes advancing *to* (for journey_advance) */
  targetJourneyPhase?: number;
}

export interface CompanyScores {
  problemEvidence?: number;
  willingness?: number;
  completion?: number;
  extraction?: number;
  escalation?: number;
  timeToResolution?: number;
  traceCompleteness?: number;
  trust?: number;
  approvalFriction?: number;
  rewardVsRisk?: number;
  earlyRevenueAttractiveness?: number;
  notes?: string;
}

export interface CompanyOsState {
  version: 1;
  companyId: string;
  /** Bootstrap journey phase 1–9 */
  journeyPhase: number;
  /** Live loop stage 1–7 */
  loopStage: number;
  gateStatus: GateStatus;
  /** OS v2.6 — how much AI/tools may do alone. Default strict. */
  autonomyPosture: AutonomyPosture;
  /** OS v2.8 — cold-path ship gate before external product-test asks. Default unknown. */
  readyForHumanEyes: ReadyForHumanEyes;
  /** ISO time of last weekly control-plane snapshot (learning ritual). */
  lastSnapshotAt?: string;
  scores: CompanyScores;
  founderApprovals: FounderApproval[];
  openQuestions: string[];
  lastAction?: string;
  updatedAt: string;
  createdAt: string;
}

export interface DecisionTrace {
  id: string;
  at: string;
  journeyPhase: number;
  loopStage: number;
  decision: string;
  why: string;
  observed: string;
  next: string;
  label: TraceLabel;
  evidence?: string;
}

export interface TransitionResult {
  ok: boolean;
  state: CompanyOsState;
  error?: string;
  trace?: DecisionTrace;
  message: string;
}

/** Simple primary names — match Company OS article / blueprint (teenager-friendly). */
export const JOURNEY_PHASE_LABELS: Record<number, string> = {
  1: 'Form thesis and list possible customer groups',
  2: 'Define what success looks like for each group',
  3: 'Synthetic research and first validation',
  4: 'Real-world research and validation',
  5: 'Design the simplest system that can test the winner',
  6: 'Build a tiny slice and test it hard',
  7: 'Try it with real or realistic users',
  8: 'Learn from what happens and improve',
  9: 'Grow only after it clearly works',
};

export const LOOP_STAGE_LABELS: Record<number, string> = {
  1: 'Talk to AI-modeled customers (cheap filter)',
  2: 'Test the idea (sandbox + real interest)',
  3: 'Build the tiny slice',
  4: 'Run tests (fixtures and automated checks)',
  5: 'Score quality against pass/fail rules',
  6: 'Bring in real feedback',
  7: 'Update memory and set the next question',
};
