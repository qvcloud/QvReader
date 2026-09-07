// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod fidelity;
mod licensing;
mod watcher;

use commands::cli::{install_cli, is_cli_installed, uninstall_cli};
use commands::file_io::{
    close_window, open_file, print_document, reveal_in_finder, save_file, set_window_title,
    show_open_dialog, show_save_dialog,
};
use commands::licensing::{
    activate_license, deactivate_license, get_license_info, record_trial_session,
};
use commands::preferences::{get_preferences, save_preferences};
use commands::version::get_app_version;
use commands::workspace::{classify_path, scan_directory};
use serde::{Deserialize, Serialize};
use std::env;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::menu::{MenuBuilder, MenuItem, SubmenuBuilder};
use tauri::{Emitter, Manager, State};
use watcher::FileWatcherManager;

fn open_in_browser(url: &str) {
    #[cfg(target_os = "macos")]
    let _ = std::process::Command::new("open").arg(url).spawn();
    #[cfg(target_os = "windows")]
    let _ = std::process::Command::new("rundll32")
        .args(["url.dll,FileProtocolHandler", url])
        .spawn();
    #[cfg(target_os = "linux")]
    let _ = std::process::Command::new("xdg-open").arg(url).spawn();
}

#[cfg(target_os = "macos")]
extern "C" {
    fn set_macos_dock_icon(bytes: *const u8, length: usize);
    fn show_macos_open_panel() -> *const std::os::raw::c_char;
}

pub struct InitialFileState(pub Mutex<Option<String>>);

#[tauri::command]
fn get_initial_file(state: State<'_, InitialFileState>) -> Option<String> {
    state.0.lock().unwrap().clone()
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InitialLaunchData {
    pub launch_mode: String,
    pub target_path: Option<String>,
    pub document: Option<commands::file_io::DocumentDto>,
    pub preferences: commands::preferences::UserPreferences,
    pub is_pro_licensed: bool,
}

#[tauri::command]
async fn get_initial_launch_data(
    app: tauri::AppHandle,
    state: State<'_, InitialFileState>,
    watcher: State<'_, FileWatcherManager>,
) -> Result<InitialLaunchData, String> {
    #[cfg(target_os = "macos")]
    {
        // On macOS Finder double-click launch, RunEvent::Opened can arrive shortly after setup.
        // If state is not yet populated, wait briefly (up to 75ms) to catch the open event.
        if state.0.lock().unwrap().is_none() {
            std::thread::sleep(std::time::Duration::from_millis(75));
        }
    }

    let initial = state.0.lock().unwrap().clone();
    let prefs = get_preferences();
    let license = get_license_info();
    let is_pro = license.is_pro;

    if let Some(path_str) = initial {
        let p = std::path::Path::new(&path_str);
        if p.is_dir() {
            return Ok(InitialLaunchData {
                launch_mode: "directory".to_string(),
                target_path: Some(path_str),
                document: None,
                preferences: prefs,
                is_pro_licensed: is_pro,
            });
        } else if p.is_file() {
            let doc = commands::file_io::open_file(app.clone(), watcher, path_str.clone()).await.ok();
            return Ok(InitialLaunchData {
                launch_mode: "file".to_string(),
                target_path: Some(path_str),
                document: doc,
                preferences: prefs,
                is_pro_licensed: is_pro,
            });
        }
    }

    Ok(InitialLaunchData {
        launch_mode: "empty".to_string(),
        target_path: None,
        document: None,
        preferences: prefs,
        is_pro_licensed: is_pro,
    })
}

#[tauri::command]
fn show_window(app: tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
    }
}

fn main() {
    let args: Vec<String> = env::args().collect();
    // Normalize a possibly-relative CLI path against the current working dir so
    // the app finds the file regardless of where the process was launched from.
    let initial_file = if args.len() > 1 && !args[1].starts_with('-') {
        let raw = PathBuf::from(&args[1]);
        if raw.is_absolute() {
            Some(raw)
        } else {
            match env::current_dir() {
                Ok(dir) => Some(dir.join(&raw)),
                Err(_) => Some(raw),
            }
        }
        .map(|p| p.to_string_lossy().to_string())
    } else {
        None
    };

    let app = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .manage(FileWatcherManager::new())
        .manage(InitialFileState(Mutex::new(initial_file)))
        // NOTE: macOS/Tauri drag&drop is intentionally NOT handled here.
        // With `dragDropEnabled: true` (see tauri.conf.json) Tauri routes the drop
        // to the frontend via the tauri://drag-* events consumed by
        // `window.onDragDropEvent` in App.tsx. Handling it again in Rust would
        // double-fire `open-file-event` / drag status and cause the document to
        // be loaded twice on a single drop.
        .setup(move |app| {
            // Force macOS dock to display QvReader icon even in dev/unbundled mode
            #[cfg(target_os = "macos")]
            {
                const ICON_BYTES: &[u8] = include_bytes!("../icons/icon.png");
                unsafe {
                    set_macos_dock_icon(ICON_BYTES.as_ptr(), ICON_BYTES.len());
                }
            }

            // Construct native App Menu
            #[cfg(target_os = "macos")]
            let app_sub = SubmenuBuilder::new(app, "QvReader")
                .about(None)
                .separator()
                .item(&MenuItem::with_id(app, "open_settings", "Preferences...", true, Some("CmdOrCtrl+,"))?)
                .item(&MenuItem::with_id(app, "open_license", "License / 授权管理...", true, None::<&str>)?)
                .separator()
                .services()
                .separator()
                .hide()
                .hide_others()
                .show_all()
                .separator()
                .quit()
                .build()?;

            let file_sub = SubmenuBuilder::new(app, "File")
                .item(&MenuItem::with_id(app, "new_file", "New Document", true, Some("CmdOrCtrl+N"))?)
                .item(&MenuItem::with_id(app, "open_file", "Open...", true, Some("CmdOrCtrl+O"))?)
                .separator()
                .item(&MenuItem::with_id(app, "save_file", "Save", true, Some("CmdOrCtrl+S"))?)
                .item(&MenuItem::with_id(app, "save_as_file", "Save As...", true, Some("CmdOrCtrl+Shift+S"))?)
                .item(&MenuItem::with_id(app, "reload_file", "Reload from Disk", true, Some("CmdOrCtrl+R"))?)
                .item(&MenuItem::with_id(app, "reveal_file", "Reveal in Finder", true, None::<&str>)?)
                .separator()
                .item(&MenuItem::with_id(app, "print_document", "Print...", true, Some("CmdOrCtrl+P"))?)
                .item(&MenuItem::with_id(app, "export_pdf", "Export as PDF...", true, Some("CmdOrCtrl+Shift+P"))?)
                .item(&MenuItem::with_id(app, "export_image", "Export as Image (PNG)...", true, Some("CmdOrCtrl+Shift+E"))?)
                .item(&MenuItem::with_id(app, "export_html", "Export as HTML...", true, Some("CmdOrCtrl+Shift+H"))?)
                .separator()
                .close_window()
                .build()?;

            let edit_sub = SubmenuBuilder::new(app, "Edit")
                .undo()
                .redo()
                .separator()
                .cut()
                .copy()
                .paste()
                .select_all()
                .build()?;

            let view_sub = SubmenuBuilder::new(app, "View")
                .item(&MenuItem::with_id(app, "view_reading", "Reading Mode", true, Some("CmdOrCtrl+1"))?)
                .item(&MenuItem::with_id(app, "view_inline", "Inline Edit Mode", true, Some("CmdOrCtrl+2"))?)
                .item(&MenuItem::with_id(app, "view_split", "Split View Mode", true, Some("CmdOrCtrl+3"))?)
                .separator()
                .item(&MenuItem::with_id(app, "toggle_outline", "Toggle Table of Contents", true, Some("CmdOrCtrl+Shift+O"))?)
                .separator()
                .item(&MenuItem::with_id(app, "zoom_in", "Zoom In", true, Some("CmdOrCtrl+="))?)
                .item(&MenuItem::with_id(app, "zoom_out", "Zoom Out", true, Some("CmdOrCtrl+-"))?)
                .item(&MenuItem::with_id(app, "zoom_reset", "Actual Size", true, Some("CmdOrCtrl+0"))?)
                .separator()
                .fullscreen()
                .build()?;

            let window_sub = SubmenuBuilder::new(app, "Window")
                .minimize()
                .separator()
                .bring_all_to_front()
                .build()?;

            let help_sub = SubmenuBuilder::new(app, "Help")
                .item(&MenuItem::with_id(app, "open_shortcuts", "Keyboard Shortcuts Guide", true, Some("CmdOrCtrl+/"))?)
                .item(&MenuItem::with_id(app, "open_settings", "Preferences...", true, Some("CmdOrCtrl+,"))?)
                .item(&MenuItem::with_id(app, "open_license", "License / 授权管理...", true, None::<&str>)?)
                .separator()
                .item(&MenuItem::with_id(app, "install_cli_menu", "Install 'qvreader' command in PATH", true, None::<&str>)?)
                .separator()
                .item(&MenuItem::with_id(app, "open_website", "QvReader Website", true, None::<&str>)?)
                .item(&MenuItem::with_id(app, "report_issue", "Report an Issue...", true, None::<&str>)?)
                .build()?;

            #[cfg(target_os = "macos")]
            let menu = MenuBuilder::new(app)
                .item(&app_sub)
                .item(&file_sub)
                .item(&edit_sub)
                .item(&view_sub)
                .item(&window_sub)
                .item(&help_sub)
                .build()?;

            #[cfg(not(target_os = "macos"))]
            let menu = MenuBuilder::new(app)
                .item(&file_sub)
                .item(&edit_sub)
                .item(&view_sub)
                .item(&window_sub)
                .item(&help_sub)
                .build()?;

            app.set_menu(menu)?;

            Ok(())
        })
        .on_menu_event(|app_handle, event| {
            let id = event.id().as_ref();
            if id == "open_file" {
                #[cfg(target_os = "macos")]
                {
                    let handle = app_handle.clone();
                    tauri::async_runtime::spawn(async move {
                        let ptr = unsafe { show_macos_open_panel() };
                        if !ptr.is_null() {
                            let s = unsafe { std::ffi::CStr::from_ptr(ptr).to_string_lossy().to_string() };
                            if !s.is_empty() {
                                if let Some(window) = handle.get_webview_window("main") {
                                    let _ = window.emit("open-file-event", &s);
                                }
                            }
                        }
                    });
                }
            } else if id == "install_cli_menu" {
                match install_cli() {
                    Ok(path) => {
                        #[cfg(target_os = "macos")]
                        {
                            let msg = format!("'qvreader' command has been installed to {}.\n\nYou can now run 'qvreader .' or 'qvreader <file>' in terminal.", path);
                            let script = format!("display dialog \"{}\" with title \"QvReader CLI\" buttons {{\"OK\"}} default button \"OK\"", msg);
                            let _ = std::process::Command::new("osascript").arg("-e").arg(script).spawn();
                        }
                    }
                    Err(err) => {
                        #[cfg(target_os = "macos")]
                        {
                            let script = format!("display alert \"Install failed: {}\"", err);
                            let _ = std::process::Command::new("osascript").arg("-e").arg(script).spawn();
                        }
                    }
                }
                if let Some(window) = app_handle.get_webview_window("main") {
                    let _ = window.emit("cli-status-changed", true);
                }
            } else if id == "print_document" {
                if let Some(window) = app_handle.get_webview_window("main") {
                    let _ = window.print();
                    let _ = window.emit("menu-action", "print_document");
                }
            } else if id == "open_website" {
                open_in_browser("https://qvreader.com");
            } else if id == "report_issue" {
                open_in_browser("https://github.com/qvcloud/QvReader/issues");
            } else if let Some(window) = app_handle.get_webview_window("main") {
                let _ = window.emit("menu-action", id);
            }
        })
        .invoke_handler(tauri::generate_handler![
            open_file,
            save_file,
            close_window,
            set_window_title,
            get_preferences,
            save_preferences,
            get_initial_file,
            show_open_dialog,
            show_save_dialog,
            reveal_in_finder,
            classify_path,
            scan_directory,
            is_cli_installed,
            install_cli,
            uninstall_cli,
            get_license_info,
            activate_license,
            deactivate_license,
            record_trial_session,
            get_app_version,
            print_document,
            get_initial_launch_data,
            show_window,
        ])
        .build(tauri::generate_context!())
        .expect("error while building QvReader application");

    app.run(|app_handle, event| {
        #[cfg(target_os = "macos")]
        if let tauri::RunEvent::Opened { urls } = &event {
            for url in urls {
                if let Ok(path) = url.to_file_path() {
                    let path_str = path.to_string_lossy().to_string();
                    if let Some(state) = app_handle.try_state::<InitialFileState>() {
                        if let Ok(mut lock) = state.0.lock() {
                            *lock = Some(path_str.clone());
                        }
                    }
                    if let Some(window) = app_handle.get_webview_window("main") {
                        let _ = window.emit("open-file-event", &path_str);
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
            }
        }
        let _ = app_handle;
        let _ = &event;
    });
}
