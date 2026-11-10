# Check: does this project use the current ai_dev_package two-agent setup?
# Prints one line when it does not (no setup, the old five-agent setup, or an older version).
param([Parameter(Mandatory)][string]$ProjectRoot, [Parameter(Mandatory)][string]$ClaudeHome)

$pkg = Join-Path $ClaudeHome 'ai_dev_package'
$guide = Join-Path $pkg 'SETUP_GUIDE.md'
$pkgVersionFile = Join-Path $pkg '.agent\ai_dev_package_version.txt'
if (-not (Test-Path -LiteralPath $pkgVersionFile)) {
    'The installed copy of ai_dev_package is missing (' + $pkg + '). Tell the user to run ' +
    'AI_Claude_Tools\Claude_Hooks\install.ps1, which installs it; nothing else to do here.'
    return
}
${current} = (Get-Content -LiteralPath $pkgVersionFile -TotalCount 1).Trim()

$p = { param($rel) Test-Path -LiteralPath (Join-Path $ProjectRoot $rel) }
$fiveAgent = (& $p '.claude\agents\architect.md') -or (& $p '.claude\agents\developer.md') -or
             (& $p '.claude\agents\tester.md') -or (& $p '.agent\rules\rules_project.md')
$twoAgent = (& $p '.claude\agents\reviewer.md') -and (& $p '.agent\rules\rules_agent_workflow.md')

if ($fiveAgent) {
    "This project uses the old five-agent ai_dev_package setup (1.x). Migrate it to the two-agent setup ${current}? " +
    "On yes: follow $guide, procedure B (Migrate)."
    return
}
if ($twoAgent) {
    $versionFile = Join-Path $ProjectRoot '.agent\ai_dev_package_version.txt'
    $have = if (Test-Path -LiteralPath $versionFile) { (Get-Content -LiteralPath $versionFile -TotalCount 1).Trim() } else { '2.0' }
    # Only an older project is offered an update; a project newer than the installed copy means the
    # copy is stale, which installed-copies.ps1 reports.
    $older = try { [version]"$have.0" -lt [version]"${current}.0" } catch { ${have} -ne ${current} }
    if ($older) {
        "This project's two-agent setup is ai_dev_package ${have}; the installed package is ${current}. Update it? " +
        "On yes: follow $guide, procedure C (Update)."
    }
    return
}
if ((& $p '.agent') -or (& $p 'CLAUDE.md')) {
    "This project has its own .agent folder or CLAUDE.md but not the ai_dev_package setup. Install the two-agent " +
    "development setup ${current} (Orchestrator + Reviewer), keeping what is there? On yes: follow $guide " +
    "(the row for other setups, then procedure A)."
    return
}
"This project has no agent setup. Install the ai_dev_package two-agent development setup ${current} " +
"(Orchestrator + Reviewer)? On yes: follow $guide, procedure A (Install)."
