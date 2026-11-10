AI_Claude_Tools
===============

My personal Claude Code set-up, kept in one place so a new machine gets it all from here.

  Claude_Hooks\   Sound hooks: a chime when Claude needs you, finishes, or a subagent finishes.
                  Added to ~\.claude\settings.json. See Claude_Hooks\README.txt.
  Claude_Mods\    Claude Code mods (plugins), each switched on or off on its own:
                    prompt-pad     prompts.txt + VS Code: /p, Ctrl+Enter, Ctrl+Shift+Enter
                    usage-status   context and rate-limit usage beside the prompt
                  See Claude_Mods\README.txt.

Not here: the aim metrics hooks (installed by ai_metrics_package) and the agent-team template
(ai_dev_package); both live under AI_Packages.


Setting up a new machine (for a person or for an AI agent)
-----------------------------------------------------------
Needs: Windows PowerShell, the Claude Code CLI ("claude" on PATH, signed in), and VS Code
("code" on PATH) for prompt-pad's extension.

Keep this folder where it is after installing: Claude Code installs the mods from Claude_Mods\.

Install in this order, in PowerShell:

  1. Hooks
       powershell -File <path>\AI_Claude_Tools\Claude_Hooks\install.ps1

  2. Mods (add -VsCodeProfiles <name> if VS Code uses a named profile for your workspaces)
       powershell -File <path>\AI_Claude_Tools\Claude_Mods\install.ps1

  3. Restart Claude Code, and reload VS Code (Ctrl+Shift+P > Reload Window).

Each script can be run again safely. Each sub-folder's README.txt says what its script does step
by step, how to check it worked, and how to change or remove what it installed.

The marketplace Claude Code registers for Claude_Mods\ is named "claude-mods" (set in
Claude_Mods\.claude-plugin\marketplace.json); the mods install as prompt-pad@claude-mods and
usage-status@claude-mods. That name does not depend on the folder name.
