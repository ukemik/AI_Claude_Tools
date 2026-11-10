import { expect, test } from 'claude-code/testing'
import { alertParts, formatCountdown, levelColor, parseRecord, pickNext, STALE_MS, summarize, toFigures } from './register.tsx'
import type { SessionRecord } from './register.tsx'

test('every window reported', () => {
  expect(
    toFigures({ window: 1_000_000, percent: 40 }, [
      { kind: 'five_hour', percentUsed: 16, resetsAt: '2026-10-06T15:00:00Z' },
      { kind: 'seven_day', percentUsed: 36, resetsAt: '2026-10-09T14:05:00Z' },
    ]),
  ).toEqual({
    ctxPct: 40,
    sxPct: 16,
    wkPct: 36,
    sxResetsAt: '2026-10-06T15:00:00Z',
    wkResetsAt: '2026-10-09T14:05:00Z',
  })
})

test('no rate-limit reading yet', () => {
  expect(toFigures({ window: 1_000_000 }, [])).toEqual({
    ctxPct: 0,
    sxPct: null,
    wkPct: null,
    sxResetsAt: null,
    wkResetsAt: null,
  })
})

test('countdowns: minutes, hours and minutes, days hours and minutes', () => {
  const now = Date.parse('2026-10-06T13:18:00Z')
  expect(formatCountdown('2026-10-06T15:00:00Z', now)).toBe('1h 42m')
  expect(formatCountdown('2026-10-06T13:45:00Z', now)).toBe('27m')
  expect(formatCountdown('2026-10-06T13:18:30Z', now)).toBe('<1m')
  expect(formatCountdown('2026-10-08T16:33:00Z', now)).toBe('2d 3h 15m')
  expect(formatCountdown(null, now)).toBe('n/a')
  expect(formatCountdown('not a date', now)).toBe('n/a')
})

test('threshold colours', () => {
  const levels = { warn: 70, crit: 85 }
  expect(levelColor(40, '#base', levels)).toBe('#base')
  expect(levelColor(70, '#base', levels)).toBe('#E5C07B')
  expect(levelColor(85, '#base', levels)).toBe('#E06C75')
  expect(levelColor(null, '#base', levels)).toBe('#base')
})

const NOW = 1_800_000_000_000
const rec = (id: string, state: SessionRecord['state'], since: number, beat = NOW): SessionRecord =>
  ({ id, cwd: `C:/p/${id}`, name: id, state, since, beat })

test('others: counts live sessions other than this one, by kind', () => {
  const records = [
    rec('self', 'waiting', 1),
    rec('a', 'waiting', 5),
    rec('b', 'waiting', 3),
    rec('c', 'approval', 9),
    rec('d', 'working', 2),
    rec('e', 'idle', 2),
    rec('dead', 'approval', 1, NOW - STALE_MS - 1),
  ]
  expect(summarize(records, 'self', NOW)).toEqual({ waiting: 2, approval: 1 })
})

test('/next: approval first, then the longest waiting; never itself or a dead session', () => {
  const records = [rec('self', 'approval', 0), rec('a', 'waiting', 5), rec('b', 'waiting', 3), rec('c', 'approval', 9)]
  expect(pickNext(records, 'self', NOW)?.id).toBe('c')
  expect(pickNext(records.filter(r => r.id !== 'c'), 'self', NOW)?.id).toBe('b')
  expect(pickNext([rec('x', 'approval', 1, NOW - STALE_MS - 1), rec('y', 'working', 1)], 'self', NOW)).toBe(null)
})

test('alert text', () => {
  expect(alertParts({ waiting: 2, approval: 1 })).toEqual({ waiting: '2 waiting', approval: '1 approval' })
  expect(alertParts({ waiting: 0, approval: 1 })).toEqual({ waiting: '', approval: '1 approval' })
  expect(alertParts({ waiting: 0, approval: 0 })).toEqual({ waiting: '', approval: '' })
})

test('a half-written or foreign file is ignored', () => {
  expect(parseRecord('{"id":"a","state":"wai')).toBe(null)
  expect(parseRecord('{"hello":1}')).toBe(null)
  expect(parseRecord('{"id":"a","state":"waiting","beat":5}')).toEqual({ id: 'a', cwd: '', name: '', state: 'waiting', since: 5, beat: 5 })
})
