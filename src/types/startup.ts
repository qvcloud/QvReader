import { DocumentModel, UserPreferences } from './document';

export type LaunchMode = 'file' | 'directory' | 'empty';

export interface InitialLaunchData {
  launchMode: LaunchMode;
  targetPath: string | null;
  document: DocumentModel | null;
  preferences: UserPreferences;
  isProLicensed: boolean;
}

export type EditorChunkStatus = 'unloaded' | 'prefetching' | 'loaded' | 'error';
