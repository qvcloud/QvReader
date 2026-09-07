use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};

/// What a path handed to QvReader (CLI arg, open-with, drag&drop) points to.
/// QvReader is primarily a Markdown reader but can also open a folder as a
/// lightweight workspace whose `.md` files are listed in a side file tree.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum PathKind {
    File,
    Directory,
    Missing,
}

#[tauri::command]
pub fn classify_path(path: String) -> PathKind {
    let p = Path::new(&path);
    if p.is_dir() {
        PathKind::Directory
    } else if p.is_file() {
        PathKind::File
    } else {
        PathKind::Missing
    }
}

/// A node in the workspace file tree. `path` is the absolute filesystem path
/// (used to open the document); `name` and `relativePath` drive the UI.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceNode {
    pub name: String,
    /// Absolute path on disk.
    pub path: String,
    /// Path relative to the workspace root, slash-separated.
    pub relative_path: String,
    /// Whether this node is a directory.
    pub is_dir: bool,
    pub children: Vec<WorkspaceNode>,
}

/// Directories that should never be traversed when scanning a workspace.
const SKIP_DIRS: &[&str] = &[
    ".git",
    ".hg",
    ".svn",
    "node_modules",
    "target",
    "dist",
    "build",
    ".next",
    ".cache",
    "vendor",
    ".venv",
    "venv",
    "__pycache__",
    ".workbuddy",
    ".idea",
    ".vscode",
    ".DS_Store",
];

/// Markdown-ish extensions surfaced in the workspace file tree.
fn is_markdown(name: &str) -> bool {
    let lower = name.to_ascii_lowercase();
    let ext = Path::new(&lower)
        .extension()
        .map(|e| e.to_string_lossy().to_string())
        .unwrap_or_default();
    matches!(
        ext.as_str(),
        "md" | "markdown" | "mdown" | "mkd" | "mkdn" | "mdx"
    )
}

/// Recursively walk `dir`, building a tree of directories and Markdown files.
/// Non-Markdown files are omitted; Markdown depth is bounded by `max_depth`
/// relative to the workspace root to avoid pathological scans.
fn build_tree(root: &Path, current: &Path, relative: &str, max_depth: usize) -> Vec<WorkspaceNode> {
    let mut nodes = Vec::new();
    let entries = match fs::read_dir(current) {
        Ok(entries) => entries,
        // Unreadable directory (permission) — skip silently.
        Err(_) => return nodes,
    };

    let mut names: Vec<(bool, String, PathBuf)> = Vec::new();
    for entry in entries.flatten() {
        let p = entry.path();
        let name = entry.file_name().to_string_lossy().to_string();
        if name.starts_with('.') {
            continue; // hidden files/dirs
        }
        let file_type = match entry.file_type() {
            Ok(t) => t,
            Err(_) => continue,
        };
        if file_type.is_symlink() {
            continue; // avoid symlink loops
        }
        if file_type.is_dir() {
            if SKIP_DIRS.contains(&name.as_str()) {
                continue;
            }
            names.push((true, name, p));
        } else if file_type.is_file() && is_markdown(&name) {
            names.push((false, name, p));
        }
    }

    // Stable, human-friendly order: directories first, then files, each
    // alphabetically (case-insensitive).
    names.sort_by(|a, b| {
        if a.0 != b.0 {
            return b.0.cmp(&a.0); // dirs before files
        }
        a.1.to_lowercase().cmp(&b.1.to_lowercase())
    });

    for (is_dir, name, p) in names {
        let child_rel = if relative.is_empty() {
            name.clone()
        } else {
            format!("{}/{}", relative, name)
        };
        if is_dir {
            let children = if max_depth > 0 {
                build_tree(root, &p, &child_rel, max_depth - 1)
            } else {
                Vec::new()
            };
            nodes.push(WorkspaceNode {
                name,
                path: p.to_string_lossy().to_string(),
                relative_path: child_rel,
                is_dir: true,
                children,
            });
        } else {
            nodes.push(WorkspaceNode {
                name,
                path: p.to_string_lossy().to_string(),
                relative_path: child_rel,
                is_dir: false,
                children: Vec::new(),
            });
        }
    }
    let _ = root;
    nodes
}

/// Scan a folder and return the Markdown file tree under it. Runs on a
/// blocking thread pool so a huge directory never stalls the IPC runtime.
#[tauri::command]
pub async fn scan_directory(root: String) -> Result<Vec<WorkspaceNode>, String> {
    tauri::async_runtime::spawn_blocking(move || scan_directory_sync(root))
        .await
        .map_err(|e| format!("Workspace scan task panicked: {}", e))?
}

fn scan_directory_sync(root: String) -> Result<Vec<WorkspaceNode>, String> {
    let root_path = PathBuf::from(&root);
    if !root_path.is_dir() {
        return Err(format!("Not a directory: {}", root));
    }
    let root_name = root_path
        .file_name()
        .map(|f| f.to_string_lossy().to_string())
        .unwrap_or_else(|| root_path.to_string_lossy().to_string());
    // The root itself is a directory node carrying the whole tree.
    let tree = WorkspaceNode {
        name: root_name,
        path: root_path.to_string_lossy().to_string(),
        relative_path: String::new(),
        is_dir: true,
        children: build_tree(&root_path, &root_path, "", 12),
    };
    Ok(vec![tree])
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_root() -> temp_root::TempRoot {
        temp_root::TempRoot::new()
    }

    // Minimal temp dir helper (no external crate) to keep unit tests hermetic.
    mod temp_root {
        use std::fs;
        use std::path::{Path, PathBuf};
        use std::sync::atomic::{AtomicUsize, Ordering};

        static COUNTER: AtomicUsize = AtomicUsize::new(0);

        pub struct TempRoot {
            pub dir: PathBuf,
        }

        impl TempRoot {
            pub fn new() -> Self {
                let n = COUNTER.fetch_add(1, Ordering::SeqCst);
                let base = std::env::temp_dir().join(format!(
                    "qvreader-ws-test-{}-{n}",
                    std::process::id()
                ));
                let _ = fs::remove_dir_all(&base);
                fs::create_dir_all(&base).expect("create temp root");
                TempRoot { dir: base }
            }
        }

        impl Drop for TempRoot {
            fn drop(&mut self) {
                let _ = fs::remove_dir_all(&self.dir);
            }
        }

        pub fn write(root: &Path, rel: &str, content: &str) {
            let p = root.join(rel);
            if let Some(parent) = p.parent() {
                fs::create_dir_all(parent).expect("create parent");
            }
            fs::write(p, content).expect("write file");
        }
    }

    #[test]
    fn classify_distinguishes_file_dir_missing() {
        let t = make_root();
        temp_root::write(&t.dir, "a.md", "# hi");
        temp_root::write(&t.dir, "sub/b.md", "# sub");
        let dir = t.dir.to_string_lossy().to_string();
        let f = t.dir.join("a.md").to_string_lossy().to_string();
        let miss = t.dir.join("nope.md").to_string_lossy().to_string();

        assert_eq!(classify_path(f.clone()), PathKind::File);
        assert_eq!(classify_path(dir.clone()), PathKind::Directory);
        assert_eq!(classify_path(miss), PathKind::Missing);
    }

    #[test]
    fn scan_lists_markdown_and_skips_junk() {
        let t = make_root();
        temp_root::write(&t.dir, "README.md", "# R");
        temp_root::write(&t.dir, "notes.md", "notes");
        temp_root::write(&t.dir, "docs/guide.markdown", "guide");
        temp_root::write(&t.dir, "docs/img.png", "not md");
        temp_root::write(&t.dir, "node_modules/pkg/index.md", "dep md");
        temp_root::write(&t.dir, ".git/config.md", "git md");
        temp_root::write(&t.dir, ".hidden.md", "hidden md");

        let root = t.dir.to_string_lossy().to_string();
        let tree = scan_directory_sync(root.clone()).expect("scan ok");
        assert_eq!(tree.len(), 1);
        let root_node = &tree[0];
        assert!(root_node.is_dir);
        // Directory itself counts 1; expect README.md + notes.md + docs (dir)
        let names: Vec<&str> = root_node.children.iter().map(|c| c.name.as_str()).collect();
        assert!(names.contains(&"README.md"), "got {:?}", names);
        assert!(names.contains(&"notes.md"), "got {:?}", names);
        assert!(names.contains(&"docs"), "got {:?}", names);
        // node_modules / .git / .hidden.md must be excluded
        assert!(!names.contains(&"node_modules"), "got {:?}", names);
        assert!(!names.contains(&".git"), "got {:?}", names);
        assert!(!names.contains(&".hidden.md"), "got {:?}", names);

        // Non-markdown top-level file should not appear.
        temp_root::write(&t.dir, "Makefile", "all:");
        let binding = scan_directory_sync(root.clone()).unwrap();
        let names2: Vec<&str> = binding[0].children.iter().map(|c| c.name.as_str()).collect();
        assert!(!names2.contains(&"Makefile"), "got {:?}", names2);
    }

    #[test]
    fn scan_non_directory_errors() {
        let t = make_root();
        temp_root::write(&t.dir, "a.md", "x");
        let f = t.dir.join("a.md").to_string_lossy().to_string();
        assert!(scan_directory_sync(f.clone()).is_err());
    }
}
