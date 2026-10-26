# Git guardrail hooks

These hooks stop AI agents (Claude Code, Codex, Cursor, Copilot, Gemini) from running git commands that change a repository. The owner's own terminal is not affected.

- `reference-transaction` blocks commit, merge, pull, fetch, reset, rebase, tag and branch changes. It can't be skipped with `--no-verify`.
- `pre-push` blocks push.

Agents are detected by environment variables their shells set (`AI_AGENT`, `CLAUDECODE`, `GEMINI_CLI`, `CODEX_SANDBOX`, `CURSOR_AGENT`). An agent that sets none of these is not detected, so the written rules in `AGENTS.md` still apply.

## Install (run in your own terminal, from this folder's parent)

```sh
cp githooks/reference-transaction githooks/pre-push .git/hooks/
cp githooks/reference-transaction githooks/pre-push ../djangoauth/.git/hooks/
```

Re-run after editing the hooks. Git doesn't track `.git/hooks`, so a fresh clone needs this step again.
