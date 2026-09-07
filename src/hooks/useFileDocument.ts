import { useState, useCallback, useEffect } from 'react';
import { DocumentModel } from '../types/document';
import { openFile, saveFile, setWindowTitle, showSaveDialog } from '../lib/ipc';
import { APP_DISPLAY_NAME } from '../config/version';

export function useFileDocument(initialPath?: string) {
  const [doc, setDoc] = useState<DocumentModel>({
    filePath: null,
    fileName: 'Untitled.md',
    rawContent: '',
    diskContent: '',
    isDirty: false,
    lineEnding: 'LF',
    encoding: 'UTF-8',
    isReadOnly: false,
    diskHash: ''
  });
  // Lightweight busy flag so the UI can show feedback while a large file is
  // being opened or written, instead of appearing frozen.
  const [busy, setBusy] = useState<'idle' | 'opening' | 'saving'>('idle');

  const loadDocument = useCallback(async (path: string) => {
    setBusy('opening');
    try {
      const loaded = await openFile(path);
      setDoc(loaded);
      await setWindowTitle(`${loaded.fileName} - ${APP_DISPLAY_NAME}`);
    } catch (err) {
      // Opening failed (missing/unreadable path). Don't leave a frozen/blank
      // shell — fall back to a clean untitled document and surface the reason.
      console.error('Failed to open file:', err);
      const name = path.split('/').pop() || 'Untitled.md';
      setDoc({
        filePath: null,
        fileName: name,
        rawContent: '',
        diskContent: '',
        isDirty: false,
        lineEnding: 'LF',
        encoding: 'UTF-8',
        isReadOnly: false,
        diskHash: ''
      });
      await setWindowTitle(`${name} - ${APP_DISPLAY_NAME}`);
    } finally {
      setBusy('idle');
    }
  }, []);

  const createNewDocument = useCallback(async () => {
    setDoc({
      filePath: null,
      fileName: 'Untitled.md',
      rawContent: '',
      diskContent: '',
      isDirty: false,
      lineEnding: 'LF',
      encoding: 'UTF-8',
      isReadOnly: false,
      diskHash: ''
    });
    await setWindowTitle(`Untitled.md - ${APP_DISPLAY_NAME}`);
  }, []);

  const resetDocument = useCallback(async (title?: string) => {
    setDoc({
      filePath: null,
      fileName: title || '',
      rawContent: '',
      diskContent: '',
      isDirty: false,
      lineEnding: 'LF',
      encoding: 'UTF-8',
      isReadOnly: false,
      diskHash: ''
    });
    if (title) {
      await setWindowTitle(`${title} - ${APP_DISPLAY_NAME}`);
    }
  }, []);

  useEffect(() => {
    if (initialPath) {
      loadDocument(initialPath);
    }
  }, [initialPath, loadDocument]);

  const updateContent = useCallback((newContent: string) => {
    setDoc((prev) => {
      const isDirty = newContent !== prev.diskContent;
      const title = `${isDirty ? '• ' : ''}${prev.fileName} - ${APP_DISPLAY_NAME}`;
      setWindowTitle(title).catch(() => {});
      return {
        ...prev,
        rawContent: newContent,
        isDirty
      };
    });
  }, []);

  const saveCurrentDocument = useCallback(async (saveAs: boolean = false) => {
    let targetPath = doc.filePath;
    // A read-only file cannot be overwritten in place; force "Save As..." so
    // the user picks a writable destination (spec US6 acceptance #4).
    if (!targetPath || saveAs || doc.isReadOnly) {
      const selected = await showSaveDialog(doc.fileName || 'Untitled.md');
      if (!selected) return false;
      targetPath = selected;
    }
    setBusy('saving');
    try {
      const result = await saveFile(
        targetPath,
        doc.rawContent,
        doc.lineEnding,
        doc.encoding
      );
      if (result.success) {
        const name = targetPath.split('/').pop() || 'Untitled.md';
        setDoc((prev) => ({
          ...prev,
          filePath: targetPath,
          fileName: name,
          diskContent: prev.rawContent,
          isDirty: false,
          diskHash: result.diskHash
        }));
        await setWindowTitle(`${name} - ${APP_DISPLAY_NAME}`);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to save file:', err);
      return false;
    } finally {
      setBusy('idle');
    }
  }, [doc.filePath, doc.rawContent, doc.lineEnding, doc.encoding, doc.fileName, doc.isReadOnly]);

  const loadDocumentFromContent = useCallback(
    async (fileName: string, content: string, filePath: string | null = null) => {
      setDoc({
        filePath,
        fileName,
        rawContent: content,
        diskContent: content,
        isDirty: false,
        lineEnding: content.includes('\r\n') ? 'CRLF' : 'LF',
        encoding: 'UTF-8',
        isReadOnly: false,
        diskHash: ''
      });
      await setWindowTitle(`${fileName} - ${APP_DISPLAY_NAME}`);
    },
    []
  );

  const reloadDiskVersion = useCallback(async () => {
    if (doc.filePath) {
      await loadDocument(doc.filePath);
    }
  }, [doc.filePath, loadDocument]);

  return {
    doc,
    setDoc,
    busy,
    loadDocument,
    loadDocumentFromContent,
    createNewDocument,
    resetDocument,
    updateContent,
    saveCurrentDocument,
    reloadDiskVersion
  };
}

