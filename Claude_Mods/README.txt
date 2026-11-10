Claude_Mods
===========

My Claude Code mods, kept in one folder so a new machine gets all of them with one script.
Each mod is its own plugin and can be switched on or off on its own. The folder is a Claude Code
"marketplace": .claude-plugin\marketplace.json lists the mods and where each one lives.

  prompt-pad\      /p opens .claude\prompts.txt in VS Code; Ctrl+Enter sends the prompt block
                   under the cursor to the Claude terminal, Ctrl+Shift+Enter does the same after
                   discarding whatever is already in the input box. Has two halves: the mod
                   (hooks\) and a VS Code extension (vscode-extension\). See prompt-pad\README.txt.
  usage-status\    Context-window fill and rate-limit usage, coloured, above the prompt.
                   See usage-status\README.txt.
  install.ps1      Installs everything (below).

The sound hooks are not mods; they live in the sibling folder Claude_Hooks\.
The aim metrics hooks are installed by ai_metrics_package, not from here.


1. What a new machine needs first
---------------------------------
- Claude Code CLI ("claude" on PATH), signed in.
- VS Code ("code" on PATH) - only for prompt-pad's extension.
- Windows PowerShell. The mods themselves are TypeScript; Claude Code runs them, nothing to build.


2. Install (for a person or for an AI agent doing the set-up)
-------------------------------------------------------------
Put this folder anywhere permanent (for example Documents\GitHub\AI_Claude_Tools\Claude_Mods). Claude Code
installs from it, so keep it after installing. Then, in PowerShell:

    powershell -File <path>\Claude_Mods\install.ps1

If VS Code uses a named profile for your workspaces, name it so the extension goes there too:

    powershell -File <path>\Claude_Mods\install.ps1 -VsCodeProfiles vscode_profile

What the script does, step by step, so it can also be done by hand:

  a. Registers this folder as a local marketplace named "claude-mods":
         claude plugin marketplace add <path>\Claude_Mods
  b. Installs each mod at user scope (all projects):
         claude plugin install prompt-pad@claude-mods
         claude plugin install usage-status@claude-mods
     (From inside a Claude Code session the same is: /plugin install prompt-pad@claude-mods)
  c. Builds prompt-pad's VS Code extension into a .vsix and installs it:
         powershell -File <path>\Claude_Mods\prompt-pad\vscode-extension\build.ps1 [-Profiles <name>]
  d. Warns if ~\.claude\settings.json still has a CLAUDE_CODE_PLUGIN_DIRS entry for these mods
     (the old way of loading them). Remove those entries, or each mod loads twice.

Then restart Claude Code and reload VS Code (Ctrl+Shift+P > Reload Window).

Check: "claude plugin list" shows prompt-pad@claude-mods and usage-status@claude-mods; a new
session shows the usage line above the prompt, and /p opens prompts.txt.


3. Changing a mod
-----------------
Edit the files here, then run install.ps1 again (it refreshes the marketplace and updates each
mod), and restart Claude Code. Raise the "version" in the mod's .claude-plugin\plugin.json
whenever you change it, or the update may be skipped.

While working on a mod, you can load it straight from its folder without installing:
    claude --plugin-dir <path>\Claude_Mods\prompt-pad
Check one with:   claude plugin validate <path>\Claude_Mods\prompt-pad
Run its tests:    claude plugin test <path>\Claude_Mods\prompt-pad


4. Removing
-----------
    claude plugin uninstall prompt-pad@claude-mods
    claude plugin uninstall usage-status@claude-mods
    claude plugin marketplace remove claude-mods
    code --uninstall-extension ukemiktarak.prompt-pad-sender


5. Adding a new mod
-------------------
Create <name>\ with .claude-plugin\plugin.json, hooks\hooks.json and the hooks module, add a
README.txt, add a { "name", "source": "./<name>" } entry to .claude-plugin\marketplace.json, and
add the name to $mods in install.ps1.
