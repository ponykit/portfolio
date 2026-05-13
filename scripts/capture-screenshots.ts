import { Browser, chromium } from 'playwright';
import { projects } from '../src/data/projects';
import * as fs from 'fs';
import * as path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'projects');
const VIEWPORT = { width: 1440, height: 1080 };
const MENU_PAGE_COUNT = 5;

type CaptureResult = {
  filename: string;
  ok: boolean;
  error?: unknown;
};

function getFilenameFromProject(project: (typeof projects)[number]) {
  return path.basename(project.thumbnail);
}

function slugifyUrl(url: string) {
  const { pathname } = new URL(url);
  const slug = pathname
    .replace(/^\/[a-z]{2}(?=\/|$)/, '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^a-zA-Z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  return slug || 'home';
}

function getMenuFilename(project: (typeof projects)[number], url: string, index: number) {
  if (index === 0) {
    return getFilenameFromProject(project);
  }

  const order = String(index + 1).padStart(2, '0');
  return `${project.id}-${order}-${slugifyUrl(url)}.png`;
}

function isCapturableInternalUrl(url: string, origin: string) {
  const parsed = new URL(url);
  const pathname = parsed.pathname.toLowerCase();

  if (parsed.origin !== origin) {
    return false;
  }

  if (
    pathname.includes('/login') ||
    pathname.includes('/signin') ||
    pathname.includes('/signup') ||
    pathname.includes('/auth') ||
    pathname.includes('/admin')
  ) {
    return false;
  }

  return true;
}

function normalizeUrl(href: string) {
  const parsed = new URL(href);
  parsed.hash = '';
  parsed.search = '';

  if (parsed.pathname !== '/') {
    parsed.pathname = parsed.pathname.replace(/\/+$/g, '');
  }

  return parsed.toString();
}

async function discoverMenuUrls(
  browser: Browser,
  project: (typeof projects)[number]
) {
  if (!project.siteUrl) {
    return [];
  }

  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1 });

  try {
    await page.goto(project.siteUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
    await page.locator('body').waitFor({ state: 'visible', timeout: 10000 });

    const baseUrl = new URL(project.siteUrl);
    const hrefs = await page
      .locator('header a[href], nav a[href], [role="navigation"] a[href], a[href]')
      .evaluateAll((links) =>
        links
          .map((link) => (link as HTMLAnchorElement).href)
          .filter(Boolean)
      );

    const urls = [project.siteUrl, ...hrefs]
      .map((href) => normalizeUrl(href))
      .filter((url) => isCapturableInternalUrl(url, baseUrl.origin));

    return Array.from(new Set(urls)).slice(0, MENU_PAGE_COUNT);
  } finally {
    await page.close();
  }
}

async function captureScreenshot(
  browser: Browser,
  url: string,
  filename: string
): Promise<CaptureResult> {
  const page = await browser.newPage({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
  });

  try {
    console.log(`Capturing: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.locator('body').waitFor({ state: 'visible', timeout: 10000 });

    await page.waitForTimeout(1200);

    const outputPath = path.join(OUTPUT_DIR, filename);
    await page.screenshot({
      path: outputPath,
      fullPage: false,
    });

    console.log(`Saved: ${filename}`);
    return { filename, ok: true };
  } catch (error) {
    console.error(`Failed to capture ${url}:`, error);
    return { filename, ok: false, error };
  } finally {
    await page.close();
  }
}

async function captureAllProjects() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const projectsToCapture = projects.filter(
    (p) => p.status === 'live' && p.siteUrl
  );

  console.log(
    `Starting capture for ${projectsToCapture.length} live projects...\n`
  );

  const browser = await chromium.launch();
  const results: CaptureResult[] = [];

  for (const project of projectsToCapture) {
    if (project.siteUrl) {
      const filename = getFilenameFromProject(project);
      const result = await captureScreenshot(browser, project.siteUrl, filename);
      results.push(result);
    }
  }

  await browser.close();

  const failed = results.filter((result) => !result.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length} screenshot(s) failed.`);
    process.exitCode = 1;
    return;
  }

  console.log('\nAll screenshots captured.');
}

async function captureMenuPages() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const projectsToCapture = projects.filter(
    (p) => p.status === 'live' && p.siteUrl
  );
  const browser = await chromium.launch();
  const results: CaptureResult[] = [];

  for (const project of projectsToCapture) {
    const urls = await discoverMenuUrls(browser, project);
    console.log(`\n${project.title}: ${urls.length} page(s)`);

    for (const [index, url] of urls.entries()) {
      const filename = getMenuFilename(project, url, index);
      const result = await captureScreenshot(browser, url, filename);
      results.push(result);
    }
  }

  await browser.close();

  const failed = results.filter((result) => !result.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length} screenshot(s) failed.`);
    process.exitCode = 1;
    return;
  }

  console.log('\nAll menu screenshots captured.');
}

async function inspectSajuNamingPage() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1 });

  try {
    await page.goto('https://saju-naming.pages.dev/naming/normal', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);

    const data = await page.evaluate(() => ({
      inputs: Array.from(document.querySelectorAll('input')).map((el) => ({
        id: el.id,
        name: el.name,
        type: el.type,
        placeholder: el.placeholder,
        value: el.value,
      })),
      buttons: Array.from(document.querySelectorAll('button')).map((el) => ({
        id: el.id,
        role: el.getAttribute('role'),
        ariaLabel: el.getAttribute('aria-label'),
        text: el.textContent?.trim(),
      })),
      dialogs: Array.from(document.querySelectorAll('[role="dialog"]')).map((el) =>
        el.textContent?.trim()
      ),
    }));

    const optionGroups: string[][] = [];
    const comboboxes = page.getByRole('combobox');
    const comboboxCount = await comboboxes.count();

    for (let index = 0; index < comboboxCount; index += 1) {
      await comboboxes.nth(index).click();
      await page.waitForTimeout(250);
      optionGroups.push(
        (await page
          .getByRole('option')
          .allTextContents()
          .catch(() => []))
          .map((text) => text.trim())
          .filter(Boolean)
          .slice(0, 30)
      );
      await page.keyboard.press('Escape').catch(() => {});
    }

    console.log(JSON.stringify({ ...data, optionGroups }, null, 2));
  } finally {
    await browser.close();
  }
}

async function selectComboboxOption(page: Awaited<ReturnType<Browser['newPage']>>, index: number, optionName: string) {
  await page.getByRole('combobox').nth(index).click();
  await page.getByRole('option', { name: optionName }).click();
}

async function fillSajuNamingForm(page: Awaited<ReturnType<Browser['newPage']>>) {
  await page.getByRole('button', { name: '동의' }).click().catch(() => {});
  await page.locator('#surname').fill('김');
  await page.waitForTimeout(1000);
  await page.locator('button').filter({ hasText: '金성씨' }).click();
  await selectComboboxOption(page, 0, '2024년');
  await selectComboboxOption(page, 1, '5월');
  await selectComboboxOption(page, 2, '13일');
  await selectComboboxOption(page, 3, '진시 (07-09시)');
  await page.getByRole('button', { name: '현대적' }).click();
  await page.getByRole('button', { name: '적정 균형' }).click();
}

async function inspectSajuResultPage() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1 });

  try {
    await page.goto('https://saju-naming.pages.dev/naming/normal', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
    await page.locator('body').waitFor({ state: 'visible', timeout: 10000 });
    await fillSajuNamingForm(page);
    await page.getByRole('button', { name: '이름 찾기' }).click();
    await page
      .getByRole('button', { name: '분석 중...' })
      .waitFor({ state: 'detached', timeout: 20000 })
      .catch(() => {});
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'saju-naming-debug-result.png'),
      fullPage: false,
    });

    const data = await page.evaluate(() => ({
      headings: Array.from(document.querySelectorAll('h1,h2,h3')).map((el) =>
        el.textContent?.trim()
      ),
      buttons: Array.from(document.querySelectorAll('button')).map((el) => ({
        text: el.textContent?.trim(),
        ariaLabel: el.getAttribute('aria-label'),
        role: el.getAttribute('role'),
      })),
      dialogs: Array.from(document.querySelectorAll('[role="dialog"]')).map((el) =>
        el.textContent?.trim()
      ),
      bodyText: document.body.textContent?.trim().slice(0, 3000),
    }));

    console.log(JSON.stringify(data, null, 2));
  } finally {
    await browser.close();
  }
}

async function captureCustomUrl() {
  const args = process.argv.slice(2);

  if (args.length === 1 && args[0] === '--inspect-saju-result') {
    await inspectSajuResultPage();
  } else if (args.length === 1 && args[0] === '--inspect-saju') {
    await inspectSajuNamingPage();
  } else if (args.length === 1 && args[0] === '--menu-pages') {
    await captureMenuPages();
  } else if (args.length === 2) {
    const [url, filename] = args;
    console.log('Custom capture mode');
    const browser = await chromium.launch();
    const result = await captureScreenshot(browser, url, filename);
    await browser.close();

    if (!result.ok) {
      process.exitCode = 1;
    }
  } else if (args.length === 0) {
    await captureAllProjects();
  } else {
    console.log('Usage:');
    console.log('  npm run capture                     # Capture all live projects');
    console.log('  npm run capture -- --inspect-saju   # Inspect Saju naming controls');
    console.log('  npm run capture -- --inspect-saju-result # Inspect Saju result controls');
    console.log('  npm run capture -- --menu-pages     # Capture 5 menu pages per project');
    console.log('  npm run capture <url> <filename>    # Capture specific URL');
    console.log('\nExamples:');
    console.log('  npm run capture https://trip-pocket.itkong.uk/ko trip-pocket.png');
  }
}

captureCustomUrl();
