export type UsageFigures = {
  ctxPct: number | null
  sxPct: number | null
  wkPct: number | null
  sxResetsAt: string | null
  wkResetsAt: string | null
}

/** How many other Claude Code sessions on this machine are waiting for the person. */
export type OthersWaiting = {
  /** Finished a turn and waiting for the next prompt. */
  waiting: number
  /** Stopped at a permission question. */
  approval: number
}

declare module 'claude-code' {
  interface PluginState {
    'usage-status': { figures: UsageFigures | null; others: OthersWaiting }
  }
}
