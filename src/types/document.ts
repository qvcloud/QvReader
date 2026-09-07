export type LineEnding = 'LF' | 'CRLF';
export type FileEncoding = 'UTF-8' | 'UTF-8-BOM';

export interface DocumentModel {
  filePath: string | null;
  fileName: string;
  rawContent: string;
  diskContent: string;
  isDirty: boolean;
  lineEnding: LineEnding;
  encoding: FileEncoding;
  isReadOnly: boolean;
  diskHash: string;
}

export type ViewMode = 'reading' | 'inline_edit' | 'split_edit';

export interface ViewState {
  mode: ViewMode;
  isOutlineOpen: boolean;
  zoomLevel: number;
  activeHeadingId: string | null;
  scrollLine: number;
}

export interface HeadingItem {
  id: string;
  level: number;
  text: string;
  sourceLine: number;
}

export type ReadingWidth = 'adaptive' | 'standard' | 'full';

export interface UserPreferences {
  theme: 'system' | 'light' | 'dark';
  fontSize: number;
  fontFamily: string;
  isOutlinePinned: boolean;
  recentFiles: string[];
  readingWidth?: ReadingWidth;
  locale?: string;
  autoSave?: boolean;
  wordWrap?: boolean;
  preserveLineEndings?: boolean;
  lastUpdateCheck?: number | null;
  autoCheckUpdate?: boolean;
}

export interface FileModifiedPayload {
  filePath: string;
  newDiskHash: string;
  hasConflict: boolean;
}

/** Filesystem kind of a path handed to QvReader. */
export type PathKind = 'file' | 'directory' | 'missing';

/** Node in a workspace Markdown file tree (see Rust `workspace.rs`). */
export interface WorkspaceNode {
  name: string;
  /** Absolute path on disk. */
  path: string;
  /** Path relative to the workspace root, slash-separated. */
  relativePath: string;
  isDir: boolean;
  children: WorkspaceNode[];
}
