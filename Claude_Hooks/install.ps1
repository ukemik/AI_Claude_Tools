# Installs Claude_Hooks for the current user. Safe to run again (it refreshes everything and never
# adds a hook twice). Run from any folder:
#   powershell -File install.ps1 [-PackageSource <ai_dev_package release folder>]
#
#   1. project-checks\  -> <ClaudeHome>\hooks\project-checks\ (mirrored), with install-info.json
#   2. the ai_dev_package release -> <ClaudeHome>\ai_dev_package\ (mirrored), if -PackageSource exists
#   3. hooks into <ClaudeHome>\settings.json: the sound hooks and the project-checks SessionStart
#      hook, keeping every other setting and hook (previous file saved as settings.json.bak)
#   4. the "Project checks" section of <ClaudeHome>\CLAUDE.md (added, or replaced if present)
param(
    [string]$ClaudeHome = (Join-Path $env:USERPROFILE '.claude'),
    [string]$PackageSource = (Join-Path $env:USERPROFILE 'OneDrive - Cabaletta Bio\Documents\GitHub\AI_Packages\Dev_Team\ai_dev_package')
)
$ErrorActionPreference = 'Stop'
$here = $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
New-Item -ItemType Directory -Force $ClaudeHome | Out-Null

function Mirror([string]$from, [string]$to) {
    robocopy $from $to /MIR /NJH /NJS /NFL /NDL /NP | Out-Null
    if ($LASTEXITCODE -ge 8) { throw "robocopy $from -> $to failed (exit $LASTEXITCODE)" }
}

# 1. Project checks
$checksDir = Join-Path $ClaudeHome 'hooks\project-checks'
Mirror (Join-Path $here 'project-checks') $checksDir
$hasPackage = $PackageSource -and (Test-Path -LiteralPath (Join-Path $PackageSource '.agent\ai_dev_package_version.txt'))
$info = [ordered]@{ toolsSource = $here; packageSource = $(if ($hasPackage) { $PackageSource } else { $null }) }
[System.IO.File]::WriteAllText((Join-Path $checksDir 'install-info.json'), ($info | ConvertTo-Json), $utf8)
Write-Host "Project checks installed in $checksDir"

# 2. ai_dev_package copy
if ($hasPackage) {
    Mirror $PackageSource (Join-Path $ClaudeHome 'ai_dev_package')
    Write-Host "ai_dev_package copied from $PackageSource"
} else {
    Write-Warning "ai_dev_package not copied: no release found at '$PackageSource'. Run again with -PackageSource <folder>."
}

# 3. Hooks in settings.json
$settingsPath = Join-Path $ClaudeHome 'settings.json'
$add = (Get-Content -LiteralPath (Join-Path $here 'sound-hooks.json') -Raw -Encoding UTF8 | ConvertFrom-Json).hooks
$runner = (Join-Path $checksDir 'run-checks.ps1') -replace '\\', '/'
$checkHook = [pscustomobject]@{ type = 'command'; command = "powershell -NoProfile -ExecutionPolicy Bypass -File `"$runner`""; timeout = 15 }
$add | Add-Member -NotePropertyName SessionStart -NotePropertyValue @([pscustomobject]@{ hooks = @($checkHook) }) -Force

if (Test-Path -LiteralPath $settingsPath) {
    Copy-Item -LiteralPath $settingsPath "$settingsPath.bak" -Force
    $settings = Get-Content -LiteralPath $settingsPath -Raw -Encoding UTF8 | ConvertFrom-Json
} else {
    $settings = New-Object PSObject
}
if (-not $settings.PSObject.Properties['hooks']) {
    $settings | Add-Member -NotePropertyName hooks -NotePropertyValue (New-Object PSObject)
}
$added = 0
foreach ($event in $add.PSObject.Properties) {
    $name = $event.Name
    if (-not $settings.hooks.PSObject.Properties[$name]) {
        $settings.hooks | Add-Member -NotePropertyName $name -NotePropertyValue @()
    }
    $present = @($settings.hooks.$name | ForEach-Object { $_.hooks } | ForEach-Object { $_.command })
    foreach ($group in $event.Value) {
        $new = @($group.hooks | Where-Object { $present -notcontains $_.command })
        if ($new.Count -gt 0) {
            $settings.hooks.$name = @($settings.hooks.$name) + [pscustomobject]@{ hooks = $new }
            $added += $new.Count
        }
    }
}
[System.IO.File]::WriteAllText($settingsPath, ($settings | ConvertTo-Json -Depth 20), $utf8)
Write-Host "Added $added hook(s) to $settingsPath (previous version saved as settings.json.bak)"

# 4. The section in the user-level CLAUDE.md that every session reads
$begin = '<!-- BEGIN AI_Claude_Tools project-checks (managed by Claude_Hooks\install.ps1) -->'
$end = '<!-- END AI_Claude_Tools project-checks -->'
$section = (Get-Content -LiteralPath (Join-Path $here 'user-claude-md.md') -Raw -Encoding UTF8).
    Replace('<CLAUDE_HOME>', $ClaudeHome).Replace('<TOOLS_DIR>', $here).TrimEnd()
$block = "$begin`r`n$section`r`n$end"
$claudeMd = Join-Path $ClaudeHome 'CLAUDE.md'
$text = if (Test-Path -LiteralPath $claudeMd) { [System.IO.File]::ReadAllText($claudeMd, $utf8) } else { '' }
$pattern = [regex]::Escape($begin) + '[\s\S]*?' + [regex]::Escape($end)
$text = if ($text -match $pattern) { [regex]::Replace($text, $pattern, { $block }) }
        elseif ($text.Trim()) { $text.TrimEnd() + "`r`n`r`n" + $block + "`r`n" }
        else { $block + "`r`n" }
[System.IO.File]::WriteAllText($claudeMd, $text, $utf8)
Write-Host "Updated the project-checks section of $claudeMd"

Write-Host "Done. Restart Claude Code."
