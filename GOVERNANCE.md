# QvReader Project Governance

This document describes the governance structure, decision-making process, and roles for the QvReader open-source project.

---

## 1. Governance Principles

- **Openness & Transparency**: All technical discussions, roadmap planning, and code reviews take place in the public repository via GitHub Issues, Discussions, and Pull Requests.
- **Fidelity & Quality First**: Changes must uphold the core project tenets: sub-50ms launch, source byte fidelity, local-first offline reading, and minimal bloat.
- **Fair Meritocracy**: Contributions of code, documentation, triage, and community support are valued and recognized equally.

---

## 2. Roles & Responsibilities

### Contributors
Anyone who participates in the project by filing issues, submitting PRs, improving docs, or reviewing others' work.
- Submit changes under Apache-2.0.
- Adhere to the [Code of Conduct](CODE_OF_CONDUCT.md).

### Maintainers
Active contributors with write access to the repository who have demonstrated technical understanding, alignment with project principles, and constructive community participation.
- Triage issues and review PRs.
- Ensure all CI quality, security, and performance gates pass before merging.
- Manage and label newcomer issues (`good first issue`).

### Core Team
The project stewards responsible for final technical direction, release signing, security incidents, and official brand assets.
- Own environment secrets and official release signing.
- Guide long-term architectural decisions.
- Enforce the Code of Conduct and handle security reports.

---

## 3. Decision-Making Process

We strive for consensus-seeking decision making:

1. **RFC & Proposal**: Major architectural or feature changes should start with an issue or RFC discussion before code is written.
2. **Review & Approval**: At least one maintainer review is required for all PRs. Maintainers must verify compliance with performance and fidelity principles.
3. **Consensus**: If consensus cannot be reached, the Core Team makes the final determination based on the project's constitutional principles (simplicity, offline-first, performance).

---

## 4. Becoming a Maintainer

Contributors who demonstrate consistent, high-quality involvement over a sustained period (e.g., 3-6 months) may be nominated as Maintainers by any existing Maintainer. Nomination is confirmed by consensus of the Core Team.
