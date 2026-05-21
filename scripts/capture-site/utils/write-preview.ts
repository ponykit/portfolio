import fs from 'fs';
import path from 'path';
import type { Manifest } from '../types.js';

/**
 * output/index.html 미리보기 페이지를 생성한다.
 */
export function writePreview(manifest: Manifest, outputDir: string): void {
  const rows = manifest.captures
    .map((entry) => {
      const pcSrc = path.relative(outputDir, entry.screenshotPc).replace(/\\/g, '/');
      const mobileSrc = path.relative(outputDir, entry.screenshotMobile).replace(/\\/g, '/');
      return `
    <section class="entry">
      <h2><span class="badge ${entry.kind}">${entry.kind}</span> <a href="${entry.url}" target="_blank">${entry.url}</a></h2>
      <div class="screens">
        <figure>
          <figcaption>PC (1440)</figcaption>
          <img src="${pcSrc}" loading="lazy" />
        </figure>
        <figure>
          <figcaption>Mobile (390)</figcaption>
          <img src="${mobileSrc}" loading="lazy" class="mobile" />
        </figure>
      </div>
    </section>`;
    })
    .join('\n');

  const failedRows = manifest.failed.length > 0
    ? `<section class="failed"><h2>Failed (${manifest.failed.length})</h2><ul>
${manifest.failed.map((f) => `<li>${f.viewport} — <a href="${f.url}">${f.url}</a>: ${f.error}</li>`).join('\n')}
</ul></section>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Site Capture — ${manifest.baseUrl}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; background: #0f0f0f; color: #e0e0e0; padding: 2rem; }
  h1 { font-size: 1.4rem; margin-bottom: 0.5rem; }
  .meta { font-size: 0.8rem; color: #888; margin-bottom: 2rem; }
  .entry { margin-bottom: 3rem; border-top: 1px solid #222; padding-top: 1.5rem; }
  .entry h2 { font-size: 0.95rem; margin-bottom: 1rem; word-break: break-all; }
  .badge { display: inline-block; padding: 0.1rem 0.5rem; border-radius: 3px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
  .badge.menu { background: #1d4ed8; }
  .badge.detail { background: #15803d; }
  .screens { display: flex; gap: 1.5rem; flex-wrap: wrap; }
  figure { display: flex; flex-direction: column; gap: 0.5rem; }
  figcaption { font-size: 0.75rem; color: #aaa; }
  img { display: block; border: 1px solid #333; border-radius: 4px; }
  img:not(.mobile) { max-width: min(860px, 100%); }
  img.mobile { max-width: 200px; }
  .failed { margin-top: 3rem; border-top: 2px solid #7f1d1d; padding-top: 1rem; }
  .failed h2 { color: #ef4444; margin-bottom: 0.5rem; }
  .failed ul { list-style: none; font-size: 0.85rem; }
  .failed li { margin-bottom: 0.4rem; }
  a { color: #60a5fa; }
</style>
</head>
<body>
<h1>Site Capture</h1>
<p class="meta">
  Base URL: <a href="${manifest.baseUrl}" target="_blank">${manifest.baseUrl}</a>
  &nbsp;|&nbsp; Generated: ${manifest.generatedAt}
  &nbsp;|&nbsp; Total: ${manifest.captures.length}
</p>
${rows}
${failedRows}
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, 'index.html'), html, 'utf-8');
}
