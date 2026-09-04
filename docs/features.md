# Features

A concise, honest description of what QvReader does today and what it deliberately does not.

## Product position

QvReader is a **lightweight, fast, document-first Markdown reader** with just enough editing.
It targets the "read a README / AI-generated doc / local note quickly" moment — open it, read
it like a web page, edit on the spot if needed, close with `Esc`. It is **not** an IDE, a
knowledge-base, a cloud-synced vault, or a full CMS.

Core values (from the project charter):

1. Fast to open, small to install.
2. Clean reading surface, no clutter.
3. Reading is the default; editing is explicit so you can't accidentally change source.
4. Editing is enough for real fixes, never a heavy editor.
5. Local files, local-first, no required account or cloud.

## Current capabilities (v1.0.0)

- **Instant reading** of CommonMark / GFM documents.
- **Fidelity** — the source file is the single source of truth. Unknown syntax, line endings,
  and encodings are preserved untouched.
- **F2 inline edit** and **F3 split edit** with live preview.
- **Code highlighting** (highlight.js), **math** (KaTeX).
- **TOC outline**, **folder workspace** with file tree.
- **Themes**, adjustable text size, **6 UI languages**.
- **CLI** (`qvreader <file>` / `qvreader .`).

## Cross-platform

| Platform | Status |
|---|---|
| macOS (Apple Silicon + Intel, universal) | Primary, supported |
| Windows (x64) | Supported via CI |
| Linux (Debian / AppImage) | Evaluated after core stability |

## Explicitly out of scope

The project charter excludes the following to protect the "fast, small, focused" identity:

- Cloud sync, Git-hosting sync, or built-in drives.
- Blog publishing, WeChat-article layout, or generic CMS.
- Becoming a knowledge base / IDE to match Typora, Obsidian, or VS Code.
- Accounts, payments, activation codes, subscriptions, or multi-device licensing.
- Forcing or silently setting default file associations.
- Large unverified plugin & theme ecosystems.

See also [roadmap.md](roadmap.md) for candidate future work.
