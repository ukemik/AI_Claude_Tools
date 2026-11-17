# System Design — AI_Claude_Tools

How the application is built. Written by the Orchestrator, **rewritten in place** so it always
describes the system as it is now (`DOC-2-02`). Updated in the same change as any architectural
change or change to a file's responsibility (`DOC-1-01`, `COD-3-07`). Not a changelog — history
lives in `../development/log_development_activity.md`.

---

## 1. Purpose & Vision

The source of the Overseer's Claude Code set-up: hooks (`Claude_Hooks/`: sound hooks and the project-checks hook) and mods (`Claude_Mods/`: prompt-pad with its VS Code extension, and usage-status), each with a PowerShell `install.ps1` that installs them into `C:\Users\ukemiktarak\.claude` and VS Code. New tools for AI-assisted development are built here too. Stack: Windows PowerShell 5.1, TypeScript (Claude Code mods), JavaScript on Node (VS Code extension).

*Who uses it, what problem it solves, and what it deliberately does not do.*

## 2. Architecture

*Stack: Windows PowerShell 5.1, TypeScript (Claude Code mods), JavaScript on Node (VS Code extension).*

### 2.1 Layers

*The layers (e.g. UI, controller, data) and the direction of calls between them.*

### 2.2 Module Responsibilities

*One row per source file. Must agree with the file responsibility map in
`.agent/rules/rules_coding.md` §2.*

| File | Responsibility |
|---|---|

### 2.3 Application Context

*Context identifiers and where they come from (`COD-8-01`), session handling, per-user state.*

### 2.4 Cross-Cutting Concerns

*Authentication and authorisation, audit enforcement (`COD-7-01`), logging, error handling,
transactions (`COD-6-01`).*

### 2.5 Features / Screens

*One subsection per screen or feature, added as each is built: what it shows, which handlers
and data functions it uses, notable design decisions with their REQ numbers.*

## 3. Data

### 3.1 Data Model

*Schemas, key tables or entities, and any asymmetry that catches people out.*

### 3.2 Database Functions

*Functions the application calls, grouped by feature, and where their definitions live
(not applicable yet (no database)).*

## 4. Current Structure

*Folder tree of the application code.*

```
AI_Claude_Tools/
├── Claude_Hooks/      install.ps1, sound-hooks.json, user-claude-md.md,
│                      project-checks/ (run-checks.ps1, checks/, VERSION)
├── Claude_Mods/       install.ps1, .claude-plugin/marketplace.json
│   ├── prompt-pad/    .claude-plugin/, hooks/, vscode-extension/
│   └── usage-status/  .claude-plugin/, hooks/, types/
└── README.txt  .gitignore
```

## 5. Known Gaps

*Architectural limitations known today, with pointers to REQ / DEF numbers.*
