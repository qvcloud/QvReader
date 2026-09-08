# QvReader Development Guide (Build from Source)

Welcome to QvReader! The complete desktop client is open-source under the Apache-2.0 license.

This guide explains how to set up your environment, build the application from source, run tests, and contribute.

---

## 1. Quick Start (Zero-Directory-Jump)

Clone the repository and run directly from the root:

```bash
# 1. Clone the public repository
git clone https://github.com/qvcloud/QvReader.git
cd QvReader

# 2. Install dependencies (Node 20+)
npm install

# 3. Launch in development mode with the bundled sample document
npm run dev
# or: make dev
```

---

## 2. Toolchain & Prerequisites

### Pinned Versions
- **Node.js**: `20.x` or higher (`npm 10+`)
- **Rust Toolchain**: `1.82.0` (pinned via root `rust-toolchain.toml`)
- **Tauri Framework**: Tauri v2.x

### Operating System Prerequisites

#### macOS
- macOS 12 (Monterey) or higher
- Xcode Command Line Tools: `xcode-select --install`
- (Optional) Universal binary packaging target:
  ```bash
  rustup target add aarch64-apple-darwin x86_64-apple-darwin
  ```

#### Linux (Debian / Ubuntu)
Install webview and system dependencies:
```bash
sudo apt-get update
sudo apt-get install -y libwebkit2gtk-4.1-dev \
                        build-essential \
                        curl \
                        wget \
                        file \
                        libssl-dev \
                        libappindicator3-dev \
                        librsvg2-dev \
                        libsecret-1-dev
```

#### Windows
- Windows 10 / 11 64-bit
- Microsoft Visual Studio C++ Build Tools
- WebView2 Runtime (pre-installed on modern Windows 10/11)

---

## 3. Project Directory Structure

Desktop client source is organized directly at the root of the repository:

```
QvReader/
├── package.json           # Root package scripts and dependencies
├── vite.config.ts         # Vite build, chunk splitting, and test config
├── rust-toolchain.toml    # Pinned 1.82.0 Rust toolchain specification
├── Makefile               # Public developer workflows (make test, make build)
├── LICENSE                # Apache-2.0 License
├── index.html             # Application webview entry
├── src/                   # React 18 + TypeScript Frontend Application
│   ├── main.tsx           # Application bootstrap
│   ├── App.tsx            # Main window and layout controller
│   ├── components/        # Editor, Reader, SplitView, Modals, Dialogs
│   ├── config/            # Edition constants, version, shortcuts
│   ├── contexts/          # License and preference state providers
│   ├── hooks/             # File I/O, sync scroll, keyboard navigation
│   ├── i18n/              # Internationalization (EN, ZH, JA, ES, KO, PT-BR)
│   ├── lib/               # Tauri IPC bridge, markdown-it plugins, math
│   └── types/             # Domain TypeScript interfaces
├── src-tauri/             # Rust Native Core Application
│   ├── Cargo.toml         # Rust crate configuration & dependencies
│   ├── Cargo.lock         # Locked dependency graph
│   ├── tauri.conf.json    # Tauri application and window configuration
│   ├── src/
│   │   ├── main.rs        # Tauri entrypoint and IPC command registration
│   │   ├── commands/      # File I/O, preferences, workspace scanning, CLI
│   │   ├── fidelity/      # Encoding detection & byte-exact preservation
│   │   └── licensing/     # Ed25519 offline entitlement verifier & storage
│   └── tests/             # Native integration and encoding contract tests
├── test-fixtures/         # Synthetic Markdown test files for offline testing
├── docs/                  # Architecture and development documentation
└── scripts/               # Build, test, and CLI installer scripts
```

---

## 4. Verification & Testing

Always execute the ordered verification suite before submitting pull requests:

```bash
# Run the sequential all-check pipeline:
make check-all
# or: npm run check:all
```

This runs:
1. Frontend unit tests: `npm run test` (Vitest)
2. Frontend typecheck and build: `npm run build` (`tsc && vite build`)
3. Native Rust test suite: `cargo test --manifest-path src-tauri/Cargo.toml --locked`
4. Public source boundary verification: `./scripts/verify-source-boundary.sh`

---

## 5. Development & Testing Edition Unlocks

To ensure external contributors can freely modify and test advanced features (diagramming, split-view editing, math rendering):

> [!NOTE]
> In local development (`npm run dev`) and test environments (`NODE_ENV !== 'production'`), **all Pro editing and diagram capabilities are unlocked by default** without decrementing trial sessions.

When producing standalone non-official builds:
```bash
# Build Community Edition Desktop Binary:
make build-community
```
Community builds compiled from source will show **"Community Build"** in the window title and About dialog per [TRADEMARKS.md](../TRADEMARKS.md). Official maintainer releases are built through secure CI release workflows. Technical support for third-party forks is provided by their authors per [SUPPORT.md](../SUPPORT.md).

---

## 6. Troubleshooting

- **`cargo test` fails with SSL error**: Ensure your network or proxy permits access to crates.io, or run with `--locked`.
- **`libsecret` or keyring error on headless Linux**: In automated headless environments, tests use mock/in-memory storage without prompting for OS keyring access.
- **Port 1420 in use**: Vite will notify if port 1420 is busy. Ensure no lingering `QvReader` dev process is running: `killall QvReader 2>/dev/null || true`.
