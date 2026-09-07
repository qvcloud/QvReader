use crate::licensing::storage::record_trial_session as store_record_trial;
use crate::licensing::{LicenseInfo, LicenseManager};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ActivateLicenseResult {
    pub success: bool,
    pub tier: Option<String>,
    pub message: Option<String>,
    pub error: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DeactivateLicenseResult {
    pub success: bool,
    pub error: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RecordTrialResult {
    pub allowed: bool,
    pub remaining: u32,
}

#[tauri::command]
pub fn get_license_info() -> LicenseInfo {
    LicenseManager::get_current_info()
}

#[tauri::command]
pub async fn activate_license(license_key: String) -> ActivateLicenseResult {
    match LicenseManager::activate(&license_key).await {
        Ok(info) => ActivateLicenseResult {
            success: true,
            tier: Some(format!("{:?}", info.tier).to_lowercase()),
            message: Some("License activated successfully".to_string()),
            error: None,
        },
        Err(e) => ActivateLicenseResult {
            success: false,
            tier: None,
            message: None,
            error: Some(e),
        },
    }
}

#[tauri::command]
pub async fn deactivate_license() -> DeactivateLicenseResult {
    match LicenseManager::deactivate().await {
        Ok(_) => DeactivateLicenseResult {
            success: true,
            error: None,
        },
        Err(e) => DeactivateLicenseResult {
            success: false,
            error: Some(e),
        },
    }
}

#[tauri::command]
pub fn record_trial_session() -> RecordTrialResult {
    let (allowed, remaining) = store_record_trial();
    RecordTrialResult { allowed, remaining }
}
