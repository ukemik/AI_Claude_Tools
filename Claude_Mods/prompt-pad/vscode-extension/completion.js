// Pure logic for the `@` (files) and `~` (last answer) completions: no `vscode` dependency, so node can test it.

/**
 * The completion token being typed at the end of `lineText` (the line up to the
 * cursor): `@` or `~` at the start of a word, then everything typed after it.
 *
 * Returns `{ kind: '@' | '~', query, start }` (`start` is the trigger's column),
 * or null when the cursor is not in such a word.
 */
function tokenBefore(lineText) {
  const files = /(^|\s)@(\S*)$/.exec(lineText);
  if (files) return { kind: '@', query: files[2], start: files.index + files[1].length };
  // `~` takes the rest of the line, so a multi-word start ("~the setup") still matches.
  const answer = /(^|\s)~([^~]*)$/.exec(lineText);
  if (answer) return { kind: '~', query: answer[2], start: answer.index + answer[1].length };
  return null;
}

/** Markdown removed from one line of prose: bold, italics, inline code, links. */
function stripInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/(^|[^*\w])\*(?!\s)(.+?)\*(?!\w)/g, '$1$2')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

// A sentence ends at . ! ? followed by a space and a capital, digit or opening mark.
const SENTENCE_BREAK = /(?<=[.!?])\s+(?=[A-Z0-9"'(`*])/;

/**
 * Splits an answer into the entries `~` offers, in order and without
 * duplicates: each sentence of prose, each bullet, each table row (cells joined
 * with ` | `) and each line of a code block, markdown formatting removed.
 */
function answerEntries(answer) {
  const entries = [];
  let isInCode = false;
  for (const raw of answer.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trim();
    if (line.startsWith('```')) { isInCode = !isInCode; continue; }
    if (line === '') continue;
    if (isInCode) { entries.push(line); continue; }

    if (line.startsWith('|')) {
      if (/^\|[\s:|-]+\|?$/.test(line)) continue; // the |---| separator row
      const cells = line.replace(/^\||\|$/g, '').split('|').map(stripInline).filter(Boolean);
      if (cells.length) entries.push(cells.join(' | '));
      continue;
    }

    const prose = stripInline(line.replace(/^(#{1,6}\s+|>\s*|[-*+]\s+|\d+[.)]\s+)/, ''));
    for (const sentence of prose.split(SENTENCE_BREAK)) {
      const text = sentence.trim();
      if (text) entries.push(text);
    }
  }
  return [...new Set(entries)];
}

/** The entries that start with `query`, ignoring case; all of them for an empty query. */
function matchingEntries(entries, query) {
  const wanted = query.trimStart().toLowerCase();
  return wanted === '' ? entries : entries.filter(e => e.toLowerCase().startsWith(wanted));
}

module.exports = { answerEntries, matchingEntries, stripInline, tokenBefore };
