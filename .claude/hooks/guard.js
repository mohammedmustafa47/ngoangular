#!/usr/bin/env node
// Food4U guardrails: Claude Code PreToolUse hook.
// Rules are listed in AGENTS.md ("Guardrails"). "deny" blocks outright; "ask" makes the
// owner approve in the permission prompt. Every block or ask is appended to guard.log.
const fs = require('fs');
const path = require('path');

const BACKEND_DIR = 'c:/users/musta/onedrive/desktop/djangoauth';
const EXTRA_ROOTS = [
  'c:/users/musta/onedrive/desktop/ngoangular', // frontend (for backend sessions)
  'c:/users/musta/appdata/local/temp/claude', // session scratchpad
  'c:/users/musta/.claude/projects/c--users-musta-onedrive-desktop-ngoangular', // Claude memory
];
const SYSTEM_ROOTS = ['c:/program files', 'c:/program files (x86)', 'c:/windows'];

const norm = p => {
  let s = String(p).trim().replace(/^["']|["']$/g, '').replace(/\\/g, '/');
  const m = s.match(/^\/([a-zA-Z])(\/.*)?$/);
  if (m) s = m[1] + ':' + (m[2] || '/');
  return s.toLowerCase().replace(/\/+$/, '');
};
const inside = (p, roots) => roots.some(r => p === r || p.startsWith(r + '/'));

const SECRET_RE = /(^|[\/\s"'=])(\.env(?!\.example)(\.[\w.-]+)?|[\w.-]+\.(jks|keystore|pem|p12|pfx|key)|google-services\.json|id_(rsa|ed25519)[\w.]*|credentials\.json|zappa_settings\.json)(?=$|[\s"'\/;|&)<>])/i;
const PROTECTED_RE = /(\.claude\/(settings(\.local)?\.json|hooks(\/|$))|\.git\/hooks(\/|$)|(^|\/)githooks(\/|$)|\.cursor\/(hooks|cli)|\.codex\/|\.vscode\/settings\.json)/i;
const CONFIG_RE = /(^|\/)(angular\.json|package(-lock)?\.json|capacitor\.config\.ts|tsconfig[\w.]*\.json|settings\.py|requirements\.txt|pipfile(\.lock)?|agents\.md|claude\.md|gemini\.md|\.gitignore|[\w.-]+\.gradle)$/i;
const MIGRATION_RE = /\/migrations\/[^/]+\.py$/i;

const GIT_WRITE_RE = /\bgit(\.exe)?["']?\s+(-[cC]\s+\S+\s+|--?[\w-]+(=\S+)?\s+)*(push|pull|fetch|commit|merge|rebase|reset|checkout|switch|restore|clean|stash|cherry-pick|revert|tag|am|apply|clone|init|config|rm|mv|add|submodule|worktree|gc|prune|filter-branch|filter-repo|update-ref|update-index|notes|bisect|remote\s+(add|remove|rm|set-url|rename)|branch\s+-[dDmMcC])\b/i;
const GH_RE = /(^|[\s;&|("'])gh(\.exe)?\s+\w/i;
const NO_VERIFY_RE = /--no-verify|core\.hooksPath/i;
const DELETE_RE = /(^|[\s;&|("'])(rm|rmdir|rd|del|erase|unlink|ri)\s|remove-item|clear-content|-delete\b|rmtree|os\.remove|os\.unlink|fs\.(rm|unlink|rmdir)|shutil\.move/i;
const DB_RE = /manage\.py["']?\s+(migrate|makemigrations|flush|sqlflush|dbshell|loaddata|squashmigrations|reset_db|shell|createsuperuser|sqlmigrate|test)|(^|[\s;&|("'])(psql|dropdb|createdb|pg_restore|pg_dump|mysql|mysqldump|mysqladmin|sqlite3)(\.exe)?\b|\b(drop\s+(table|database|schema)|truncate\s+table|delete\s+from|alter\s+table)\b/i;
const PACKAGE_RE = /\b(npm|pnpm|yarn)(\.cmd)?\s+(i|install|add|uninstall|remove|rm|un|update|upgrade|up|ci|link|audit\s+fix|dedupe|prune)\b|\bpip3?\s+(install|uninstall)|-m\s+pip\s+(install|uninstall)|\bpipenv\s+(install|uninstall|update|lock)|\bng\s+(update|add)\b/i;
const RELEASE_RE = /\bcap\s+(sync|copy|update|run|open|add)\b|gradlew(\.bat)?\s+[^;&|]*(assemble|bundle|publish|install|sign)|\bkeytool\b|\bjarsigner\b|\bapksigner\b|\bzappa\s+(deploy|update|undeploy|certify)/i;
const OUTSIDE_HINT_RE = /(^|[\s"'=(])~[\/\\]|\$home\b|\$env:(userprofile|appdata|localappdata|homepath)|%(userprofile|appdata|localappdata|homepath)%/i;
const READ_ONLY_START_RE = /^\s*(cat|type|get-content|gc|ls|dir|head|tail|less|more|wc|stat|test-path)\b/i;
const MCP_WRITE_RE = /(send|create|update|delete|trash|share|forward|reply|publish|upload|generate|copy|move|label|mark|respond|append|insert|clear|comment|import|deploy|execute|post|edit|autofill|merge|resize|apply|register|cancel|archive|attach|remove|rename|batch)/i;

let raw = '';
process.stdin.on('data', d => (raw += d)).on('end', () => {
  let data = {};
  try { data = JSON.parse(raw || '{}'); } catch { return; }
  const tool = data.tool_name || '';
  const ti = data.tool_input || {};
  const projectDir = norm(process.env.CLAUDE_PROJECT_DIR || data.cwd || process.cwd());
  const roots = [projectDir, BACKEND_DIR, ...EXTRA_ROOTS];
  const cwd = data.cwd || projectDir;
  const abs = p => {
    const n = norm(p);
    return /^[a-z]:\//.test(n) || /^[a-z]:$/.test(n) ? n : norm(path.resolve(cwd, String(p)));
  };

  const deny = [];
  const ask = [];

  if (['Read', 'Edit', 'Write', 'MultiEdit', 'NotebookEdit', 'Glob', 'Grep'].includes(tool)) {
    const target = ti.file_path || ti.notebook_path || ti.path || cwd;
    const p = abs(target);
    const isWrite = ['Edit', 'Write', 'MultiEdit', 'NotebookEdit'].includes(tool);
    if (!inside(p, roots)) deny.push(`Rule 5: only this project and the backend folder may be accessed (${target}).`);
    if (SECRET_RE.test('/' + p) || (ti.glob && SECRET_RE.test('/' + ti.glob))) deny.push('Secrets: .env files, keys, keystores and credential files may not be read or changed.');
    if (isWrite && PROTECTED_RE.test(p)) deny.push('Guardrail files (.claude settings/hooks, git hooks, other agents\' permission configs) may not be changed by an agent.');
    if (isWrite && MIGRATION_RE.test(p)) ask.push('Rule 3: migration files decide the database schema.');
    if (isWrite && CONFIG_RE.test(p)) ask.push(`Config / rules file change needs approval (${path.basename(p)}).`);
    if (tool === 'Write' && fs.existsSync(target)) ask.push(`Rewriting the whole existing file ${path.basename(p)} needs approval.`);
  }

  if (tool === 'Bash' || tool === 'PowerShell') {
    const cmd = String(ti.command || '');
    const cmdNorm = cmd.replace(/\\/g, '/');
    if (GIT_WRITE_RE.test(cmd) || NO_VERIFY_RE.test(cmd)) deny.push('Rule 2: git commands that change anything (commit, push, pull, fetch, merge, …) are run by the owner only. Give the owner the exact command instead. Read-only status/diff/log/show are allowed.');
    if (GH_RE.test(cmd)) deny.push('Rule 2: GitHub CLI (gh) commands are run by the owner only.');
    if (SECRET_RE.test(cmdNorm)) deny.push('Secrets: .env files, keys, keystores and credential files may not be read or changed.');
    if (PROTECTED_RE.test(cmdNorm) && !READ_ONLY_START_RE.test(cmd)) deny.push('Guardrail files may not be changed by an agent.');
    if (OUTSIDE_HINT_RE.test(cmd)) deny.push('Rule 5: home-folder paths (~, $HOME, %USERPROFILE%) are outside the allowed folders.');
    const paths = cmdNorm.match(/[a-zA-Z]:\/[^\s"'`;|&<>]*|(?<=^|[\s"'=(])\/[a-zA-Z]\/[^\s"'`;|&<>]*/g) || [];
    for (const p of paths) {
      const n = norm(p);
      if (!inside(n, roots) && !inside(n, SYSTEM_ROOTS)) deny.push(`Rule 5: only this project and the backend folder may be accessed (${p}).`);
    }
    if (DELETE_RE.test(cmd)) ask.push('Rule 4: deleting files or folders needs the owner\'s permission.');
    if (DB_RE.test(cmd)) ask.push('Rule 3: database commands (migrate, makemigrations, flush, SQL, mysql, …) need the owner\'s instruction.');
    if (PACKAGE_RE.test(cmd)) ask.push('Installing, removing or updating packages needs approval.');
    if (RELEASE_RE.test(cmd)) ask.push('Android sync/build/signing and deployments need approval.');
  }

  if (tool.startsWith('mcp__') && MCP_WRITE_RE.test(tool.split('__').pop())) {
    ask.push(`Sending, sharing or creating something in an external service needs approval (${tool}).`);
  }
  if (tool === 'Artifact' && !['list', 'read', 'open', 'quickstart'].includes(ti.action || 'publish')) {
    ask.push('Publishing or deleting an artifact needs approval.');
  }

  if (!deny.length && !ask.length) return;
  const decision = deny.length ? 'deny' : 'ask';
  const reason = [...new Set(deny.length ? deny : ask)].join(' ');
  try {
    const summary = JSON.stringify(ti).slice(0, 300);
    fs.appendFileSync(path.join(__dirname, 'guard.log'), `${new Date().toISOString()}\t${decision}\t${tool}\t${reason}\t${summary}\n`);
  } catch {}
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: decision,
      permissionDecisionReason: `[Food4U guardrail] ${reason}`,
    },
  }));
});
