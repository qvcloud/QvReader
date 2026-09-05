# Usage & Keyboard Shortcuts

QvReader is designed around three states. You always start in **Reading mode** (the default
and only safe view — ordinary clicks and typing never alter your source).

## Core interactions

| Action | macOS | Windows / Linux |
|---|---|---|
| Open a file | Double-click `.md`, or `qvreader file.md`, or File → Open | same |
| Open folder as workspace | `qvreader .` | same |
| Enter **inline edit** (100% Free Core Feature) | `F2` | `F2` |
| Enter **split view** (20 Free/Day, Soft Reminder Beyond) | `F3` | `F3` |
| Back to reading | `F3` / `F2` (toggle) | same |
| Save | `Cmd + S` | `Ctrl + S` |
| Standard Print (Native OS, 100% Free) | `Cmd + P` | `Ctrl + P` |
| Export as PDF | `Cmd + Shift + P` | `Ctrl + Shift + P` |
| Export as Long Image (PNG) | `Cmd + Shift + E` | `Ctrl + Shift + E` |
| Export as Standalone HTML | `Cmd + Shift + H` | `Ctrl + Shift + H` |
| Toggle Outline Sidebar | `Cmd + Shift + O` | `Ctrl + Shift + O` |
| Toggle Workspace Sidebar | `Cmd + Shift + W` | `Ctrl + Shift + W` |
| Keyboard Shortcuts Guide | `Cmd + /` | `Ctrl + /` |
| Zoom | `Cmd + scroll` | `Ctrl + scroll` |
| Close / quit | `Esc` (when clean) | `Esc` |
| Settings | `Cmd + ,` | `Ctrl + ,` |

## Reading mode

- Read, scroll, select text, follow links, view images.
- **Outline** sidebar: navigate by headings; current section is highlighted.
- **Themes** & text size live in Settings (`Cmd/Ctrl+,`).
- Standard native printing (`Cmd/Ctrl+P`) is always available and optimized for paper output.

## Inline edit (F2)

- **100% Free Core Feature**, without any trial session deductions or paywall banners.
- Edit directly on the reading canvas at the current position, preserving reading context.
- Perfect for quick fixes, editing typos, or lightweight revisions. Press `Esc` or `F2` to return to reading mode immediately.
- Save with `Cmd/Ctrl+S`, preserving line endings (LF/CRLF) and character encoding.

## Split view (F3)

- Left: Markdown source. Right: live rendered preview.
- Editing updates the preview (debounced so typing stays fluid with zero latency).
- The pane you scroll drives the other; your **active line is highlighted** on the preview and kept aligned.
- **Daily Free Quota**: Community Edition users receive 20 free split-view uses per day (automatically resets at midnight). Beyond 20 uses, a gentle non-blocking Pro suggestion appears once per new file; closing the modal leaves the editor in split-view mode with **unrestricted, full functionality**.

## Workspace & Advanced Export (Pro Capabilities)

- **Workspace Drawer** (`Cmd/Ctrl+Shift+W`): Tree-based browsing and management for multi-document projects.
- **Direct PDF Export** (`Cmd/Ctrl+Shift+P`), **High-Resolution PNG Image Export** (`Cmd/Ctrl+Shift+E`), and **Self-Contained HTML Export** (`Cmd/Ctrl+Shift+H`).
- Community Edition includes a **300-session free evaluation quota**; Pro users enjoy unlimited lifetime access.

## Saving & safety

- QvReader preserves the **original bytes** of your file: line endings (LF/CRLF) and
  encoding (UTF-8, with/without BOM) are detected and written back unchanged.
- If the file changed on disk outside QvReader, you are warned before overwriting.
- Closing or switching modes with unsaved edits asks you to save, discard, or stay. **Document saving is never blocked**, guaranteeing zero user data loss even when trial limits expire.

## Language

Switch UI language in Settings → General → Language. Supported: English, 简体中文,
日本語, 한국어, Português (Brasil), Español.
