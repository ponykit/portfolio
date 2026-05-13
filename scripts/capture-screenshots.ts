import { chromium } from 'playwright';
import { projects } from '../src/data/projects';
import * as fs from 'fs';
import * as path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'projects');

async function captureScreenshot(url: string, filename: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1080 },
  });

  try {
    console.log(`📸 Capturing: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

    await page.waitForTimeout(1500);

    const outputPath = path.join(OUTPUT_DIR, filename);
    await page.screenshot({
      path: outputPath,
      fullPage: false,
    });

    console.log(`✅ Saved: ${filename}`);
  } catch (error) {
    console.error(`❌ Failed to capture ${url}:`, error);
  } finally {
    await browser.close();
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
    `🚀 Starting capture for ${projectsToCapture.length} live projects...\n`
  );

  for (const project of projectsToCapture) {
    if (project.siteUrl) {
      const filename = `${project.id}.png`;
      await captureScreenshot(project.siteUrl, filename);
    }
  }

  console.log('\n✨ All screenshots captured!');
}

async function captureCustomUrl() {
  const args = process.argv.slice(2);

  if (args.length === 2) {
    const [url, filename] = args;
    console.log(`🎯 Custom capture mode`);
    await captureScreenshot(url, filename);
  } else if (args.length === 0) {
    await captureAllProjects();
  } else {
    console.log('Usage:');
    console.log('  npm run capture                     # Capture all live projects');
    console.log('  npm run capture <url> <filename>    # Capture specific URL');
    console.log('\nExamples:');
    console.log('  npm run capture https://trip-pocket.itkong.uk/ko trip-pocket.png');
  }
}

captureCustomUrl();
