// Run with: node --test block.test.js
const test = require('node:test');
const assert = require('node:assert');
const { findBlock, nextNumber, sectionOf, stamp, withOpenBlock } = require('./block');

const FOOTER = '============\nYAPILMADI\n============\n\n\n============\nSIK KULLANILANLAR\n============\n';

test('a new file gets one open block and both bottom sections', () => {
  assert.deepStrictEqual(withOpenBlock(''), { text: `-\n\n;\n\n${FOOTER}`, line: 2 });
});

test('a file without the sections gets the block at the end, then the sections', () => {
  assert.deepStrictEqual(withOpenBlock('- #1 x\nhello\n;\n'), {
    text: `- #1 x\nhello\n;\n\n-\n\n;\n\n${FOOTER}`,
    line: 6,
  });
});

test('the new block goes between the last prompt and YAPILMADI, notes kept', () => {
  const text = '- #1 x\nhello\n;\n\n============\nYAPILMADI\n============\nmy note\n\n============\nSIK KULLANILANLAR\n============\n-\nfrequent\n;\n';
  const { text: out, line } = withOpenBlock(text);
  assert.strictEqual(out, '- #1 x\nhello\n;\n\n-\n\n;\n\n============\nYAPILMADI\n============\nmy note\n\n============\nSIK KULLANILANLAR\n============\n-\nfrequent\n;\n');
  assert.strictEqual(out.split('\n')[line - 2], '-');
  assert.strictEqual(out.split('\n')[line], ';');
});

test('an empty block already above YAPILMADI is reused', () => {
  const text = `- #1 x\nhello\n;\n\n-\n\n;\n\n${FOOTER}`;
  assert.deepStrictEqual(withOpenBlock(text), { text, line: 6 });
});

test('CRLF files stay CRLF', () => {
  const { text } = withOpenBlock('- #1 x\r\nhello\r\n;\r\n');
  assert.ok(text.startsWith('- #1 x\r\nhello\r\n;\r\n\r\n-\r\n\r\n;\r\n\r\n============\r\nYAPILMADI'));
  assert.ok(!/[^\r]\n/.test(text));
});

test('sections: prompts above YAPILMADI, notes under it, frequent under SIK KULLANILANLAR', () => {
  const lines = withOpenBlock('- #1 x\nhello\n;\n').text.split('\n');
  assert.strictEqual(sectionOf(lines, 1), 'prompts');
  assert.strictEqual(sectionOf(lines, lines.indexOf('YAPILMADI') + 2), 'notes');
  assert.strictEqual(sectionOf(lines, lines.indexOf('SIK KULLANILANLAR') + 2), 'frequent');
});

test('a block never spans a heading: a note under YAPILMADI does not reach the open block above', () => {
  const lines = ['-', '', ';', '', '============', 'YAPILMADI', '============', 'my note'];
  assert.ok(findBlock(lines, 7).error.includes('not inside'));
});

const file = [
  '- sent 05-OCT-2026 09:00', 'old prompt', ';',
  '',
  '-', 'line one', 'SELECT * FROM t;', 'line three', ';',
];

test('finds the block around the cursor, keeping inner lines that end in ;', () => {
  assert.deepStrictEqual(findBlock(file, 6), {
    start: 4, end: 8, text: 'line one\nSELECT * FROM t;\nline three',
  });
});

test('works with the cursor on either marker line', () => {
  assert.strictEqual(findBlock(file, 4).start, 4);
  assert.strictEqual(findBlock(file, 8).start, 4);
});

test('refuses a block already sent', () => {
  assert.deepStrictEqual(findBlock(file, 1), { error: 'This prompt has already been sent.' });
});

test('refuses outside any block', () => {
  assert.ok(findBlock(file, 3).error.includes('not inside'));
});

test('refuses an empty block and an unclosed one', () => {
  assert.deepStrictEqual(findBlock(['-', '', ';'], 1), { error: 'The prompt block is empty.' });
  assert.ok(findBlock(['-', 'text'], 1).error.includes('no closing'));
});

test('next number: first prompt, after unnumbered sent blocks, after numbered ones', () => {
  assert.strictEqual(nextNumber(['-', 'x', ';']), 1);
  assert.strictEqual(nextNumber(['- sent 05-OCT-2026 09:00', 'a', ';', '- sent 05-OCT-2026 09:10', 'b', ';']), 3);
  assert.strictEqual(nextNumber(['- sent 05-OCT-2026 09:00', 'a', ';', '- sent #7 06-OCT-2026 08:00', 'b', ';']), 8);
});

test('a numbered sent block is still refused for resending, in the new and older forms', () => {
  assert.deepStrictEqual(findBlock(['- #3 06-OCT-2026 08:00', 'x', ';'], 1), { error: 'This prompt has already been sent.' });
  assert.deepStrictEqual(findBlock(['- sent #3 06-OCT-2026 08:00', 'x', ';'], 1), { error: 'This prompt has already been sent.' });
});

test('numbering continues across the older and new marker forms', () => {
  assert.strictEqual(nextNumber(['- sent #5 06-OCT-2026 07:48', 'a', ';', '- #6 06-OCT-2026 07:50', 'b', ';']), 7);
});

test('timestamp format', () => {
  assert.strictEqual(stamp(new Date(2026, 9, 6, 14, 5)), '06-OCT-2026 14:05');
});
