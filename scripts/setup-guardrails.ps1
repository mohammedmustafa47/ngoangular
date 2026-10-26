# Food4U guardrail setup. Run this YOURSELF (agents are blocked from these steps):
#   powershell -ExecutionPolicy Bypass -File scripts\setup-guardrails.ps1
# Safe to re-run: every step checks whether it's already done. Also use it after a fresh clone.

$ErrorActionPreference = 'Stop'
$fe = 'C:\Users\musta\OneDrive\Desktop\ngoangular'
$be = 'C:\Users\musta\OneDrive\Desktop\djangoauth'
$utf8 = New-Object System.Text.UTF8Encoding $false

function Done($msg) { Write-Host "[ok] $msg" -ForegroundColor Green }

# 1. Git hooks in both repos (block commits/pulls/pushes from AI agents only)
foreach ($repo in @($fe, $be)) {
    foreach ($hook in @('reference-transaction', 'pre-push')) {
        Copy-Item "$fe\githooks\$hook" "$repo\.git\hooks\$hook" -Force
    }
    Done "git hooks installed in $repo"
}

# 2. Three edits to the Claude Code guard
$guardPath = "$fe\.claude\hooks\guard.js"
$guard = [IO.File]::ReadAllText($guardPath)
if (-not $guard.Contains("'c:/users/musta/onedrive/desktop/ngoangular',")) {
    $guard = $guard.Replace("const EXTRA_ROOTS = [", "const EXTRA_ROOTS = [`n  'c:/users/musta/onedrive/desktop/ngoangular', // frontend (for backend sessions)")
}
if (-not $guard.Contains('(^|\/)githooks(\/|$)')) {
    $guard = $guard.Replace('|\.git\/hooks(\/|$)|', '|\.git\/hooks(\/|$)|(^|\/)githooks(\/|$)|')
}
if (-not $guard.Contains('|sqlmigrate|test)')) {
    $guard = $guard.Replace('|sqlmigrate)', '|sqlmigrate|test)')
}
[IO.File]::WriteAllText($guardPath, $guard, $utf8)
Done "guard.js updated (frontend access for backend sessions, githooks/ protected, manage.py test asks first)"

# 3. Claude Code settings for sessions started in the backend folder
$beSettings = "$be\.claude\settings.json"
if (-not (Test-Path $beSettings)) {
    New-Item -ItemType Directory -Force "$be\.claude" | Out-Null
    $json = @'
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "additionalDirectories": ["C:\\Users\\musta\\OneDrive\\Desktop\\ngoangular"],
    "deny": [
      "Bash(git push:*)", "Bash(git pull:*)", "Bash(git fetch:*)", "Bash(git commit:*)",
      "Bash(git merge:*)", "Bash(git rebase:*)", "Bash(git reset:*)", "Bash(git clean:*)",
      "Bash(git config:*)", "Bash(gh:*)",
      "Read(**/.env)", "Read(**/.env.*)", "Read(**/zappa_settings.json)",
      "Edit(.claude/settings.json)", "Edit(.claude/hooks/**)", "Edit(.git/hooks/**)"
    ]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"C:/Users/musta/OneDrive/Desktop/ngoangular/.claude/hooks/guard.js\"",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
'@
    [IO.File]::WriteAllText($beSettings, $json, $utf8)
}
Done "backend .claude\settings.json in place"

# 4. Backend .env: secret key, debug flag, DB password (only adds what's missing)
$envPath = "$be\.env"
$envText = if (Test-Path $envPath) { [IO.File]::ReadAllText($envPath) } else { '' }
$add = @()
if ($envText -notmatch '(?m)^DJANGO_SECRET_KEY=.+') {
    $key = (& python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())").Trim()
    $add += "DJANGO_SECRET_KEY=$key"
}
if ($envText -notmatch '(?m)^DJANGO_DEBUG=') { $add += 'DJANGO_DEBUG=True' }
if ($envText -notmatch '(?m)^DB_PASSWORD=') {
    $secure = Read-Host 'Enter your MySQL root password (hidden)' -AsSecureString
    $plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
    $add += "DB_PASSWORD=$plain"
}
if ($add.Count) {
    $prefix = if ($envText -and -not $envText.EndsWith("`n")) { "`n" } else { '' }
    [IO.File]::AppendAllText($envPath, $prefix + ($add -join "`n") + "`n", $utf8)
}
Done ".env has DJANGO_SECRET_KEY, DJANGO_DEBUG and DB_PASSWORD"

# 5. Verify the backend starts
Push-Location $be
try { & python manage.py check } finally { Pop-Location }

Write-Host "`nAll set. Now commit the new files yourself:" -ForegroundColor Cyan
Write-Host "  cd $be; git add .claude/settings.json; git commit -m 'Add Claude Code guardrail settings'; git push"
Write-Host "  cd $fe; git add scripts/setup-guardrails.ps1; git commit -m 'Add guardrail setup script'; git push"
