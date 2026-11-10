import type { Register } from 'claude-code'

export const PROMPTS_FILE = '.claude/prompts.txt'
// The main loop's last answer, read by the VS Code extension's `~` completion.
export const LAST_ANSWER_FILE = '.claude/last-answer.txt'

// Kept in step with `withOpenBlock` in the VS Code extension
// (`.claude/vscode-extensions/prompt-pad-sender/block.js`).
const NOTES_TITLE = 'YAPILMADI'
const RULE = '============'
const FOOTER = [RULE, NOTES_TITLE, RULE, '', '', RULE, 'SIK KULLANILANLAR', RULE]

const isRule = (line: string): boolean => /^=+$/.test(line.trim())

function headingIndex(lines: string[], title: string): number {
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim().toUpperCase() === title && isRule(lines[i - 1])) return i - 1
  }
  return -1
}

/**
 * Makes sure an empty `-` / `;` block is open just above the YAPILMADI heading
 * (adding the YAPILMADI and SIK KULLANILANLAR sections when the file has none),
 * reusing an empty block already there.
 *
 * Returns the new text, keeping the file's own line endings, and the 1-based
 * line of the empty line between `-` and `;`, where the cursor goes.
 */
export function withOpenBlock(original: string): { text: string; line: number } {
  const eol = original.includes('\r\n') ? '\r\n' : '\n'
  const lines = original.replace(/\r\n/g, '\n').replace(/\s+$/, '').split('\n')
  if (lines.length === 1 && lines[0] === '') lines.pop()

  const footerAt = headingIndex(lines, NOTES_TITLE)
  const head = footerAt === -1 ? lines : lines.slice(0, footerAt)
  const footer = footerAt === -1 ? FOOTER : lines.slice(footerAt)
  while (head.length && head[head.length - 1].trim() === '') head.pop()

  const n = head.length
  const isReused = n >= 3 && head[n - 3].trim() === '-' && head[n - 2].trim() === '' && head[n - 1].trim() === ';'
  if (!isReused) {
    if (n) head.push('')
    head.push('-', '', ';')
  }
  const cursor = head.length - 2
  return { text: [...head, '', ...footer].join(eol) + eol, line: cursor + 1 }
}

// Put in front of a prompt by the VS Code extension's Ctrl+Shift+Enter. Kept in step with
// CLEAR_MARKER in `.claude/vscode-extensions/prompt-pad-sender/extension.js`.
export const CLEAR_MARKER = '<<prompt-pad:clear>>'

/**
 * Drops everything up to and including the last CLEAR_MARKER, so whatever was in the input box
 * before the prompt arrived (for example a right-click paste) is not sent. Text without the
 * marker is returned unchanged.
 */
export function afterClearMarker(text: string): string {
  const at = text.lastIndexOf(CLEAR_MARKER)
  return at === -1 ? text : text.slice(at + CLEAR_MARKER.length)
}

export const register: Register = on => {
  on('prompt.submit', async ($, e, next) => {
    if (e.command || !e.text.includes(CLEAR_MARKER)) return next(e)
    return next({ ...e, text: afterClearMarker(e.text) })
  })

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'p',
      description: `Open ${PROMPTS_FILE} in VS Code at a new prompt block`,
      immediate: true,
    })
    return next(e)
  })

  on('command.run', { command: 'p' }, async $ => {
    const root = await $.session.root()
    const path = `${root}/${PROMPTS_FILE}`
    const original = (await $.fs.exists(path)) ? await $.fs.read(path) : ''
    const { text, line } = withOpenBlock(original)
    await $.fs.write(path, text)

    // Relative path with the project root as cwd: no spaces reach cmd's parser.
    const opened = await $.process.run(['cmd', '/c', 'code', '-r', '-g', `${PROMPTS_FILE}:${line}`], { cwd: root })
    if (opened.exitCode !== 0) {
      return { text: `Could not open VS Code (exit ${opened.exitCode}): ${opened.stderr.trim()}` }
    }
    return { text: `Opened ${PROMPTS_FILE} at line ${line}.` }
  })

  // Only the answer's written text is saved: tool calls, file edits and their results are not part of it.
  on('turn.complete', async ($, e, next) => {
    if (e.agentId === undefined && !e.isAborted && e.answer.trim() !== '') {
      const root = await $.session.root()
      await $.fs.write(`${root}/${LAST_ANSWER_FILE}`, e.answer)
    }
    return next(e)
  })
}
