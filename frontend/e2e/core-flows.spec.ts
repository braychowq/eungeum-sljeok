import { expect, test, type Browser, type Page } from '@playwright/test';

async function loginAsTestUser(page: Page, displayName = 'E2E회원', userId?: string) {
  const response = await page.request.post('/api/test-auth/login', {
    data: { displayName, userId }
  });

  expect(response.ok()).toBeTruthy();
}

function uniqueLabel(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function createCommunityPost(page: Page, title: string, body: string) {
  await page.goto('/community/new');
  await page.locator('[data-field="title"]').fill(title);
  await page.locator('[data-field="body"]').fill(body);
  await page.locator('[data-submit]').click();
  await expect(page).toHaveURL(/\/community\/post\//);
  await expect(page.locator('h1', { hasText: title })).toBeVisible();
  return page.url().split('/').pop() ?? '';
}

async function createSecondUserContext(browser: Browser, displayName: string) {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:3025' });
  const page = await context.newPage();
  await loginAsTestUser(page, displayName);
  return { context, page };
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

  test('인증이 필요한 페이지와 쓰기 API는 비로그인 사용자를 차단한다', async ({ page }) => {
    await page.goto('/community/new');
    await expect(page).toHaveURL(/\/login\?error=auth_required/);

    await page.goto('/market/new');
    await expect(page).toHaveURL(/\/login\?error=auth_required/);

    const writeResponse = await page.request.post('/api/community/posts', {
      data: {
        category: 'free',
        title: '비로그인 작성 차단',
        body: '로그인 없이 쓰기 요청이 허용되면 안 됩니다.'
      }
    });

    expect(writeResponse.status()).toBe(401);
  });

  test('게시글 작성과 댓글 작성이 실제 저장되고 새로고침 후에도 유지된다', async ({ page }) => {
    await loginAsTestUser(page, '커뮤니티E2E');

    const title = uniqueLabel('플레이라이트-게시글');
    const body = uniqueLabel('브라우저-E2E-게시글-본문');
    await createCommunityPost(page, title, body);

    await page.locator('[data-comment-body]').fill('플레이라이트 댓글 등록 테스트');
    await page.locator('[data-comment-submit]').click();
    await expect(page.locator('[data-comment-list]')).toContainText('플레이라이트 댓글 등록 테스트');

    await page.reload();
    await expect(page.locator('body')).toContainText(title);
    await expect(page.locator('[data-comment-list]')).toContainText('플레이라이트 댓글 등록 테스트');
  });

  test('게시글 작성 폼은 validation 실패를 사용자에게 노출한다', async ({ page }) => {
    await loginAsTestUser(page, '검증E2E');

    await page.goto('/community/new');
    await page.locator('[data-field="title"]').fill('검증용 제목');
    await page.locator('[data-field="body"]').fill('나');
    await page.locator('[data-submit]').click();

    await expect(page.locator('[data-form-message]')).toContainText(
      '내용을 조금 더 적어주세요.'
    );
    await expect(page).toHaveURL(/\/community\/new$/);
  });

  test('작성자는 게시글을 수정하고 삭제할 수 있으며 다른 사용자는 수정 접근이 거부된다', async ({ page, browser }) => {
    await loginAsTestUser(page, '작성자E2E');

    const title = uniqueLabel('수정삭제-원본');
    const updatedTitle = uniqueLabel('수정삭제-수정본');
    const slug = await createCommunityPost(
      page,
      title,
      '작성자만 수정과 삭제를 할 수 있는지 확인하는 테스트 본문입니다.'
    );

    const { context: otherContext, page: otherPage } = await createSecondUserContext(browser, '다른회원E2E');
    await otherPage.goto(`/community/post/${slug}/edit`);
    await expect(otherPage.getByRole('heading', { name: '이 글은 수정할 수 없어요' })).toBeVisible();
    await otherContext.close();

    await page.goto(`/community/post/${slug}`);
    await expect(page.locator('[data-post-edit]')).toBeVisible();
    await page.locator('[data-post-edit]').click();

    await expect(page).toHaveURL(new RegExp(`/community/post/${slug}/edit$`));
    await page.locator('[data-field="title"]').fill(updatedTitle);
    await page.locator('[data-field="body"]').fill('수정된 본문입니다. 저장 후 상세 페이지에서 실제 DB 반영 여부를 확인합니다.');
    await page.locator('[data-submit]').click();

    await expect(page).toHaveURL(new RegExp(`/community/post/${slug}$`));
    await expect(page.locator('h1')).toContainText(updatedTitle);
    await page.reload();
    await expect(page.locator('h1')).toContainText(updatedTitle);

    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('[data-post-delete]').click();
    await expect(page).toHaveURL(/\/community$/);

    await page.goto(`/community?q=${encodeURIComponent(updatedTitle)}`);
    await expect(page.locator('body')).toContainText('아직 찾는 글이 없어요');
  });

  test('커뮤니티 검색 empty state와 상세 404 에러 화면을 안전하게 노출한다', async ({ page }) => {
    await page.goto(`/community?q=${encodeURIComponent(uniqueLabel('없는검색어'))}`);
    await expect(page.locator('body')).toContainText('아직 찾는 글이 없어요');

    const missingSlug = uniqueLabel('missing-post');
    const response = await page.goto(`/community/post/${missingSlug}`);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: '글을 찾을 수 없어요' })).toBeVisible();
  });

  test('로그인 후 공방 등록이 실제 저장되고 상세로 이동한다', async ({ page }) => {
    await loginAsTestUser(page, '공방E2E');

    const studioName = uniqueLabel('플레이라이트-테스트-공방');
    await page.goto('/market/new');
    await page.locator('[data-field="name"]').fill(studioName);
    await page.locator('[data-field="location"]').fill('서울 종로구 율곡로 10');
    await page
      .locator('[data-field="description"]')
      .fill('브라우저 자동화로 공방 등록 API와 상세 이동까지 실제로 동작하는지 확인하는 테스트 설명입니다.');
    await page.locator('[data-field="price"]').fill('210000');
    await page.locator('[data-field="contact"]').fill('010-2222-3333');
    await page.locator('[data-studio-submit]').click();

    await expect(page).toHaveURL(/\/market\/studio\//);
    await expect(page.getByRole('heading', { name: studioName })).toBeVisible();
    await expect(page.locator('body')).toContainText('서울 종로구 율곡로 10');

    await page.reload();
    await expect(page.locator('body')).toContainText(studioName);
  });

  test('공방 문의는 전화 대신 메시지로 이어지고 대화가 양쪽에 저장된다', async ({ page, browser }) => {
    await loginAsTestUser(page, '문의회원E2E');

    await page.goto('/market/studio/silent-earth');
    await expect(page.locator('a[href^="/messages?start=silent-earth"]')).toBeVisible();
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);

    await page.locator('a[href^="/messages?start=silent-earth"]').click();
    await expect(page).toHaveURL(/\/messages\/.+/);
    await expect(page.getByRole('heading', { name: 'Silent Earth Studio' })).toBeVisible();

    const guestMessage = uniqueLabel('문의메시지');
    await page.locator('[data-chat-input]').fill(guestMessage);
    await page.locator('[data-chat-submit]').click();
    await expect(page.locator('[data-chat-thread]')).toContainText(guestMessage);

    const conversationPath = new URL(page.url()).pathname;
    await page.goto('/messages');
    await expect(page.locator(`a[href="${conversationPath}"]`)).toContainText(guestMessage);

    const ownerContext = await browser.newContext({ baseURL: 'http://127.0.0.1:3025' });
    const ownerPage = await ownerContext.newPage();
    await loginAsTestUser(ownerPage, '호스트', 'user-seed-curation-host');
    await ownerPage.goto('/messages');
    await expect(ownerPage.locator(`a[href="${conversationPath}"]`)).toContainText(guestMessage);
    await ownerPage.locator(`a[href="${conversationPath}"]`).click();
    const ownerReply = uniqueLabel('호스트답장');
    await ownerPage.locator('[data-chat-input]').fill(ownerReply);
    await ownerPage.locator('[data-chat-submit]').click();
    await expect(ownerPage.locator('[data-chat-thread]')).toContainText(ownerReply);
    await ownerContext.close();

    await page.goto(conversationPath);
    await expect(page.locator('[data-chat-thread]')).toContainText(guestMessage);
    await expect(page.locator('[data-chat-thread]')).toContainText(ownerReply);
  });
});
