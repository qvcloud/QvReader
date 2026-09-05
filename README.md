<div align="center">

<img src="assets/logo.png" alt="QvReader" width="128" height="128" />

# QvReader

**Ultra-lightweight, instant Markdown reader & editor for macOS & Windows**

Open a `.md` file and read it like a web page — in milliseconds. Clean, distraction-free,
document-first. Press `F2` to edit in place, `F3` for a live split view. When you're done, press `Esc` and leave.

</div>

**Languages:** [English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Português (Brasil)](README.pt-BR.md) · [Español](README.es.md)

---

## Why QvReader?

Most Markdown tools solve "writing a lot." QvReader solves **reading and lightly editing
local documents fast** — READMEs, AI-generated docs, meeting notes, release notes.

- **Opens instantly.** Double-click a file, you're reading. No project, no vault, no workbench.
- **Tiny footprint.** A native Tauri app — no bundled browser engine. The installer is a few MB.
- **Distraction-free reading.** Clean typography, no toolbars crowding the page. Reading is the default state.
- **Local-first.** Your files stay on your disk. No account, no cloud, no telemetry of your content.
- **Edit when you need it.** Reading never corrupts your source. Editing is explicit, and always honors your original bytes.

---

## Features

### Reading (default)

| Capability | Detail |
|---|---|
| Instant open | Double-click `.md` → reading view |
| GFM rendering | Headings, tables, task lists, strikethrough, blockquotes |
| Syntax-highlighted code | highlight.js, fence language auto-detect |
| Math (KaTeX) | Inline & block LaTeX |
| Local images | Relative paths resolve against the document's directory |
| TOC outline | Navigate long documents by heading; active section highlighted |
| Themes | Light / Dark / Follow-system + presets |
| Smart Adaptive Width | Fluid responsive width (896px–1280px) eliminating wide display gutters, with 3 reading width modes (Adaptive/Standard/Full) |
| Text size | Adjustable body size & zoom |
| File watch | Detects external edits, warns before you overwrite |

### Authoring & Editing

| Mode | Shortcut | Rules & What it does |
|---|---|---|
| **Inline edit** | `F2` | **100% Free Core Feature**. Edit directly on the reading canvas via CodeMirror 6 |
| **Split view** | `F3` | Side-by-side editing with live preview. **20 free uses/day**, soft non-blocking prompt beyond |
| **Reading mode** | `Esc` | Return to clean reading mode; press `Esc` when unmodified to close window |

- `Cmd/Ctrl+S` saves with **line-ending (LF/CRLF) & encoding (UTF-8/BOM) fidelity**.
- Unsaved changes are strictly guarded — no silent data loss on close, exit, or external changes.
- Split view keeps your cursor line aligned and highlighted on the preview.
- All views share one document state and undo history.

### Export & Sharing

- **Standard Print** (`Cmd/Ctrl+P`): Native OS print dialog with paper-optimized, ink-friendly styling. Free forever.
- **Export as PDF** (`Cmd/Ctrl+Shift+P`): Dedicated direct PDF export pipeline with system guidance.
- **Export as Long Image PNG** (`Cmd/Ctrl+Shift+E`): 2x Retina high-resolution document snapshot, automatically saved and copied to clipboard.
- **Export as Standalone HTML** (`Cmd/Ctrl+Shift+H`): Portable self-contained HTML file with embedded offline styles and rendering engines.
- *(Advanced exports and workspace management include a 300-session free evaluation quota; Pro users enjoy unlimited access)*

### Workspace & Project Management

- Press `Cmd/Ctrl+Shift+W` or click the top folder drawer to toggle the **workspace file-tree sidebar**.
- Run `qvreader .` from a terminal to instantly open the current directory as a project workspace.

---

## Install

Download the latest installer for your platform from the
**[GitHub Releases](https://github.com/qvcloud/QvReader/releases)** page.

| Platform | Artifact |
|---|---|
| macOS (Apple Silicon & Intel) | `QvReader_<ver>_universal.dmg` |
| Windows (x64) | `QvReader_<ver>_x64-setup.exe` / `.msi` |
| Linux (Debian / AppImage) | `QvReader_<ver>_amd64.deb` / `.AppImage` |

> The repository this page lives in is the **community & release home**. Source code is
> developed privately and mirrored into installers published under **Releases**.

### Register the `qvreader` CLI (optional)

```bash
# macOS: point the wrapper at the installed app
qvreader README.md        # open a file
qvreader .                # open current folder as a workspace
```

---

## Quick Start

```bash
# open a specific file
qvreader path/to/file.md

# open a folder as a workspace
qvreader .

# double-click any .md file
# it just opens — reading, immediately
```

**Reading** → scroll, follow links, select text.
**Editing** → press `F3` (split) or `F2` (inline), make changes, `Cmd/Ctrl+S` to save, `Esc` to return.
**Navigation** → toggle the outline / workspace sidebar.

---

## Documentation

- [Usage & shortcuts](docs/usage.md)
- [Features](docs/features.md)
- [Development (build from source)](docs/development.md)
- [Release process](docs/release-process.md)
- [Changelog](CHANGELOG.md)

---

## Project status

QvReader is actively developed. macOS is the primary, day-one platform; Windows ships via
CI. Linux is evaluated once core stability and testing capacity are in place.

See [docs/roadmap.md](docs/roadmap.md) for what is planned and explicitly out of scope.

---

## License

[Apache License 2.0](LICENSE)

```
Copyright 2026 QvCloud (qvreader.com)
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
