# Roadmap

A transparent view of what QvReader is planning and what it is deliberately not building.
Items move into development only after they are spec'd and shown not to hurt startup speed,
binary size, Markdown fidelity, or the core reading experience.

## High-priority candidates

- **Large-document performance baselines** — quantified load & scroll targets, not just "it opens."
- **External file live-refresh** — when another editor / an AI agent rewrites the file, update without data loss.
- **Source ↔ preview block link highlight** — finer than plain synced scroll.
- **macOS native polish** — file association UX, menus, per-platform shortcuts.

## Secondary / evaluated later

- Native **PDF export**, single-file **HTML export**.
- **Mermaid** diagrams and richer **math** as optional, lazy-loaded extensions.
- **Linux** support — only once core features are stable and test capacity exists.
- Portable ("green") Windows build.
- Markdown-aware table focus / full-screen reading.

## Explicitly out of scope

The charter fixes the boundary. QvReader will not chase "be everything":

- Cloud sync / built-in drives / Git-hosting sync.
- Blog or CMS publishing.
- Accounts, payments, activation, licensing, or telemetry that reads your content.
- Silently setting default file associations.
- Feature parity arms-races with Typora / Obsidian / full IDEs.

Each roadmap item is gated by the review questions in the spec process: Does it serve a real,
frequent scenario? Does it preserve "open fast, read well, don't interrupt"? What is its
measurable impact on size/startup/memory? Does it touch the source format? What is the
platform-equivalent interaction? Does it involve network/account/payment/privacy?

Candidate work is discussed in the [issue tracker](https://github.com/qvcloud/QvReader/issues).
