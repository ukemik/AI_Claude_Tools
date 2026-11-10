import { expect, test } from 'claude-code/testing'
import { formatCountdown, levelColor, toFigures } from './register.tsx'

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
