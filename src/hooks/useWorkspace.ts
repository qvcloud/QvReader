import { useState, useCallback } from 'react';
import { WorkspaceNode } from '../types/document';
import { scanDirectory } from '../lib/ipc';

/**
 * Holds the "workspace" (a folder opened as a project). When a directory is
 * opened, we scan it once for its Markdown file tree and expose it for the
 * file sidebar. Files are opened on demand via the parent's document loader,
 * so this hook owns no document state itself.
 */
export function useWorkspace() {
  const [root, setRoot] = useState<string | null>(null);
  const [tree, setTree] = useState<WorkspaceNode[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Scan + open a folder as the current workspace. */
  const openWorkspace = useCallback(async (dir: string): Promise<WorkspaceNode[]> => {
    setIsScanning(true);
    setError(null);
    try {
      const nodes = await scanDirectory(dir);
      setRoot(dir);
      setTree(nodes);
      return nodes;
    } catch (err) {
      setError(String(err));
      setRoot(null);
      setTree([]);
      return [];
    } finally {
      setIsScanning(false);
    }
  }, []);

  /** Clear the workspace and return to single-file mode. */
  const closeWorkspace = useCallback(() => {
    setRoot(null);
    setTree([]);
    setError(null);
  }, []);

  /** Re-scan the current workspace (e.g. after files changed on disk). */
  const refreshWorkspace = useCallback(async () => {
    if (root) {
      await openWorkspace(root);
    }
  }, [root, openWorkspace]);

  return {
    root,
    tree,
    isScanning,
    error,
    openWorkspace,
    closeWorkspace,
    refreshWorkspace
  };
}
