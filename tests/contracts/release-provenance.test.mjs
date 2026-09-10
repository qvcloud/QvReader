import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCHEMA_PATH = path.resolve(__dirname, '../../contracts/release-provenance.schema.json');

import { validateReleaseProvenance } from '../../scripts/validate-release-provenance.mjs';
export { validateReleaseProvenance };

// =========================================================================
// Test Fixtures & Assertions
// =========================================================================

describe('Release Provenance Contract Validation', () => {
  it('verifies schema file exists and has correct version', () => {
    assert(fs.existsSync(SCHEMA_PATH), `Schema file must exist at ${SCHEMA_PATH}`);
    const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf-8'));
    assert.equal(schema.schemaVersion?.const || schema.properties?.schemaVersion?.const, 1);
  });

  const validFixture = {
    schemaVersion: 1,
    version: '0.2.0',
    tag: 'v0.2.0',
    sourceRepository: 'https://github.com/qvcloud/QvReader',
    sourceCommit: '0123456789abcdef0123456789abcdef01234567',
    workflowRun: 'https://github.com/qvcloud/QvReader/actions/runs/123456789',
    publishedAt: '2026-09-08T10:00:00Z',
    artifacts: [
      {
        name: 'QvReader-0.2.0-universal.dmg',
        platform: 'macos',
        architecture: 'universal',
        packageType: 'dmg',
        sizeBytes: 15420100,
        sha256: 'a'.repeat(64),
        signatureStatus: 'signed',
        sbom: 'QvReader-0.2.0-universal.dmg.spdx.json',
        attestation: 'QvReader-0.2.0-universal.dmg.attestation.json'
      },
      {
        name: 'QvReader-0.2.0-x64-setup.exe',
        platform: 'windows',
        architecture: 'x86_64',
        packageType: 'nsis',
        sizeBytes: 18230500,
        sha256: 'b'.repeat(64),
        signatureStatus: 'signed',
        sbom: 'QvReader-0.2.0-x64-setup.exe.spdx.json',
        attestation: 'QvReader-0.2.0-x64-setup.exe.attestation.json'
      },
      {
        name: 'QvReader-0.2.0-x86_64.AppImage',
        platform: 'linux',
        architecture: 'x86_64',
        packageType: 'appimage',
        sizeBytes: 24510000,
        sha256: 'c'.repeat(64),
        signatureStatus: 'unsigned',
        sbom: 'QvReader-0.2.0-x86_64.AppImage.spdx.json',
        attestation: 'QvReader-0.2.0-x86_64.AppImage.attestation.json'
      }
    ]
  };

  it('validates a complete and compliant manifest fixture', () => {
    const validResult = validateReleaseProvenance(validFixture);
    assert.equal(validResult.valid, true, `Valid fixture failed validation: ${validResult.errors.join(', ')}`);
  });

  it('rejects manifest when required platform (e.g. linux) is missing', () => {
    const missingPlatformFixture = JSON.parse(JSON.stringify(validFixture));
    missingPlatformFixture.artifacts = missingPlatformFixture.artifacts.filter(a => a.platform !== 'linux');
    const missingPlatformResult = validateReleaseProvenance(missingPlatformFixture);
    assert.equal(missingPlatformResult.valid, false);
    assert(missingPlatformResult.errors.some(e => e.includes('Missing platform in release artifacts matrix: linux')));
  });

  it('rejects manifest when tag does not match version', () => {
    const mismatchedVersionFixture = JSON.parse(JSON.stringify(validFixture));
    mismatchedVersionFixture.tag = 'v0.2.1';
    const mismatchedVersionResult = validateReleaseProvenance(mismatchedVersionFixture);
    assert.equal(mismatchedVersionResult.valid, false);
    assert(mismatchedVersionResult.errors.some(e => e.includes('Tag mismatch')));
  });

  it('rejects manifest when artifact sha256 is invalid', () => {
    const invalidShaFixture = JSON.parse(JSON.stringify(validFixture));
    invalidShaFixture.artifacts[0].sha256 = 'not-a-valid-sha256';
    const invalidShaResult = validateReleaseProvenance(invalidShaFixture);
    assert.equal(invalidShaResult.valid, false);
    assert(invalidShaResult.errors.some(e => e.includes('invalid sha256 hash')));
  });

  it('rejects manifest when duplicate artifact names are found', () => {
    const duplicateArtifactFixture = JSON.parse(JSON.stringify(validFixture));
    duplicateArtifactFixture.artifacts.push({ ...duplicateArtifactFixture.artifacts[0] });
    const duplicateResult = validateReleaseProvenance(duplicateArtifactFixture);
    assert.equal(duplicateResult.valid, false);
    assert(duplicateResult.errors.some(e => e.includes('duplicate artifact name detected')));
  });
});
