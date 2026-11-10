# project-checks runner: Claude Code SessionStart hook.
#
# Runs every check in checks\ against the project the session was started in, and hands what
# they report to Claude as one numbered list to ask the user about first. Checks only look;
# they never change files. Claude makes a change only after the user says yes.
#
# A check is a file checks\<name>.ps1 that takes -ProjectRoot and -ClaudeHome and prints zero
# or more lines; each line is one question for the user, saying what was found and what to do
# on "yes". A check is skipped in a project that has the file .claude\declined\<name>.
#
# Never fails the session: any error is swallowed and nothing is printed.
param([string]$ClaudeHome = (Join-Path $env:USERPROFILE '.claude'))
$ErrorActionPreference = 'Stop'
try {
    $hookInput = $null
    try { $hookInput = [Console]::In.ReadToEnd() | ConvertFrom-Json } catch { }

    $root = $env:CLAUDE_PROJECT_DIR
    if (-not $root -and $hookInput) { $root = $hookInput.cwd }
    if (-not $root) { $root = (Get-Location).Path }
    $root = $root.TrimEnd('\', '/')

    # Only project folders: a git repository, or a folder already set up for agents.
    # The home folder is never a project (its .claude is the user's own).
    $userHome = $env:USERPROFILE.TrimEnd('\')
    $isProject = (Test-Path -LiteralPath (Join-Path $root '.git')) -or
                 (Test-Path -LiteralPath (Join-Path $root '.agent')) -or
                 (Test-Path -LiteralPath (Join-Path $root 'CLAUDE.md'))
    if (-not $isProject -or $root -ieq $userHome) { exit 0 }

    $items = @()
    $checks = Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot 'checks') -Filter '*.ps1' -ErrorAction SilentlyContinue | Sort-Object Name
    foreach ($check in $checks) {
        $name = $check.BaseName
        if (Test-Path -LiteralPath (Join-Path $root ".claude\declined\$name")) { continue }
        try {
            $lines = & $check.FullName -ProjectRoot $root -ClaudeHome $ClaudeHome
            foreach ($line in @($lines)) { if ("$line".Trim()) { $items += "[$name] $line" } }
        } catch { }
    }
    if ($items.Count -eq 0) { exit 0 }

    $list = ($items | ForEach-Object -Begin { $i = 0 } -Process { $i++; "$i. $_" }) -join "`n"
    $text = "project-checks: $($items.Count) item(s) for this project ($root). " +
        "Before anything else, make your first message of this session these numbered questions to the user, " +
        "each answered yes / later / no. On yes, do what the item says. On no, create the empty file " +
        ".claude\declined\<check name> in the project (the name in brackets), so that check stops asking here. " +
        "On later, do nothing. Then carry on with the user's request.`n$list"

    $out = @{ hookSpecificOutput = @{ hookEventName = 'SessionStart'; additionalContext = $text } } | ConvertTo-Json -Compress -Depth 5
    [Console]::Out.Write($out)
} catch { }
exit 0
