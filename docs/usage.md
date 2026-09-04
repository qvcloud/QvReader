# Usage & Keyboard Shortcuts

QvReader is designed around three states. You always start in **Reading mode** (the default
and only safe view — ordinary clicks and typing never alter your source).

## Core interactions

| Action | macOS | Windows / Linux |
|---|---|---|
| Open a file | Double-click `.md`, or `qvreader file.md`, or File → Open | same |
| Open folder as workspace | `qvreader .` | same |
| Enter **split view** | `F3` | `F3` |
| Enter **inline edit** | `F2` | `F2` |
| Back to reading | `F3` / `F2` (toggle) | same |
| Save | `Cmd + S` | `Ctrl + S` |
| Zoom | `Cmd + scroll` | `Ctrl + scroll` |
| Close / quit | `Esc` (when clean) | `Esc` |
| Settings | `Cmd + ,` | `Ctrl + ,` |

## Reading mode

- Read, scroll, select text, follow links, view images.
- **Outline** sidebar: navigate by headings; current section is highlighted.
- **Workspace** sidebar: browse and switch between Markdown files in a folder.
- **Themes** & text size live in Settings (`Cmd/Ctrl+,`).

## Split view (F3)

- Left: Markdown source. Right: live rendered preview.
- Editing updates the preview (debounced so typing stays smooth).
- The pane you scroll drives the other; your **active line is highlighted** on the preview
  and kept aligned.
- Save with `Cmd/Ctrl+S`. Original line endings & encoding are preserved.

## Inline edit (F2)

- Edit directly on the reading canvas at the current position.
- Good for quick typos, broken links, or a one-line fix without opening a split pane.
- Same source fidelity rules as split view.

## Saving & safety

- QvReader preserves the **original bytes** of your file: line endings (LF/CRLF) and
  encoding (UTF-8, with/without BOM) are detected and written back unchanged.
- If the file changed on disk outside QvReader, you are warned before overwriting.
- Closing or switching modes with unsaved edits asks you to save, discard, or stay.

## Language

Switch UI language in Settings → General → Language. Supported: English, 简体中文,
日本語, 한국어, Português (Brasil), Español.
