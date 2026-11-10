# Check: are the installed project checks and the installed ai_dev_package copy as new as their
# sources? install.ps1 records the sources in <ClaudeHome>\hooks\project-checks\install-info.json.
# Prints one line per installed copy that is behind. Machine-wide, so it asks in any project.
param([Parameter(Mandatory)][string]$ProjectRoot, [Parameter(Mandatory)][string]$ClaudeHome)

$installed = Join-Path $ClaudeHome 'hooks\project-checks'
$infoFile = Join-Path $installed 'install-info.json'
if (-not (Test-Path -LiteralPath $infoFile)) { return }
$info = Get-Content -LiteralPath $infoFile -Raw | ConvertFrom-Json
$firstLine = { param($f) if (Test-Path -LiteralPath $f) { (Get-Content -LiteralPath $f -TotalCount 1).Trim() } else { $null } }

$installer = Join-Path $info.toolsSource 'install.ps1'
$srcChecks = & $firstLine (Join-Path $info.toolsSource 'project-checks\VERSION')
$hereChecks = & $firstLine (Join-Path $installed 'VERSION')
if ($srcChecks -and $srcChecks -ne $hereChecks) {
    "The project checks in $($info.toolsSource) are version $srcChecks; the installed ones are $hereChecks. " +
    "Update them? On yes: run powershell -File `"$installer`" and tell the user to restart Claude Code."
}

if ($info.packageSource) {
    $srcPkg = & $firstLine (Join-Path $info.packageSource '.agent\ai_dev_package_version.txt')
    $herePkg = & $firstLine (Join-Path $ClaudeHome 'ai_dev_package\.agent\ai_dev_package_version.txt')
    if ($srcPkg -and $srcPkg -ne $herePkg) {
        "The ai_dev_package release in $($info.packageSource) is $srcPkg; the installed copy is $herePkg. " +
        "Refresh the installed copy? On yes: run powershell -File `"$installer`"."
    }
}
