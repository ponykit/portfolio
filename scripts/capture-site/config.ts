import type { ViewportConfig } from './types.js';

export interface SiteCaptureConfig {
  baseUrl: string;
  outputDir: string;
  screenshotsDir: string;
  viewports: ViewportConfig[];
  /** 같은 도메인 내에서 포함할 경로 패턴 (정규식 문자열). 비어있으면 모두 허용 */
  includePatterns: string[];
  /** 제외할 경로 패턴 (정규식 문자열) */
  excludePatterns: string[];
  /** 상세 페이지로 분류할 경로 패턴 (정규식 문자열) */
  detailPatterns: string[];
  /** 페이지 스크롤 후 콘텐츠 안정 대기 시간 (ms) */
  scrollStepDelay: number;
  /** 각 캡처 사이 간격 (ms) */
  captureDelay: number;
}

function resolveBaseUrl(): string {
  // CLI --url 인자 우선
  const urlArgIndex = process.argv.indexOf('--url');
  if (urlArgIndex !== -1 && process.argv[urlArgIndex + 1]) {
    return process.argv[urlArgIndex + 1];
  }
  // 환경변수
  if (process.env.CAPTURE_BASE_URL) {
    return process.env.CAPTURE_BASE_URL;
  }
  // 기본값
  return 'https://trip-pocket.itkong.uk/ko';
}

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config: SiteCaptureConfig = {
  baseUrl: resolveBaseUrl(),
  outputDir: path.join(__dirname, 'output'),
  screenshotsDir: path.join(__dirname, 'output', 'screenshots'),
  viewports: [
    { name: 'pc', width: 1440, height: 1100 },
    { name: 'mobile', width: 390, height: 844 },
  ],
  includePatterns: [],
  excludePatterns: [
    '/login',
    '/admin',
    '/api/',
    '/auth/',
    '#',
    'mailto:',
    'tel:',
  ],
  detailPatterns: [
    '/courses/',
    '/guides/',
    '/festivals/',
    '/attractions/',
    '/city-tours/',
  ],
  scrollStepDelay: 300,
  captureDelay: 500,
};
