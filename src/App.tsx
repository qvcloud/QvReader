import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { ViewMode, WorkspaceNode } from './types/document';
import { useFileDocument } from './hooks/useFileDocument';
import { usePreferences } from './hooks/usePreferences';
import { useZoom } from './hooks/useZoom';
import { useHeadings } from './components/Outline/useHeadings';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useEditorPrefetch } from './hooks/useEditorPrefetch';
import { ReaderView } from './components/Reader/ReaderView';
import { OutlineDrawer } from './components/Outline/OutlineDrawer';
import { ExternalConflictBanner } from './components/Dialogs/ExternalConflictBanner';
import { StatusBar } from './components/StatusBar/StatusBar';

// Lazy-loaded editor and modal components to keep reading startup payload < 450 KB
const InlineEditor = React.lazy(() =>
  import('./components/Editor/InlineEditor').then((m) => ({ default: m.InlineEditor }))
);
const SplitContainer = React.lazy(() =>
  import('./components/SplitView/SplitContainer').then((m) => ({ default: m.SplitContainer }))
);
const SafeExitDialog = React.lazy(() =>
  import('./components/Dialogs/SafeExitDialog').then((m) => ({ default: m.SafeExitDialog }))
);
const ShortcutsModal = React.lazy(() =>
  import('./components/ShortcutsModal/ShortcutsModal').then((m) => ({ default: m.ShortcutsModal }))
);
const SettingsModal = React.lazy(() =>
  import('./components/SettingsModal/SettingsModal').then((m) => ({ default: m.SettingsModal }))
);
const LicenseModal = React.lazy(() =>
  import('./components/LicenseModal/LicenseModal').then((m) => ({ default: m.LicenseModal }))
);
const ProUpsellModal = React.lazy(() =>
  import('./components/LicenseModal/ProUpsellModal').then((m) => ({ default: m.ProUpsellModal }))
);
import { DropOverlay } from './components/DropOverlay/DropOverlay';
import { UpdateNotification } from './components/UpdateNotification/UpdateNotification';
import { ContextMenu } from './components/ContextMenu/ContextMenu';
import { checkForUpdates, snoozeUpdate } from './services/updater';
import { UpdateManifest } from './types/updater';
import { closeWindow, getInitialLaunchData, showWindow, isTauri, revealInFinder, classifyPath, openExternalUrl, setWindowTitle, printDocument } from './lib/ipc';
import { renderMarkdown } from './lib/markdown';
import { useWorkspace } from './hooks/useWorkspace';
import { WorkspaceSidebar, isNodeDir } from './components/Workspace/WorkspaceSidebar';
import { useI18n, I18nProvider } from './i18n';
import { useLicense, LicenseProvider } from './contexts/LicenseContext';
import { formatWindowTitle } from './config/version';
import { getSampleDocument } from './data/samples';
import { getF3DailyUsage, recordF3DailyUsage } from './services/f3Quota';
import {
  BookOpen,
  Edit3,
  Columns,
  ListTree,
  FolderOpen,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  Save,
  Settings,
  Sparkles,
  Printer,
  FileText,
  Image as ImageIcon,
  Globe,
  Download,
  X
} from 'lucide-react';

type PendingAction =
  | null
  | { type: 'file'; path: string }
  | { type: 'workspace'; path: string }
  | { type: 'new' };

/** Auto-detect preferred markdown file (README.md or first .md) when opening a workspace. */
function findPreferredWorkspaceFile(nodes: WorkspaceNode[]): string | null {
  if (!nodes || nodes.length === 0) return null;
  const root = nodes[0];
  if (!root) return null;

  const rootChildren = root.children || [];
  // 1. Check for README.md (case-insensitive) in root children
  const readme = rootChildren.find(
    (c) => !isNodeDir(c) && /^readme(\.|$)/i.test(c.name)
  );
  if (readme) return readme.path;

  // 2. Check for README.md recursively
  function findReadmeRecursive(list: WorkspaceNode[]): string | null {
    for (const item of list) {
      if (!isNodeDir(item) && /^readme(\.|$)/i.test(item.name)) {
        return item.path;
      }
      if (isNodeDir(item) && item.children) {
        const found = findReadmeRecursive(item.children);
        if (found) return found;
      }
    }
    return null;
  }
  const deepReadme = findReadmeRecursive(rootChildren);
  if (deepReadme) return deepReadme;

  // 3. Find first markdown file in preorder traversal
  function findFirstFile(list: WorkspaceNode[]): string | null {
    for (const item of list) {
      if (!isNodeDir(item)) {
        return item.path;
      }
      if (isNodeDir(item) && item.children) {
        const found = findFirstFile(item.children);
        if (found) return found;
      }
    }
    return null;
  }
  return findFirstFile(rootChildren);
}

function AppContent() {
  const [mode, setMode] = useState<ViewMode>('reading');
  useEditorPrefetch();
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isFilesOpen, setIsFilesOpen] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasExternalConflict, setHasExternalConflict] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [pendingUpdateManifest, setPendingUpdateManifest] = useState<UpdateManifest | null>(null);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isExportMenuOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [isExportMenuOpen]);

  // Proactive background update check deferred 3.5s after launch (Constitution Principle I & III)
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const result = await checkForUpdates();
        if (result.status === 'available' && result.manifest) {
          setPendingUpdateManifest(result.manifest);
        }
      } catch (e) {
        // Background check fails silently
        console.debug('Background update check silently ignored:', e);
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const { locale, t } = useI18n();
  const {
    isPro,
    trialRemaining,
    isLicenseModalOpen,
    setIsLicenseModalOpen,
    upsellFeature,
    setUpsellFeature,
    requestProFeature
  } = useLicense();

  const promptedF3FilesRef = useRef<Set<string>>(new Set());

  const handleModeChange = useCallback(
    async (targetMode: ViewMode) => {
      if (targetMode === 'reading') {
        setMode('reading');
        return;
      }

      // F2 Inline Edit is a 100% free core feature! Never gated by Pro or trial limits.
      if (targetMode === 'inline_edit') {
        setMode('inline_edit');
        return;
      }

      // F3 Split View: 20 free daily uses. Exceeding 20 prompts upsell on new files without blocking.
      if (targetMode === 'split_edit') {
        if (isPro) {
          setMode('split_edit');
          return;
        }

        const { exceeded } = getF3DailyUsage();
        const fileKey = docRef.current.filePath || docRef.current.fileName || 'current_file';

        if (!exceeded) {
          recordF3DailyUsage();
          setMode('split_edit');
          return;
        }

        // Exceeded 20 daily uses: prompt once per new file, but never block user
        if (!promptedF3FilesRef.current.has(fileKey)) {
          promptedF3FilesRef.current.add(fileKey);
          setUpsellFeature(t.license.proFeatureSplit || t.common.splitMode);
        }
        setMode('split_edit');
        return;
      }
    },
    [isPro, setUpsellFeature, t.license.proFeatureSplit, t.common.splitMode]
  );

  const handleToggleMode = useCallback(async (updater: ViewMode | ((prev: ViewMode) => ViewMode)) => {
    const nextMode = typeof updater === 'function' ? updater(mode) : updater;
    await handleModeChange(nextMode);
  }, [mode, handleModeChange]);

  const { preferences, updatePreferences } = usePreferences();
  const isDark =
    preferences.theme === 'dark' ||
    (preferences.theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  const { fontSize, setFontSize, zoomIn, zoomOut, resetZoom } = useZoom(preferences.fontSize);
  const {
    doc,
    busy,
    loadDocument,
    loadDocumentFromContent,
    createNewDocument,
    resetDocument,
    updateContent,
    saveCurrentDocument,
    reloadDiskVersion
  } = useFileDocument();
  const {
    root: workspaceRoot,
    tree: workspaceTree,
    isScanning: workspaceScanning,
    openWorkspace,
    refreshWorkspace
  } = useWorkspace();

  const projectName = useMemo(() => {
    if (!workspaceRoot) return null;
    const parts = workspaceRoot.split(/[/\\]/).filter(Boolean);
    return parts[parts.length - 1] || workspaceRoot;
  }, [workspaceRoot]);

  // Keep native window title in sync with active document, workspace, and dirty state
  useEffect(() => {
    const title = formatWindowTitle({
      fileName: doc.fileName,
      projectName,
      isDirty: doc.isDirty,
      hasFilePath: Boolean(doc.filePath),
    });
    setWindowTitle(title).catch(() => {});
  }, [projectName, doc.filePath, doc.fileName, doc.isDirty]);

  // Keep a ref in sync with the latest doc so the (single-binding) external
  // modification listener below always reads fresh path/dirty/disk state
  // without having to re-register on every keystroke.
  const docRef = useRef(doc);
  docRef.current = doc;

  const { headings, activeHeadingId } = useHeadings(doc.rawContent);

  // Keyboard shortcut (Cmd+, or Ctrl+,) to open Settings Center
  useEffect(() => {
    const handleSettingsHotkey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen(true);
      }
    };
    window.addEventListener('keydown', handleSettingsHotkey);
    return () => window.removeEventListener('keydown', handleSettingsHotkey);
  }, []);

  // Lock down developer inspection shortcuts in production distributions
  useEffect(() => {
    if (!import.meta.env.PROD) return;

    const handleInspectLockdown = (e: KeyboardEvent) => {
      // F12 or Ctrl/Cmd+Shift+I/J/C or Ctrl/Cmd+Alt+I/J/C
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) ||
        ((e.metaKey || e.ctrlKey) && e.altKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleInspectLockdown, { capture: true });
    return () => window.removeEventListener('keydown', handleInspectLockdown, { capture: true });
  }, []);

  // Execute a switch that no longer needs a dirty-save confirmation.
  const dispatchAction = useCallback(
    async (action: PendingAction) => {
      if (action === null) return;
      if (action.type === 'file') {
        await loadDocument(action.path);
      } else if (action.type === 'workspace') {
        const allowed = await requestProFeature(t.workspace.title || t.license.proFeatureWorkspace);
        if (!allowed) return;
        setIsFilesOpen(true);
        setIsOutlineOpen(false);
        const nodes = await openWorkspace(action.path);
        const preferredFile = findPreferredWorkspaceFile(nodes);
        if (preferredFile) {
          await loadDocument(preferredFile);
        } else {
          const parts = action.path.split(/[/\\]/).filter(Boolean);
          const folderName = parts[parts.length - 1] || action.path;
          await resetDocument(folderName);
        }
      } else if (action.type === 'new') {
        await createNewDocument();
      }
    },
    [loadDocument, openWorkspace, resetDocument, createNewDocument, requestProFeature, t.workspace.title, t.license.proFeatureWorkspace]
  );

  // Guard a dirty document before switching away (to another file, a folder
  // workspace, or a new doc). Returns immediately if clean and performs the
  // switch; otherwise parks the target in `pendingAction` to be replayed by
  // the SafeExitDialog after the user saves/discards.
  const requestSwitch = useCallback(
    (action: PendingAction) => {
      if (action === null) return;
      if (doc.isDirty) {
        setPendingAction(action);
        setIsExitDialogOpen(true);
        return;
      }
      void dispatchAction(action);
    },
    [doc.isDirty, dispatchAction]
  );

  // Open a file OR folder depending on what `path` points to on disk. Used for
  // every external entry point (CLI arg, Finder open-with, drag & drop).
  const handleOpenPath = useCallback(
    async (path: string) => {
      let kind: 'file' | 'directory' | 'missing';
      try {
        kind = await classifyPath(path);
      } catch {
        kind = 'file'; // best-effort: treat unknown as a file
      }
      if (kind === 'directory') {
        requestSwitch({ type: 'workspace', path });
      } else if (kind === 'file') {
        requestSwitch({ type: 'file', path });
      } else {
        console.warn('Ignored path that does not exist:', path);
      }
    },
    [requestSwitch]
  );

  // Keep a live ref to handleOpenPath so the one-shot init effect (below) can
  // read the current implementation without re-running whenever `doc.isDirty`
  // changes (which would otherwise re-trigger the initial open on every save).
  const openPathRef = useRef(handleOpenPath);
  openPathRef.current = handleOpenPath;

  // Load initial document / workspace from CLI args or OS open event via unified bootstrap IPC.
  // This runs exactly once on mount and avoids intermediate sample.md flashes.
  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const launchData = await getInitialLaunchData();
        if (!isMounted) return;

        if (launchData.launchMode === 'file' && launchData.document) {
          // Direct single-step document injection from Rust bootstrap
          loadDocumentFromContent(
            launchData.document.fileName,
            launchData.document.rawContent,
            launchData.document.filePath
          );
          void showWindow();
          return;
        } else if (launchData.launchMode === 'directory' && launchData.targetPath) {
          await openPathRef.current(launchData.targetPath);
          void showWindow();
          return;
        } else if (launchData.targetPath) {
          if (launchData.targetPath.endsWith('sample.md')) {
            loadDocumentFromContent('sample.md', getSampleDocument(locale), launchData.targetPath);
          } else {
            await openPathRef.current(launchData.targetPath);
          }
          void showWindow();
          return;
        }
      } catch (err) {
        console.warn('Failed to query initial launch data:', err);
      }
      if (isMounted) {
        loadDocumentFromContent('sample.md', getSampleDocument(locale));
        void showWindow();
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, [loadDocumentFromContent, locale]);

  // Keep sample document in sync with the user's selected language if viewing unmodified sample
  useEffect(() => {
    if (doc.fileName === 'sample.md' && !doc.isDirty) {
      loadDocumentFromContent('sample.md', getSampleDocument(locale), doc.filePath);
    }
  }, [locale, doc.fileName, doc.isDirty, doc.filePath, loadDocumentFromContent]);

  // Listen for file open events from OS (macOS Finder double-click, "Open With",
  // terminal `qvreader <path>`, folder drop via LaunchServices, etc.)
  useEffect(() => {
    let unlisten: (() => void) | undefined;
    if (isTauri()) {
      import('@tauri-apps/api/event').then(({ listen }) => {
        listen<string>('open-file-event', (event) => {
          if (event.payload) {
            handleOpenPath(event.payload);
          }
        }).then((fn) => {
          unlisten = fn;
        });
      });
    }
    return () => {
      if (unlisten) unlisten();
    };
  }, [handleOpenPath]);

  // External disk-change detection (spec US6 / FR-013). The Rust file watcher
  // emits `file-modified-on-disk` when the currently open file changes on disk
  // through another process. Behavior depends on unsaved state:
  //   - clean file  -> silently reload the new disk version (auto-refresh)
  //   - dirty file  -> show the conflict banner so the user can choose to
  //                    reload (discard local) or keep their local edits.
  useEffect(() => {
    if (!isTauri()) return;
    let unlisten: (() => void) | undefined;
    import('@tauri-apps/api/event').then(({ listen }) => {
      listen<{ filePath: string }>('file-modified-on-disk', (event) => {
        const filePath = event.payload?.filePath;
        const current = docRef.current;
        // Only react when the modified path is the one we have open.
        if (!filePath || !current.filePath || filePath !== current.filePath) {
          return;
        }
        if (current.isDirty) {
          setHasExternalConflict(true);
        } else {
          // No local edits: silently adopt the external change.
          reloadDiskVersion();
        }
      }).then((fn) => {
        unlisten = fn;
      });
    });
    return () => {
      if (unlisten) unlisten();
    };
  }, [reloadDiskVersion]);

  // Native Tauri Window / Webview Drag & Drop listener.
  // With dragDropEnabled:true Tauri intercepts native drops and dispatches them
  // here (tauri://drag-*). This is the single drag&drop entry point in Tauri;
  // we must NOT also listen on window-level HTML5 drag events or handle drops
  // in Rust, otherwise a single drop would trigger handleOpenFile twice.
  useEffect(() => {
    let unlistenDragDrop: (() => void) | undefined;
    if (isTauri()) {
      import('@tauri-apps/api/window')
        .then(({ getCurrentWindow }) => {
          return getCurrentWindow().onDragDropEvent((event) => {
            if (event.payload.type === 'enter' || event.payload.type === 'over') {
              setIsDragging(true);
            } else if (event.payload.type === 'leave') {
              setIsDragging(false);
            } else if (event.payload.type === 'drop') {
              setIsDragging(false);
              const paths = event.payload.paths;
              if (paths && paths.length > 0) {
                handleOpenPath(paths[0]);
              }
            }
          });
        })
        .then((fn) => {
          unlistenDragDrop = fn;
        })
        .catch((err) => {
          console.warn('Window drag & drop setup:', err);
        });
    }
    return () => {
      if (unlistenDragDrop) unlistenDragDrop();
    };
  }, [handleOpenPath]);

  // HTML5 Drag & Drop fallback — browser/web preview ONLY.
  // Inside Tauri this is a dead path (dragDropEnabled:true swallows HTML5 drag
  // events), so it must be skipped there to avoid double-open alongside
  // onDragDropEvent above.
  useEffect(() => {
    if (isTauri()) return;
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter++;
      if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
        setIsDragging(true);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter--;
      if (dragCounter <= 0) {
        dragCounter = 0;
        setIsDragging(false);
      }
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter = 0;
      setIsDragging(false);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        // @ts-ignore
        const path = file.path;
        if (path) {
          handleOpenPath(path);
        } else {
          const text = await file.text();
          loadDocumentFromContent(file.name, text);
        }
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [handleOpenPath, loadDocumentFromContent]);

  // Safe Exit or Document Switch Handler
  const handleExitRequest = useCallback(() => {
    if (doc.isDirty) {
      setPendingAction(null); // no follow-up target -> close after confirm
      setIsExitDialogOpen(true);
    } else {
      closeWindow(true);
    }
  }, [doc.isDirty]);

  const handleNewFile = useCallback(() => {
    if (doc.isDirty) {
      setPendingAction({ type: 'new' });
      setIsExitDialogOpen(true);
    } else {
      createNewDocument();
    }
  }, [doc.isDirty, createNewDocument]);

  const handleCloseActiveFile = useCallback(() => {
    const hasActiveFile = Boolean(
      doc.filePath !== null ||
      doc.isDirty ||
      (doc.rawContent && doc.rawContent.trim().length > 0) ||
      (doc.fileName && doc.fileName !== 'Untitled.md' && doc.fileName !== t.common.untitled)
    );
    if (hasActiveFile) {
      handleNewFile();
    } else {
      handleExitRequest();
    }
  }, [doc.filePath, doc.isDirty, doc.rawContent, doc.fileName, t.common.untitled, handleNewFile, handleExitRequest]);

  // Shared "confirmed" path: after the dirty doc was saved (or discarded),
  // replay the parked target. A null target means the user just wants to close
  // the window.
  const finishPending = useCallback(async () => {
    setIsExitDialogOpen(false);
    const target = pendingAction;
    setPendingAction(null);
    if (target === null) {
      closeWindow(true);
      return;
    }
    await dispatchAction(target);
  }, [pendingAction, dispatchAction]);

  const handleConfirmSave = async () => {
    const ok = await saveCurrentDocument();
    // Keep the dialog open if the save was cancelled or failed (e.g. user
    // dismissed a forced Save-As for a read-only file) so edits are not lost.
    if (!ok) return;
    await finishPending();
  };

  const handleConfirmDiscard = async () => {
    await finishPending();
  };

  const handleCancelExitOrOpen = () => {
    setIsExitDialogOpen(false);
    setPendingAction(null);
  };

  const handlePrint = useCallback(() => {
    void printDocument();
  }, []);

  const handleExportPdf = useCallback(async () => {
    const allowed = await requestProFeature(t.common.exportPdf);
    if (!allowed) return;

    setToastMessage(t.common.exportPdfNotice);
    setTimeout(() => setToastMessage(null), 4000);
    void printDocument();
  }, [requestProFeature, t.common.exportPdf, t.common.exportPdfNotice]);

  const handleExportImage = useCallback(async () => {
    if (isExportingImage) return;

    const allowed = await requestProFeature(t.common.exportImage);
    if (!allowed) return;

    if (mode === 'inline_edit') {
      await handleModeChange('reading');
      await new Promise((res) => setTimeout(res, 200));
    }

    const targetEl = document.querySelector('.qv-markdown') as HTMLElement;
    if (!targetEl) {
      setToastMessage(t.common.noContentToExport);
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setIsExportingImage(true);
    setToastMessage(t.common.exportingImage);

    const { exportMarkdownAsImage } = await import('./services/imageExport');
    const result = await exportMarkdownAsImage(targetEl, {
      fileName: doc.fileName || 'Document',
      isDark
    });

    setIsExportingImage(false);

    if (result.success) {
      setToastMessage(t.common.imageExportSuccess);
      setTimeout(() => setToastMessage(null), 3500);
    } else {
      setToastMessage(t.common.exportFailed.replace('{error}', result.error?.message || 'Unknown error'));
      setTimeout(() => setToastMessage(null), 4000);
    }
  }, [isExportingImage, requestProFeature, mode, handleModeChange, doc.fileName, isDark, t.common.exportImage, t.common.noContentToExport, t.common.exportingImage, t.common.imageExportSuccess, t.common.exportFailed]);

  const handleExportHtml = useCallback(async () => {
    const allowed = await requestProFeature(t.common.exportHtml);
    if (!allowed) return;

    const renderedContainer = document.querySelector('.qv-markdown');
    const renderedHtml = renderedContainer ? renderedContainer.innerHTML : renderMarkdown(doc.rawContent);
    const { exportDocumentAsHtml } = await import('./services/htmlExport');
    const result = exportDocumentAsHtml(doc.rawContent, renderedHtml, {
      fileName: doc.fileName || 'Document',
      isDark
    });
    if (result.success) {
      setToastMessage(t.common.htmlExportSuccess);
      setTimeout(() => setToastMessage(null), 3500);
    }
  }, [requestProFeature, doc.rawContent, doc.fileName, isDark, t.common.exportHtml, t.common.htmlExportSuccess]);

  // Listen for native application menu bar actions
  useEffect(() => {
    let unlisten: (() => void) | undefined;
    if (isTauri()) {
      import('@tauri-apps/api/event').then(({ listen }) => {
        listen<string>('menu-action', (event) => {
          const action = event.payload;
          switch (action) {
            case 'print_document':
              handlePrint();
              break;
            case 'export_pdf':
              handleExportPdf();
              break;
            case 'export_image':
              handleExportImage();
              break;
            case 'export_html':
              handleExportHtml();
              break;
            case 'new_file':
              handleNewFile();
              break;
            case 'save_file':
              saveCurrentDocument(false);
              break;
            case 'save_as_file':
              saveCurrentDocument(true);
              break;
            case 'reload_file':
              reloadDiskVersion();
              break;
            case 'reveal_file':
              if (doc.filePath) {
                revealInFinder(doc.filePath);
              }
              break;
            case 'open_settings':
              setIsSettingsOpen(true);
              break;
            case 'open_license':
              setIsLicenseModalOpen(true);
              break;
            case 'open_shortcuts':
              setIsShortcutsOpen(true);
              break;
            case 'view_reading':
              void handleModeChange('reading');
              break;
            case 'view_inline':
              void handleModeChange('inline_edit');
              break;
            case 'view_split':
              void handleModeChange('split_edit');
              break;
            case 'toggle_outline':
              setIsOutlineOpen((prev) => !prev);
              break;
            case 'zoom_in':
              zoomIn();
              break;
            case 'zoom_out':
              zoomOut();
              break;
            case 'zoom_reset':
              resetZoom();
              break;
            case 'open_website':
              void openExternalUrl('https://qvreader.com');
              break;
            case 'report_issue':
              void openExternalUrl('https://github.com/qvcloud/QvReader/issues');
              break;
          }
        }).then((fn) => {
          unlisten = fn;
        });
      });
    }
    return () => {
      if (unlisten) unlisten();
    };
  }, [
    handleNewFile,
    saveCurrentDocument,
    reloadDiskVersion,
    doc.filePath,
    setIsSettingsOpen,
    setIsLicenseModalOpen,
    setIsShortcutsOpen,
    handleModeChange,
    setIsOutlineOpen,
    zoomIn,
    zoomOut,
    resetZoom
  ]);

  const [contextMenu, setContextMenu] = useState<{ isOpen: boolean; x: number; y: number }>({
    isOpen: false,
    x: 0,
    y: 0
  });

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('input, textarea, [contenteditable="true"]')) {
      return;
    }
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY
    });
  }, []);

  // Bind all keyboard shortcuts (suppressed while any modal owns the keyboard).
  useKeyboardShortcuts({
    mode,
    setMode: handleToggleMode,
    onNew: handleNewFile,
    onClose: handleCloseActiveFile,
    onSave: () => saveCurrentDocument(false),
    onReload: reloadDiskVersion,
    onExit: handleExitRequest,
    onToggleOutline: () => setIsOutlineOpen((prev) => !prev),
    onZoomIn: zoomIn,
    onZoomOut: zoomOut,
    onResetZoom: resetZoom,
    onPrint: handlePrint,
    onExportPdf: handleExportPdf,
    onExportImage: handleExportImage,
    onExportHtml: handleExportHtml,
    onShortcuts: () => setIsShortcutsOpen(true),
    enabled: !isExitDialogOpen && !isShortcutsOpen && !isSettingsOpen && !isLicenseModalOpen && !upsellFeature
  });

  const handleSelectHeading = (_sourceLine: number, anchorId: string) => {
    if (mode === 'reading') {
      const el = document.getElementById(anchorId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className="relative flex flex-col h-screen w-screen overflow-hidden bg-white dark:bg-[#1e1e1e] text-slate-900 dark:text-slate-100"
    >
      {/* External Conflict Warning Banner */}
      <ExternalConflictBanner
        isVisible={hasExternalConflict}
        onReload={() => {
          reloadDiskVersion();
          setHasExternalConflict(false);
        }}
        onDismiss={() => setHasExternalConflict(false)}
      />

      {/* Busy indicator — visible while a large file is being opened/written so
          the app doesn't appear frozen. Non-blocking, overlays the top edge. */}
      {busy !== 'idle' && (
        <div className="absolute top-0 inset-x-0 h-0.5 z-50 overflow-hidden">
          <div
            className="h-full bg-blue-500 animate-pulse"
            style={{ width: busy === 'opening' ? '60%' : '40%', transition: 'width 0.3s' }}
          />
        </div>
      )}

      {/* Minimalist Top App Bar */}
      <header className="h-10 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between px-3 shrink-0 bg-slate-50/80 dark:bg-[#181818]/80 backdrop-blur select-none z-30">
        {/* Left: Files / Outline & Document Info */}
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              if (!isFilesOpen) {
                const allowed = await requestProFeature(t.workspace.title || t.license.proFeatureWorkspace);
                if (!allowed) return;
                setIsFilesOpen(true);
                setIsOutlineOpen(false);
              } else {
                setIsFilesOpen(false);
              }
            }}
            title={t.workspace.title}
            className={`p-1.5 rounded-lg transition ${
              isFilesOpen
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsOutlineOpen((prev) => !prev)}
            title={`${t.common.outline} (Ctrl/Cmd+Shift+O)`}
            className={`p-1.5 rounded-lg transition ${
              isOutlineOpen
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <ListTree className="w-4 h-4" />
          </button>

          {/* Active File Pill with Hover Close Button */}
          {(() => {
            const hasActiveFile = Boolean(
              doc.filePath !== null ||
              doc.isDirty ||
              (doc.rawContent && doc.rawContent.trim().length > 0) ||
              (doc.fileName && doc.fileName !== 'Untitled.md' && doc.fileName !== t.common.untitled)
            );
            return (
              <div
                className={`group relative inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs transition-colors ${
                  hasActiveFile
                    ? 'hover:bg-slate-200/70 dark:hover:bg-neutral-800/80 cursor-default'
                    : ''
                }`}
                title={doc.filePath || doc.fileName || t.common.untitled}
              >
                {doc.isDirty && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" title="Unsaved changes" />
                )}
                <span className="font-medium truncate max-w-xs text-slate-700 dark:text-neutral-300 flex items-center gap-1">
                  {projectName ? (
                    <>
                      <span className="text-slate-400 dark:text-neutral-500 font-normal">{projectName}</span>
                      {doc.filePath ? (
                        <>
                          <span className="text-slate-300 dark:text-neutral-600 font-normal">/</span>
                          <span className="font-semibold text-slate-800 dark:text-neutral-200">{doc.fileName}</span>
                        </>
                      ) : null}
                    </>
                  ) : (
                    <span>{doc.fileName || t.common.untitled}</span>
                  )}
                </span>
                {hasActiveFile && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseActiveFile();
                    }}
                    title={`${t.common.closeFile} (${typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC') ? '⌘W' : 'Ctrl+W'})`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-slate-400 hover:text-slate-700 dark:text-neutral-500 dark:hover:text-neutral-200 hover:bg-slate-300/80 dark:hover:bg-neutral-700/80 shrink-0 ml-0.5"
                    aria-label={t.common.closeFile}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })()}
        </div>

        {/* Center: Mode Switcher (Reading | F2 Inline | F3 Split) */}
        <div className="flex items-center bg-slate-200/60 dark:bg-neutral-800/80 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => void handleModeChange('reading')}
            title={t.common.readMode}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium ${
              mode === 'reading'
                ? 'bg-white dark:bg-[#252526] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.common.readMode}</span>
          </button>

          <button
            onClick={() => void handleModeChange('inline_edit')}
            title={t.common.inlineMode}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium ${
              mode === 'inline_edit'
                ? 'bg-white dark:bg-[#252526] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t.common.inlineMode}</span>
          </button>

          <button
            onClick={() => void handleModeChange('split_edit')}
            title={t.common.splitMode}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium ${
              mode === 'split_edit'
                ? 'bg-white dark:bg-[#252526] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{t.common.splitMode}</span>
          </button>
        </div>

        {/* Right: Actions (Save, Zoom, Language, Theme) */}
        <div className="flex items-center gap-1">
          {doc.isDirty && (
            <button
              onClick={() => saveCurrentDocument(false)}
              title={`${t.common.save} (Ctrl/Cmd+S)`}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition mr-1"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.common.save}</span>
            </button>
          )}

          {/* Export & Print Menu */}
          <div className="relative" ref={exportDropdownRef}>
            <button
              onClick={() => setIsExportMenuOpen((prev) => !prev)}
              title={t.common.exportMenu || 'Export & Print'}
              className={`p-1.5 rounded-lg transition ${
                isExportMenuOpen
                  ? 'bg-slate-200 dark:bg-neutral-700 text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
            >
              <Download className="w-4 h-4" />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-[#252526] border border-slate-200 dark:border-neutral-700 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    handlePrint();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />
                    <span>{t.common.print}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
                    {typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC') ? '⌘P' : 'Ctrl+P'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    handleExportPdf();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />
                    <span>{t.common.exportPdf}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
                    {typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC') ? '⌘⇧P' : 'Ctrl+⇧P'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    handleExportImage();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />
                    <span>{t.common.exportImage}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
                    {typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC') ? '⌘⇧E' : 'Ctrl+⇧E'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    handleExportHtml();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />
                    <span>{t.common.exportHtml}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
                    {typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC') ? '⌘⇧H' : 'Ctrl+⇧H'}
                  </span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={zoomOut}
            title={`${t.common.zoomOut} (Ctrl/Cmd -)`}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={zoomIn}
            title={`${t.common.zoomIn} (Ctrl/Cmd +)`}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Unified Settings Center Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            title={`${t.common.settings} (Ctrl/Cmd+,)`}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Pro / License Button */}
          <button
            onClick={() => setIsLicenseModalOpen(true)}
            title={isPro ? t.license.proEdition : `${t.license.activatePro} (${trialRemaining} left)`}
            className={`p-1.5 rounded-lg transition ${
              isPro
                ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() =>
              updatePreferences({
                theme: preferences.theme === 'dark' ? 'light' : 'dark'
              })
            }
            title={preferences.theme === 'dark' ? t.common.themeLight : t.common.themeDark}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition ml-0.5"
          >
            {preferences.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Body Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Workspace file tree (shown when a folder was opened or the Files
            button is active). Clicking a Markdown file opens it via the same
            dirty-safe path used for every other file entry. */}
        <WorkspaceSidebar
          tree={workspaceTree}
          activeFilePath={doc.filePath}
          isScanning={workspaceScanning}
          isOpen={isFilesOpen}
          onClose={() => setIsFilesOpen(false)}
          onOpenFile={(p) => requestSwitch({ type: 'file', path: p })}
          onRefresh={() => void refreshWorkspace()}
        />

        <OutlineDrawer
          headings={headings}
          activeId={activeHeadingId}
          isOpen={isOutlineOpen}
          onClose={() => setIsOutlineOpen(false)}
          onSelectHeading={handleSelectHeading}
        />

        {projectName && !doc.filePath && !doc.rawContent ? (
          <main className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 dark:text-neutral-500 select-none">
            <FolderOpen className="w-12 h-12 mb-3 text-amber-500/70" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-neutral-200 mb-1">
              {projectName}
            </h3>
            <p className="text-xs max-w-sm mb-4">
              {t.workspace.empty}
            </p>
            <button
              onClick={() => createNewDocument()}
              className="px-3.5 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm transition"
            >
              {t.common.newDocument}
            </button>
          </main>
        ) : (
          <>
            {mode === 'reading' && (
              <ReaderView
                content={doc.rawContent}
                filePath={doc.filePath}
                fontSize={fontSize}
                readingWidth={preferences.readingWidth || 'adaptive'}
              />
            )}

            {mode === 'inline_edit' && (
              <React.Suspense fallback={<div className="flex-1 flex items-center justify-center p-8 text-slate-400 dark:text-neutral-500 text-xs select-none">Loading editor...</div>}>
                <InlineEditor
                  content={doc.rawContent}
                  onChange={updateContent}
                  isDark={isDark}
                  fontSize={fontSize}
                />
              </React.Suspense>
            )}

            {mode === 'split_edit' && (
              <React.Suspense fallback={<div className="flex-1 flex items-center justify-center p-8 text-slate-400 dark:text-neutral-500 text-xs select-none">Loading editor...</div>}>
                <SplitContainer
                  content={doc.rawContent}
                  filePath={doc.filePath}
                  onChange={updateContent}
                  isDark={isDark}
                  fontSize={fontSize}
                />
              </React.Suspense>
            )}
          </>
        )}
      </div>

      {/* Refined Status Bar */}
      <StatusBar
        content={doc.rawContent}
        encoding={doc.encoding}
        lineEnding={doc.lineEnding}
        isReadOnly={doc.isReadOnly}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Drag & Drop Visual Overlay */}
      <DropOverlay isVisible={isDragging} />

      {/* Lazy-loaded Modal Dialogs */}
      <React.Suspense fallback={null}>
        {/* Safe Exit / Document Switch Prompt Dialog */}
        {isExitDialogOpen && (
          <SafeExitDialog
            isOpen={isExitDialogOpen}
            fileName={doc.fileName || t.common.untitled}
            onSave={handleConfirmSave}
            onDiscard={handleConfirmDiscard}
            onCancel={handleCancelExitOrOpen}
          />
        )}

        {/* Keyboard Shortcuts Guide Modal */}
        {isShortcutsOpen && (
          <ShortcutsModal
            isOpen={isShortcutsOpen}
            onClose={() => setIsShortcutsOpen(false)}
          />
        )}

        {/* Unified Settings Center Modal */}
        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            onOpenLicense={() => setIsLicenseModalOpen(true)}
            preferences={preferences}
            onUpdatePreferences={updatePreferences}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            onResetFontSize={resetZoom}
          />
        )}

        {/* License Management Modal */}
        {isLicenseModalOpen && (
          <LicenseModal
            isOpen={isLicenseModalOpen}
            onClose={() => setIsLicenseModalOpen(false)}
          />
        )}

        {/* Pro Trial Upsell Modal */}
        {!!upsellFeature && (
          <ProUpsellModal
            isOpen={!!upsellFeature}
            featureName={upsellFeature}
            onClose={() => setUpsellFeature(null)}
            onOpenLicenseModal={() => {
              setUpsellFeature(null);
              setIsLicenseModalOpen(true);
            }}
          />
        )}
      </React.Suspense>

      {/* Proactive Update Notification Toast */}
      <UpdateNotification
        manifest={pendingUpdateManifest}
        onClose={() => setPendingUpdateManifest(null)}
        onSnooze={async () => {
          setPendingUpdateManifest(null);
          await snoozeUpdate();
        }}
      />

      {/* Right-Click Context Menu */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={() => setContextMenu((prev) => ({ ...prev, isOpen: false }))}
        mode={mode}
        onSetMode={(m) => void handleModeChange(m)}
        isOutlineOpen={isOutlineOpen}
        onToggleOutline={() => setIsOutlineOpen((prev) => !prev)}
        onPrint={handlePrint}
        onExportPdf={handleExportPdf}
        onExportImage={handleExportImage}
        onExportHtml={handleExportHtml}
      />

      {/* Toast Notification for Export / Status Messages */}
      {toastMessage && (
        <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900/90 dark:bg-neutral-800/95 text-white text-xs rounded-xl shadow-2xl backdrop-blur-md border border-white/10 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150 select-none">
          {isExportingImage && (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export const App: React.FC = () => {
  return (
    <I18nProvider>
      <LicenseProvider>
        <AppContent />
      </LicenseProvider>
    </I18nProvider>
  );
};

export default App;
