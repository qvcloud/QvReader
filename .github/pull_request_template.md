## Description

<!-- Describe your changes and link to any relevant issues (e.g. Fixes #123) -->

---

## Type of Change

- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Performance improvement
- [ ] Documentation update
- [ ] Test / Refactoring

---

## Constitutional Tenet Checks

Please verify that your change adheres to the project's core principles:

- [ ] **Markdown Fidelity**: Does NOT alter file encodings (UTF-8, UTF-8-BOM) or line endings (CRLF vs. LF). Preserves user content verbatim.
- [ ] **Local-First & Privacy**: Operates fully offline; does NOT send document contents, file paths, or private data to any remote server.
- [ ] **Performance & Budget**: Does not increase startup latency or violate bundle budgets (verified via `npm run build`).
- [ ] **Cross-Platform Compatibility**: Tested or structured to work consistently across macOS, Windows, and Linux.

---

## Quality & Testing Evidence

- [ ] `npm test` passes (all unit and regression tests green)
- [ ] `npm run build` succeeds without warnings or budget violations
- [ ] `cargo test --manifest-path src-tauri/Cargo.toml --locked` passes
- [ ] `cargo fmt` and `cargo clippy` pass cleanly
- [ ] `node scripts/verify-docs.mjs --scope all` passes
- [ ] No secrets, private keys, API credentials, or customer data are included

<!-- Attach test command output or screenshots if applicable -->

---

## Licensing Terms (Inbound = Outbound)

- [ ] I agree that my contribution is licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).
- [ ] I have read and agree to the [Code of Conduct](../CODE_OF_CONDUCT.md).
