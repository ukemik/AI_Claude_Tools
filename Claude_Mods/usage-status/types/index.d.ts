export type UsageFigures = {
  ctxPct: number | null
  sxPct: number | null
  wkPct: number | null
  sxResetsAt: string | null
  wkResetsAt: string | null
}

declare module 'claude-code' {
  interface PluginState {
    'usage-status': { figures: UsageFigures | null }
  }
}
