import type { Browser } from 'playwright';
import type { ViewportConfig, FailedEntry } from '../types.js';
import { scrollPage } from './scroll-page.js';

interface CaptureResult {
  filePath: string | null;
  failed: FailedEntry | null;
}

/**
 * 단일 URL을 지정된 viewport로 캡처하여 outputPath에 저장한다.
 */
export async function capturePage(
  browser: Browser,
  url: string,
  outputPath: string,
  viewport: ViewportConfig,
  scrollStepDelay: number,
): Promise<CaptureResult> {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  try {
    // 전체 캡처 작업에 60초 타임아웃 적용
    await Promise.race([
      (async () => {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20_000 });
        await page.waitForTimeout(2000);
        await scrollPage(page, scrollStepDelay);
        await page.screenshot({ path: outputPath, fullPage: true });
      })(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Capture timeout (60s)')), 60_000),
      ),
    ]);
    return { filePath: outputPath, failed: null };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return {
      filePath: null,
      failed: { url, viewport: viewport.name, error },
    };
  } finally {
    await context.close();
  }
}
