// Run with: node --test completion.test.js
const test = require('node:test');
const assert = require('node:assert');
const { answerEntries, matchingEntries, tokenBefore } = require('./completion');

test('tokenBefore: @ and ~ only at the start of a word', () => {
  assert.deepStrictEqual(tokenBefore('look at @src/app'), { kind: '@', query: 'src/app', start: 8 });
  assert.deepStrictEqual(tokenBefore('@'), { kind: '@', query: '', start: 0 });
  assert.strictEqual(tokenBefore('mail me@host'), null);
  assert.deepStrictEqual(tokenBefore('copy ~the setup'), { kind: '~', query: 'the setup', start: 5 });
  assert.strictEqual(tokenBefore('a~b'), null);
  assert.strictEqual(tokenBefore('- #6 06-OCT-2026 07:52'), null);
});

const answer = [
  '**Two problems remain.** The first is `blocking`. See [the log](http://x).',
  '',
  '- **Line 5911:** the call is bare.',
  '1. Run the setup again.',
  '',
  '| Figure | Turns yellow at |',
  '|---|---|',
  '| `ctx` | 70% |',
  '',
  '```sql',
  'SELECT id FROM t;',
  '```',
  'Two problems remain.',
].join('\n');

test('answerEntries: sentences, bullets, table rows and code lines, markdown removed, no duplicates', () => {
  assert.deepStrictEqual(answerEntries(answer), [
    'Two problems remain.',
    'The first is blocking.',
    'See the log.',
    'Line 5911: the call is bare.',
    'Run the setup again.',
    'Figure | Turns yellow at',
    'ctx | 70%',
    'SELECT id FROM t;',
  ]);
});

test('matchingEntries: starts-with, ignoring case; everything for an empty query', () => {
  const entries = answerEntries(answer);
  assert.deepStrictEqual(matchingEntries(entries, 'the'), ['The first is blocking.']);
  assert.deepStrictEqual(matchingEntries(entries, 'RUN the'), ['Run the setup again.']);
  assert.strictEqual(matchingEntries(entries, '').length, entries.length);
});
