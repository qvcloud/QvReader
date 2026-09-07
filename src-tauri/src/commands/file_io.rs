use crate::fidelity::encoding::{detect_and_read, prepare_bytes_for_save, FileEncoding, LineEnding};
use crate::watcher::FileWatcherManager;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use tauri::{AppHandle, State, Window};
use xxhash_rust::xxh64::xxh64;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DocumentDto {
    #[serde(rename = "filePath")]
    pub file_path: Option<String>,
    #[serde(rename = "fileName")]
    pub file_name: String,
    #[serde(rename = "rawContent")]
    pub raw_content: String,
    #[serde(rename = "diskContent")]
    pub disk_content: String,
    #[serde(rename = "isDirty")]
    pub is_dirty: bool,
    #[serde(rename = "lineEnding")]
    pub line_ending: LineEnding,
    pub encoding: FileEncoding,
    #[serde(rename = "isReadOnly")]
    pub is_read_only: bool,
    #[serde(rename = "diskHash")]
    pub disk_hash: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SaveResult {
    pub success: bool,
    #[serde(rename = "diskHash")]
    pub disk_hash: String,
}

#[tauri::command]
pub async fn open_file(
    app: AppHandle,
    watcher: State<'_, FileWatcherManager>,
    path: String,
) -> Result<DocumentDto, String> {
    // Read + decode on a blocking thread pool so a large file never stalls the
    // async/IPC runtime or the webview event loop while it is being loaded.
    tauri::async_runtime::spawn_blocking(move || {
        let p = Path::new(&path);
        if !p.exists() {
            return Err(format!("File does not exist: {}", path));
        }

        let bytes = fs::read(p).map_err(|e| format!("Failed to read file: {}", e))?;
        let detected = detect_and_read(&bytes)?;
        let file_name = p
            .file_name()
            .map(|f| f.to_string_lossy().to_string())
            .unwrap_or_else(|| "document.md".to_string());

        let is_read_only = fs::metadata(p)
            .map(|m| m.permissions().readonly())
            .unwrap_or(false);

        Ok(DocumentDto {
            file_path: Some(path),
            file_name,
            raw_content: detected.content.clone(),
            disk_content: detected.content,
            is_dirty: false,
            line_ending: detected.line_ending,
            encoding: detected.encoding,
            is_read_only,
            disk_hash: detected.hash,
        })
    })
    .await
    .map_err(|e| format!("File read task panicked: {}", e))?
    .and_then(|dto| {
        // Watch opened file for external changes (on success only).
        let p = dto.file_path.clone().unwrap_or_default();
        watcher.start_watching(app, PathBuf::from(p));
        Ok(dto)
    })
}

#[tauri::command]
pub fn save_file(
    file_path: String,
    content: String,
    line_ending: LineEnding,
    encoding: FileEncoding,
) -> Result<SaveResult, String> {
    let p = Path::new(&file_path);
    let bytes = prepare_bytes_for_save(&content, line_ending, encoding);
    let new_hash = format!("{:x}", xxh64(&bytes, 0));

    // Atomic save: write to temporary file in same dir, then rename
    let parent_dir = p.parent().unwrap_or_else(|| Path::new("."));
    let temp_file = parent_dir.join(format!(".{}.tmp", p.file_name().unwrap().to_string_lossy()));

    fs::write(&temp_file, &bytes)
        .map_err(|e| format!("Failed to write temporary file: {}", e))?;

    fs::rename(&temp_file, p)
        .map_err(|e| format!("Failed to commit file atomically: {}", e))?;

    Ok(SaveResult {
        success: true,
        disk_hash: new_hash,
    })
}

#[tauri::command]
pub fn close_window(window: Window, _force: Option<bool>) {
    let _ = window.close();
}

#[tauri::command]
pub fn set_window_title(window: Window, title: String) {
    let _ = window.set_title(&title);
}

#[cfg(target_os = "macos")]
extern "C" {
    fn show_macos_open_panel() -> *const std::os::raw::c_char;
    fn show_macos_save_panel(default_name: *const std::os::raw::c_char) -> *const std::os::raw::c_char;
    fn reveal_in_macos_finder(path: *const std::os::raw::c_char);
}

#[tauri::command]
pub fn show_open_dialog() -> Option<String> {
    #[cfg(target_os = "macos")]
    unsafe {
        let ptr = show_macos_open_panel();
        if !ptr.is_null() {
            let s = std::ffi::CStr::from_ptr(ptr).to_string_lossy().to_string();
            if !s.is_empty() {
                return Some(s);
            }
        }
    }
    None
}

#[tauri::command]
pub fn show_save_dialog(default_name: Option<String>) -> Option<String> {
    #[cfg(target_os = "macos")]
    unsafe {
        let name_c = default_name.and_then(|n| std::ffi::CString::new(n).ok());
        let ptr = show_macos_save_panel(name_c.as_ref().map_or(std::ptr::null(), |c| c.as_ptr()));
        if !ptr.is_null() {
            let s = std::ffi::CStr::from_ptr(ptr).to_string_lossy().to_string();
            if !s.is_empty() {
                return Some(s);
            }
        }
    }
    None
}

#[tauri::command]
pub fn reveal_in_finder(path: String) {
    #[cfg(target_os = "macos")]
    unsafe {
        if let Ok(c_str) = std::ffi::CString::new(path) {
            reveal_in_macos_finder(c_str.as_ptr());
        }
    }
}

#[tauri::command]
pub fn print_document(window: tauri::WebviewWindow) -> Result<(), String> {
    window.print().map_err(|e| e.to_string())
}



