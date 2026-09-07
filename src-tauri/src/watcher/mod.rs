use notify::{Config, Event, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use serde::Serialize;
use std::path::PathBuf;
use std::sync::mpsc::{channel, Receiver, Sender};
use std::sync::Mutex;
use std::thread;
use tauri::{AppHandle, Emitter};

#[derive(Debug, Clone, Serialize)]
pub struct FileModifiedEvent {
    #[serde(rename = "filePath")]
    pub file_path: String,
}

/// Unified message flowing over a single channel:
///  - the manager sends `Watch(path)` to switch the active file, and
///  - the notify callback forwards `FileModified(path)` events.
enum Msg {
    Watch(PathBuf),
    FileModified(PathBuf),
}

/// Holds the command end of the channel once the single watcher thread has
/// been spawned. Starting to watch is idempotent: the first call spawns the
/// thread, every later call just sends a `Watch` command to re-target it — so
/// repeated document opens never accumulate extra threads or notify watchers.
pub struct FileWatcherManager {
    state: Mutex<Option<Sender<Msg>>>,
}

impl FileWatcherManager {
    pub fn new() -> Self {
        Self {
            state: Mutex::new(None),
        }
    }

    pub fn start_watching(&self, app: AppHandle, path: PathBuf) {
        let mut guard = match self.state.lock() {
            Ok(g) => g,
            Err(poisoned) => poisoned.into_inner(),
        };

        match guard.as_ref() {
            Some(tx) => {
                // Watcher already running; just re-target it.
                let _ = tx.send(Msg::Watch(path));
            }
            None => {
                let (tx, rx) = channel::<Msg>();
                // `tx` stays with the manager for re-targeting; the thread keeps
                // `rx` (receiver) plus a clone of `tx` for the notify callback.
                spawn_watcher_thread(app, tx.clone(), rx);
                *guard = Some(tx);
                let _ = guard.as_ref().unwrap().send(Msg::Watch(path));
            }
        }
    }
}

fn spawn_watcher_thread(app: AppHandle, notify_tx: Sender<Msg>, rx: Receiver<Msg>) {
    thread::spawn(move || {
        // notify runs this callback on its own thread; forward modification
        // events back into the shared channel so the single loop below both
        // switches the active path and emits to the frontend.
        let callback = move |result: notify::Result<Event>| {
            if let Ok(event) = result {
                if matches!(event.kind, EventKind::Modify(_)) {
                    if let Some(p) = event.paths.first() {
                        let _ = notify_tx.send(Msg::FileModified(p.clone()));
                    }
                }
            }
        };

        let mut watcher = match RecommendedWatcher::new(callback, Config::default()) {
            Ok(w) => w,
            Err(e) => {
                eprintln!("Failed to initialize file watcher: {}", e);
                return;
            }
        };

        let mut active: Option<PathBuf> = None;

        // The only receiver loop: handles `Watch` commands from the manager and
        // `FileModified` events forwarded by the notify callback.
        while let Ok(msg) = rx.recv() {
            match msg {
                Msg::Watch(path) => {
                    if active.as_ref() == Some(&path) {
                        continue;
                    }
                    if let Some(prev) = active.take() {
                        let _ = watcher.unwatch(&prev);
                    }
                    match watcher.watch(&path, RecursiveMode::NonRecursive) {
                        Ok(()) => {
                            active = Some(path.clone());
                        }
                        Err(e) => {
                            eprintln!("Failed to watch file {:?}: {}", path, e);
                        }
                    }
                }
                Msg::FileModified(p) => {
                    if active.as_ref() == Some(&p) {
                        let _ = app.emit(
                            "file-modified-on-disk",
                            FileModifiedEvent {
                                file_path: p.to_string_lossy().to_string(),
                            },
                        );
                    }
                }
            }
        }
    });
}
