import { expect, test } from 'claude-code/testing'
import { withOpenBlock } from './register'

const FOOTER = '============\nYAPILMADI\n============\n\n\n============\nSIK KULLANILANLAR\n============\n'

test('a new file gets one open block and both bottom sections', () => {
  expect(withOpenBlock('')).toEqual({ text: `-\n\n;\n\n${FOOTER}`, line: 2 })
})

test('a file without the sections gets the block at the end, then the sections', () => {
  expect(withOpenBlock('- #1 x\nhello\n;\n')).toEqual({ text: `- #1 x\nhello\n;\n\n-\n\n;\n\n${FOOTER}`, line: 6 })
})

test('the new block goes between the last prompt and YAPILMADI, notes kept', () => {
  const text = '- #1 x\nhello\n;\n\n============\nYAPILMADI\n============\nmy note\n\n============\nSIK KULLANILANLAR\n============\n-\nfrequent\n;\n'
  expect(withOpenBlock(text)).toEqual({
    text: '- #1 x\nhello\n;\n\n-\n\n;\n\n============\nYAPILMADI\n============\nmy note\n\n============\nSIK KULLANILANLAR\n============\n-\nfrequent\n;\n',
    line: 6,
  })
})

test('an empty block already above YAPILMADI is reused', () => {
  const text = `- #1 x\nhello\n;\n\n-\n\n;\n\n${FOOTER}`
  expect(withOpenBlock(text)).toEqual({ text, line: 6 })
})

test('Windows line endings are kept', () => {
  const { text } = withOpenBlock('note\r\n')
  expect(text.startsWith('note\r\n\r\n-\r\n\r\n;\r\n\r\n============\r\nYAPILMADI')).toBe(true)
  expect(/[^\r]\n/.test(text)).toBe(false)
})
