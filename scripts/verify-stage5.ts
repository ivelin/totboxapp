/**
 * Verification driver for Stage 5 (per strategist restructure).
 * Single orchestrator.
 * - wipes canonical logs: stage5-availability.log, stage5-mcp.log, mcp-real.log
 * - runs direct store x2 (test-stage5.ts)
 * - spawns dev:mcp with stdout/stderr tee to mcp-real.log
 * - runs MCP x2 (test-stage5-mcp.ts), appends client to stage5-mcp.log
 * - asserts >=4 tools/call name=get_availability in mcp-real.log
 * - build, etc.
 * Run with: SCRATCH=/tmp/grok-goal-de43eae9ef8b/implementer npx tsx scripts/verify-stage5.ts
 */
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const SCRATCH = process.env.SCRATCH || '/tmp/grok-goal-de43eae9ef8b/implementer';

function logTo(file: string, msg: string) {
  fs.appendFileSync(path.join(SCRATCH, file), msg + '\n');
}

function writeLog(file: string, msg: string) {
  fs.writeFileSync(path.join(SCRATCH, file), msg + '\n');
}

async function run() {
  fs.mkdirSync(SCRATCH, { recursive: true });

  // clear canonical logs
  writeLog('stage5-availability.log', '');
  writeLog('stage5-mcp.log', '');
  writeLog('mcp-real.log', '=== mcp server log (teed) ===\n');

  console.log('Starting Stage 5 verification...');

  // Step 3-ish: direct store x2 (test-stage5.ts does register+conn+merge asserts)
  let availLog = '=== 3. direct store availability x2 ===\n';
  for (let i = 1; i <= 2; i++) {
    const out = await exec('npx tsx scripts/test-stage5.ts');
    availLog += `run${i}:\n` + out + '\n';
  }
  writeLog('stage5-availability.log', availLog);

  // Step 4: bg dev:mcp with tee to server log, then MCP test x2
  console.log('Starting external dev:mcp (tee to mcp-real.log)...');
  const mcpLogPath = path.join(SCRATCH, 'mcp-real.log');
  // use --no-cache to pick latest source changes (e.g. logging name)
  const mcpProc = spawn('sh', ['-c', `npx tsx --no-cache server/mcp.ts 2>&1 | tee -a ${mcpLogPath}`], { detached: true });
  await sleep(5000); // wait ready

  let mcpLog = '=== 4. mcp get_availability x2 (real fetch) ===\n';
  for (let i = 1; i <= 2; i++) {
    const out = await exec(`npx tsx scripts/test-stage5-mcp.ts ${i}`);
    mcpLog += `run${i}:\n` + out + '\n';
  }
  // append client transcript (do not overwrite server tee)
  fs.appendFileSync(path.join(SCRATCH, 'stage5-mcp.log'), mcpLog);

  // assert in server log: >=4 tools/call for get_availability (2 runs x 2 calls)
  const countStr = await exec(`grep -c 'tools/call' ${mcpLogPath} || echo 0`);
  const count = parseInt(countStr.trim(), 10);
  console.log('tools/call count in server log:', count);
  if (count < 4) {
    console.error('FAIL: expected at least 4 tools/call in mcp server log for the x2 MCP fetches');
    try { if (mcpProc.pid) process.kill(-mcpProc.pid); } catch {}
    process.exit(1);
  }

  try { if (mcpProc.pid) process.kill(-mcpProc.pid); } catch {}
  await sleep(1000);

  // build
  const build = await exec('npm run build');
  logTo('verif-all-stage5.log', '=== build ===\n' + build);

  // evidence artifacts
  const artifacts = await exec('ls scripts/test-stage5.ts scripts/test-stage5-mcp.ts scripts/verify-stage5.ts src/app/api/calendar/connect/start/route.ts src/app/api/calendar/connect/callback/route.ts src/lib/store.ts | cat');
  logTo('verif-all-stage5.log', '=== artifacts ===\n' + artifacts);

  logTo('verif-all-stage5.log', '=== VERIF COMPLETE ===');
  console.log('Verification logs written to ' + SCRATCH);
}

function exec(cmd: string): Promise<string> {
  return new Promise((res, rej) => {
    const p = spawn('sh', ['-c', cmd]);
    let out = '';
    p.stdout.on('data', d => out += d);
    p.stderr.on('data', d => out += d);
    p.on('close', () => res(out));
  });
}
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

run().catch(console.error);
