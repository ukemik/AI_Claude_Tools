// Pure logic for the prompt-pad sender: no `vscode` dependency, so node can test it.
// `withOpenBlock` is duplicated in the Claude Code mod (`.claude/mods/prompt-pad`); keep the two in step.

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const NOTES_TITLE = 'YAPILMADI';
const FREQUENT_TITLE = 'SIK KULLANILANLAR';
const RULE = '============';

// The two sections kept at the bottom of the file.
const FOOTER = [RULE, NOTES_TITLE, RULE, '', '', RULE, FREQUENT_TITLE, RULE];

const pad = n => String(n).padStart(2, '0');

/** The sent marker's timestamp, local time: `06-OCT-2026 14:05`. */
function stamp(date) {
  return `${pad(date.getDate())}-${MONTHS[date.getMonth()]}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const isOpen = line => line.trim() === '-';
// Sent markers: `- #N <date time>`, and the older `- sent ...` form.
const isSent = line => /^-\s+(#\d+|sent\b)/.test(line.trim());
const isClose = line => line.trim() === ';';
const isRule = line => /^=+$/.test(line.trim());

/** 0-based index of the `=====` line that opens the heading `title`, or -1. */
function headingIndex(lines, title) {
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim().toUpperCase() === title && isRule(lines[i - 1])) return i - 1;
  }
  return -1;
}

/** Which part of the file a line is in: `prompts`, `notes` (YAPILMADI) or `frequent` (SIK KULLANILANLAR). */
function sectionOf(lines, index) {
  const notes = headingIndex(lines, NOTES_TITLE);
  const frequent = headingIndex(lines, FREQUENT_TITLE);
  if (frequent !== -1 && index > frequent) return 'frequent';
  if (notes !== -1 && index > notes) return 'notes';
  return 'prompts';
}

/**
 * Finds the prompt block around the cursor: an opening line that is exactly `-`,
 * a closing line that is exactly `;`, and the text between them. A heading's
 * `=====` line is a boundary: no block spans one.
 *
 * Returns `{ start, end, text }` (0-based line numbers of the two markers), or
 * `{ error }` when the cursor is not inside an unsent block with text in it.
 */
function findBlock(lines, cursor) {
  let start = -1;
  for (let i = cursor; i >= 0; i--) {
    if (isOpen(lines[i])) { start = i; break; }
    if (isSent(lines[i])) return { error: 'This prompt has already been sent.' };
    if (isRule(lines[i]) || (isClose(lines[i]) && i !== cursor)) break;
  }
  if (start === -1) return { error: 'The cursor is not inside a prompt block (between - and ;).' };

  let end = -1;
  for (let j = start + 1; j < lines.length; j++) {
    if (isClose(lines[j])) { end = j; break; }
    if (isOpen(lines[j]) || isSent(lines[j]) || isRule(lines[j])) break;
  }
  if (end === -1 || end < cursor) return { error: 'The prompt block has no closing ; line.' };

  const text = lines.slice(start + 1, end).join('\n').trim();
  if (text === '') return { error: 'The prompt block is empty.' };
  return { start, end, text };
}

/**
 * The number the next sent prompt gets: one past the highest `#N` already on a
 * sent line, or past the count of sent lines when that is higher (older,
 * unnumbered sent blocks still count).
 */
function nextNumber(lines) {
  let highest = 0;
  let sent = 0;
  for (const line of lines) {
    if (!isSent(line)) continue;
    sent += 1;
    const match = /#(\d+)/.exec(line);
    if (match) highest = Math.max(highest, Number(match[1]));
  }
  return Math.max(highest, sent) + 1;
}

/**
 * Makes sure an empty `-` / `;` block is open just above the YAPILMADI heading
 * (adding both bottom sections when the file has none), reusing an empty block
 * already there.
 *
 * Returns the file's new text, in its own line endings, and the 1-based line of
 * the empty line inside the open block, where the cursor goes.
 */
function withOpenBlock(original) {
  const eol = original.includes('\r\n') ? '\r\n' : '\n';
  const lines = original.replace(/\r\n/g, '\n').replace(/\s+$/, '').split('\n');
  if (lines.length === 1 && lines[0] === '') lines.pop();

  const footerAt = headingIndex(lines, NOTES_TITLE);
  const head = footerAt === -1 ? lines : lines.slice(0, footerAt);
  const footer = footerAt === -1 ? FOOTER : lines.slice(footerAt);
  while (head.length && head[head.length - 1].trim() === '') head.pop();

  const n = head.length;
  const isReused = n >= 3 && isOpen(head[n - 3]) && head[n - 2].trim() === '' && isClose(head[n - 1]);
  if (!isReused) {
    if (n) head.push('');
    head.push('-', '', ';');
  }
  const cursor = head.length - 2;
  return { text: [...head, '', ...footer].join(eol) + eol, line: cursor + 1 };
}

module.exports = { findBlock, nextNumber, sectionOf, stamp, withOpenBlock };
