use hmac::{Hmac, Mac};
use sha2::{Digest, Sha256};
use std::env;
use std::sync::OnceLock;

type HmacSha256 = Hmac<Sha256>;

pub const INTEGRITY_SEED: &[u8] = b"qvreader_pro_integrity_secret_seed_v1_local";
pub const ALLOWED_CLOCK_DRIFT_SECS: u64 = 900; // 15 minutes tolerance for timezone/NTP

static DEVICE_FINGERPRINT: OnceLock<String> = OnceLock::new();

/// Computes or retrieves a cached stable, non-reversible SHA-256 device fingerprint (instance_id)
pub fn get_device_fingerprint() -> String {
    DEVICE_FINGERPRINT.get_or_init(compute_device_fingerprint).clone()
}

fn compute_device_fingerprint() -> String {
    let mut hasher = Sha256::new();

    // 1. Hostname / Computer Name
    let hostname = env::var("HOSTNAME")
        .or_else(|_| env::var("COMPUTERNAME"))
        .unwrap_or_else(|_| "qv-host".to_string());
    hasher.update(hostname.as_bytes());
    hasher.update(b":");

    // 2. User name
    let user = env::var("USER")
        .or_else(|_| env::var("USERNAME"))
        .unwrap_or_else(|_| "qv-user".to_string());
    hasher.update(user.as_bytes());
    hasher.update(b":");

    // 3. Platform OS
    hasher.update(env::consts::OS.as_bytes());
    hasher.update(b":");
    hasher.update(env::consts::ARCH.as_bytes());

    // 4. Platform-specific hardware machine UUID
    #[cfg(target_os = "macos")]
    {
        if let Ok(output) = std::process::Command::new("ioreg")
            .args(["-rd1", "-c", "IOPlatformExpertDevice"])
            .output()
        {
            let text = String::from_utf8_lossy(&output.stdout);
            for line in text.lines() {
                if line.contains("IOPlatformUUID") {
                    hasher.update(line.trim().as_bytes());
                    break;
                }
            }
        }
    }

    #[cfg(target_os = "linux")]
    {
        if let Ok(content) = std::fs::read_to_string("/etc/machine-id") {
            hasher.update(content.trim().as_bytes());
        }
    }

    #[cfg(target_os = "windows")]
    {
        if let Ok(output) = std::process::Command::new("reg")
            .args(["query", r"HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Cryptography", "/v", "MachineGuid"])
            .output()
        {
            let text = String::from_utf8_lossy(&output.stdout);
            for line in text.lines() {
                if line.contains("MachineGuid") {
                    if let Some(guid) = line.split_whitespace().last() {
                        hasher.update(guid.trim().as_bytes());
                        break;
                    }
                }
            }
        }
    }

    let result = hasher.finalize();
    hex::encode(result)
}

/// Computes local HMAC-SHA256 signature for tamper-resistant caching
pub fn compute_local_signature(license_key: &str, instance_id: &str, activated_at: &str) -> String {
    let mut mac = HmacSha256::new_from_slice(INTEGRITY_SEED)
        .expect("HMAC can take key of any size");
    let payload = format!("{}:{}:{}", license_key, instance_id, activated_at);
    mac.update(payload.as_bytes());
    hex::encode(mac.finalize().into_bytes())
}

/// Validates that the local signature is authentic and belongs to this device
pub fn verify_local_signature(
    license_key: &str,
    instance_id: &str,
    activated_at: &str,
    signature: &str,
) -> bool {
    let current_device = get_device_fingerprint();
    if instance_id != current_device {
        return false;
    }

    let expected_sig = compute_local_signature(license_key, instance_id, activated_at);
    expected_sig == signature
}

/// Computes local HMAC-SHA256 checksum for TrialState to prevent manual editing
pub fn compute_trial_checksum(
    used_sessions: u32,
    max_sessions: u32,
    first_used_at: Option<&str>,
    last_used_epoch: u64,
    device_fingerprint: &str,
) -> String {
    let mut mac = HmacSha256::new_from_slice(INTEGRITY_SEED)
        .expect("HMAC can take key of any size");
    let payload = format!(
        "{}:{}:{}:{}:{}",
        used_sessions,
        max_sessions,
        first_used_at.unwrap_or(""),
        last_used_epoch,
        device_fingerprint
    );
    mac.update(payload.as_bytes());
    hex::encode(mac.finalize().into_bytes())
}

/// Verifies trial state checksum against current device
pub fn verify_trial_checksum(
    used_sessions: u32,
    max_sessions: u32,
    first_used_at: Option<&str>,
    last_used_epoch: u64,
    device_fingerprint: &str,
    checksum: &str,
) -> bool {
    let expected = compute_trial_checksum(
        used_sessions,
        max_sessions,
        first_used_at,
        last_used_epoch,
        device_fingerprint,
    );
    expected == checksum
}

/// Computes HMAC signature for the sentinel high-watermark
pub fn compute_sentinel_signature(high_water_mark: u32, device_fingerprint: &str) -> String {
    let mut mac = HmacSha256::new_from_slice(INTEGRITY_SEED)
        .expect("HMAC can take key of any size");
    let payload = format!("sentinel:{}:{}", high_water_mark, device_fingerprint);
    mac.update(payload.as_bytes());
    hex::encode(mac.finalize().into_bytes())
}

/// Verifies sentinel signature
pub fn verify_sentinel_signature(high_water_mark: u32, device_fingerprint: &str, signature: &str) -> bool {
    let expected = compute_sentinel_signature(high_water_mark, device_fingerprint);
    expected == signature
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_device_fingerprint_deterministic() {
        let fp1 = get_device_fingerprint();
        let fp2 = get_device_fingerprint();
        assert_eq!(fp1, fp2);
        assert_eq!(fp1.len(), 64);
    }

    #[test]
    fn test_signature_roundtrip() {
        let license_key = "CR-PRO-TEST-KEY-12345";
        let instance_id = get_device_fingerprint();
        let activated_at = "2026-09-04T12:00:00Z";

        let sig = compute_local_signature(license_key, &instance_id, activated_at);
        assert!(verify_local_signature(license_key, &instance_id, activated_at, &sig));

        // Mismatched device ID or key must fail
        assert!(!verify_local_signature(license_key, "fake_device_id", activated_at, &sig));
        assert!(!verify_local_signature("WRONG-KEY", &instance_id, activated_at, &sig));
    }

    #[test]
    fn test_trial_checksum_roundtrip_and_tampering() {
        let fp = get_device_fingerprint();
        let checksum = compute_trial_checksum(10, 100, Some("2026-09-05T12:00:00Z"), 1788620000, &fp);

        // Valid verify
        assert!(verify_trial_checksum(10, 100, Some("2026-09-05T12:00:00Z"), 1788620000, &fp, &checksum));

        // Tampered session count (e.g. user changed 10 to 0)
        assert!(!verify_trial_checksum(0, 100, Some("2026-09-05T12:00:00Z"), 1788620000, &fp, &checksum));

        // Tampered timestamp
        assert!(!verify_trial_checksum(10, 100, Some("2026-09-01T12:00:00Z"), 1788620000, &fp, &checksum));

        // Foreign device fingerprint
        assert!(!verify_trial_checksum(10, 100, Some("2026-09-05T12:00:00Z"), 1788620000, "another_machine_id", &checksum));
    }

    #[test]
    fn test_sentinel_signature_verification() {
        let fp = get_device_fingerprint();
        let sig = compute_sentinel_signature(100, &fp);
        assert!(verify_sentinel_signature(100, &fp, &sig));
        assert!(!verify_sentinel_signature(0, &fp, &sig));
        assert!(!verify_sentinel_signature(100, "other_device", &sig));
    }
}
