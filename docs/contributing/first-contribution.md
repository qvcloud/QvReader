# First Contribution Guide

Welcome! We are excited to have you contribute to QvReader. This guide will help you make your very first contribution smoothly.

---

## 1. What Makes a "Good First Issue"?

We carefully label tasks suitable for beginners with the [`good first issue`](https://github.com/qvcloud/QvReader/labels/good%20first%20issue) label. A good first issue usually meets these criteria:

- **Isolated Scope**: Modifies 1–3 files without affecting cross-cutting core contracts.
- **Clear Reproduction & Acceptance**: Has an exact sample Markdown file or UI state to verify.
- **Example Tasks**:
  - Fixing typo or clarifying documentation / translation strings.
  - Adding a missing shortcut or toolbar tooltip.
  - Adding edge-case unit tests for Markdown parsing or KaTeX/Mermaid rendering.
  - Small CSS / Tailwind alignment tweaks.

---

## 2. Step-by-Step Workflow

### Step 1: Fork and Clone
```bash
git clone https://github.com/<your-username>/QvReader.git
cd QvReader
git checkout -b fix/your-issue-name
```

### Step 2: Install and Verify Baseline
```bash
npm ci
npm test
npm run build
```

### Step 3: Make Your Changes
- Keep changes minimal and focused on the issue.
- Verify that your editor does not unintentionally reformat unrelated files or change line endings.

### Step 4: Run Verification Gates
Before opening your PR, run our test suite locally:
```bash
npm test
cargo test --manifest-path src-tauri/Cargo.toml --locked
node scripts/verify-docs.mjs --scope all
```

### Step 5: Commit and Push
```bash
git add .
git commit -m "fix(ui): improve toolbar contrast in dark mode"
git push origin fix/your-issue-name
```

### Step 6: Submit Pull Request
Open a PR against the `main` branch of `qvcloud/QvReader`. Complete the PR template checklist.

---

## 3. Public vs. Private Boundaries

- **All Client Work is Public**: All user interface, Markdown parsing, editor logic, Tauri Rust commands, and offline licensing verifiers live in this repository.
- **No Secret Access Needed**: You do not need access to private deployment servers or payment providers to test full client features.
- **Development Mode**: In local development (`NODE_ENV !== 'production'`), Pro features are unlocked automatically so you can test all editing and export features.

---

## 4. Contributor Attribution

We deeply appreciate every contribution:
- Every merged PR is credited in the corresponding release notes.
- You can add your GitHub username to the list below in your PR:

### Contributors Hall of Fame
- [@qvcloud](https://github.com/qvcloud) (Project Maintainer)
- *(Your name here!)*
