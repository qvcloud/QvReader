use crate::licensing::crypto;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

pub const DEFAULT_MAX_TRIAL_SESSIONS: u32 = 300;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LicenseRecord {
    #[serde(rename = "licenseKey")]
    pub license_key: String,
    #[serde(rename = "instanceId")]
    pub instance_id: String,
    #[serde(rename = "customerEmail")]
    pub customer_email: String,
    #[serde(rename = "productId")]
    pub product_id: String,
    pub tier: String,
    #[serde(rename = "activatedAt")]
    pub activated_at: String,
    #[serde(rename = "expiresAt")]
    pub expires_at: Option<String>,
    pub signature: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TrialState {
    #[serde(rename = "usedSessions")]
    pub used_sessions: u32,
    #[serde(rename = "maxSessions")]
    pub max_sessions: u32,
    #[serde(rename = "firstUsedAt")]
    pub first_used_at: Option<String>,
    #[serde(rename = "lastUsedAt")]
    pub last_used_at: Option<String>,
    #[serde(rename = "lastUsedEpoch", default)]
    pub last_used_epoch: u64,
    #[serde(default)]
    pub checksum: String,
}

impl Default for TrialState {
    fn default() -> Self {
        let fp = crypto::get_device_fingerprint();
        let checksum = crypto::compute_trial_checksum(0, DEFAULT_MAX_TRIAL_SESSIONS, None, 0, &fp);
        Self {
            used_sessions: 0,
            max_sessions: DEFAULT_MAX_TRIAL_SESSIONS,
            first_used_at: None,
            last_used_at: None,
            last_used_epoch: 0,
            checksum,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SentinelState {
    pub fingerprint: String,
    pub consumed: bool,
    #[serde(rename = "highWaterMark")]
    pub high_water_mark: u32,
    pub signature: String,
}

#[cfg(test)]
std::thread_local! {
    static TEST_DIR: std::cell::RefCell<Option<PathBuf>> = const { std::cell::RefCell::new(None) };
}

#[cfg(test)]
pub fn set_test_dir(path: Option<PathBuf>) {
    TEST_DIR.with(|d| *d.borrow_mut() = path);
}

fn get_app_data_dir() -> PathBuf {
    #[cfg(test)]
    {
        if let Some(p) = TEST_DIR.with(|d| d.borrow().clone()) {
            let _ = fs::create_dir_all(&p);
            return p;
        }
    }
    let mut dir = dirs::config_dir().unwrap_or_else(|| PathBuf::from("."));
    dir.push("qvreader");
    let _ = fs::create_dir_all(&dir);
    dir
}

fn get_sentinel_file_path() -> PathBuf {
    #[cfg(test)]
    {
        if let Some(p) = TEST_DIR.with(|d| d.borrow().clone()) {
            return p.join(".sentinel");
        }
    }
    let mut dir = dirs::data_local_dir().unwrap_or_else(get_app_data_dir);
    dir.push("qvreader");
    let _ = fs::create_dir_all(&dir);
    dir.join(".sentinel")
}

fn get_license_file_path() -> PathBuf {
    get_app_data_dir().join("license.json")
}

fn get_entitlement_file_path() -> PathBuf {
    get_app_data_dir().join("entitlement.json")
}

fn get_trial_file_path() -> PathBuf {
    get_app_data_dir().join("trial.json")
}

pub fn load_entitlement() -> Option<super::entitlement::SignedEntitlement> {
    let path = get_entitlement_file_path();
    if !path.exists() {
        return None;
    }
    let data = fs::read(&path).ok()?;
    serde_json::from_slice::<super::entitlement::SignedEntitlement>(&data).ok()
}

pub fn save_entitlement(entitlement: &super::entitlement::SignedEntitlement) -> Result<(), String> {
    let path = get_entitlement_file_path();
    let json = serde_json::to_string_pretty(entitlement).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())
}

pub fn delete_entitlement() -> Result<(), String> {
    let path = get_entitlement_file_path();
    if path.exists() {
        fs::remove_file(path).map_err(|e| e.to_string())?;
    }
    let _ = delete_license_credential();
    Ok(())
}

const KEYRING_SERVICE: &str = "qvreader";
const KEYRING_USER: &str = "license_key";

pub fn save_license_credential(key: &str) -> Result<(), String> {
    #[cfg(not(test))]
    {
        if let Ok(entry) = keyring::Entry::new(KEYRING_SERVICE, KEYRING_USER) {
            let _ = entry.set_password(key);
        }
    }
    #[cfg(test)]
    {
        let _ = key;
    }
    Ok(())
}

pub fn delete_license_credential() -> Result<(), String> {
    #[cfg(not(test))]
    {
        if let Ok(entry) = keyring::Entry::new(KEYRING_SERVICE, KEYRING_USER) {
            let _ = entry.delete_password();
        }
    }
    Ok(())
}

pub fn load_sentinel() -> Option<SentinelState> {
    let path = get_sentinel_file_path();
    if !path.exists() {
        return None;
    }
    let data = fs::read(&path).ok()?;
    let sentinel = serde_json::from_slice::<SentinelState>(&data).ok()?;
    let fp = crypto::get_device_fingerprint();
    if sentinel.fingerprint != fp {
        return None;
    }
    if !crypto::verify_sentinel_signature(sentinel.high_water_mark, &fp, &sentinel.signature) {
        return None;
    }
    Some(sentinel)
}

pub fn update_sentinel(high_water_mark: u32) -> Result<(), String> {
    let fp = crypto::get_device_fingerprint();
    let current_watermark = load_sentinel()
        .map(|s| s.high_water_mark)
        .unwrap_or(0);
    let new_mark = std::cmp::max(current_watermark, high_water_mark);
    let signature = crypto::compute_sentinel_signature(new_mark, &fp);
    let record = SentinelState {
        fingerprint: fp,
        consumed: new_mark >= DEFAULT_MAX_TRIAL_SESSIONS,
        high_water_mark: new_mark,
        signature,
    };
    let path = get_sentinel_file_path();
    let json = serde_json::to_string(&record).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())
}

pub fn load_license() -> Option<LicenseRecord> {
    let path = get_license_file_path();
    if !path.exists() {
        return None;
    }
    let data = fs::read(&path).ok()?;
    serde_json::from_slice::<LicenseRecord>(&data).ok()
}

pub fn delete_license() -> Result<(), String> {
    let path = get_license_file_path();
    if path.exists() {
        fs::remove_file(path).map_err(|e| e.to_string())?;
    }
    Ok(())
}

pub fn load_trial() -> TrialState {
    let fp = crypto::get_device_fingerprint();
    let path = get_trial_file_path();
    let sentinel = load_sentinel();

    // Check if sentinel indicates that trial is already consumed
    let sentinel_consumed = sentinel
        .as_ref()
        .map(|s| s.consumed || s.high_water_mark >= DEFAULT_MAX_TRIAL_SESSIONS)
        .unwrap_or(false);

    if !path.exists() {
        // File does not exist
        if sentinel_consumed {
            // Anti-deletion protection: User deleted trial.json after consuming quota
            return TrialState {
                used_sessions: DEFAULT_MAX_TRIAL_SESSIONS,
                max_sessions: DEFAULT_MAX_TRIAL_SESSIONS,
                first_used_at: None,
                last_used_at: None,
                last_used_epoch: 0,
                checksum: crypto::compute_trial_checksum(
                    DEFAULT_MAX_TRIAL_SESSIONS,
                    DEFAULT_MAX_TRIAL_SESSIONS,
                    None,
                    0,
                    &fp,
                ),
            };
        }

        // Clean first run
        let initial_checksum = crypto::compute_trial_checksum(0, DEFAULT_MAX_TRIAL_SESSIONS, None, 0, &fp);
        return TrialState {
            used_sessions: 0,
            max_sessions: DEFAULT_MAX_TRIAL_SESSIONS,
            first_used_at: None,
            last_used_at: None,
            last_used_epoch: 0,
            checksum: initial_checksum,
        };
    }

    if let Ok(data) = fs::read(&path) {
        if let Ok(mut trial) = serde_json::from_slice::<TrialState>(&data) {
            // Case 1: Legacy file migration without HMAC checksum (pre-checksum version)
            if trial.checksum.is_empty() {
                let max = std::cmp::max(DEFAULT_MAX_TRIAL_SESSIONS, trial.max_sessions);
                let used = std::cmp::min(trial.used_sessions, max);
                trial.max_sessions = max;
                trial.used_sessions = used;
                trial.checksum = crypto::compute_trial_checksum(
                    trial.used_sessions,
                    trial.max_sessions,
                    trial.first_used_at.as_deref(),
                    trial.last_used_epoch,
                    &fp,
                );
                let _ = save_trial(&trial);
                return trial;
            }

            // Case 2: Has checksum. Verify against the recorded max_sessions
            let is_valid_checksum = crypto::verify_trial_checksum(
                trial.used_sessions,
                trial.max_sessions,
                trial.first_used_at.as_deref(),
                trial.last_used_epoch,
                &fp,
                &trial.checksum,
            );

            let lock_max = std::cmp::max(DEFAULT_MAX_TRIAL_SESSIONS, trial.max_sessions);

            if !is_valid_checksum {
                // Tamper detected: User edited count/timestamps or copied file
                let first_used_at = trial.first_used_at.clone();
                let last_used_at = trial.last_used_at.clone();
                return TrialState {
                    used_sessions: lock_max,
                    max_sessions: lock_max,
                    first_used_at: first_used_at.clone(),
                    last_used_at,
                    last_used_epoch: trial.last_used_epoch,
                    checksum: crypto::compute_trial_checksum(
                        lock_max,
                        lock_max,
                        first_used_at.as_deref(),
                        trial.last_used_epoch,
                        &fp,
                    ),
                };
            }

            // 2. Check for monotonic time / clock rollback
            let now_epoch = current_epoch_seconds();
            if trial.last_used_epoch > 0
                && now_epoch + crypto::ALLOWED_CLOCK_DRIFT_SECS < trial.last_used_epoch
            {
                // Clock was turned backward by > 15 minutes!
                let first_used_at = trial.first_used_at.clone();
                let last_used_at = trial.last_used_at.clone();
                return TrialState {
                    used_sessions: lock_max,
                    max_sessions: lock_max,
                    first_used_at: first_used_at.clone(),
                    last_used_at,
                    last_used_epoch: trial.last_used_epoch,
                    checksum: crypto::compute_trial_checksum(
                        lock_max,
                        lock_max,
                        first_used_at.as_deref(),
                        trial.last_used_epoch,
                        &fp,
                    ),
                };
            }

            // 3. Sentinel watermark consistency check
            if let Some(ref s) = sentinel {
                if s.high_water_mark > trial.used_sessions {
                    // Trial count in trial.json is lower than recorded watermark! Tampering detected.
                    let first_used_at = trial.first_used_at.clone();
                    let last_used_at = trial.last_used_at.clone();
                    return TrialState {
                        used_sessions: lock_max,
                        max_sessions: lock_max,
                        first_used_at: first_used_at.clone(),
                        last_used_at,
                        last_used_epoch: trial.last_used_epoch,
                        checksum: crypto::compute_trial_checksum(
                            lock_max,
                            lock_max,
                            first_used_at.as_deref(),
                            trial.last_used_epoch,
                            &fp,
                        ),
                    };
                }
            }

            // 4. Upgrade quota from older max_sessions (< 300) to DEFAULT_MAX_TRIAL_SESSIONS (300)
            if trial.max_sessions < DEFAULT_MAX_TRIAL_SESSIONS {
                let mut upgraded = trial;
                upgraded.max_sessions = DEFAULT_MAX_TRIAL_SESSIONS;
                upgraded.checksum = crypto::compute_trial_checksum(
                    upgraded.used_sessions,
                    upgraded.max_sessions,
                    upgraded.first_used_at.as_deref(),
                    upgraded.last_used_epoch,
                    &fp,
                );
                let _ = save_trial(&upgraded);
                return upgraded;
            }

            return trial;
        }
    }

    // Corrupted file -> Lock quota
    TrialState {
        used_sessions: DEFAULT_MAX_TRIAL_SESSIONS,
        max_sessions: DEFAULT_MAX_TRIAL_SESSIONS,
        first_used_at: None,
        last_used_at: None,
        last_used_epoch: 0,
        checksum: crypto::compute_trial_checksum(
            DEFAULT_MAX_TRIAL_SESSIONS,
            DEFAULT_MAX_TRIAL_SESSIONS,
            None,
            0,
            &fp,
        ),
    }
}

pub fn save_trial(trial: &TrialState) -> Result<(), String> {
    let fp = crypto::get_device_fingerprint();
    let mut updated = trial.clone();
    updated.checksum = crypto::compute_trial_checksum(
        updated.used_sessions,
        updated.max_sessions,
        updated.first_used_at.as_deref(),
        updated.last_used_epoch,
        &fp,
    );

    let path = get_trial_file_path();
    let json = serde_json::to_string_pretty(&updated).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())?;

    let _ = update_sentinel(updated.used_sessions);
    Ok(())
}

/// Increments the trial session counter and returns (allowed, remaining)
pub fn record_trial_session() -> (bool, u32) {
    let mut trial = load_trial();
    let now = chrono_now();
    let now_epoch = current_epoch_seconds();

    if trial.used_sessions >= trial.max_sessions {
        return (false, 0);
    }

    if trial.first_used_at.is_none() {
        trial.first_used_at = Some(now.clone());
    }
    trial.last_used_at = Some(now);
    trial.last_used_epoch = now_epoch;
    trial.used_sessions += 1;

    let _ = save_trial(&trial);

    let remaining = trial.max_sessions.saturating_sub(trial.used_sessions);
    (true, remaining)
}

fn chrono_now() -> String {
    // Standard RFC3339 timestamp approximation without extra heavy crate
    let d = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default();
    format!("{}.{}", d.as_secs(), d.subsec_millis())
}

fn current_epoch_seconds() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0)
}

#[cfg(test)]
pub fn setup_isolated_env(test_name: &str) -> PathBuf {
    let nanos = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_nanos())
        .unwrap_or(0);
    let temp_dir = std::env::temp_dir().join(format!("qv_test_{}_{}_{}", test_name, std::process::id(), nanos));
    let _ = fs::remove_dir_all(&temp_dir);
    let _ = fs::create_dir_all(&temp_dir);
    set_test_dir(Some(temp_dir.clone()));
    temp_dir
}

#[cfg(test)]
pub fn cleanup_isolated_env(temp_dir: PathBuf) {
    set_test_dir(None);
    let _ = fs::remove_dir_all(temp_dir);
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;

    #[test]
    fn test_normal_trial_usage() {
        let temp_dir = setup_isolated_env("normal_usage");

        let trial = load_trial();
        assert_eq!(trial.used_sessions, 0);
        assert_eq!(trial.max_sessions, 300);

        let (allowed, remaining) = record_trial_session();
        assert!(allowed);
        assert_eq!(remaining, 299);

        let reloaded = load_trial();
        assert_eq!(reloaded.used_sessions, 1);
        assert!(reloaded.last_used_epoch > 0);

        cleanup_isolated_env(temp_dir);
    }

    #[test]
    fn test_tamper_detection_on_manual_edit() {
        let temp_dir = setup_isolated_env("tamper_edit");

        // Record 5 sessions
        for _ in 0..5 {
            record_trial_session();
        }
        let trial = load_trial();
        assert_eq!(trial.used_sessions, 5);

        // Attacker manually alters trial.json: sets usedSessions = 0 without updating checksum
        let trial_path = get_trial_file_path();
        let raw = fs::read_to_string(&trial_path).unwrap();
        let tampered_raw = raw.replace("\"usedSessions\": 5", "\"usedSessions\": 0");
        fs::write(&trial_path, tampered_raw).unwrap();

        // Reload: must detect tampering and lock quota to max_sessions (0 remaining)
        let loaded = load_trial();
        assert_eq!(loaded.used_sessions, 300);

        let (allowed, remaining) = record_trial_session();
        assert!(!allowed);
        assert_eq!(remaining, 0);

        cleanup_isolated_env(temp_dir);
    }

    #[test]
    fn test_clock_rollback_detection() {
        let temp_dir = setup_isolated_env("clock_rollback");

        record_trial_session();
        let mut trial = load_trial();

        // Simulate future timestamp: session was recorded at epoch 2000000000
        trial.last_used_epoch = 2000000000;
        let fp = crypto::get_device_fingerprint();
        trial.checksum = crypto::compute_trial_checksum(
            trial.used_sessions,
            trial.max_sessions,
            trial.first_used_at.as_deref(),
            trial.last_used_epoch,
            &fp,
        );
        let path = get_trial_file_path();
        fs::write(path, serde_json::to_string_pretty(&trial).unwrap()).unwrap();

        // System time now is ~1.78 billion, so 2.0 billion is ~7 years in future -> Rollback detected!
        let reloaded = load_trial();
        assert_eq!(reloaded.used_sessions, 300);

        cleanup_isolated_env(temp_dir);
    }

    #[test]
    fn test_sentinel_catches_trial_deletion() {
        let temp_dir = setup_isolated_env("sentinel_deletion");

        // Consume trial
        let mut trial = load_trial();
        trial.used_sessions = 300;
        save_trial(&trial).unwrap();

        // Verify sentinel was written
        let sentinel = load_sentinel().expect("sentinel must exist");
        assert!(sentinel.consumed);
        assert_eq!(sentinel.high_water_mark, 300);

        // User deletes trial.json to bypass trial expiration
        let trial_path = get_trial_file_path();
        fs::remove_file(trial_path).unwrap();

        // Reload: sentinel must catch it and refuse to reset
        let reloaded = load_trial();
        assert_eq!(reloaded.used_sessions, 300);

        let (allowed, remaining) = record_trial_session();
        assert!(!allowed);
        assert_eq!(remaining, 0);

        cleanup_isolated_env(temp_dir);
    }

    #[test]
    fn test_legacy_migration_without_checksum() {
        let temp_dir = setup_isolated_env("legacy_migration");

        // Write a legacy trial.json with maxSessions: 100, usedSessions: 21, no checksum
        let legacy_json = r#"{
  "usedSessions": 21,
  "maxSessions": 100,
  "firstUsedAt": "1788536410.744",
  "lastUsedAt": "1788626125.39"
}"#;
        let trial_path = get_trial_file_path();
        fs::write(&trial_path, legacy_json).unwrap();

        // Load trial: must migrate maxSessions to 300, preserve usedSessions: 21, and compute valid checksum
        let loaded = load_trial();
        assert_eq!(loaded.used_sessions, 21);
        assert_eq!(loaded.max_sessions, 300);
        assert!(!loaded.checksum.is_empty());

        let fp = crypto::get_device_fingerprint();
        assert!(crypto::verify_trial_checksum(
            loaded.used_sessions,
            loaded.max_sessions,
            loaded.first_used_at.as_deref(),
            loaded.last_used_epoch,
            &fp,
            &loaded.checksum,
        ));

        // Subsequent session recording should work smoothly from 21 -> 22 with 278 remaining
        let (allowed, remaining) = record_trial_session();
        assert!(allowed);
        assert_eq!(remaining, 278);

        cleanup_isolated_env(temp_dir);
    }
}

