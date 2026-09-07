# Security Policy

The QvReader team takes the security of our software and users seriously. This document outlines our vulnerability reporting process, response commitments, and supported versions.

---

## 1. Supported Versions

Security updates are provided for the following versions:

| Version | Supported | Notes |
|---|---|---|
| `v0.1.x` | Yes | Currently active release series |
| `< v0.1.0` | No | Pre-release alpha/beta builds |

We strongly recommend always running the latest official release.

---

## 2. Reporting a Vulnerability

**DO NOT report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

If you believe you have discovered a vulnerability, please report it privately through one of these channels:

1. **GitHub Private Vulnerability Reporting** (Preferred):
   Navigate to the [Security Advisories](https://github.com/qvcloud/QvReader/security/advisories) tab and click **"Report a vulnerability"**.
2. **Email**:
   Send an encrypted or plain message to `security@qvreader.com` with the subject `[SECURITY] <Brief Description>`.

### What to Include in Your Report

Please provide:
- A clear description of the vulnerability and its potential impact.
- Step-by-step instructions to reproduce the issue (including sample Markdown fixtures or environment details).
- Any proof-of-concept (PoC) code or screen recording.
- Your assessment of affected versions and platforms.

---

## 3. Response SLA & Process

- **Initial Acknowledgment**: Within 48 hours of receipt.
- **Triage & Validation**: Within 7 business days, confirming severity and reproduction.
- **Fix & Advisory**: We coordinate patches in a private branch or advisory. A fix will be prepared and released with an advisory following standard Coordinated Vulnerability Disclosure (CVD).
- **Public Disclosure**: We ask researchers to refrain from public disclosure until an official fix is published, typically within 30 to 90 days.

---

## 4. Secret & Sensitive Data Handling

- **Never Commit Secrets**: Never commit or submit API keys, tokens, license keys, signing certificates, or personal data.
- **Redaction**: When attaching error logs or terminal dumps to issues, verify that paths, credentials, and customer identifiers are fully redacted.
- **Leak Remediation**: Any credential accidentally posted will be revoked and rotated immediately before Git history cleanup.
