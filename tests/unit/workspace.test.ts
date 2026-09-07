import { describe, it, expect } from 'vitest';
import { WorkspaceNode } from '../../src/types/document';
import { isNodeDir, getNodeRelativePath } from '../../src/components/Workspace/WorkspaceSidebar';

describe('Workspace Node & Tree Utilities', () => {
  it('correctly detects directory with camelCase isDir', () => {
    const dirNode: WorkspaceNode = {
      name: 'Downloads',
      path: '/Users/test/Downloads',
      relativePath: '',
      isDir: true,
      children: []
    };
    expect(isNodeDir(dirNode)).toBe(true);

    const fileNode: WorkspaceNode = {
      name: 'README.md',
      path: '/Users/test/Downloads/README.md',
      relativePath: 'README.md',
      isDir: false,
      children: []
    };
    expect(isNodeDir(fileNode)).toBe(false);
  });

  it('correctly detects directory with snake_case is_dir for backwards compatibility', () => {
    const legacyDirNode = {
      name: 'docs',
      path: '/Users/test/Downloads/docs',
      relative_path: 'docs',
      is_dir: true,
      children: []
    } as unknown as WorkspaceNode;
    expect(isNodeDir(legacyDirNode)).toBe(true);

    const legacyFileNode = {
      name: 'guide.md',
      path: '/Users/test/Downloads/docs/guide.md',
      relative_path: 'docs/guide.md',
      is_dir: false,
      children: []
    } as unknown as WorkspaceNode;
    expect(isNodeDir(legacyFileNode)).toBe(false);
  });

  it('correctly resolves relativePath across casing', () => {
    const modern: WorkspaceNode = {
      name: 'notes.md',
      path: '/test/notes.md',
      relativePath: 'notes.md',
      isDir: false,
      children: []
    };
    expect(getNodeRelativePath(modern)).toBe('notes.md');

    const legacy = {
      name: 'legacy.md',
      path: '/test/legacy.md',
      relative_path: 'legacy.md',
      is_dir: false,
      children: []
    } as unknown as WorkspaceNode;
    expect(getNodeRelativePath(legacy)).toBe('legacy.md');
  });
});
