prompt-pad
==========

Write prompts in a text file in VS Code and send them to the Claude Code terminal with one key.
Two halves that work together:

  hooks\              the Claude Code mod
  vscode-extension\   the VS Code extension "Prompt Pad Sender"

What it does
  /p                 (in Claude Code) opens <project>\.claude\prompts.txt in VS Code at a new,
                     empty prompt block, creating the file if needed.
  Ctrl+Enter         (in prompts.txt) sends the block under the cursor - the lines between a
                     line "-" and a line ";" - to the Claude terminal and submits it. The block
                     is stamped "- #<n> <date time>" and a new empty block is opened.
  Ctrl+Shift+Enter   the same, but first discards whatever is already in Claude's input box
                     (for example text a right-click pasted there).
  @                  (in prompts.txt) completes project file paths.
  ~                  (in prompts.txt) completes sentences from Claude's last answer, which the
                     mod saves to <project>\.claude\last-answer.txt after each turn.

prompts.txt layout
  Blocks above the YAPILMADI heading are prompts (stamped when sent). Blocks under YAPILMADI are
  notes and are never sent. Blocks under SIK KULLANILANLAR are reusable prompts: sent, never
  stamped. /p adds these headings to a file that has none.

How Ctrl+Shift+Enter works
  The extension puts the marker <<prompt-pad:clear>> in front of the block; the mod's
  prompt.submit hook drops everything up to and including it before the prompt reaches Claude.
  The marker string is defined in both hooks\register.ts and vscode-extension\extension.js
  (CLEAR_MARKER) and must stay the same in both. If the mod is not loaded, the marker is sent
  along with the prompt. A paste that starts with "/" makes Claude treat the input as a slash
  command, which the mod cannot rewrite.

Files
  .claude-plugin\plugin.json          name, version, description
  hooks\hooks.json                    points Claude Code at the hooks module
  hooks\register.ts                   the mod: /p, last-answer.txt, the clear marker
  hooks\register.test.ts              tests:  claude plugin test <this folder>
  tsconfig.json                       for type-checking in an editor
  vscode-extension\package.json       the extension's manifest: commands and key bindings
  vscode-extension\extension.js       sending, stamping, completion
  vscode-extension\block.js           finding and opening blocks (kept in step with the mod's
                                      withOpenBlock)
  vscode-extension\completion.js      @ and ~ completion
  vscode-extension\*.test.js          tests for block.js and completion.js
  vscode-extension\build.ps1          packs the extension into a .vsix and installs it in VS Code

Install: see ..\README.txt (install.ps1 does both halves). Alone:
    claude plugin install prompt-pad@claude-mods
    powershell -File vscode-extension\build.ps1 [-Profiles <VS Code profile name>]
Then restart Claude Code and reload VS Code.

Settings (VS Code, "Prompt Pad")
  promptPad.terminalName    send to the terminal whose name contains this text (empty = active)
  promptPad.submitDelayMs   pause between pasting and pressing Enter (default 200)

Windows only as written: /p opens VS Code through cmd.

After a change, raise "version" in .claude-plugin\plugin.json (the mod) and/or in
vscode-extension\package.json (the extension), then run ..\install.ps1 again.
