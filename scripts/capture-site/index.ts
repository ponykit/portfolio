import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { config } from './config.js';
import type { CaptureEntry, CollectedLink, FailedEntry, Manifest } from './types.js';
import { collectLinks } from './utils/collect-links.js';
import { capturePage } from './utils/capture-page.js';
import { safeFileName } from './utils/safe-file-name.js';
import { normalizeUrl } from './utils/normalize-url.js';
import { writePreview } from './utils/write-preview.js';
import { scrollPage } from './utils/scroll-page.js';

// ── 출력 디렉토리 보장 ────────────────────────────────────────────────────────
fs.mkdirSync(config.screenshotsDir, { recursive: true });

// ── 상태 ─────────────────────────────────────────────────────────────────────
const visited = new Set<string>();
const captures: CaptureEntry[] = [];
const failed: FailedEntry[] = [];

/** 메뉴 키별로 상세 페이지를 1개씩만 캡처하기 위한 집합 */
const detailCapturedMenuKeys = new Set<string>();

function screenshotPath(slug: string, viewportName: string): string {
  return path.join(config.screenshotsDir, `${slug}__${viewportName}.png`);
}

async function captureUrl(
  browser: ReturnType<typeof chromium.launch> extends Promise<infer T> ? T : never,
  link: CollectedLink,
): Promise<void> {
  const { url, kind, menuKey } = link;

  if (visited.has(url)) return;
  visited.add(url);

  if (kind === 'detail' && detailCapturedMenuKeys.has(menuKey)) {
    console.log(`  ⏭  skip detail (already captured for ${menuKey}): ${url}`);
    return;
  }

  console.log(`  📸 [${kind}/${menuKey}] ${url}`);

  const slug = safeFileName(url);
  const pcPath = screenshotPath(slug, 'pc');
  const mobilePath = screenshotPath(slug, 'mobile');

  // 이미 캡처된 파일이 있으면 재사용
  const pcExists = fs.existsSync(pcPath);
  const mobileExists = fs.existsSync(mobilePath);
  if (pcExists && mobileExists) {
    console.log(`  ✅ [${kind}/${menuKey}] already captured, skipping: ${url}`);
    captures.push({
      url, kind, menuKey,
      screenshotPc: pcPath,
      screenshotMobile: mobilePath,
      capturedAt: new Date().toISOString(),
    });
    if (kind === 'detail') detailCapturedMenuKeys.add(menuKey);
    return;
  }

  const [pcResult, mobileResult] = await Promise.all([
    capturePage(browser, url, pcPath, config.viewports[0], config.scrollStepDelay),
    capturePage(browser, url, mobilePath, config.viewports[1], config.scrollStepDelay),
  ]);

  if (pcResult.failed) failed.push(pcResult.failed);
  if (mobileResult.failed) failed.push(mobileResult.failed);

  // 둘 중 하나라도 성공하면 manifest에 기록
  if (pcResult.filePath || mobileResult.filePath) {
    captures.push({
      url,
      kind,
      menuKey,
      screenshotPc: pcResult.filePath ?? '',
      screenshotMobile: mobileResult.filePath ?? '',
      capturedAt: new Date().toISOString(),
    });

    if (kind === 'detail') {
      detailCapturedMenuKeys.add(menuKey);
    }
  }

  await new Promise((r) => setTimeout(r, config.captureDelay));
}

function saveManifest(manifest: Manifest): void {
  fs.writeFileSync(
    path.join(config.outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf-8',
  );
}

function saveFailedCaptures(): void {
  fs.writeFileSync(
    path.join(config.outputDir, 'failed-captures.json'),
    JSON.stringify(failed, null, 2),
    'utf-8',
  );
}

// ── 메인 ─────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  console.log(`\n🌐  Base URL : ${config.baseUrl}`);
  console.log(`📂  Output   : ${config.outputDir}\n`);

  const browser = await chromium.launch({ headless: true });

  try {
    // 1. 홈 페이지에서 링크 수집
    console.log('🔍  Collecting links from base URL...');
    const context = await browser.newContext({
      viewport: { width: config.viewports[0].width, height: config.viewports[0].height },
    });
    const rootPage = await context.newPage();
    await rootPage.goto(config.baseUrl, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await rootPage.waitForTimeout(2000);
    await scrollPage(rootPage, config.scrollStepDelay);

    const links = await collectLinks(rootPage, {
      baseUrl: config.baseUrl,
      includePatterns: config.includePatterns,
      excludePatterns: config.excludePatterns,
      detailPatterns: config.detailPatterns,
    });
    await context.close();

    // 베이스 URL 자체도 메뉴로 추가
    const baseNormalized = normalizeUrl(config.baseUrl);
    const allLinks: CollectedLink[] = [
      { url: baseNormalized, kind: 'menu', menuKey: 'root' },
      ...links,
    ];

    const menuLinks = allLinks.filter((l) => l.kind === 'menu');
    const detailLinks = allLinks.filter((l) => l.kind === 'detail');

    console.log(`  Found ${menuLinks.length} menu pages, ${detailLinks.length} detail pages.\n`);

    // 2. 각 메뉴 페이지 캡처
    console.log('📸  Capturing menu pages...');
    for (const link of menuLinks) {
      await captureUrl(browser, link);
    }

    // 3. 상세 페이지: menuKey별 1개씩만 캡처
    console.log('\n📸  Capturing detail pages (1 per menu key)...');
    for (const link of detailLinks) {
      await captureUrl(browser, link);
    }
  } finally {
    await browser.close();
  }

  // 4. 결과 저장
  const manifest: Manifest = {
    baseUrl: config.baseUrl,
    generatedAt: new Date().toISOString(),
    captures,
    failed,
  };

  saveManifest(manifest);
  saveFailedCaptures();
  writePreview(manifest, config.outputDir);

  console.log(`\n✅  Done — ${captures.length} captured, ${failed.length} failed.`);
  console.log(`   manifest  → ${path.join(config.outputDir, 'manifest.json')}`);
  console.log(`   preview   → ${path.join(config.outputDir, 'index.html')}`);
  if (failed.length > 0) {
    console.log(`   failed    → ${path.join(config.outputDir, 'failed-captures.json')}`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
