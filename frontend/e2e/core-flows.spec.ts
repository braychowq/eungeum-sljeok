import { expect, test, type Page } from '@playwright/test';

async function loginAsTestUser(page: Page, displayName = 'E2E회원') {
  const response = await page.request.post('/api/test-auth/login', {
    data: { displayName }
  });

  expect(response.ok()).toBeTruthy();
}

test.describe('핵심 사용자 시나리오', () => {
  test('홈/공방/커뮤니티가 실제 DB 데이터를 렌더링한다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: '당신의 작업실을 찾아보세요' })).toBeVisible();
    await expect(page.locator('a[href^="/market/studio/"]').first()).toBeVisible();
    await expect(page.locator('a[href^="/community/post/"]').first()).toBeVisible();

    await page.goto('/market');
    await expect(page.getByRole('heading', { name: "Maison de L'Artiste" }).locator('a')).toBeVisible();

    await page.goto('/community');
    await expect(page.locator('a[href^="/community/post/"]').first()).toBeVisible();
  });

  test('로그인 후 게시글 작성과 댓글 작성이 실제 저장된다', async ({ page }) => {
    await loginAsTestUser(page, '커뮤니티E2E');

    await page.goto('/community/new');
    await page.locator('[data-field="title"]').fill('플레이라이트 게시글 등록 테스트');
    await page.locator('[data-field="body"]').fill('브라우저 E2E를 통해 실제 게시글 작성 API가 동작하는지 확인합니다.');
    await page.locator('[data-submit]').click();

    await expect(page).toHaveURL(/\/community\/post\//);
    await expect(page.locator('h1', { hasText: '플레이라이트 게시글 등록 테스트' })).toBeVisible();

    await page.locator('[data-comment-body]').fill('플레이라이트 댓글 등록 테스트');
    await page.locator('[data-comment-submit]').click();

    await expect(page.locator('[data-comment-list]')).toContainText('플레이라이트 댓글 등록 테스트');
  });

  test('로그인 후 공방 등록이 실제 저장되고 상세로 이동한다', async ({ page }) => {
    await loginAsTestUser(page, '공방E2E');

    await page.goto('/market/new');
    await page.locator('[data-field="name"]').fill('플레이라이트 테스트 공방');
    await page.locator('[data-field="location"]').fill('서울 종로구 율곡로 10');
    await page
      .locator('[data-field="description"]')
      .fill('브라우저 자동화로 공방 등록 API와 상세 이동까지 실제로 동작하는지 확인하는 테스트 설명입니다.');
    await page.locator('[data-field="price"]').fill('210000');
    await page.locator('[data-field="contact"]').fill('010-2222-3333');
    await page.locator('[data-studio-submit]').click();

    await expect(page).toHaveURL(/\/market\/studio\//);
    await expect(page.getByRole('heading', { name: '플레이라이트 테스트 공방' })).toBeVisible();
    await expect(page.locator('body')).toContainText('서울 종로구 율곡로 10');
    await expect(page.locator('body')).toContainText(
      '브라우저 자동화로 공방 등록 API와 상세 이동까지 실제로 동작하는지 확인하는 테스트 설명입니다.'
    );
  });
});
