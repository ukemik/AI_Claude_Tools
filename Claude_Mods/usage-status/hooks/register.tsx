import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, SessionContextUsage, SessionRateLimit } from 'claude-code'

import type { OthersWaiting, UsageFigures } from '../types'

const figures = atom({ plugin: 'usage-status', key: 'figures' } as const, null)
const others = atom({ plugin: 'usage-status', key: 'others' } as const, { waiting: 0, approval: 0 })

const COLORS = {
  ctx: '#C3A6FF',
  sx: '#A8E6A3',
  wk: '#61AFEF',
  warn: '#E5C07B',
  crit: '#E06C75',
  waiting: '#FF9E64',
} as const

// Percentages at which a figure turns warn (yellow) and crit (red).
const CTX_LEVELS = { warn: 70, crit: 85 } as const
const LIMIT_LEVELS = { warn: 80, crit: 95 } as const

// ---- Other sessions waiting -------------------------------------------------------------
// Each session keeps one small JSON file in ~/.claude/session-watch/ saying what it is doing,
// and reads the others' files every few seconds.

export type SessionStateName = 'idle' | 'working' | 'waiting' | 'approval'

export type SessionRecord = {
  id: string
  cwd: string
  name: string
  state: SessionStateName
  /** When the session entered its current state (ms since epoch). */
  since: number
  /** Last heartbeat (ms since epoch); a record not refreshed for STALE_MS is a dead session. */
  beat: number
}

const REFRESH_MS = 3_000
const HEARTBEAT_MS = 30_000
export const STALE_MS = 90_000
const PRUNE_MS = 24 * 60 * 60 * 1000

export const isLive = (r: SessionRecord, now: number): boolean => now - r.beat < STALE_MS

export function summarize(records: readonly SessionRecord[], selfId: string, now: number): OthersWaiting {
  const live = records.filter(r => r.id !== selfId && isLive(r, now))
  return {
    waiting: live.filter(r => r.state === 'waiting').length,
    approval: live.filter(r => r.state === 'approval').length,
  }
}

/** The session /next goes to: permission questions first, then the one waiting longest. */
export function pickNext(records: readonly SessionRecord[], selfId: string, now: number): SessionRecord | null {
  const rank = (s: SessionStateName): number => (s === 'approval' ? 0 : s === 'waiting' ? 1 : 2)
  const candidates = records
    .filter(r => r.id !== selfId && isLive(r, now) && rank(r.state) < 2)
    .sort((a, b) => rank(a.state) - rank(b.state) || a.since - b.since)
  return candidates[0] ?? null
}

/** "2 waiting · 1 approval", "1 approval", "3 waiting", or "" when nobody waits. */
export function alertParts(o: OthersWaiting): { waiting: string; approval: string } {
  return {
    waiting: o.waiting > 0 ? `${o.waiting} waiting` : '',
    approval: o.approval > 0 ? `${o.approval} approval` : '',
  }
}

export function parseRecord(text: string): SessionRecord | null {
  try {
    const r = JSON.parse(text) as Partial<SessionRecord>
    if (typeof r.id !== 'string' || typeof r.beat !== 'number' || typeof r.state !== 'string') return null
    return {
      id: r.id,
      cwd: typeof r.cwd === 'string' ? r.cwd : '',
      name: typeof r.name === 'string' ? r.name : '',
      state: r.state as SessionStateName,
      since: typeof r.since === 'number' ? r.since : r.beat,
      beat: r.beat,
    }
  } catch {
    return null
  }
}

const folderName = (path: string): string => path.replace(/[\\/]+$/, '').split(/[\\/]/).pop() ?? path

// Module state: rebuilt by session.start, which a reload runs again.
let me: SessionRecord | null = null
let dir = ''
let started = false

// ---- Usage figures ----------------------------------------------------------------------

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

async function writeMe($: EngineInterface): Promise<void> {
  if (!me || !dir) return
  me = { ...me, beat: Date.now() }
  await $.fs.write(`${dir}/${me.id}.json`, JSON.stringify(me))
}

async function setState($: EngineInterface, state: SessionStateName): Promise<void> {
  if (!me || me.state === state) return
  me = { ...me, state, since: Date.now() }
  await writeMe($)
}

async function readAll($: EngineInterface): Promise<SessionRecord[]> {
  if (!dir || !(await $.fs.exists(dir))) return []
  const now = Date.now()
  const records: SessionRecord[] = []
  for (const entry of await $.fs.list(dir)) {
    if (entry.kind !== 'file' || !entry.name.endsWith('.json')) continue
    const r = parseRecord(await $.fs.read(`${dir}/${entry.name}`).catch(() => ''))
    if (r) records.push(r)
    // A file left by a session that ended without cleaning up (a crash, a closed window).
    if (r && now - r.beat > PRUNE_MS) await $.process.run(['cmd', '/c', 'del', '/q', entry.name], { cwd: dir }).catch(() => undefined)
  }
  return records
}

async function refresh($: EngineInterface): Promise<void> {
  const records = await readAll($)
  const next = summarize(records, me?.id ?? '', Date.now())
  const prev = await read($, others)
  if (prev.waiting !== next.waiting || prev.approval !== next.approval) await update($, others, () => next)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    $.ui.status(undefined)
    const { context, rateLimits } = await $.session.usage()
    await update($, figures, () => toFigures(context, rateLimits))

    const home = (await $.env.get('USERPROFILE')) ?? (await $.env.get('HOME')) ?? ''
    if (home) {
      dir = `${home.replace(/\\/g, '/')}/.claude/session-watch`
      const cwd = await $.session.cwd()
      const now = Date.now()
      me = { id: await $.session.id(), cwd, name: folderName(cwd), state: me?.state ?? 'idle', since: now, beat: now }
      await writeMe($)
      if (!started) {
        started = true
        $.clock.every(REFRESH_MS, () => void refresh($).catch(() => undefined))
        $.clock.every(HEARTBEAT_MS, () => void writeMe($).catch(() => undefined))
      }
      await refresh($)
    }

    await $.command.register({ name: 'next', description: 'Go to the next Claude Code session waiting for you', immediate: true })
    return result
  })

  // The person typed a prompt in this session: it is working, not waiting.
  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) await setState($, 'working')
    return next(e)
  })

  // The main loop finished its answer: waiting for the next prompt (unless the person stopped it).
  on('turn.complete', async ($, e, next) => {
    if (e.agentId === undefined) await setState($, e.isAborted ? 'idle' : 'waiting')
    return next(e)
  })

  // A permission question is on screen.
  on('classic.Notification', async ($, e, next) => {
    if (e.notification_type === 'permission_prompt') await setState($, 'approval')
    return next(e)
  })

  // The question was answered and the tool went on (or was refused): back to working.
  on('tool.call', async ($, e, next) => {
    const result = await next(e)
    if (me?.state === 'approval') await setState($, 'working')
    return result
  })

  on('session.end', async ($, e, next) => {
    if (me && dir) await $.process.run(['cmd', '/c', 'del', '/q', `${me.id}.json`], { cwd: dir }).catch(() => undefined)
    me = null
    return next(e)
  })

  on('command.run', { command: 'next' }, async $ => {
    const target = pickNext(await readAll($), me?.id ?? '', Date.now())
    if (!target) return { text: 'No other session is waiting for you.' }
    // `code .` in the session's folder brings forward the VS Code window that has it open.
    const opened = await $.process.run(['cmd', '/c', 'code', '.'], { cwd: target.cwd })
    if (opened.exitCode !== 0) return { text: `Could not open VS Code for ${target.name} (exit ${opened.exitCode}).` }
    const what = target.state === 'approval' ? 'needs an approval' : 'is waiting'
    return { text: `${target.name} ${what}: brought its VS Code window forward.` }
  })

  on('session.measure', async ($, e, next) => {
    await update($, figures, () => toFigures(e.context, e.rateLimits))
    return next(e)
  })

  on('ui.render', { component: 'SessionMode' }, async ($, e, next) => {
    const f = await read($, figures)
    const alert = alertParts(await read($, others))
    if (f === null && !alert.waiting && !alert.approval) return next(e)

    const { Box, Text } = $.ui.resolve(e)
    const modes = e.props.modes.join(' & ')

    return (
      <Box>
        {alert.waiting ? <Text bold color={COLORS.waiting}>{alert.waiting}</Text> : null}
        {alert.waiting && alert.approval ? <Text dimColor> · </Text> : null}
        {alert.approval ? <Text bold color={COLORS.crit}>{alert.approval}</Text> : null}
        {(alert.waiting || alert.approval) && (modes || f) ? <Text dimColor> │ </Text> : null}
        {modes ? <Text dimColor>{modes}{f ? ' │ ' : ''}</Text> : null}
        {f ? (
          <Box>
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
        ) : null}
      </Box>
    )
  })
}
