/**
 * URL을 파일 시스템에 안전한 파일명으로 변환한다.
 * e.g. https://example.com/ko/courses/jeju → ko-courses-jeju
 */
export function safeFileName(url: string): string {
  try {
    const { hostname, pathname, searchParams } = new URL(url);
    const pathPart = pathname
      .replace(/^\/+|\/+$/g, '')
      .replace(/[^a-zA-Z0-9가-힣_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    const queryPart = [...searchParams.entries()]
      .map(([k, v]) => `${k}-${v}`)
      .join('_')
      .replace(/[^a-zA-Z0-9가-힣_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    const base = pathPart || hostname.replace(/\./g, '-');
    const full = queryPart ? `${base}__q_${queryPart}` : base;
    return full.toLowerCase().slice(0, 120);
  } catch {
    return url.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 120);
  }
}
