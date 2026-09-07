export interface UpdateManifest {
  version: string;
  releaseDate: string;
  downloadUrl: string;
  releaseNotes: string;
  mandatory?: boolean;
  minSupportedClient?: string;
}

export interface AppVersionInfo {
  version: string;
  buildType: string;
  platform: string;
  arch: string;
}

export type UpdateCheckStatus = 'idle' | 'checking' | 'available' | 'up-to-date' | 'error';

export interface UpdateCheckResult {
  status: UpdateCheckStatus;
  currentVersion: string;
  latestVersion?: string;
  manifest?: UpdateManifest;
  errorMessage?: string;
}
