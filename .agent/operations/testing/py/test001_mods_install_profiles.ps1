# Test 001 (REQ-001): Claude_Mods/install.ps1 calls build.ps1 correctly with and without
# -VsCodeProfiles. Runs a copy of the installer in a sandbox with stub claude, code and build.ps1,
# so nothing outside .agent/temp/test001/ is written. Prints RESULT: PASS or RESULT: FAIL.
#   powershell -NoProfile -ExecutionPolicy Bypass -File test001_mods_install_profiles.ps1 [-Installer <install.ps1>]
param(
    [string]$Installer = (Join-Path $PSScriptRoot '..\..\..\..\Claude_Mods\install.ps1')
)
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..\..')).Path
$sandbox = Join-Path $projectRoot '.agent\temp\test001'
$utf8 = New-Object System.Text.UTF8Encoding($false)

function Write-File([string]$path, [string]$text) {
    New-Item -ItemType Directory -Force (Split-Path $path) | Out-Null
    [System.IO.File]::WriteAllText($path, $text, $utf8)
}

# Fresh sandbox
if (Test-Path -LiteralPath $sandbox) { Remove-Item -LiteralPath $sandbox -Recurse -Force }
$installCopy = Join-Path $sandbox 'Claude_Mods\install.ps1'
$calls = Join-Path $sandbox 'build_calls.txt'
Write-File $installCopy ([System.IO.File]::ReadAllText((Resolve-Path $Installer).Path))
Write-File (Join-Path $sandbox 'Claude_Mods\prompt-pad\vscode-extension\build.ps1') @"
param([string[]]`$Profiles = @())
[System.IO.File]::AppendAllText('$calls', "COUNT=`$(`$Profiles.Count);VALUES=`$(`$Profiles -join '|')``r``n")
"@
$bin = Join-Path $sandbox 'bin'
Write-File (Join-Path $bin 'claude.cmd') "@echo claude-mods prompt-pad@claude-mods usage-status@claude-mods`r`n"
Write-File (Join-Path $bin 'code.cmd') "@echo off`r`n"
$env:PATH = "$bin;$env:PATH"

$failures = @()
function Invoke-Case([string]$name, [string[]]$psArgs, [string]$expected) {
    if (Test-Path -LiteralPath $calls) { Remove-Item -LiteralPath $calls }
    $out = (& powershell @psArgs 2>&1 | Out-String)
    $exit = $LASTEXITCODE
    $lines = @(if (Test-Path -LiteralPath $calls) { Get-Content -LiteralPath $calls })
    Write-Host "--- case $name (exit $exit)"
    Write-Host $out.TrimEnd()
    Write-Host "build.ps1 calls: $($lines.Count) [$($lines -join '; ')]"
    if ($exit -ne 0) { $script:failures += "case ${name}: exit $exit, expected 0" }
    if ($out -match 'Missing an argument') { $script:failures += "case ${name}: output contains 'Missing an argument'" }
    if ($lines.Count -ne 1 -or $lines[0] -ne $expected) {
        $script:failures += "case ${name}: build.ps1 calls [$($lines -join '; ')], expected [$expected]"
    }
}

Invoke-Case 'A (no -VsCodeProfiles)' @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $installCopy) 'COUNT=0;VALUES='
Invoke-Case 'B (-VsCodeProfiles p1,p2)' @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', "& '$installCopy' -VsCodeProfiles p1,p2") 'COUNT=2;VALUES=p1|p2'

if ($failures.Count -eq 0) { Write-Host 'RESULT: PASS'; exit 0 }
$failures | ForEach-Object { Write-Host "FAILED: $_" }
Write-Host 'RESULT: FAIL'
exit 1
