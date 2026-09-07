use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppVersionInfo {
    pub version: String,
    #[serde(rename = "buildType")]
    pub build_type: String,
    pub platform: String,
    pub arch: String,
}

#[tauri::command]
pub fn get_app_version() -> AppVersionInfo {
    let build_type = if cfg!(debug_assertions) {
        "debug".to_string()
    } else {
        "release".to_string()
    };

    AppVersionInfo {
        version: env!("CARGO_PKG_VERSION").to_string(),
        build_type,
        platform: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
    }
}
