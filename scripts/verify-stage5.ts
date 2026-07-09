/**
 * Verification driver for Stage 5.
 * Use SCRATCH=... to control where logs are written (defaults to a local temp dir
 * that can be cleaned easily). Do not hardcode goal-specific /tmp paths.
 */
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const defaultScratch = path.join(process.cwd(), '.verif-scratch');
const SCRATCH = process.env.SCRATCH || defaultScratch;

function logTo(file: string, msg: string) {
  fs.appendFileSync(path.join(SCRATCH, file), msg + '\n');
}

function writeLog(file: string, msg: string) {
  fs.writeFileSync(path.join(SCRATCH, file), msg + '\n');
}

async function run() {
  // Clean previous run artifacts so we don't accumulate junk in the scratch dir.
  try { fs.rmSync(SCRATCH, { recursive: true, force: true }); } catch {}
  fs.mkdirSync(SCRATCH, { recursive: true });

  // clear canonical logs
  writeLog('stage5-availability.log', '');
  writeLog('stage5-mcp.log', '');
  writeLog('mcp-real.log', '=== mcp server log (from transcript) ===\n');

  console.log('Starting Stage 5 verification...');

  // Step 3-ish: direct store x2 (test-stage5.ts does register+conn+merge asserts)
  let availLog = '=== 3. direct store availability x2 ===\n';
  for (let i = 1; i <= 2; i++) {
    const out = await exec('npx tsx scripts/test-stage5.ts');
    availLog += `run${i}:\n` + out + '\n';
  }
  writeLog('stage5-availability.log', availLog);

  // Step 4: bg dev:mcp via proper spawn (env for transcript path, stdio ignore), client x2; hard asserts on server transcript + client
  console.log('Starting external dev:mcp ...');
  const mcpLogPath = path.join(SCRATCH, 'mcp-real.log');
  fs.writeFileSync(mcpLogPath, '=== mcp server log (from transcript) ===\n');
  const mcpProc = spawn('npm', ['run', 'dev:mcp'], {
    detached: true,
    stdio: 'ignore',
    env: { ...process.env, MCP_TRANSCRIPT_PATH: mcpLogPath }
  });
  // poll for genuine server listening emission (up to ~12s)
  let waited = 0;
  const pollMs = 400;
  while (waited < 12000) {
    try {
      const content = fs.readFileSync(mcpLogPath, 'utf8');
      if (content.includes('[MCP_TRANSCRIPT] listening')) break;
    } catch {}
    await sleep(pollMs);
    waited += pollMs;
  }
  await sleep(800); // small extra settle for transport

  let mcpLog = '=== 4. mcp get_availability x2 (real fetch) ===\n';
  for (let i = 1; i <= 2; i++) {
    const out = await exec(`npx tsx scripts/test-stage5-mcp.ts ${i}`);
    mcpLog += `run${i}:\n` + out + '\n';
  }
  fs.appendFileSync(path.join(SCRATCH, 'stage5-mcp.log'), mcpLog);

  try { if (mcpProc.pid) process.kill(-mcpProc.pid); } catch {}
  await sleep(300);

  // hard asserts (server transcript has listening + full RESPs; client stdout has full bodies)
  const serverListening = (await exec(`grep -c '\\[MCP_TRANSCRIPT\\] listening' ${mcpLogPath} || echo 0`)).trim();
  const serverResp = (await exec(`grep -c '\\[MCP_TRANSCRIPT\\] RESP' ${mcpLogPath} || echo 0`)).trim();
  const clientBodies = (await exec(`grep -c '"jsonrpc"' ${path.join(SCRATCH, 'stage5-mcp.log')} || echo 0`)).trim();
  console.log('server listening:', serverListening, 'RESPs:', serverResp, 'client bodies:', clientBodies);
  if (parseInt(serverListening) < 1 || parseInt(serverResp) < 4 || parseInt(clientBodies) < 4) {
    console.error('FAIL: missing server transcript (listening+RESPs) or client bodies for x2');
    process.exit(1);
  }


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
