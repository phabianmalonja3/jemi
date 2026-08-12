export type AppPlatform = 'ANDROID' | 'IOS';

export interface AppVersionRequest {
  appId: string;
  platform: AppPlatform;
  currentVersion: string;
  currentBuildNumber: number;
  minimumBuildNumber: number;
  updateMessage: string;
  storeUrl: string;
  active: boolean;
}

export interface AppVersion extends AppVersionRequest {
  id: string;
}