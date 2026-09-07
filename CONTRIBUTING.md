# Contributing to QvReader

Thank you for your interest in contributing to QvReader! We are dedicated to building a fast, lightweight, offline-first Markdown reader and editor.

---

## 1. Code of Conduct

All contributors and participants agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to `conduct@qvreader.com`.

---

## 2. Contribution Licensing (Inbound = Outbound)

QvReader is licensed under the [Apache License, Version 2.0](LICENSE).

- **No CLA / DCO Required**: We use the standard **Inbound = Outbound** model. By submitting a Pull Request to this repository, you agree that your contribution is licensed under the Apache License 2.0.
- **Copyright Retention**: You retain copyright to your original work while granting the project rights under Apache-2.0.
- **Third-Party Code**: If including third-party code or assets, they must have an Apache-2.0-compatible permissive license (e.g., MIT, BSD, Apache-2.0) and be credited in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

---

## 3. Project Boundaries & Architecture

Before starting development, please review the [Architecture Documentation](docs/architecture.md):

- **Complete Public Client**: The entire desktop application (React frontend + Tauri/Rust native layer) is developed and maintained in this public repository.
- **Offline-First Principle**: Core reading and editing must **never** require network access or upload document contents.
- **Markdown Fidelity**: Modifications must never alter file encodings (UTF-8, UTF-8-BOM), line endings (CRLF vs. LF), or silently rewrite Markdown formatting.
- **Licensing & Entitlement**: Local development and test environments (`NODE_ENV !== 'production'`) unlock Pro features by default so contributors can test all UI components freely. Entitlement issuance and signing keys remain strictly outside the client codebase.

For newcomer tasks, check out [First Contribution Guide](docs/contributing/first-contribution.md) and browse issues labeled [`good first issue`](https://github.com/qvcloud/QvReader/labels/good%20first%20issue).

---

## 4. Development Setup

### Prerequisites

- **Node.js**: >= 20.x and `npm`
- **Rust**: Stable toolchain (`rustup default stable`)
- **Tauri 2 Prerequisites**: Platform-specific C++ build tools and WebKit / WebView2 libraries (see [Tauri Prerequisites](https://v2.tauri.app/start/prerequisites/))

### Getting Started

```bash
# 1. Fork and clone the repository
git clone https://github.com/<your-username>/QvReader.git
cd QvReader

# 2. Install dependencies
npm ci

# 3. Start local development server
npm run tauri -- dev test-fixtures/sample.md
```

---

## 5. Testing & Quality Standards

Every Pull Request must pass our automated quality gates:

```bash
# Frontend test suite (unit & regression tests)
npm test

# Production bundle build & size budget check
npm run build

# Native Rust formatting & linter
cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo clippy --manifest-path src-tauri/Cargo.toml --locked -- -D warnings

# Native Rust test suite (isolated temporary directories)
cargo test --manifest-path src-tauri/Cargo.toml --locked

# Documentation integrity check
node scripts/verify-docs.mjs --scope all
```

> **Note on Build Order**: Always run `npm run build` before running tests or native packaging, as the native bundle embeds the compiled `dist/` directory.

---

## 6. Submitting a Pull Request

1. **Create a branch**: Use descriptive branch names like `feat/mermaid-zoom` or `fix/encoding-bom`.
2. **Commit messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat: ...`, `fix: ...`, `docs: ...`).
3. **Fill PR template**: Complete the checklist in [.github/pull_request_template.md](.github/pull_request_template.md), providing evidence for testing, performance, fidelity, and privacy.
4. **CI Validation**: Pull request workflows run in an isolated sandbox with read-only permissions and no secrets.

---

## 7. Contributor Recognition

All contributors who have merged pull requests are attributed in:
- The [Contributors List](docs/contributing/first-contribution.md#contributor-attribution)
- Release release notes published on GitHub Releases
- The client's "About" dialog contributor section in upcoming releases

See [Contributor Validation Checklist](docs/contributor-validation.md) to verify your development setup and contribution workflow.
