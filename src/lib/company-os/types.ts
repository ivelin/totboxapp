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

export type TraceLabel = 'synthetic' | 'real' | 'mixed';

export type FounderApprovalKind =
  | 'journey_advance'
  | 'journey_kill'
  | 'stage_advance'
  | 'start_loop'
  | 'monetization_path'
  | 'autonomy_level'
  | 'other';

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

export const JOURNEY_PHASE_LABELS: Record<number, string> = {
  1: 'Form thesis and list ICPs (Ideation)',
  2: 'Define success per group (Vision/ICP)',
  3: 'Synthetic research (Discovery synthetic leg)',
  4: 'Real-world research + monetization stress',
  5: 'Design simplest system (Architecture)',
  6: 'Build tiny slice (Evaluation-Driven)',
  7: 'Real/realistic users (Test & early launch)',
  8: 'Learn & improve (Traction)',
  9: 'Grow after proof (Scale)',
};

export const LOOP_STAGE_LABELS: Record<number, string> = {
  1: 'Synthetic user research',
  2: 'Validation / concept testing',
  3: 'Product building',
  4: 'Testing (synthetic + automated)',
  5: 'Evaluation',
  6: 'Real user feedback ingestion',
  7: 'Memory update & loop back',
};
