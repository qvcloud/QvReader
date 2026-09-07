use std::fs;
use std::path::{Path, PathBuf};

fn get_cli_paths() -> Vec<PathBuf> {
    let mut paths = Vec::new();
    if let Some(home) = dirs::home_dir() {
        paths.push(home.join(".local").join("bin").join("qvreader"));
    }
    paths.push(PathBuf::from("/usr/local/bin/qvreader"));
    paths
}

#[tauri::command]
pub fn is_cli_installed() -> bool {
    for path in get_cli_paths() {
        if path.exists() {
            return true;
        }
    }
    false
}

#[tauri::command]
pub fn install_cli() -> Result<String, String> {
    let home = dirs::home_dir().ok_or_else(|| "Could not locate home directory".to_string())?;
    let local_bin = home.join(".local").join("bin");

    if !local_bin.exists() {
        fs::create_dir_all(&local_bin)
            .map_err(|e| format!("Failed to create ~/.local/bin: {}", e))?;
    }

    let current_exe = std::env::current_exe().unwrap_or_default();
    let exe_str = current_exe.to_string_lossy().to_string();

    // Determine .app bundle path if inside macOS bundle (Contents/MacOS/<binary>)
    let app_bundle_path = if exe_str.contains(".app/Contents/MacOS") {
        current_exe
            .parent()
            .and_then(|p| p.parent())
            .and_then(|p| p.parent())
            .map(|p| p.to_string_lossy().to_string())
            .unwrap_or_default()
    } else {
        String::new()
    };

    let script = format!(
        r#"#!/bin/bash
# QvReader CLI Launcher

TARGET="${{1:-.}}"

if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    echo "Usage: qvreader [path]"
    echo "Open a file or directory in QvReader"
    echo ""
    echo "Examples:"
    echo "  qvreader .              # Open current directory"
    echo "  qvreader README.md      # Open README.md"
    echo "  qvreader ~/notes        # Open notes directory"
    exit 0
fi

# Resolve target path to absolute path
if [ -e "$TARGET" ]; then
    if [ -d "$TARGET" ]; then
        TARGET="$(cd "$TARGET" 2>/dev/null && pwd)"
    else
        DIR="$(cd "$(dirname "$TARGET")" 2>/dev/null && pwd)"
        BASE="$(basename "$TARGET")"
        TARGET="$DIR/$BASE"
    fi
fi

if [ "$(uname)" = "Darwin" ]; then
    APP="{app_bundle_path}"
    if [ -n "$APP" ] && [ -d "$APP" ]; then
        open -a "$APP" "$TARGET"
    elif open -b com.qvreader.desktop "$TARGET" 2>/dev/null; then
        :
    elif [ -d "/Applications/QvReader.app" ]; then
        open -a "/Applications/QvReader.app" "$TARGET"
    elif [ -d "$HOME/Applications/QvReader.app" ]; then
        open -a "$HOME/Applications/QvReader.app" "$TARGET"
    elif command -v open >/dev/null 2>&1 && open -a "QvReader" "$TARGET" 2>/dev/null; then
        :
    else
        "{current_exe}" "$TARGET" >/dev/null 2>&1 &
    fi
elif [ "$(uname)" = "Linux" ]; then
    "{current_exe}" "$TARGET" >/dev/null 2>&1 &
else
    start "" "{current_exe}" "$TARGET"
fi
"#,
        app_bundle_path = app_bundle_path,
        current_exe = exe_str
    );

    let target_path = local_bin.join("qvreader");
    fs::write(&target_path, &script)
        .map_err(|e| format!("Failed to write qvreader script: {}", e))?;

    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let mut perms = fs::metadata(&target_path)
            .map_err(|e| format!("Failed to read permissions: {}", e))?
            .permissions();
        perms.set_mode(0o755);
        fs::set_permissions(&target_path, perms)
            .map_err(|e| format!("Failed to set executable permission: {}", e))?;
    }

    // Best-effort: also attempt /usr/local/bin if writable
    let usr_local_bin = Path::new("/usr/local/bin/qvreader");
    if let Ok(_) = fs::write(usr_local_bin, &script) {
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            if let Ok(meta) = fs::metadata(usr_local_bin) {
                let mut perms = meta.permissions();
                perms.set_mode(0o755);
                let _ = fs::set_permissions(usr_local_bin, perms);
            }
        }
    }

    Ok(target_path.to_string_lossy().to_string())
}

#[tauri::command]
pub fn uninstall_cli() -> Result<(), String> {
    for path in get_cli_paths() {
        if path.exists() {
            let _ = fs::remove_file(&path);
        }
    }
    Ok(())
}
