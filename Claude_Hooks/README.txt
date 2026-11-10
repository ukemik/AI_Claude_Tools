Claude_Hooks
============

Claude Code hooks I use on every machine. Hooks are not mods: they are entries in
~\.claude\settings.json that run a command when something happens in Claude Code.

Only the sound hooks are here. The aim metrics hooks are installed by ai_metrics_package.

  sound-hooks.json   the hooks, in the same shape as the "hooks" key of settings.json
  install.ps1        adds them to ~\.claude\settings.json

What they do
  A short chime (C:\Windows\Media\Windows Navigation Start.wav) when Claude Code
    Notification   needs your attention (a permission question, or idle waiting for you)
    Stop           finishes its answer
    SubagentStop   a subagent finishes
  Windows only: the sound is played through PowerShell's Media.SoundPlayer.


Install (for a person or for an AI agent doing the set-up)
-----------------------------------------------------------
In PowerShell:

    powershell -File <path>\Claude_Hooks\install.ps1

The script reads ~\.claude\settings.json, saves a copy as settings.json.bak, adds each hook in
sound-hooks.json under its event unless the same command is already there, and writes the file
back. Every other setting and hook (for example the aim metrics hooks) is kept. Running it again
adds nothing.

By hand instead: open ~\.claude\settings.json and, under "hooks", add each event's entry from
sound-hooks.json to that event's list (create "hooks" or the event if missing). Do not replace
an event's existing entries; add to them.

Restart Claude Code afterwards; hooks are read when a session starts. Inside a session, /hooks
lists the hooks in force.

Change the sound: replace the .wav path in sound-hooks.json (any file in C:\Windows\Media works),
then edit the same entries in settings.json by hand; install.ps1 adds, it does not replace.

Remove: delete the three SoundPlayer entries from ~\.claude\settings.json.
