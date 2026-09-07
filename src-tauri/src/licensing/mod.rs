pub mod creem;
pub mod crypto;
pub mod entitlement;
pub mod storage;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum LicenseTier {
    Community,
    Trial,
    Pro,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LicenseInfo {
    pub tier: LicenseTier,
    #[serde(rename = "isPro")]
    pub is_pro: bool,
    #[serde(rename = "trialUsed")]
    pub trial_used: u32,
    #[serde(rename = "trialMax")]
    pub trial_max: u32,
    #[serde(rename = "customerEmail")]
    pub customer_email: Option<String>,
    #[serde(rename = "expiresAt")]
    pub expires_at: Option<String>,
    #[serde(rename = "deviceFingerprint")]
    pub device_fingerprint: String,
}

pub struct LicenseManager;

impl LicenseManager {
    /// Fast-path local verification of current license status (sub-millisecond)
    pub fn get_current_info() -> LicenseInfo {
        let fingerprint = crypto::get_device_fingerprint();
        let trial = storage::load_trial();

        // 1. Primary check: Verify signed Ed25519 entitlement token
        if let Some(entitlement) = storage::load_entitlement() {
            if entitlement.verify().is_ok() {
                return LicenseInfo {
                    tier: LicenseTier::Pro,
                    is_pro: true,
                    trial_used: trial.used_sessions,
                    trial_max: trial.max_sessions,
                    customer_email: Some("pro@qvreader.com".to_string()),
                    expires_at: entitlement.expires_at.map(|e| e.to_string()),
                    device_fingerprint: fingerprint,
                };
            }
        }

        // 2. Secondary check: Legacy persistent license backward compatibility
        if let Some(record) = storage::load_license() {
            if crypto::verify_local_signature(
                &record.license_key,
                &record.instance_id,
                &record.activated_at,
                &record.signature,
            ) {
                return LicenseInfo {
                    tier: LicenseTier::Pro,
                    is_pro: true,
                    trial_used: trial.used_sessions,
                    trial_max: trial.max_sessions,
                    customer_email: Some(record.customer_email),
                    expires_at: record.expires_at,
                    device_fingerprint: fingerprint,
                };
            }
        }

        // 3. Check trial status
        if trial.used_sessions < trial.max_sessions {
            LicenseInfo {
                tier: LicenseTier::Trial,
                is_pro: false,
                trial_used: trial.used_sessions,
                trial_max: trial.max_sessions,
                customer_email: None,
                expires_at: None,
                device_fingerprint: fingerprint,
            }
        } else {
            LicenseInfo {
                tier: LicenseTier::Community,
                is_pro: false,
                trial_used: trial.used_sessions,
                trial_max: trial.max_sessions,
                customer_email: None,
                expires_at: None,
                device_fingerprint: fingerprint,
            }
        }
    }

    /// Online activation using signed-entitlement provider
    pub async fn activate(license_key: &str) -> Result<LicenseInfo, String> {
        let fingerprint = crypto::get_device_fingerprint();
        let hostname = std::env::var("HOSTNAME")
            .or_else(|_| std::env::var("COMPUTERNAME"))
            .unwrap_or_else(|_| "device".to_string());

        let client = creem::ActivationClient::new();
        let response = client
            .activate(license_key, &fingerprint, Some(&hostname))
            .await?;

        if !response.success {
            return Err("License key is invalid or activation failed".to_string());
        }

        // Cryptographically verify the signed entitlement before persisting
        response.entitlement.verify().map_err(|e| {
            format!("Entitlement verification failed: {}", e)
        })?;

        // Persist verified entitlement
        storage::save_entitlement(&response.entitlement)?;

        // Persist credential in platform keyring where supported
        let _ = storage::save_license_credential(license_key);

        Ok(Self::get_current_info())
    }

    /// Deactivate current license slot and remove credentials
    pub async fn deactivate() -> Result<(), String> {
        let fingerprint = crypto::get_device_fingerprint();
        let client = creem::ActivationClient::new();
        let _ = client.deactivate(&fingerprint).await;
        storage::delete_entitlement()?;
        storage::delete_license()?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::Instant;

    #[test]
    fn test_license_signature_validation() {
        let license_key = "CR-PRO-999-LIFETIME-VALID";
        let instance_id = crypto::get_device_fingerprint();
        let activated_at = "2026-09-04T12:00:00.000Z";

        let sig = crypto::compute_local_signature(license_key, &instance_id, activated_at);
        assert!(!sig.is_empty());

        // Valid signature on same device
        assert!(crypto::verify_local_signature(
            license_key,
            &instance_id,
            activated_at,
            &sig
        ));

        // Tampered key fails
        assert!(!crypto::verify_local_signature(
            "CR-PRO-TAMPERED-KEY",
            &instance_id,
            activated_at,
            &sig
        ));

        // Foreign machine fingerprint fails
        assert!(!crypto::verify_local_signature(
            license_key,
            "foreign_machine_fingerprint_hash_12345678",
            activated_at,
            &sig
        ));
    }

    #[test]
    fn test_offline_license_verification_speed() {
        let temp_dir = storage::setup_isolated_env("verify_speed");
        // Warm up caches / directory checks
        let _ = LicenseManager::get_current_info();

        let start = Instant::now();
        let info = LicenseManager::get_current_info();
        let elapsed = start.elapsed();

        assert!(info.trial_max >= 100);
        // SC-002 requires verification under 50ms; locally it is < 1ms
        assert!(
            elapsed.as_millis() < 50,
            "License verification took {} ms, exceeded 50ms SLA",
            elapsed.as_millis()
        );
        storage::cleanup_isolated_env(temp_dir);
    }

    #[tokio::test]
    async fn test_creem_activation_and_deactivation_flow() {
        let temp_dir = storage::setup_isolated_env("creem_flow");
        // Test activation with developer test bypass key
        let activate_result = LicenseManager::activate("CR-TEST-PRO-LIFETIME").await;
        assert!(activate_result.is_ok(), "Activation failed: {:?}", activate_result);

        let info = LicenseManager::get_current_info();
        assert!(info.is_pro);
        assert_eq!(info.customer_email, Some("pro@qvreader.com".to_string()));

        // Deactivate
        let deactivate_result = LicenseManager::deactivate().await;
        assert!(deactivate_result.is_ok());

        let info_after = LicenseManager::get_current_info();
        assert!(!info_after.is_pro);
        storage::cleanup_isolated_env(temp_dir);
    }

    #[test]
    fn test_trial_counter_increment() {
        let temp_dir = storage::setup_isolated_env("trial_counter");
        let before = storage::load_trial();
        let (allowed, remaining) = storage::record_trial_session();
        let after = storage::load_trial();

        if before.used_sessions < before.max_sessions {
            assert!(allowed);
            assert_eq!(after.used_sessions, before.used_sessions + 1);
            assert_eq!(remaining, after.max_sessions - after.used_sessions);
        }
        storage::cleanup_isolated_env(temp_dir);
    }
}

