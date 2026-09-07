/**
 * License & Entitlement Domain Model
 */

export type LicenseTier = 'community' | 'trial' | 'pro';

/**
 * Signed Ed25519 entitlement token verified offline by the desktop client
 */
export interface SignedEntitlement {
  schemaVersion: number;
  entitlementId: string;
  edition: string;
  deviceIdHash: string;
  issuedAt: number;
  expiresAt: number | null;
  issuer: string;
  keyId: string;
  signature: string;
}

/**
 * Local license record persisted in $APP_DATA_DIR/license.json
 */
export interface LicenseRecord {
  /** The raw activation key from Creem (e.g. CR-XXXX-XXXX-XXXX) */
  licenseKey: string;
  /** Unique anonymous device fingerprint registered with Creem */
  instanceId: string;
  /** Customer email returned by Creem */
  customerEmail: string;
  /** Associated Creem product ID */
  productId: string;
  /** Entitlement status */
  tier: 'pro';
  /** ISO timestamp when activated on this device */
  activatedAt: string;
  /** Expiration timestamp, or null for lifetime buyout */
  expiresAt: string | null;
  /** Local HMAC-SHA256 signature calculated from (licenseKey + instanceId + activatedAt) */
  signature: string;
}

/**
 * Trial usage tracking model persisted in client preferences
 */
export interface TrialState {
  /** Cumulative count of Pro sessions used (entering F2/F3 edit mode) */
  usedSessions: number;
  /** Total allowed free trial sessions (default: 300) */
  maxSessions: number;
  /** Timestamp when first trial session was triggered */
  firstUsedAt: string | null;
  /** Last used session timestamp (for backward clock tampering detection) */
  lastUsedAt: string | null;
}

/**
 * Tauri IPC Response for get_license_info
 */
export interface LicenseInfoResponse {
  tier: LicenseTier;
  isPro: boolean;
  trialUsed: number;
  trialMax: number;
  customerEmail: string | null;
  expiresAt: string | null;
  deviceFingerprint: string;
}

/**
 * Tauri IPC Response for activate_license
 */
export interface ActivateLicenseResponse {
  success: boolean;
  tier?: string;
  message?: string;
  error?: string | null;
  entitlement?: SignedEntitlement;
}

/**
 * Tauri IPC Response for deactivate_license
 */
export interface DeactivateLicenseResponse {
  success: boolean;
  error?: string | null;
}

/**
 * Tauri IPC Response for record_trial_session
 */
export interface RecordTrialResponse {
  allowed: boolean;
  remaining: number;
}
