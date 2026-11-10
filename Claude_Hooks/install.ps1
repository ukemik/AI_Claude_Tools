# Adds the hooks in sound-hooks.json to ~\.claude\settings.json (user scope), keeping every
# setting and hook already there. Safe to run again: a hook already present is not added twice.
# Run from any folder:  powershell -File install.ps1   (-SettingsPath <file> to target another file)
param([string]$SettingsPath = (Join-Path $env:USERPROFILE '.claude\settings.json'))
$ErrorActionPreference = 'Stop'
$source = Join-Path $PSScriptRoot 'sound-hooks.json'
$settingsPath = $SettingsPath

$add = (Get-Content -LiteralPath $source -Raw -Encoding UTF8 | ConvertFrom-Json).hooks
if (Test-Path -LiteralPath $settingsPath) {
    Copy-Item -LiteralPath $settingsPath "$settingsPath.bak" -Force
    $settings = Get-Content -LiteralPath $settingsPath -Raw -Encoding UTF8 | ConvertFrom-Json
} else {
    New-Item -ItemType Directory -Force (Split-Path $settingsPath) | Out-Null
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

# UTF-8 without a byte-order mark, which Claude Code reads cleanly.
$json = $settings | ConvertTo-Json -Depth 20
[System.IO.File]::WriteAllText($settingsPath, $json, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Added $added hook(s) to $settingsPath (previous version, if any, saved as $settingsPath.bak). Restart Claude Code."
