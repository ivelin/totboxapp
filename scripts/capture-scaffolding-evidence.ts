#!/usr/bin/env tsx
/**
 * Orchestrator for capturing Verification plan evidence cleanly.
 * Usage: SCRATCH=/tmp/grok-goal-cd514e5af4b7/implementer npx tsx scripts/capture-scaffolding-evidence.ts
 * Overwrites logs, hard asserts observables, exits 0 only if all good.
 */
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const SCRATCH = process.env.SCRATCH || '/tmp/grok-goal-cd514e5af4b7/implementer';
const ROOT = process.cwd();

const ALLOWLIST = [
  'package.json',
  'package-lock.json',
  'vitest.config.ts',
  '.github/workflows/ci.yml',
  'scripts/eval/',
  'scripts/verify-scaffolding.ts',
  'scripts/capture-scaffolding-evidence.ts',
  'src/lib/',
];

function assertScope() {
  let changedRaw = '';
  try {
    changedRaw = execSync('git diff --name-only origin/feat/expand-scope', { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  } catch {
    try {
      changedRaw = execSync('git diff --name-only HEAD', { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    } catch {
      changedRaw = '';
    }
  }
  const changed = changedRaw.trim().split('\n').filter(Boolean);
  const bad = changed.filter(f => !ALLOWLIST.some(allowed => f === allowed || f.startsWith(allowed)));
  if (bad.length > 0) {
    console.error('ASSERT SCOPE FAIL: out-of-scope files dirty:', bad);
    process.exit(1);
  }
}

function ensureScratch() {
  if (fs.existsSync(SCRATCH)) {
    fs.rmSync(SCRATCH, { recursive: true, force: true });
  }
  fs.mkdirSync(SCRATCH, { recursive: true });
}

function runAndCapture(cmd: string, logFile: string, label: string) {
  console.log(`[${label}] running: ${cmd}`);
  let output = '';
  let exitCode = 0;
  try {
    output = execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (err: unknown) {
    const e = err as { stdout?: string; stderr?: string; status?: number };
    output = (e.stdout || '') + (e.stderr || '');
    exitCode = e.status || 1;
  }
  const full = `=== ${label} ===\nCMD: ${cmd}\nEXIT: ${exitCode}\n${output}\n`;
  fs.appendFileSync(logFile, full);
  return { output, exitCode };
}

function assertNoErrorInCoverage(logPath: string) {
  const content = fs.readFileSync(logPath, 'utf8');
  if (!content.includes('CMD:') || !content.includes('EXIT: 0') || content.includes('ERROR: Coverage')) {
    console.error('ASSERT FAIL: coverage log missing CMD/EXIT:0 or contains ERROR: Coverage');
    process.exit(1);
  }
}

function assertTestPassed(logPath: string) {
  const content = fs.readFileSync(logPath, 'utf8');
  if (!content.includes('CMD:') || !content.includes('EXIT: 0') || !content.includes('9 passed')) {
    console.error('ASSERT FAIL: test log missing CMD/EXIT:0 or "9 passed"');
    process.exit(1);
  }
}

function assertEvalPassed(logPath: string) {
  const content = fs.readFileSync(logPath, 'utf8');
  if (!content.includes('EVAL PASSED')) {
    console.error('ASSERT FAIL: eval log does not show EVAL PASSED');
    process.exit(1);
  }
}

function assertVerifySuccess(logPath: string) {
  const content = fs.readFileSync(logPath, 'utf8');
  if (!content.includes('SUCCESS: merged false vs fallback true')) {
    console.error('ASSERT FAIL: verify log does not show SUCCESS');
    process.exit(1);
  }
}

function assertBuildSuccess(logPath: string) {
  const content = fs.readFileSync(logPath, 'utf8');
  const buildExits = (content.match(/build-run[\s\S]*?EXIT: 0/g) || []).length;
  if (buildExits < 2) {
    console.error('ASSERT FAIL: build runs did not both exit 0');
    process.exit(1);
  }
}

function assertCIEvidence(logPath: string) {
  const content = fs.readFileSync(logPath, 'utf8');
  if (!content.includes('typecheck-exec') || !content.includes('EXIT: 0')) {
    console.error('ASSERT FAIL: ci-evidence.log missing typecheck-exec + EXIT: 0');
    process.exit(1);
  }
}

function main() {
  assertScope();
  ensureScratch();
  console.log(`Capturing to ${SCRATCH}`);

  const testLog = path.join(SCRATCH, 'test-output.log');
  const covLog = path.join(SCRATCH, 'coverage-output.log');
  const evalLog = path.join(SCRATCH, 'eval.log');
  const ciLog = path.join(SCRATCH, 'ci-evidence.log');
  const verLog = path.join(SCRATCH, 'scaffolding-verify.log');

  // STEP 1: test and coverage , twice -- full output (plan describes |tail but we capture full for complete evidence incl passing details)
  for (let i = 1; i <= 2; i++) {
    runAndCapture('npm run test 2>&1', testLog, `test-run${i}`);
    runAndCapture('npm run test:coverage 2>&1', covLog, `coverage-run${i}`);
  }
  assertNoErrorInCoverage(covLog);
  assertTestPassed(testLog);

  // STEP 2: eval twice
  for (let i = 1; i <= 2; i++) {
    runAndCapture('npm run test:eval 2>&1', evalLog, `eval-run${i}`);
  }
  assertEvalPassed(evalLog);

  // STEP 3: ls + cat ci
  fs.writeFileSync(ciLog, '=== ls .github/workflows/ci.yml ===\n');
  runAndCapture('ls -l .github/workflows/ci.yml', ciLog, 'ci-ls');
  runAndCapture('cat .github/workflows/ci.yml', ciLog, 'ci-cat');
  // also run the lint:ci and typecheck for evidence
  runAndCapture('npm run lint:ci 2>&1', ciLog, 'lint:ci-exec');
  runAndCapture('npm run typecheck 2>&1', ciLog, 'typecheck-exec');

  // STEP 4: build + tsx verify twice (full build for complete log)
  for (let i = 1; i <= 2; i++) {
    runAndCapture('npm run build 2>&1', verLog, `build-run${i}`);
    runAndCapture('npx tsx scripts/verify-scaffolding.ts 2>&1', verLog, `verify-run${i}`);
  }
  assertBuildSuccess(verLog);
  assertVerifySuccess(verLog);
  assertCIEvidence(ciLog);

  console.log('All assertions passed. Evidence captured cleanly.');
  process.exit(0);
}

main();
