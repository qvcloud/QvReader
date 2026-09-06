# Development (build from source)

> Note: the **application source code lives in a private repository**. This `release`
> repository is the **community + release home**: it holds docs, license, changelog, and
> points to installers published on GitHub Releases. Public mirrors of source may be
> published here later.

## Tech stack

- **Desktop framework:** Tauri v2 (Rust core + system webview)
- **Frontend:** React 18 + Vite + TypeScript
- **Editing:** CodeMirror 6
- **Rendering:** markdown-it + highlight.js + KaTeX
- **Supported platforms:** macOS (primary), Windows, Linux (in progress)

## Local macOS build (prerequisite for packaging a DMG)

```bash
# 1. Install Rust + the Apple targets you need
#    e.g. via rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add aarch64-apple-darwin x86_64-apple-darwin   # universal

# 2. Install JS deps
cd client
npm install

# 3. Run in dev mode (with a sample doc)
npm run tauri dev -- path/to/sample.md

# 4. Build a release app + DMG
npm run tauri build

# 5. Optional: register the `qvreader` CLI
make install-cli
```

## Automated release builds

A CI workflow (`build-desktop.yml`) builds on tag push `v*`:

- **macOS** — universal (Intel + Apple Silicon) `.dmg`
- **Windows** — `.msi` + NSIS `.exe`
- **Linux** — `.deb` + `.AppImage`

Artifacts are automatically attached to [GitHub Releases](https://github.com/qvcloud/QvReader/releases).

## Project layout

```
release/
├── README.md            # community-facing landing page
├── CHANGELOG.md
├── LICENSE              # Apache-2.0
├── docs/                # usage / features / roadmap / development
├── assets/              # logo & app icon
└── scripts/             # publish helpers
```
