import { Browser, Page, chromium } from 'playwright';
import { projects } from '../src/data/projects';
import * as fs from 'fs';
import * as path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'projects');
const VIEWPORT = { width: 1440, height: 1080 };
const MENU_PAGE_COUNT = 5;
const ENVIRONMENT_VIEWPORTS = [
  { name: 'mobile', label: 'Mobile', width: 390, height: 844 },
  { name: 'tablet', label: 'Tablet', width: 834, height: 1112 },
  { name: 'desktop', label: 'Desktop', width: 1440, height: 1080 },
] as const;

type CaptureResult = {
  filename: string;
  outputPath?: string;
  ok: boolean;
  error?: unknown;
};

type EnvironmentCapture = {
  label: string;
  viewport: string;
  filename: string;
  outputPath: string;
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

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function splitFilename(filename: string) {
  const parsed = path.parse(filename);
  return {
    name: parsed.name,
    ext: parsed.ext || '.png',
  };
}

function getEnvironmentFilename(filename: string, suffix: string) {
  const { name, ext } = splitFilename(filename);
  return `${name}-${suffix}${ext}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getImageDataUrl(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
  const data = fs.readFileSync(filePath).toString('base64');
  return `data:${mimeType};base64,${data}`;
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
  return captureScreenshotWithViewport(browser, url, filename, VIEWPORT);
}

async function captureScreenshotWithViewport(
  browser: Browser,
  url: string,
  filename: string,
  viewport: { width: number; height: number }
): Promise<CaptureResult> {
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: 1,
  });

  try {
    console.log(`Capturing ${viewport.width}x${viewport.height}: ${url}`);
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
    return { filename, outputPath, ok: true };
  } catch (error) {
    console.error(`Failed to capture ${url}:`, error);
    return { filename, ok: false, error };
  } finally {
    await page.close();
  }
}

async function composeEnvironmentBundle(
  page: Page,
  captures: EnvironmentCapture[],
  title: string,
  filename: string
): Promise<CaptureResult> {
  try {
    const outputPath = path.join(OUTPUT_DIR, filename);
    const cards = captures
      .map(
        (capture) => `
          <figure class="card">
            <div class="label-row">
              <strong>${escapeHtml(capture.label)}</strong>
              <span>${escapeHtml(capture.viewport)}</span>
            </div>
            <img src="${getImageDataUrl(capture.outputPath)}" alt="${escapeHtml(
              capture.label
            )} screenshot" />
          </figure>
        `
      )
      .join('');

    await page.setViewportSize({ width: 1800, height: 1200 });
    await page.setContent(
      `
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              * { box-sizing: border-box; }
              body {
                margin: 0;
                padding: 48px;
                background: #f4f7fb;
                color: #111827;
                font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              }
              .shell {
                width: 100%;
                display: grid;
                gap: 28px;
              }
              .title {
                margin: 0;
                font-size: 32px;
                line-height: 1.2;
                font-weight: 800;
                letter-spacing: 0;
              }
              .grid {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 24px;
                align-items: start;
              }
              .card {
                margin: 0;
                overflow: hidden;
                border: 1px solid #d8e0ec;
                border-radius: 8px;
                background: white;
                box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
              }
              .label-row {
                display: flex;
                justify-content: space-between;
                gap: 16px;
                padding: 14px 16px;
                border-bottom: 1px solid #e5eaf2;
                font-size: 16px;
                line-height: 1.2;
              }
              .label-row span {
                color: #64748b;
                font-weight: 600;
              }
              img {
                display: block;
                width: 100%;
                height: auto;
              }
            </style>
          </head>
          <body>
            <main class="shell">
              <h1 class="title">${escapeHtml(title)}</h1>
              <section class="grid">${cards}</section>
            </main>
          </body>
        </html>
      `,
      { waitUntil: 'load' }
    );
    await page.screenshot({ path: outputPath, fullPage: true });
    console.log(`Saved bundle: ${filename}`);
    return { filename, outputPath, ok: true };
  } catch (error) {
    console.error(`Failed to compose ${filename}:`, error);
    return { filename, ok: false, error };
  }
}

async function captureEnvironmentBundle(
  browser: Browser,
  url: string,
  filename: string,
  title = url
): Promise<CaptureResult[]> {
  const results: CaptureResult[] = [];
  const captures: EnvironmentCapture[] = [];

  for (const viewport of ENVIRONMENT_VIEWPORTS) {
    const envFilename = getEnvironmentFilename(filename, viewport.name);
    const result = await captureScreenshotWithViewport(
      browser,
      url,
      envFilename,
      viewport
    );
    results.push(result);

    if (result.ok && result.outputPath) {
      captures.push({
        label: viewport.label,
        viewport: `${viewport.width} x ${viewport.height}`,
        filename: result.filename,
        outputPath: result.outputPath,
      });
    }
  }

  if (captures.length !== ENVIRONMENT_VIEWPORTS.length) {
    return results;
  }

  const page = await browser.newPage({ viewport: { width: 1800, height: 1200 } });
  try {
    results.push(
      await composeEnvironmentBundle(
        page,
        captures,
        title,
        getEnvironmentFilename(filename, 'env-bundle')
      )
    );
  } finally {
    await page.close();
  }

  return results;
}

async function captureAllProjects() {
  ensureOutputDir();

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
  ensureOutputDir();

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

async function captureEnvironmentBundles() {
  ensureOutputDir();

  const projectsToCapture = projects.filter(
    (p) => p.status === 'live' && p.siteUrl
  );
  const browser = await chromium.launch();
  const results: CaptureResult[] = [];

  for (const project of projectsToCapture) {
    if (!project.siteUrl) {
      continue;
    }

    console.log(`\n${project.title}: environment bundle`);
    results.push(
      ...(await captureEnvironmentBundle(
        browser,
        project.siteUrl,
        getFilenameFromProject(project),
        project.title
      ))
    );
  }

  await browser.close();

  const failed = results.filter((result) => !result.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length} environment screenshot(s) failed.`);
    process.exitCode = 1;
    return;
  }

  console.log('\nAll environment bundles captured.');
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
  } else if (args.length === 1 && args[0] === '--env-bundle') {
    await captureEnvironmentBundles();
  } else if (args.length === 3 && args[0] === '--env-bundle') {
    const [, url, filename] = args;
    console.log('Custom environment bundle mode');
    ensureOutputDir();
    const browser = await chromium.launch();
    const results = await captureEnvironmentBundle(browser, url, filename);
    await browser.close();

    if (results.some((result) => !result.ok)) {
      process.exitCode = 1;
    }
  } else if (args.length === 2) {
    const [url, filename] = args;
    console.log('Custom capture mode');
    ensureOutputDir();
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
    console.log('  npm run capture -- --env-bundle     # Capture mobile/tablet/desktop bundles');
    console.log('  npm run capture -- --env-bundle <url> <filename> # Capture one responsive bundle');
    console.log('  npm run capture <url> <filename>    # Capture specific URL');
    console.log('\nExamples:');
    console.log('  npm run capture https://trip-pocket.itkong.uk/ko trip-pocket.png');
    console.log('  npm run capture -- --env-bundle https://trip-pocket.itkong.uk/ko trip-pocket.png');
  }
}

captureCustomUrl();
