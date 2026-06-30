/**
 * Verification driver for Stage 4 (per strategist).
 * Runs verif-plan steps 1-6 in order.
 * Overwrites: {SCRATCH}/stage4-register.log , mcp-scoped-test.log , verif-all.log
 * Uses external bg for dev:mcp (no spawn in test).
 */
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const SCRATCH = '/tmp/grok-goal-a047ab44ea9b/implementer';

function logTo(file: string, msg: string) {
  fs.appendFileSync(path.join(SCRATCH, file), msg + '\n');
}

async function run() {
  fs.mkdirSync(SCRATCH, { recursive: true });

  // Step 1: git
  const git = await exec('git log --oneline -3 && echo "HEAD: $(git rev-parse --short HEAD)" && git status --porcelain | wc -l');
  logTo('verif-all.log', '=== 1. git ===\n' + git);

  // Step 2: direct reg x2 (use real loop var)
  let regLog = '=== 2. direct registration x2 ===\n';
  for (let i = 1; i <= 2; i++) {
    const out = await exec(`npx tsx -e '
import { registerProvider, getProvidersForToken } from "./src/lib/store.js";
const r = registerProvider({name: "PlanVerif${i}", location: "P", services: ["p"]});
console.log("i=" + ${i} + " token?" + !!r.token + " scoped?" + (getProvidersForToken(r.token).length===1) + " name=" + r.name);
' `);
    regLog += out + '\n';
  }
  fs.writeFileSync(path.join(SCRATCH, 'stage4-register.log'), regLog);

  // Step 3: read dashboard source (just note)
  const dash = await exec('grep -E "(form|name:|services:|location:|rules|MCP Endpoint Generator|token|regenerate|Claude|ChatGPT)" src/app/dashboard/page.tsx | head -10');
  logTo('verif-all.log', '=== 3. dashboard source ===\n' + dash);

  // Step 4: bg dev:mcp (once), invoke test x2
  console.log('Starting external dev:mcp for verif...');
  const mcpProc = spawn('npm', ['run', 'dev:mcp'], { detached: true, stdio: 'ignore' });
  await sleep(5000); // wait ready

  let testLog = '=== 4. mcp + test x2 ===\n';
  for (let i = 1; i <= 2; i++) {
    const out = await exec('npx tsx scripts/test-mcp.ts');
    testLog += `run${i}:\n` + out + '\n';
  }
  fs.writeFileSync(path.join(SCRATCH, 'mcp-scoped-test.log'), testLog);

  try { if (mcpProc.pid) process.kill(-mcpProc.pid); } catch {}
  await sleep(1000);

  // build
  const build = await exec('npm run build');
  logTo('verif-all.log', '=== build ===\n' + build);

  // Step 5: README
  const readme = await exec('grep -A2 "Stage 4" README.md');
  logTo('verif-all.log', '=== 5. README ===\n' + readme);

  // Step 6: evidence (committed files)
  const committed = await exec('git show HEAD:server/mcp.ts | grep -E "dispatchMcpTool|getProviderDetailsForToken|getAvailabilityForToken" | head -3 ; git show HEAD:src/app/dashboard/page.tsx | grep -E "Register|token|MCP Endpoint Generator" | head -2 ; git show HEAD:src/lib/store.ts | grep -E "registerProvider|getProvidersForToken" | head -3');
  logTo('verif-all.log', '=== 6. committed evidence ===\n' + committed);

  logTo('verif-all.log', '=== VERIF COMPLETE ===');
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
