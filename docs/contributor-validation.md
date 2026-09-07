# External Contributor Validation Smoke Checklist

This checklist is used by external contributors, maintainers, and onboarding testers to verify the newcomer experience.
A newcomer should be able to navigate this workflow in under 30 minutes without requesting private documentation or credentials.

---

## Stage 1: Setup Discovery (< 10 Minutes)

| Check | Expected Observation | Result |
|---|---|---|
| **Root README Guidance** | `README.md` provides clear development setup, clone command, and links to `CONTRIBUTING.md`. | [ ] |
| **Prerequisites Transparency** | Toolchain versions (Node.js 20+, Rust stable, Tauri 2 prerequisites) are explicitly listed. | [ ] |
| **No Private Access Required** | Clone and build do not require private npm registries, SSH keys to private repos, or API keys. | [ ] |
| **Conduct & Governance** | `CODE_OF_CONDUCT.md`, `GOVERNANCE.md`, and `SUPPORT.md` are easily discoverable. | [ ] |

---

## Stage 2: First Issue Selection (< 5 Minutes)

| Check | Expected Observation | Result |
|---|---|---|
| **Issue Labeling** | Issues labeled `good first issue` have clear scopes, expected outcomes, and pointers to relevant files. | [ ] |
| **Newcomer Documentation** | `docs/contributing/first-contribution.md` provides a step-by-step walkthrough for newcomers. | [ ] |
| **Boundaries Clear** | The difference between public client features and out-of-scope backend services is transparent. | [ ] |

---

## Stage 3: Local Quality Checks (< 10 Minutes)

Run the following commands in sequence on a clean checkout:

```bash
# 1. Clean install
npm ci

# 2. Frontend test suites
npm test

# 3. Production asset build & bundle budget
npm run build

# 4. Native code style and linter
cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo clippy --manifest-path src-tauri/Cargo.toml --locked -- -D warnings

# 5. Native unit and contract tests (hermetic, temporary directory)
cargo test --manifest-path src-tauri/Cargo.toml --locked

# 6. Documentation and relative link verification
node scripts/verify-docs.mjs --scope all
```

All 6 checks must pass cleanly with 0 errors.

---

## Stage 4: Pull Request Preparation (< 5 Minutes)

| Check | Expected Observation | Result |
|---|---|---|
| **PR Template Usability** | `.github/pull_request_template.md` guides contributor to check fidelity, privacy, and performance. | [ ] |
| **Inbound = Outbound Consensus** | PR submission implicitly agrees to Apache-2.0 without CLA/DCO signing roadblocks. | [ ] |
| **Conventional Commits** | Commits follow format `type(scope): summary` (e.g., `fix(editor): preserve CRLF line ending`). | [ ] |

---

## Stage 5: Attribution & Recognition

| Check | Expected Observation | Result |
|---|---|---|
| **Contributor List** | Contributor is invited to add their name/handle to `docs/contributing/first-contribution.md`. | [ ] |
| **Release Notes** | Merged PRs are automatically or manually acknowledged in subsequent release notes. | [ ] |
