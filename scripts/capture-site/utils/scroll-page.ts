import type { Page } from 'playwright';

/**
 * 페이지를 끝까지 천천히 스크롤해서 lazy loading 콘텐츠를 로드한 뒤
 * 다시 최상단으로 돌아온다.
 */
export async function scrollPage(page: Page, stepDelay = 300): Promise<void> {
  await page.evaluate(async (delay: number) => {
    await new Promise<void>((resolve) => {
      const distance = 400;
      const maxIterations = 60; // 최대 60회 (약 18초)
      let iterations = 0;
      const timer = setInterval(() => {
        iterations++;
        window.scrollBy(0, distance);
        if (
          window.scrollY + window.innerHeight >= document.body.scrollHeight ||
          iterations >= maxIterations
        ) {
          clearInterval(timer);
          resolve();
        }
      }, delay);
    });
  }, stepDelay);

  // 상단으로 복귀
  await page.evaluate(() => window.scrollTo(0, 0));

  // 최종 렌더링 안정 대기
  await page.waitForTimeout(300);
}
