const vscode = require('vscode');
const path = require('path');
const { findBlock, nextNumber, sectionOf, stamp, withOpenBlock } = require('./block');
const { answerEntries, matchingEntries, tokenBefore } = require('./completion');

// Folders the `@` file list leaves out.
const FILE_EXCLUDE = '{**/.git/**,**/node_modules/**,**/__pycache__/**,**/.venv/**,**/.pytest_cache/**}';

// Bracketed-paste markers: the CLI takes the text as one paste, so line breaks
// inside a prompt do not submit it early.
const PASTE_START = '\x1b[200~';
const PASTE_END = '\x1b[201~';

function pickTerminal() {
  const name = vscode.workspace.getConfiguration('promptPad').get('terminalName', '').trim().toLowerCase();
  if (name) {
    const named = vscode.window.terminals.find(t => t.name.toLowerCase().includes(name));
    if (named) return named;
  }
  return vscode.window.activeTerminal;
}

// Put in front of the prompt by Ctrl+Shift+Enter. The prompt-pad mod's `prompt.submit` hook drops
// everything in the input box up to and including it, so text already in the box is not sent.
// Kept in step with CLEAR_MARKER in the mod (`.claude/mods/prompt-pad/hooks/register.ts`).
const CLEAR_MARKER = '<<prompt-pad:clear>>';

function sendClear() {
  return send({ clearFirst: true });
}

async function send({ clearFirst = false } = {}) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const doc = editor.document;
  const lines = [];
  for (let i = 0; i < doc.lineCount; i++) lines.push(doc.lineAt(i).text);

  const block = findBlock(lines, editor.selection.active.line);
  if (block.error) {
    vscode.window.showWarningMessage(`Prompt Pad: ${block.error}`);
    return;
  }

  // YAPILMADI holds notes, never sent; SIK KULLANILANLAR prompts are sent but not stamped, so they stay reusable.
  const section = sectionOf(lines, block.start);
  if (section === 'notes') {
    vscode.window.showWarningMessage('Prompt Pad: blocks under YAPILMADI are notes and are not sent.');
    return;
  }

  const terminal = pickTerminal();
  if (!terminal) {
    vscode.window.showWarningMessage('Prompt Pad: no terminal is open to send the prompt to.');
    return;
  }

  const delayMs = vscode.workspace.getConfiguration('promptPad').get('submitDelayMs', 200);
  terminal.show(true);
  const text = clearFirst ? CLEAR_MARKER + block.text : block.text;
  terminal.sendText(PASTE_START + text + PASTE_END, false);
  await new Promise(resolve => setTimeout(resolve, delayMs));
  terminal.sendText('\r', false);

  if (section === 'prompts') {
    const opener = doc.lineAt(block.start);
    const number = nextNumber(lines);
    await editor.edit(edit => edit.replace(opener.range, `- #${number} ${stamp(new Date())}`));
  }

  // Open the next block just above YAPILMADI and put the cursor in it.
  const current = doc.getText();
  const next = withOpenBlock(current);
  if (next.text !== current) {
    const whole = new vscode.Range(doc.positionAt(0), doc.positionAt(current.length));
    await editor.edit(edit => edit.replace(whole, next.text));
  }
  const cursor = new vscode.Position(next.line - 1, 0);
  editor.selection = new vscode.Selection(cursor, cursor);
  editor.revealRange(new vscode.Range(cursor, cursor));

  await doc.save();
}

/** `@` lists the project's files; the inserted reference is relative to the folder holding `.claude/`. */
async function fileItems(document, range, root) {
  const base = vscode.Uri.file(root);
  const uris = await vscode.workspace.findFiles(new vscode.RelativePattern(base, '**/*'), FILE_EXCLUDE, 20000);
  return uris.map(uri => {
    const rel = path.relative(root, uri.fsPath).split(path.sep).join('/');
    const item = new vscode.CompletionItem(rel, vscode.CompletionItemKind.File);
    item.insertText = `@${rel}`;
    item.filterText = `@${rel}`;
    item.range = range;
    item.sortText = String(rel.length).padStart(5, '0') + rel;
    return item;
  });
}

/** `~` lists the sentences of Claude's last answer that start with what was typed. */
async function answerItems(range, root, query) {
  let answer;
  try {
    const bytes = await vscode.workspace.fs.readFile(vscode.Uri.file(path.join(root, '.claude', 'last-answer.txt')));
    answer = Buffer.from(bytes).toString('utf8');
  } catch {
    // Say why the list is empty rather than leaving only VS Code's word suggestions.
    const item = new vscode.CompletionItem('(no saved answer yet: Claude saves its last answer when a turn finishes)', vscode.CompletionItemKind.Text);
    item.insertText = `~${query}`;
    item.filterText = `~${query}`;
    item.range = range;
    return [item];
  }
  return matchingEntries(answerEntries(answer), query).map((entry, index) => {
    const item = new vscode.CompletionItem(entry, vscode.CompletionItemKind.Text);
    item.insertText = entry;
    item.filterText = `~${query}`;
    item.range = range;
    item.sortText = String(index).padStart(5, '0');
    return item;
  });
}

const completionProvider = {
  async provideCompletionItems(document, position) {
    const token = tokenBefore(document.lineAt(position.line).text.slice(0, position.character));
    if (!token) return undefined;
    const range = new vscode.Range(position.line, token.start, position.line, position.character);
    // prompts.txt lives in <project>/.claude/, so the project is two levels up.
    const root = path.dirname(path.dirname(document.uri.fsPath));
    if (token.kind === '@') return new vscode.CompletionList(await fileItems(document, range, root), false);
    // Incomplete: asked again on every keystroke, so the starts-with filter is ours, not VS Code's fuzzy one.
    return new vscode.CompletionList(await answerItems(range, root, token.query), true);
  },
};

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('promptPad.send', () => send()),
    vscode.commands.registerCommand('promptPad.sendClear', sendClear),
    vscode.languages.registerCompletionItemProvider({ pattern: '**/prompts.txt' }, completionProvider, '@', '~'),
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
