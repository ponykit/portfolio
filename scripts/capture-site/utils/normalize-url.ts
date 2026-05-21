/**
 * URL을 정규화한다.
 * - trailing slash 제거 (루트 경로 제외)
 * - hash 제거
 * - 검색 파라미터 정렬
 */
export function normalizeUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    url.hash = '';
    url.searchParams.sort();
    const pathname = url.pathname.endsWith('/') && url.pathname !== '/'
      ? url.pathname.slice(0, -1)
      : url.pathname;
    url.pathname = pathname;
    return url.toString();
  } catch {
    return rawUrl;
  }
}
