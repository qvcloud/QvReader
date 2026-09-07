use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

fn default_locale() -> String {
    "zh".to_string()
}

fn default_true() -> bool {
    true
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserPreferences {
    pub theme: String,
    #[serde(rename = "fontSize")]
    pub font_size: u32,
    #[serde(rename = "fontFamily")]
    pub font_family: String,
    #[serde(rename = "isOutlinePinned")]
    pub is_outline_pinned: bool,
    #[serde(rename = "recentFiles")]
    pub recent_files: Vec<String>,
    #[serde(default = "default_locale")]
    pub locale: String,
    #[serde(rename = "autoSave", default)]
    pub auto_save: bool,
    #[serde(rename = "wordWrap", default = "default_true")]
    pub word_wrap: bool,
    #[serde(rename = "preserveLineEndings", default = "default_true")]
    pub preserve_line_endings: bool,
    #[serde(rename = "lastUpdateCheck", default)]
    pub last_update_check: Option<u64>,
    #[serde(rename = "autoCheckUpdate", default = "default_true")]
    pub auto_check_update: bool,
}

impl Default for UserPreferences {
    fn default() -> Self {
        Self {
            theme: "system".to_string(),
            font_size: 15,
            font_family: "sans-serif".to_string(),
            is_outline_pinned: false,
            recent_files: Vec::new(),
            locale: "zh".to_string(),
            auto_save: false,
            word_wrap: true,
            preserve_line_endings: true,
            last_update_check: None,
            auto_check_update: true,
        }
    }
}

fn get_prefs_path() -> PathBuf {
    let mut dir = dirs::config_dir().unwrap_or_else(|| PathBuf::from("."));
    dir.push("qvreader");
    let _ = fs::create_dir_all(&dir);
    dir.push("preferences.json");
    dir
}

#[tauri::command]
pub fn get_preferences() -> UserPreferences {
    let path = get_prefs_path();
    if path.exists() {
        if let Ok(bytes) = fs::read(&path) {
            if let Ok(prefs) = serde_json::from_slice::<UserPreferences>(&bytes) {
                return prefs;
            }
        }
    }
    UserPreferences::default()
}

#[tauri::command]
pub fn save_preferences(prefs: UserPreferences) -> Result<(), String> {
    let path = get_prefs_path();
    let json = serde_json::to_string_pretty(&prefs).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())?;
    Ok(())
}
