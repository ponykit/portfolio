import type { Page } from 'playwright';
import type { CollectedLink } from '../types.js';
import { normalizeUrl } from './normalize-url.js';

interface CollectOptions {
  baseUrl: string;
  includePatterns: string[];
  excludePatterns: string[];
  detailPatterns: string[];
}

function isExternalOrSpecial(href: string, baseHostname: string): boolean {
  if (!href) return true;
  if (href.startsWith('mailto:') || href.startsWith('tel:')) return true;
  if (href.startsWith('#')) return true;
  try {
    const url = new URL(href);
    return url.hostname !== baseHostname;
  } catch {
    return false;
  }
}

function matchesAny(pathname: string, patterns: string[]): boolean {
  return patterns.some((p) => new RegExp(p).test(pathname));
}

/**
 * 현재 페이지에서 a[href] 링크를 수집해 메뉴/상세 분류로 반환한다.
 * menuKey는 해당 링크가 속한 메뉴를 식별하는 키다.
 */
export async function collectLinks(
  page: Page,
  options: CollectOptions,
): Promise<CollectedLink[]> {
  const { baseUrl, includePatterns, excludePatterns, detailPatterns } = options;
  const baseHostname = new URL(baseUrl).hostname;

  const hrefs: string[] = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href]')).map(
      (a) => (a as HTMLAnchorElement).href,
    ),
  );

  const seen = new Set<string>();
  const links: CollectedLink[] = [];

  for (const href of hrefs) {
    if (isExternalOrSpecial(href, baseHostname)) continue;

    let normalized: string;
    try {
      normalized = normalizeUrl(href);
    } catch {
      continue;
    }

    if (seen.has(normalized)) continue;
    seen.add(normalized);

    const { pathname } = new URL(normalized);

    if (matchesAny(pathname, excludePatterns)) continue;
    if (includePatterns.length > 0 && !matchesAny(pathname, includePatterns)) continue;

    const isDetail = matchesAny(pathname, detailPatterns);

    // 상세 페이지의 menuKey: detailPattern에 매칭되는 세그먼트를 추출
    let menuKey = 'root';
    if (isDetail) {
      const matched = detailPatterns.find((p) => new RegExp(p).test(pathname));
      if (matched) {
        menuKey = matched.replace(/\//g, '').replace(/[^a-zA-Z0-9-]/g, '');
      }
    } else {
      // 메뉴 페이지: pathname의 첫 번째 세그먼트(언어 코드 제외)
      const segments = pathname.split('/').filter(Boolean);
      const langPattern = /^[a-z]{2}(-[a-z]{2})?$/;
      const firstNonLang = segments.find((s) => !langPattern.test(s));
      menuKey = firstNonLang ?? 'root';
    }

    links.push({
      url: normalized,
      kind: isDetail ? 'detail' : 'menu',
      menuKey,
    });
  }

  return links;
}
