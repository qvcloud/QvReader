# Open-Source & Commercial Boundary Comprehension Questionnaire

This questionnaire and scoring rubric evaluates whether new users, contributors, and evaluators accurately understand the boundaries between QvReader's Apache-2.0 open-source code, trademarks, official distributions, paid commercial services, and privacy guarantees without relying on private explanations.

---

## Evaluation Standard

- **Sample Size**: At least 5 independent, uninvolved users/evaluators.
- **Passing Target**: >= 90% aggregate score (at least 6 out of 7 questions answered correctly per evaluator).

---

## The 7-Question Boundary Assessment

### Q1: Source Code Rights & Forking
**Question**: Are you legally permitted to fork, inspect, modify, and build the QvReader desktop client source code for personal or internal use?
- [x] **A (Correct)**: Yes, 100% of the desktop client source code is licensed under the permissive Apache License 2.0.
- [ ] **B**: No, only the documentation is open source; client code is closed.
- [ ] **C**: Only if I purchase an official Pro license first.

### Q2: Trademarks & Redistribution Identity
**Question**: If you compile a modified version of QvReader and distribute it publicly, what name and branding requirements apply?
- [ ] **A**: I can call it "Official QvReader" with no modifications to branding.
- [x] **B (Correct)**: I must prominently identify it as a "Community Build" (or "非官方构建") in the window title and About dialog, and cannot use the trademark in a confusing way.
- [ ] **C**: Apache-2.0 transfers all trademark rights, so there are no restrictions.

### Q3: Official Code Signing & Notarization
**Question**: Do community builds compiled from source include official Apple Developer ID notarization and Windows Authenticode code signatures?
- [ ] **A**: Yes, the repository contains the private signing keys for anyone to use.
- [x] **B (Correct)**: No, official digital signatures and notarization are exclusively attached by maintainers to official releases in protected CI environments.
- [ ] **C**: Digital signatures are created automatically by npm.

### Q4: Document Privacy & Local-First Processing
**Question**: Does QvReader ever upload, transmit, or index your local Markdown documents or file paths on remote cloud servers?
- [ ] **A**: Yes, documents are continuously backed up to the cloud.
- [x] **B (Correct)**: No, QvReader is strictly Local-First and offline; document contents and local file paths are never uploaded to any remote server.
- [ ] **C**: Only files larger than 10MB are uploaded.

### Q5: Pro Activation Data Minimization
**Question**: When activating a Pro license, what data is transmitted to the verification endpoint?
- [ ] **A**: The full text of opened Markdown files and user browsing history.
- [x] **B (Correct)**: Only the user-entered license key, an anonymized SHA-256 device identifier hash, user-visible device label, and client version.
- [ ] **C**: Full operating system credentials and passwords.

### Q6: Offline Behavior & License Failure Safety
**Question**: What happens if your computer is offline, or if an entitlement signature cannot be verified?
- [ ] **A**: The application locks all Markdown documents and refuses to save files.
- [x] **B (Correct)**: Core reading, F2 editing, and file saving remain 100% functional; invalid entitlement only affects Pro feature prompts without damaging local files.
- [ ] **C**: The application crashes and deletes local files.

### Q7: Support Scope & Forks
**Question**: Does the official QvReader support team provide technical support for modified third-party forks or unofficial builds?
- [ ] **A**: Yes, all forks are fully supported by official staff.
- [x] **B (Correct)**: No, official support is strictly scoped to official maintainer builds obtained from official distribution channels.
- [ ] **C**: Yes, if reported on Twitter.

---

## Scoring Rubric

| Total Correct Answers | Score | Evaluation |
|---|---|---|
| 7 / 7 | 100% | Exceptional understanding of all legal, technical, and privacy boundaries. |
| 6 / 7 | 85.7% | Passing comprehension threshold (minimum acceptable for individual user). |
| < 6 / 7 | < 85% | Failed boundary comprehension; clarify documentation wording. |
