usage-status
============

Shows, on the mode line beside the prompt box, how full the context window is and how much of the
rate limits is used, each in its own colour:

    ctx 42% | sx 18% ↻ 3h 12m | wk 55% ↻ 2d 4h 10m

  ctx   context-window fill (purple; yellow from 70%, red from 85%)
  sx    current session (5-hour) limit used, and time until it resets (green)
  wk    weekly limit used, and time until it resets (blue)
  sx/wk turn yellow from 80% and red from 95%.

Figures come from Claude Code itself (session.measure).

Other sessions waiting for you (since 0.3.0)
  On the left of the same line, only when another Claude Code session on this machine is waiting:

    2 waiting · 1 approval │ ctx 42% | ...

  waiting    (orange) the session finished its answer and waits for your next prompt; it stops
             counting as soon as you type a prompt in it
  approval   (red) the session stopped at a permission question
  /next      brings forward the VS Code window of the session to go to: approvals first, then
             the one waiting longest. It runs "code ." in that session's folder, so it picks the
             window that has that folder open; it cannot pick a terminal tab inside a window,
             and two sessions in the same folder look the same.

  How: each session keeps a small file in %USERPROFILE%\.claude\session-watch\ (its folder,
  state and a heartbeat every 30 s) and reads the others' files every 3 s. A session that
  stops sending heartbeats (closed or crashed) stops counting after 90 s; its file is deleted
  when the session ends, or after a day. Nothing leaves the machine.

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
