import React, { useState } from 'react';
import { useI18n } from '../../i18n';
import { WorkspaceNode } from '../../types/document';
import { ChevronRight, FileText, Folder, FolderOpen, RefreshCw, X } from 'lucide-react';

interface Props {
  /** The workspace root node(s) as returned by Rust `scan_directory`. */
  tree: WorkspaceNode[];
  /** Absolute path of the currently open document, if any (to highlight). */
  activeFilePath: string | null;
  isScanning: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOpenFile: (absPath: string) => void;
  onRefresh: () => void;
}

export const isNodeDir = (node: WorkspaceNode): boolean => {
  if (typeof node.isDir === 'boolean') return node.isDir;
  if (typeof (node as unknown as { is_dir?: boolean }).is_dir === 'boolean') {
    return (node as unknown as { is_dir: boolean }).is_dir;
  }
  return false;
};

export const getNodeRelativePath = (node: WorkspaceNode): string => {
  return node.relativePath ?? (node as unknown as { relative_path?: string }).relative_path ?? '';
};

/** Recursively expand a directory tree of Markdown files + folders. */
const TreeNode: React.FC<{
  node: WorkspaceNode;
  depth: number;
  activeFilePath: string | null;
  onOpenFile: (absPath: string) => void;
}> = ({ node, depth, activeFilePath, onOpenFile }) => {
  const isDir = isNodeDir(node);
  const [expanded, setExpanded] = useState(true);

  if (!isDir) {
    const isActive = activeFilePath === node.path;
    return (
      <button
        onClick={() => onOpenFile(node.path)}
        title={getNodeRelativePath(node) || node.name}
        style={{ paddingLeft: `${depth * 14 + 6}px` }}
        className={`w-full text-left py-1 pr-2 rounded text-xs transition flex items-center gap-1.5 group ${
          isActive
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
            : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-200/50 dark:hover:bg-neutral-800'
        }`}
      >
        <span className="w-3.5 shrink-0" />
        <FileText className="w-3.5 h-3.5 shrink-0 opacity-60 text-slate-500 dark:text-neutral-400" />
        <span className="truncate">{node.name}</span>
      </button>
    );
  }

  const hasChildren = Boolean(node.children && node.children.length > 0);
  return (
    <div>
      <button
        onClick={() => setExpanded((e) => !e)}
        style={{ paddingLeft: `${depth * 14 + 6}px` }}
        className="w-full text-left py-1 pr-2 rounded text-xs transition flex items-center gap-1.5 text-slate-700 dark:text-neutral-300 hover:bg-slate-200/50 dark:hover:bg-neutral-800 font-medium"
      >
        {hasChildren ? (
          <ChevronRight
            className={`w-3.5 h-3.5 shrink-0 transition-transform ${expanded ? 'rotate-90' : ''} text-slate-400`}
          />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {expanded ? (
          <FolderOpen className="w-3.5 h-3.5 shrink-0 text-amber-500" />
        ) : (
          <Folder className="w-3.5 h-3.5 shrink-0 text-amber-500" />
        )}
        <span className="truncate">{node.name}</span>
      </button>
      {expanded &&
        hasChildren &&
        node.children.map((child) => (
          <TreeNode
            key={child.path}
            node={child}
            depth={depth + 1}
            activeFilePath={activeFilePath}
            onOpenFile={onOpenFile}
          />
        ))}
    </div>
  );
};

export const WorkspaceSidebar: React.FC<Props> = ({
  tree,
  activeFilePath,
  isScanning,
  isOpen,
  onClose,
  onOpenFile,
  onRefresh
}) => {
  const { t } = useI18n();
  if (!isOpen) return null;

  const rootNode = tree[0];
  const projectName = rootNode?.name || t.workspace.title;
  const children = rootNode?.children || [];

  return (
    <aside className="w-72 h-full border-r border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-[#181818] flex flex-col z-20 shrink-0">
      {/* Workspace Header: displays the project name */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-slate-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 min-w-0" title={rootNode?.path || projectName}>
          <FolderOpen className="w-4 h-4 shrink-0 text-amber-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-neutral-200 truncate">
            {projectName}
          </span>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={onRefresh}
            disabled={isScanning}
            title={t.workspace.refresh}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Workspace File Tree: lists files and folders directly under root */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {isScanning ? (
          <div className="px-4 py-8 text-center text-xs text-slate-400 dark:text-neutral-500">
            {t.workspace.scanning}
          </div>
        ) : !rootNode || children.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-slate-400 dark:text-neutral-500 leading-relaxed">
            {t.workspace.empty}
          </div>
        ) : (
          children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={0}
              activeFilePath={activeFilePath}
              onOpenFile={onOpenFile}
            />
          ))
        )}
      </div>
    </aside>
  );
};
