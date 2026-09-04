# Changelog

All notable changes are tracked here. Format follows [Keep a Changelog](https://keepachangelog.com/).

## [1.0.0] - 2026-09-04

### Added
- Instant Markdown reading mode — double-click any `.md` file to read.
- `F3` split view: source editor (CodeMirror 6) + live synced preview.
- `F2` inline editing directly on the reading canvas.
- GFM rendering: tables, task lists, strikethrough, blockquotes, code blocks (highlight.js).
- KaTeX math (inline & block).
- Local relative images resolved against the document directory.
- TOC outline with active-heading highlight.
- Light / dark / follow-system themes + presets.
- Adjustable text size.
- External file-change detection with overwrite guard.
- Line-ending (LF/CRLF) & encoding (UTF-8/BOM) fidelity on save.
- Unsaved-change protection on close/exit/mode switch.
- `qvreader` global CLI: open a file or a folder as a workspace.
- Folder workspace with file-tree sidebar.
- Multi-language UI (English, 简体中文, 日本語, 한국어, Português, Español).
- macOS `.dmg`, Windows `.exe`/`.msi`, Linux `.deb`/`.AppImage` via CI.
