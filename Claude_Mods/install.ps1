# Installs every mod in this folder into Claude Code (user scope) and builds the VS Code extension.
# Run from any folder:  powershell -File install.ps1 [-VsCodeProfiles <name>,<name>]
# Safe to run again: it refreshes the marketplace and reinstalls or updates each mod.
param([string[]]$VsCodeProfiles = @())
$ErrorActionPreference = 'Stop'
$here = $PSScriptRoot
$market = 'claude-mods'
$mods = 'prompt-pad', 'usage-status'

foreach ($tool in 'claude', 'code') {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) { throw "'$tool' is not on PATH. Install it first (see README.txt)." }
}

# 1. This folder becomes a local marketplace (added once; refreshed on later runs).
$known = (claude plugin marketplace list) -join "`n"
if ($known -match [regex]::Escape($market)) { claude plugin marketplace update $market }
else { claude plugin marketplace add $here }

# 2. Each mod, at user scope (every project, every session).
$installed = (claude plugin list) -join "`n"
foreach ($m in $mods) {
    if ($installed -match [regex]::Escape("$m@$market")) { claude plugin update "$m@$market" }
    else { claude plugin install "$m@$market" }
}

# 3. prompt-pad's VS Code half.
& powershell -NoProfile -File (Join-Path $here 'prompt-pad\vscode-extension\build.ps1') -Profiles $VsCodeProfiles

# 4. A mod loaded twice (here and from an old CLAUDE_CODE_PLUGIN_DIRS entry) runs its hooks twice.
$settings = Join-Path $env:USERPROFILE '.claude\settings.json'
if ((Test-Path $settings) -and ((Get-Content $settings -Raw) -match 'CLAUDE_CODE_PLUGIN_DIRS')) {
    Write-Warning "settings.json still has CLAUDE_CODE_PLUGIN_DIRS. Remove the entries for $($mods -join ', ') from it, or the mods load twice."
}

Write-Host "Done. Restart Claude Code, and reload VS Code (Ctrl+Shift+P > Reload Window)."
