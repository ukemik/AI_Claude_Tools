import { atom, read, update } from 'claude-code'
import type { Register, SessionContextUsage, SessionRateLimit } from 'claude-code'

import type { UsageFigures } from '../types'

const figures = atom({ plugin: 'usage-status', key: 'figures' } as const, null)

const COLORS = { ctx: '#C3A6FF', sx: '#A8E6A3', wk: '#61AFEF', warn: '#E5C07B', crit: '#E06C75' } as const

// Percentages at which a figure turns warn (yellow) and crit (red).
const CTX_LEVELS = { warn: 70, crit: 85 } as const
const LIMIT_LEVELS = { warn: 80, crit: 95 } as const

export function formatCountdown(iso: string | null | undefined, nowMs: number): string {
  if (!iso) return 'n/a'
  const target = new Date(iso).getTime()
  if (Number.isNaN(target)) return 'n/a'
  const minutes = Math.floor((target - nowMs) / 60_000)
  if (minutes < 1) return '<1m'
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const mins = minutes % 60
  if (days > 0) return `${days}d ${hours}h ${mins}m`
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

export function levelColor(pct: number | null, base: string, levels: { warn: number; crit: number }): string {
  if (pct === null) return base
  if (pct >= levels.crit) return COLORS.crit
  if (pct >= levels.warn) return COLORS.warn
  return base
}

const pctText = (pct: number | null): string => (pct === null ? 'n/a' : `${pct}%`)

export function toFigures(context: SessionContextUsage, rateLimits: SessionRateLimit[]): UsageFigures {
  const session = rateLimits.find(l => l.kind === 'five_hour')
  const weekAll = rateLimits.find(l => l.kind === 'seven_day')
  return {
    ctxPct: context.percent ?? 0,
    sxPct: session?.percentUsed ?? null,
    wkPct: weekAll?.percentUsed ?? null,
    sxResetsAt: session?.resetsAt ?? null,
    wkResetsAt: weekAll?.resetsAt ?? null,
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    $.ui.status(undefined)
    const { context, rateLimits } = await $.session.usage()
    await update($, figures, () => toFigures(context, rateLimits))
    return result
  })

  on('session.measure', async ($, e, next) => {
    await update($, figures, () => toFigures(e.context, e.rateLimits))
    return next(e)
  })

  on('ui.render', { component: 'SessionMode' }, async ($, e, next) => {
    const f = await read($, figures)
    if (f === null) return next(e)

    const { Box, Text } = $.ui.resolve(e)
    const modes = e.props.modes.join(' & ')

    return (
      <Box>
        {modes ? <Text dimColor>{modes} │ </Text> : null}
        <Text dimColor>ctx </Text>
        <Text color={levelColor(f.ctxPct, COLORS.ctx, CTX_LEVELS)}>{pctText(f.ctxPct)}</Text>
        <Text dimColor> │ sx </Text>
        <Text color={levelColor(f.sxPct, COLORS.sx, LIMIT_LEVELS)}>{pctText(f.sxPct)}</Text>
        <Text dimColor> ↻ </Text>
        <Text color={COLORS.sx}>{formatCountdown(f.sxResetsAt, Date.now())}</Text>
        <Text dimColor> │ wk </Text>
        <Text color={levelColor(f.wkPct, COLORS.wk, LIMIT_LEVELS)}>{pctText(f.wkPct)}</Text>
        <Text dimColor> ↻ </Text>
        <Text color={levelColor(f.wkPct, COLORS.wk, LIMIT_LEVELS)}>{formatCountdown(f.wkResetsAt, Date.now())}</Text>
      </Box>
    )
  })
}
