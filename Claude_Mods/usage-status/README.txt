usage-status
============

Shows, on the mode line beside the prompt box, how full the context window is and how much of the
rate limits is used, each in its own colour:

    ctx 42% | sx 18% ↻ 3h 12m | wk 55% ↻ 2d 4h 10m

  ctx   context-window fill (purple; yellow from 70%, red from 85%)
  sx    current session (5-hour) limit used, and time until it resets (green)
  wk    weekly limit used, and time until it resets (blue)
  sx/wk turn yellow from 80% and red from 95%.

Figures come from Claude Code itself (session.measure); nothing is read from disk or the network.

Files
  .claude-plugin\plugin.json   name, version, description, types contract
  hooks\hooks.json             points Claude Code at the hooks module
  hooks\register.tsx           the mod
  hooks\register.test.ts       tests:  claude plugin test <this folder>
  types\index.d.ts             the values the mod keeps in session state
  tsconfig.json                for type-checking in an editor (types appear once the mod loads)

Install: see ..\README.txt (install.ps1 does it). Alone:
    claude plugin install usage-status@claude-mods

Change the colours or thresholds at the top of hooks\register.tsx (COLORS, CTX_LEVELS,
LIMIT_LEVELS), raise "version" in .claude-plugin\plugin.json, and run ..\install.ps1 again.
