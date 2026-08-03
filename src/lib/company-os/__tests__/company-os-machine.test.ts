import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  advanceJourneyPhase,
  appendTrace,
  commitTransition,
  continueLoopStage,
  defaultCompanyState,
  defaultStorePaths,
  loadState,
  orchestrateCurrentStage,
  saveState,
  startLoop,
  statusSummary,
} from '../index';

describe('company-os machine (shipped transitions)', () => {
  it('default seed is journey 6 / loop 4 / strict posture for totboxapp', () => {
    const s = defaultCompanyState();
    expect(s.companyId).toBe('totboxapp');
    expect(s.journeyPhase).toBe(6);
    expect(s.loopStage).toBe(4);
    expect(s.autonomyPosture).toBe('strict');
    const board = statusSummary(s);
    // Article promise: plain-language control plane — no cryptic dumps
    expect(board).toContain('WHERE DO WE STAND?');
    expect(board).toContain('step 6 of 9');
    expect(board).toContain('step 4 of 7');
    expect(board).toContain('Build a tiny slice and test it hard');
    expect(board).toContain('Run tests (fixtures and automated checks)');
    expect(board).toContain('Strict');
    expect(board).toContain('How free is the AI?');
    expect(board).toContain('Top open questions');
    expect(board).toContain('One-line read');
    expect(board).not.toContain('posture: strict');
    expect(board).not.toContain('Evaluation-Driven');
    expect(board).not.toMatch(/scores:\s*\{/);
  });

  it('startLoop resets to stage 1 without changing journey', () => {
    const s = defaultCompanyState();
    const r = startLoop(s, { note: 'test start' });
    expect(r.ok).toBe(true);
    expect(r.state.loopStage).toBe(1);
    expect(r.state.journeyPhase).toBe(6);
    expect(r.trace?.decision).toBe('start_loop');
    expect(r.trace?.label).toBe('mixed');
  });

  it('continueLoopStage advances one stage', () => {
    const s = { ...defaultCompanyState(), loopStage: 4 };
    const r = continueLoopStage(s);
    expect(r.ok).toBe(true);
    expect(r.state.loopStage).toBe(5);
    expect(r.state.journeyPhase).toBe(6);
  });

  it('continueLoopStage wraps 7 → 1 without journey advance', () => {
    const s = { ...defaultCompanyState(), loopStage: 7 };
    const r = continueLoopStage(s);
    expect(r.ok).toBe(true);
    expect(r.state.loopStage).toBe(1);
    expect(r.state.journeyPhase).toBe(6);
    expect(r.trace?.decision).toBe('loop_cycle_complete_restart');
  });

  it('REFUSES silent journey advance and sets waiting_for_founder', () => {
    const s = defaultCompanyState();
    const r = advanceJourneyPhase(s);
    expect(r.ok).toBe(false);
    expect(r.error).toBe('REFUSED_SILENT_JOURNEY_ADVANCE');
    expect(r.state.journeyPhase).toBe(6);
    expect(r.state.gateStatus).toBe('waiting_for_founder');
  });

  it('REFUSES continue while gate is waiting_for_founder unless founderOk', () => {
    const s = { ...defaultCompanyState(), gateStatus: 'waiting_for_founder' as const };
    const blocked = continueLoopStage(s);
    expect(blocked.ok).toBe(false);
    expect(blocked.error).toBe('WAITING_FOR_FOUNDER');
    const ok = continueLoopStage(s, { founderOk: true });
    expect(ok.ok).toBe(true);
    expect(ok.state.loopStage).toBe(s.loopStage + 1);
  });

  it('advances journey only with explicitApproval', () => {
    const s = defaultCompanyState();
    const refused = advanceJourneyPhase(s);
    expect(refused.ok).toBe(false);
    const ok = advanceJourneyPhase(s, {
      explicitApproval: true,
      note: 'authorize_phase_7 founder test',
    });
    expect(ok.ok).toBe(true);
    expect(ok.state.journeyPhase).toBe(7);
    expect(ok.state.gateStatus).toBe('open');
    expect(ok.trace?.label).toBe('real');
    expect(ok.state.founderApprovals.some((a) => a.kind === 'journey_advance' && a.granted)).toBe(
      true
    );
  });

  it('orchestrateCurrentStage records stage-4 testing work', () => {
    const s = { ...defaultCompanyState(), loopStage: 4 };
    const r = orchestrateCurrentStage(s, { productSignal: 'npm test: 48 passed' });
    expect(r.ok).toBe(true);
    expect(r.trace?.decision).toBe('run_stage_work');
    expect(r.trace?.observed).toContain('48 passed');
    expect(r.state.scores.completion).toBeDefined();
  });
});

describe('company-os state store (real filesystem)', () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'cos-'));
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it('loadState seeds, continue commits trace, refuse journey persists gate', () => {
    const paths = defaultStorePaths(root);
    const s0 = loadState(paths, true);
    expect(existsSync(paths.statePath)).toBe(true);
    expect(s0.loopStage).toBe(4);

    const cont = continueLoopStage(s0);
    commitTransition(paths, cont);
    const s1 = loadState(paths, false);
    expect(s1.loopStage).toBe(5);
    const traces = readdirSync(paths.tracesDir).filter((f) => f.endsWith('.json'));
    expect(traces.length).toBeGreaterThanOrEqual(1);

    const refused = advanceJourneyPhase(s1);
    expect(refused.ok).toBe(false);
    commitTransition(paths, refused);
    const s2 = loadState(paths, false);
    expect(s2.journeyPhase).toBe(6);
    expect(s2.gateStatus).toBe('waiting_for_founder');

    const raw = JSON.parse(readFileSync(paths.statePath, 'utf8'));
    expect(raw.version).toBe(1);
    expect(raw.companyId).toBe('totboxapp');
  });

  it('startLoop then appendTrace writes labeled decision file', () => {
    const paths = defaultStorePaths(root);
    const s0 = loadState(paths, true);
    const started = startLoop(s0, { note: 'fixture start' });
    commitTransition(paths, started);
    expect(started.state.loopStage).toBe(1);
    if (started.trace) {
      const p = appendTrace(paths, started.trace);
      expect(existsSync(p)).toBe(true);
      const t = JSON.parse(readFileSync(p, 'utf8'));
      expect(t.label).toMatch(/synthetic|real|mixed/);
      expect(t.decision).toBe('start_loop');
    }
  });

  it('saveState round-trips scores', () => {
    const paths = defaultStorePaths(root);
    const s = defaultCompanyState();
    s.scores.rewardVsRisk = 0.55;
    saveState(paths, s);
    const loaded = loadState(paths, false);
    expect(loaded.scores.rewardVsRisk).toBe(0.55);
  });
});
