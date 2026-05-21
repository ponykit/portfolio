export type PageKind = 'menu' | 'detail';

export type ViewportName = 'pc' | 'mobile';

export interface ViewportConfig {
  name: ViewportName;
  width: number;
  height: number;
}

export interface CaptureEntry {
  url: string;
  kind: PageKind;
  menuKey: string;
  screenshotPc: string;
  screenshotMobile: string;
  capturedAt: string;
}

export interface FailedEntry {
  url: string;
  viewport: ViewportName;
  error: string;
}

export interface Manifest {
  baseUrl: string;
  generatedAt: string;
  captures: CaptureEntry[];
  failed: FailedEntry[];
}

export interface CollectedLink {
  url: string;
  kind: PageKind;
  menuKey: string;
}
