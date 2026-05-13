import { chromium } from 'playwright';
import { projects } from '../src/data/projects';
import * as fs from 'fs';
import * as path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'projects');

async function captureScreenshot(url: string, filename: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
  });

  try {
    console.log(`📸 Capturing: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // 페이지 로딩 대기
    await page.waitForTimeout(2000);
    
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
  // 출력 디렉토리 생성
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // demoUrl이 있는 프로젝트만 캡처
  const projectsWithDemo = projects.filter((p) => p.demoUrl);

  console.log(`🚀 Starting capture for ${projectsWithDemo.length} projects...\n`);

  for (const project of projectsWithDemo) {
    if (project.demoUrl) {
      const filename = `${project.id}-${project.title.toLowerCase().replace(/\s+/g, '-')}.png`;
      await captureScreenshot(project.demoUrl, filename);
    }
  }

  console.log('\n✨ All screenshots captured!');
}

// 개별 URL 캡처 모드 (인자로 URL과 파일명 전달 가능)
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
    console.log('  npm run capture              # Capture all projects with demoUrl');
    console.log('  npm run capture <url> <filename>  # Capture specific URL');
  }
}

captureCustomUrl();
