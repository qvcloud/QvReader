/**
 * Validates a release-provenance manifest against the contract rules.
 * Pure ES module with zero external runtime dependencies.
 *
 * @param {object} manifest 
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateReleaseProvenance(manifest) {
  const errors = [];

  if (typeof manifest !== 'object' || manifest === null) {
    return { valid: false, errors: ['Manifest must be a non-null object'] };
  }

  // Schema version
  if (manifest.schemaVersion !== 1) {
    errors.push(`schemaVersion must be 1, got: ${manifest.schemaVersion}`);
  }

  // Version pattern
  const semverRegex = /^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$/;
  if (typeof manifest.version !== 'string' || !semverRegex.test(manifest.version)) {
    errors.push(`Invalid version format: ${manifest.version}`);
  }

  // Tag pattern
  const tagRegex = /^v[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$/;
  if (typeof manifest.tag !== 'string' || !tagRegex.test(manifest.tag)) {
    errors.push(`Invalid tag format: ${manifest.tag}`);
  }

  // Version and Tag consistency
  if (manifest.version && manifest.tag && manifest.tag !== `v${manifest.version}`) {
    errors.push(`Tag mismatch: tag ${manifest.tag} does not equal v${manifest.version}`);
  }

  // Source Repository
  if (manifest.sourceRepository !== 'https://github.com/qvcloud/QvReader') {
    errors.push(`sourceRepository must be "https://github.com/qvcloud/QvReader", got: ${manifest.sourceRepository}`);
  }

  // Source Commit
  const sha1Regex = /^[0-9a-f]{40}$/;
  if (typeof manifest.sourceCommit !== 'string' || !sha1Regex.test(manifest.sourceCommit)) {
    errors.push(`sourceCommit must be 40-char hex string, got: ${manifest.sourceCommit}`);
  }

  // Workflow Run
  if (typeof manifest.workflowRun !== 'string' || !manifest.workflowRun.startsWith('https://')) {
    errors.push(`workflowRun must be a valid https URL, got: ${manifest.workflowRun}`);
  }

  // Artifacts array
  if (!Array.isArray(manifest.artifacts) || manifest.artifacts.length === 0) {
    errors.push('artifacts must be a non-empty array');
    return { valid: errors.length === 0, errors };
  }

  const validPlatforms = new Set(['macos', 'windows', 'linux']);
  const validPackageTypes = new Set(['dmg', 'msi', 'nsis', 'appimage', 'deb', 'zip']);
  const validSignatureStatuses = new Set(['unsigned', 'signed', 'notarized', 'not-applicable']);
  const sha256Regex = /^[0-9a-f]{64}$/;

  const seenArtifactNames = new Set();
  const seenPlatforms = new Set();

  for (let i = 0; i < manifest.artifacts.length; i++) {
    const art = manifest.artifacts[i];
    const prefix = `artifact[${i}] (${art?.name || 'unnamed'})`;

    if (!art || typeof art !== 'object') {
      errors.push(`${prefix}: must be an object`);
      continue;
    }

    // Name & Duplicates
    if (!art.name || typeof art.name !== 'string') {
      errors.push(`${prefix}: missing or invalid name`);
    } else {
      if (seenArtifactNames.has(art.name)) {
        errors.push(`${prefix}: duplicate artifact name detected: ${art.name}`);
      }
      seenArtifactNames.add(art.name);
    }

    // Platform
    if (!validPlatforms.has(art.platform)) {
      errors.push(`${prefix}: invalid platform: ${art.platform}`);
    } else {
      seenPlatforms.add(art.platform);
    }

    // Architecture
    if (!art.architecture || typeof art.architecture !== 'string') {
      errors.push(`${prefix}: missing or invalid architecture`);
    }

    // Package Type
    if (!validPackageTypes.has(art.packageType)) {
      errors.push(`${prefix}: invalid packageType: ${art.packageType}`);
    }

    // Size
    if (typeof art.sizeBytes !== 'number' || art.sizeBytes <= 0 || !Number.isInteger(art.sizeBytes)) {
      errors.push(`${prefix}: sizeBytes must be a positive integer`);
    }

    // SHA256
    if (typeof art.sha256 !== 'string' || !sha256Regex.test(art.sha256)) {
      errors.push(`${prefix}: invalid sha256 hash (must be 64-char lowercase hex): ${art.sha256}`);
    }

    // Signature Status
    if (!validSignatureStatuses.has(art.signatureStatus)) {
      errors.push(`${prefix}: invalid signatureStatus: ${art.signatureStatus}`);
    }

    // SBOM & Attestation
    if (!art.sbom || typeof art.sbom !== 'string') {
      errors.push(`${prefix}: missing sbom reference`);
    }
    if (!art.attestation || typeof art.attestation !== 'string') {
      errors.push(`${prefix}: missing attestation reference`);
    }
  }

  // Check required platforms matrix
  for (const plat of validPlatforms) {
    if (!seenPlatforms.has(plat)) {
      errors.push(`Missing platform in release artifacts matrix: ${plat}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
