import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type TemplateName =
  | 'home'
  | 'market'
  | 'market-new'
  | 'market-detail'
  | 'market-registration-mobile'
  | 'messages'
  | 'messages-room'
  | 'community'
  | 'community-new'
  | 'community-post-detail'
  | 'login'
  | 'onboarding'
  | 'account';

type ActiveSection = 'none' | 'community' | 'market';

const templateFiles: Record<TemplateName, string> = {
  home: 'home.html',
  market: 'market.html',
  'market-new': 'market-new.html',
  'market-detail': 'market-detail.html',
  'market-registration-mobile': 'market-registration-mobile.html',
  messages: 'messages.html',
  'messages-room': 'messages-room.html',
  community: 'community.html',
  'community-new': 'community-new.html',
  'community-post-detail': 'community-post-detail.html',
  login: 'login.html',
  onboarding: 'onboarding.html',
  account: 'account.html'
};

const commonReplacements: Array<[string, string]> = [
  ['href="#">커뮤니티</a>', 'href="/community">커뮤니티</a>'],
  ['href="#">Community</a>', 'href="/community">커뮤니티</a>'],
  ['href="#">공방 공유</a>', 'href="/market">공방 공유</a>'],
  ['href="#">Studio Share</a>', 'href="/market">공방 공유</a>'],
  ['href="#">은금슬쩍</a>', 'href="/">은금슬쩍</a>'],
  ['data-auth-guest="" href="#">로그인</a>', 'data-auth-guest="" href="/login">로그인</a>']
];

const pageReplacements: Record<TemplateName, Array<[string, string]>> = {
  home: [
    [
      `<button class="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-xs tracking-widest uppercase hover:opacity-90 transition-all shadow-lg shadow-primary/10">`,
      `<a href="/community" class="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-xs tracking-widest uppercase hover:opacity-90 transition-all shadow-lg shadow-primary/10">`
    ],
    ['</button>\n<button class="px-8 py-4 rounded-full border border-outline text-on-surface font-label text-xs tracking-widest uppercase hover:bg-surface-container transition-all">', '</a>\n<a href="/market" class="inline-flex items-center justify-center px-8 py-4 rounded-full border border-outline text-on-surface font-label text-xs tracking-widest uppercase hover:bg-surface-container transition-all">'],
    ['</button>\n</div>\n</div>', '</a>\n</div>\n</div>'],
    [
      `<button class="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-outline hover:border-primary transition-all duration-300 whitespace-nowrap">`,
      `<a href="/market" class="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-outline hover:border-primary transition-all duration-300 whitespace-nowrap">`
    ],
    ['</button>\n</div>\n<div class="flex gap-8 overflow-x-auto hide-scrollbar pb-12 snap-x">', '</a>\n</div>\n<div class="flex gap-8 overflow-x-auto hide-scrollbar pb-12 snap-x">']
  ],
  market: [
    [
      `<article class="flex flex-col items-center justify-center p-12 border-2 border-dashed border-outline-variant/30 rounded-xl bg-surface-container-low/30 hover:bg-surface-container-low transition-colors group cursor-pointer">`,
      `<a href="/market/new" class="flex flex-col items-center justify-center p-12 border-2 border-dashed border-outline-variant/30 rounded-xl bg-surface-container-low/30 hover:bg-surface-container-low transition-colors group cursor-pointer">`
    ],
    ['</article>\n</section>', '</a>\n</section>']
  ],
  'market-new': [],
  'market-detail': [['<main class="pt-[68px] pb-32">', '<main class="pt-24 pb-32">']],
  'market-registration-mobile': [],
  messages: [],
  'messages-room': [],
  community: [
    [
      `<button class="mt-6 flex items-center gap-2 text-primary font-label text-xs uppercase tracking-widest border-b border-primary/20 hover:border-primary transition-all pb-1">`,
      `<a href="/community/new" class="inline-flex items-center gap-2 mt-6 text-primary font-label text-xs uppercase tracking-widest border-b border-primary/20 hover:border-primary transition-all pb-1">`
    ],
    ['</button>\n</article>', '</a>\n</article>'],
    [
      `<button class="w-full mt-8 py-4 border border-outline/20 rounded-full font-label text-[10px] uppercase tracking-widest hover:bg-white transition-all">전체 상품 보기</button>`,
      `<a href="/market" class="inline-flex w-full items-center justify-center mt-8 py-4 border border-outline/20 rounded-full font-label text-[10px] uppercase tracking-widest hover:bg-white transition-all">전체 공방 보기</a>`
    ],
    [
      `<button class="px-10 py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-label text-[10px] uppercase tracking-widest hover:shadow-lg transition-all">공방 둘러보기</button>`,
      `<a href="/market" class="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-label text-[10px] uppercase tracking-widest hover:shadow-lg transition-all">공방 둘러보기</a>`
    ],
    [
      `<button class="w-16 h-16 rounded-full bg-primary shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95 group">`,
      `<a href="/community/new" class="w-16 h-16 rounded-full bg-primary shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95 group">`
    ],
    ['</button>\n<span class="absolute right-full mr-4 px-4 py-2 bg-on-surface text-surface text-[10px] font-label uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">이야기 공유하기</span>', '</a>\n<span class="absolute right-full mr-4 px-4 py-2 bg-on-surface text-surface text-[10px] font-label uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">글쓰기</span>']
  ],
  'community-new': [],
  'community-post-detail': [],
  login: [],
  onboarding: [],
  account: []
};

const authStyleBlock = `
<style>
        [data-auth-member] {
            display: none;
        }
        body.is-logged-in [data-auth-guest] {
            display: none !important;
        }
        body.is-logged-in [data-auth-member] {
            display: inline-flex !important;
        }
    </style>`;

const authBootstrapBlock = `
<script>
(() => {
  const body = document.body;
  if (!body) return;

  const params = new URLSearchParams(window.location.search);
  const pageNext = params.get('next');
  const safePath = (value, fallback = '/') => {
    if (!value || typeof value !== 'string') return fallback;
    const trimmed = value.trim();
    if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('\\\\')) {
      return fallback;
    }
    return trimmed;
  };

  const currentPath = safePath(
    window.location.pathname + window.location.search + window.location.hash,
    '/'
  );
  const loginTarget = body.hasAttribute('data-login-page')
    ? safePath(pageNext, '/')
    : currentPath;
  const loginHref = '/login?next=' + encodeURIComponent(loginTarget);

  document.querySelectorAll('[data-auth-guest]').forEach((node) => {
    if (node instanceof HTMLAnchorElement) {
      node.href = loginHref;
    }
  });

  const applyAuthState = (payload) => {
    const authenticated = Boolean(payload && payload.authenticated);
    body.classList.toggle('is-logged-in', authenticated);

    if (authenticated && payload.user) {
      document.querySelectorAll('[data-auth-member]').forEach((node) => {
        if (node instanceof HTMLAnchorElement) {
          node.href = payload.user.accountPath || '/account';
        }
      });

      document.querySelectorAll('[data-auth-display-name]').forEach((node) => {
        node.textContent = payload.user.displayName || '메이커';
      });
    }

    window.dispatchEvent(new CustomEvent('auth:resolved', { detail: payload || { authenticated: false } }));
  };

  const redirect = (path) => {
    const nextPath = safePath(path, '/');
    if (window.location.pathname + window.location.search !== nextPath) {
      window.location.replace(nextPath);
    }
  };

  fetch('/api/auth/me', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    credentials: 'same-origin',
    cache: 'no-store'
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('auth_check_failed');
      }
      return response.json();
    })
    .then((payload) => {
      applyAuthState(payload);

      if (!payload || !payload.authenticated) {
        if (body.dataset.authRequired === 'true') {
          redirect('/login?error=auth_required&next=' + encodeURIComponent(currentPath));
        }
        return;
      }

      if (body.dataset.authRequired === 'true' && payload.user && payload.user.requiresOnboarding) {
        redirect('/onboarding?next=' + encodeURIComponent(currentPath));
        return;
      }

      if (body.hasAttribute('data-login-page')) {
        const next = safePath(pageNext, '/');
        redirect(payload.user && payload.user.requiresOnboarding
          ? '/onboarding?next=' + encodeURIComponent(next)
          : next);
        return;
      }

      if (body.hasAttribute('data-onboarding-page') && payload.user && !payload.user.requiresOnboarding) {
        redirect('/account');
        return;
      }

      if (body.hasAttribute('data-account-page') && payload.user && payload.user.requiresOnboarding) {
        redirect('/onboarding?next=' + encodeURIComponent('/account'));
      }
    })
    .catch(() => {
      applyAuthState({ authenticated: false });
      if (body.dataset.authRequired === 'true') {
        redirect('/login?error=auth_required&next=' + encodeURIComponent(currentPath));
      }
    });
})();
</script>`;

const studioFormEnhancerBlock = `
<script>
(() => {
  const form = document.querySelector('[data-studio-form]');
  if (!form) return;

  const message = document.querySelector('[data-studio-form-message]');
  const submitButton = form.querySelector('[data-studio-submit]');
  const submitButtonLabel = submitButton ? submitButton.textContent.trim() : '올리기';
  const fileInput = document.querySelector('[data-studio-image-input]');
  const uploadTriggers = Array.from(document.querySelectorAll('[data-studio-upload-trigger]'));
  const previewTarget = document.querySelector('[data-studio-preview-target]');
  const clearPreviewButton = document.querySelector('[data-studio-clear-preview]');
  const imageCountNodes = Array.from(document.querySelectorAll('[data-studio-image-count]'));
  const categoryInput = form.querySelector('[data-field="category"]');
  const categoryButtons = Array.from(form.querySelectorAll('[data-category-option]'));
  const customAmenityButton = form.querySelector('[data-custom-amenity]');
  const locationInput = form.querySelector('[data-field="location"]');
  const mapFrame = document.querySelector('[data-studio-map-frame]');
  const mapLabel = document.querySelector('[data-studio-map-label]');
  const layout = form.getAttribute('data-layout') || 'desktop';
  let selectedFiles = [];
  let mapTimer = null;

  const setMessage = (type, text) => {
    if (!message) return;
    if (!text) {
      message.hidden = true;
      message.textContent = '';
      return;
    }

    message.hidden = false;
    message.textContent = text;
    message.className = type === 'success'
      ? 'rounded-xl px-5 py-4 text-sm bg-[#eef6ed] text-[#295b2d] border border-[#cfe3cb]'
      : 'rounded-xl px-5 py-4 text-sm bg-[#fdf0ee] text-[#803321] border border-[#f0c8c2]';
  };

  const restorePreview = () => {
    if (!previewTarget) return;
    const fallbackSrc = previewTarget.getAttribute('data-fallback-src');
    if (fallbackSrc) {
      previewTarget.setAttribute('src', fallbackSrc);
    }
  };

  if (previewTarget && !previewTarget.getAttribute('data-fallback-src')) {
    previewTarget.setAttribute('data-fallback-src', previewTarget.getAttribute('src') || '');
  }

  const updateImageCount = () => {
    const text = selectedFiles.length
      ? '사진 ' + selectedFiles.length + '장'
      : '사진 없음';

    imageCountNodes.forEach((node) => {
      node.textContent = text;
    });

    if (clearPreviewButton) {
      clearPreviewButton.hidden = selectedFiles.length === 0;
    }
  };

  const updatePreview = () => {
    updateImageCount();

    if (!previewTarget) return;

    if (!selectedFiles.length) {
      restorePreview();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        previewTarget.setAttribute('src', reader.result);
      }
    };
    reader.readAsDataURL(selectedFiles[0]);
  };

  if (fileInput) {
    const openFilePicker = () => fileInput.click();

    uploadTriggers.forEach((trigger) => {
      trigger.addEventListener('click', openFilePicker);
      trigger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openFilePicker();
        }
      });
    });

    fileInput.addEventListener('change', () => {
      selectedFiles = Array.from(fileInput.files || []).slice(0, 10);
      updatePreview();
    });
  }

  if (clearPreviewButton) {
    clearPreviewButton.addEventListener('click', (event) => {
      event.preventDefault();
      selectedFiles = [];
      if (fileInput) fileInput.value = '';
      updatePreview();
    });
  }

  const setActiveCategory = (nextCategory) => {
    if (!nextCategory) return;

    categoryButtons.forEach((button) => {
      const isActive = (button.dataset.categoryOption || '') === nextCategory;
      button.classList.toggle('bg-secondary', isActive);
      button.classList.toggle('text-on-secondary', isActive);
      button.classList.toggle('bg-surface-container-high', !isActive);
      button.classList.toggle('text-on-surface-variant', !isActive);
    });

    if (categoryInput) {
      categoryInput.value = nextCategory;
    }
  };

  if (categoryButtons.length) {
    const initialCategory = (categoryInput && categoryInput.value) || categoryButtons[0].dataset.categoryOption || '';
    setActiveCategory(initialCategory);

    categoryButtons.forEach((button) => {
      button.addEventListener('click', () => {
        setActiveCategory(button.dataset.categoryOption || '');
      });
    });
  }

  if (customAmenityButton) {
    customAmenityButton.addEventListener('click', () => {
      const wrapper = document.createElement('div');
      wrapper.className =
        'flex items-center justify-between p-4 bg-surface-container-lowest rounded-md border border-outline-variant/10';
      wrapper.setAttribute('data-custom-amenity-row', '');
      wrapper.innerHTML =
        '<div class="flex items-center gap-3">' +
        '<span class="material-symbols-outlined text-secondary">electric_bolt</span>' +
        '<input class="min-w-0 flex-1 bg-transparent border-none p-0 text-sm font-medium focus:ring-0 placeholder:text-outline-variant/60" placeholder="직접 입력" type="text" />' +
        '</div>' +
        '<input checked class="rounded border-outline-variant text-secondary focus:ring-secondary/20" name="amenities" type="checkbox" value="" />';

      const textInput = wrapper.querySelector('input[type="text"]');
      const inputNode = wrapper.querySelector('input[name="amenities"]');

      if (textInput && inputNode) {
        const syncAmenityValue = () => {
          inputNode.value = textInput.value.trim();
        };

        textInput.addEventListener('input', syncAmenityValue);
        syncAmenityValue();
        window.setTimeout(() => textInput.focus(), 0);
      }

      customAmenityButton.before(wrapper);
    });
  }

  const valueOf = (field) => {
    const input = form.querySelector('[data-field="' + field + '"]');
    if (!input) return '';
    return (input.value || '').toString().trim();
  };

  const collectAmenities = () =>
    Array.from(form.querySelectorAll('input[name="amenities"]:checked'))
      .map((input) => input.value)
      .filter(Boolean);

  const updateMapPreview = (query) => {
    if (!mapFrame) return;

    const trimmed = (query || '').trim();
    const fallbackQuery = mapFrame.getAttribute('data-default-query') || '서울';
    const activeQuery = trimmed || fallbackQuery;

    mapFrame.setAttribute(
      'src',
      'https://www.google.com/maps?q=' + encodeURIComponent(activeQuery) + '&z=15&output=embed'
    );

    if (mapLabel) {
      mapLabel.textContent = trimmed
        ? trimmed
        : fallbackQuery;
    }
  };

  if (locationInput) {
    updateMapPreview(locationInput.value || '');
    locationInput.addEventListener('input', () => {
      if (mapTimer) {
        window.clearTimeout(mapTimer);
      }

      mapTimer = window.setTimeout(() => {
        updateMapPreview(locationInput.value || '');
      }, 250);
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      name: valueOf('name'),
      location: valueOf('location'),
      description: valueOf('description'),
      price: valueOf('price'),
      contact: valueOf('contact'),
      category: valueOf('category') || '주얼리 공방',
      capacity: valueOf('capacity'),
      amenities: collectAmenities(),
      imageNames: selectedFiles.map((file) => file.name),
      imageCount: selectedFiles.length,
      platform: layout
    };

    const missing = [];
    if (!payload.name) missing.push('공방 이름');
    if (!payload.location) missing.push('위치');
    if (!payload.description) missing.push('소개');
    if (!payload.price) missing.push(layout === 'mobile' ? '시간당 가격' : '일일 대여료');
    if (!payload.contact) missing.push('연락처');

    if (missing.length) {
      setMessage('error', '빈칸을 채워주세요.');
      return;
    }

    try {
      setMessage('', '');

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute('aria-busy', 'true');
        submitButton.textContent = '올리는 중...';
      }

      const response = await fetch('/api/studios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login?error=auth_required&next=' + encodeURIComponent(window.location.pathname);
          return;
        }
        if (response.status === 403) {
          window.location.href = '/onboarding?next=' + encodeURIComponent(window.location.pathname);
          return;
        }
        throw new Error(result.message || '잠시 후 다시 시도해 주세요.');
      }

      const createdName = result && result.data && result.data.name ? result.data.name : payload.name;
      const detailPath = result && result.data && result.data.detailPath ? result.data.detailPath : '/market';
      setMessage('success', createdName + ' 공방을 올렸어요.');
      form.reset();
      selectedFiles = [];

      if (fileInput) {
        fileInput.value = '';
      }

      restorePreview();
      updateImageCount();

      if (categoryButtons.length) {
        setActiveCategory(categoryButtons[0].dataset.categoryOption || '');
      }

      form.querySelectorAll('[data-custom-amenity-row]').forEach((row) => row.remove());
      window.setTimeout(() => {
        window.location.href = detailPath;
      }, 300);
    } catch (error) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? error.message
          : '잠시 후 다시 시도해 주세요.';
      setMessage('error', errorMessage);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
        submitButton.textContent = submitButtonLabel;
      }
    }
  });

  updateImageCount();
})();
</script>`;

const messageBadgeEnhancerBlock = `
<script>
(() => {
  const badges = Array.from(document.querySelectorAll('[data-message-unread-badge]'));
  if (!badges.length) return;

  let pollTimer = null;
  let authenticated = false;

  const setBadgeCount = (count) => {
    badges.forEach((badge) => {
      if (!(badge instanceof HTMLElement)) return;
      if (!count || count < 1) {
        badge.hidden = true;
        badge.textContent = '';
        badge.classList.add('hidden');
        return;
      }

      badge.hidden = false;
      badge.textContent = count > 99 ? '99+' : String(count);
      badge.classList.remove('hidden');
      badge.classList.add('inline-flex');
    });
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/conversations/unread-count', {
        method: 'GET',
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store'
      });

      if (!response.ok) {
        setBadgeCount(0);
        return;
      }

      const result = await response.json().catch(() => ({}));
      const count = result && result.data && typeof result.data.count === 'number' ? result.data.count : 0;
      setBadgeCount(count);
    } catch {
      setBadgeCount(0);
    }
  };

  window.addEventListener('auth:resolved', (event) => {
    const detail = event.detail || {};
    authenticated = Boolean(detail.authenticated);
    if (pollTimer) {
      window.clearInterval(pollTimer);
      pollTimer = null;
    }

    if (!authenticated) {
      setBadgeCount(0);
      return;
    }

    fetchUnreadCount();
    pollTimer = window.setInterval(fetchUnreadCount, 20000);
  });

  window.addEventListener('messages:updated', () => {
    if (!authenticated) return;
    fetchUnreadCount();
  });
})();
</script>`;

const communityPostComposerBlock = `
<script>
(() => {
  const form = document.querySelector('[data-community-form]');
  if (!form) return;

  const message = form.querySelector('[data-form-message]');
  const submitButton = form.querySelector('[data-submit]');
  const submitLabel = submitButton ? submitButton.textContent.trim() : '올리기';
  const fileInput = form.querySelector('[data-image-input]');
  const uploadTrigger = form.querySelector('[data-upload-trigger]');
  const imageCount = form.querySelector('[data-image-count]');
  const titleInput = form.querySelector('[data-field="title"]');
  const bodyInput = form.querySelector('[data-field="body"]');
  const submitUrl = form.getAttribute('data-submit-url') || '/api/community/posts';
  const submitMethod = (form.getAttribute('data-submit-method') || 'POST').toUpperCase();
  const successPath = form.getAttribute('data-success-path') || '/community';
  const successMessage = form.getAttribute('data-success-message') || '글을 남겼어요.';
  let selectedFiles = [];

  const setMessage = (type, text) => {
    if (!message) return;
    if (!text) {
      message.hidden = true;
      message.textContent = '';
      return;
    }

    message.hidden = false;
    message.textContent = text;
    message.className = type === 'success'
      ? 'w-full rounded-xl px-5 py-4 text-sm bg-[#eef6ed] text-[#295b2d] border border-[#cfe3cb]'
      : 'w-full rounded-xl px-5 py-4 text-sm bg-[#fdf0ee] text-[#803321] border border-[#f0c8c2]';
  };

  const updateImageCount = () => {
    if (!imageCount) return;
    imageCount.textContent = selectedFiles.length
      ? '이미지 ' + selectedFiles.length + '장'
      : '이미지 없음';
  };

  if (fileInput && uploadTrigger) {
    const openFilePicker = () => fileInput.click();
    uploadTrigger.addEventListener('click', openFilePicker);
    uploadTrigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openFilePicker();
      }
    });

    fileInput.addEventListener('change', () => {
      selectedFiles = Array.from(fileInput.files || []).slice(0, 10);
      updateImageCount();
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const categoryInput = form.querySelector('input[name="category"]:checked');
    const payload = {
      body: bodyInput ? bodyInput.value.trim() : '',
      category: categoryInput ? categoryInput.value : '',
      imageNames: selectedFiles.map((file) => file.name),
      title: titleInput ? titleInput.value.trim() : ''
    };

    if (!payload.category || !payload.title || !payload.body) {
      setMessage('error', '빈칸을 채워주세요.');
      return;
    }

    try {
      setMessage('', '');

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = '저장 중...';
      }

      const response = await fetch(submitUrl, {
        method: submitMethod,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login?error=auth_required&next=' + encodeURIComponent(window.location.pathname);
          return;
        }
        if (response.status === 403) {
          window.location.href = '/onboarding?next=' + encodeURIComponent(window.location.pathname);
          return;
        }
        const fieldErrors = result && typeof result === 'object' ? result.fieldErrors : null;
        const firstFieldError =
          fieldErrors && typeof fieldErrors === 'object'
            ? Object.values(fieldErrors).find((value) => typeof value === 'string' && value.trim())
            : '';
        throw new Error(firstFieldError || result.message || '잠시 후 다시 시도해 주세요.');
      }

      setMessage('success', successMessage);
      window.setTimeout(() => {
        window.location.href = result && result.data && result.data.detailPath
          ? result.data.detailPath
          : successPath;
      }, 300);
    } catch (error) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? error.message
          : '잠시 후 다시 시도해 주세요.';
      setMessage('error', errorMessage);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitLabel;
      }
    }
  });

  updateImageCount();
})();
</script>`;

const communityCommentComposerBlock = `
<script>
(() => {
  const form = document.querySelector('[data-comment-form]');

  if (!form) {
    return;
  }

  const bodyInput = form.querySelector('[data-comment-body]');
  const submitButton = form.querySelector('[data-comment-submit]');
  const message = form.querySelector('[data-comment-message]');
  const postId = form.getAttribute('data-post-id');
  const submitLabel = submitButton ? submitButton.textContent : '남기기';

  const setMessage = (type, text) => {
    if (!message) return;

    if (!text) {
      message.hidden = true;
      message.textContent = '';
      message.className = 'hidden rounded-xl border px-4 py-3 text-sm';
      return;
    }

    message.hidden = false;
    message.textContent = text;
    message.className = type === 'success'
      ? 'rounded-xl border px-4 py-3 text-sm bg-[#eef6ed] text-[#295b2d] border-[#cfe3cb]'
      : 'rounded-xl border px-4 py-3 text-sm bg-[#fdf0ee] text-[#803321] border-[#f0c8c2]';
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      body: bodyInput ? bodyInput.value.trim() : ''
    };

    if (!payload.body) {
      setMessage('error', '댓글을 적어주세요.');
      return;
    }

    if (!postId) {
      setMessage('error', '다시 시도해 주세요.');
      return;
    }

    try {
      setMessage('', '');

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = '남기는 중...';
      }

      const response = await fetch('/api/community/posts/' + encodeURIComponent(postId) + '/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login?error=auth_required&next=' + encodeURIComponent(window.location.pathname);
          return;
        }
        if (response.status === 403) {
          window.location.href = '/onboarding?next=' + encodeURIComponent(window.location.pathname);
          return;
        }
        const fieldErrors = result && typeof result === 'object' ? result.fieldErrors : null;
        const firstFieldError =
          fieldErrors && typeof fieldErrors === 'object'
            ? Object.values(fieldErrors).find((value) => typeof value === 'string' && value.trim())
            : '';
        throw new Error(firstFieldError || result.message || '잠시 후 다시 시도해 주세요.');
      }

      setMessage('success', '댓글을 남겼어요.');
      window.setTimeout(() => window.location.reload(), 250);
    } catch (error) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? error.message
          : '잠시 후 다시 시도해 주세요.';
      setMessage('error', errorMessage);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitLabel;
      }
    }
  });
})();
</script>`;

const communityPostOwnerActionsBlock = `
<script>
(() => {
  const deleteButton = document.querySelector('[data-post-delete]');
  if (!deleteButton) return;

  const message = document.querySelector('[data-post-action-message]');
  const postId = deleteButton.getAttribute('data-post-id');
  const defaultLabel = deleteButton.textContent ? deleteButton.textContent.trim() : '삭제';

  const setMessage = (type, text) => {
    if (!message) return;
    if (!text) {
      message.hidden = true;
      message.textContent = '';
      message.className = 'hidden mt-3 rounded-xl border px-4 py-3 text-sm';
      return;
    }

    message.hidden = false;
    message.textContent = text;
    message.className = type === 'success'
      ? 'mt-3 rounded-xl border px-4 py-3 text-sm bg-[#eef6ed] text-[#295b2d] border-[#cfe3cb]'
      : 'mt-3 rounded-xl border px-4 py-3 text-sm bg-[#fdf0ee] text-[#803321] border-[#f0c8c2]';
  };

  deleteButton.addEventListener('click', async () => {
    if (!postId) {
      setMessage('error', '다시 시도해 주세요.');
      return;
    }

    const confirmed = window.confirm('이 글을 지울까요?');
    if (!confirmed) return;

    try {
      setMessage('', '');
      deleteButton.disabled = true;
      deleteButton.textContent = '지우는 중...';

      const response = await fetch('/api/community/posts/' + encodeURIComponent(postId), {
        method: 'DELETE',
        headers: {
          Accept: 'application/json'
        },
        credentials: 'same-origin'
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login?error=auth_required&next=' + encodeURIComponent(window.location.pathname);
          return;
        }
        throw new Error(result.message || '잠시 후 다시 시도해 주세요.');
      }

      setMessage('success', '글을 지웠어요.');
      window.setTimeout(() => {
        window.location.href = '/community';
      }, 250);
    } catch (error) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? error.message
          : '잠시 후 다시 시도해 주세요.';
      setMessage('error', errorMessage);
    } finally {
      deleteButton.disabled = false;
      deleteButton.textContent = defaultLabel;
    }
  });
})();
</script>`;

const messagesInboxEnhancerBlock = `
<script>
(() => {
  const page = document.querySelector('[data-messages-page]');
  if (!page) return;

  const list = page.querySelector('[data-inbox-list]');
  const emptyState = page.querySelector('[data-inbox-empty]');
  const message = document.querySelector('[data-inbox-message]');
  const params = new URLSearchParams(window.location.search);
  const startWorkshop = params.get('start');
  const focusWorkshop = params.get('workshop');
  let starting = false;
  let pollingTimer = null;
  let focusHandled = false;

  const setMessage = (type, text) => {
    if (!message) return;
    if (!text) {
      message.hidden = true;
      message.textContent = '';
      message.className = 'hidden mb-4 rounded-2xl border px-5 py-4 text-sm';
      return;
    }

    message.hidden = false;
    message.textContent = text;
    message.className = type === 'success'
      ? 'mb-4 rounded-2xl border border-[#d7e7d8] bg-[#f1f7f2] px-5 py-4 text-sm text-[#2f5a35]'
      : 'mb-4 rounded-2xl border border-[#f0d4cd] bg-[#fff4f1] px-5 py-4 text-sm text-[#8a3827]';
  };

  const escapeHtml = (value) =>
    String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');

  const renderItem = (item) => {
    const unreadBadge = item.unreadCount > 0
      ? '<span class="inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-2 py-1 text-[11px] font-semibold leading-none text-white">' + (item.unreadCount > 99 ? '99+' : String(item.unreadCount)) + '</span>'
      : '';
    const previewClass = item.unreadCount > 0 ? 'text-on-surface font-medium' : 'text-on-surface-variant';
    const image = item.imageUrl
      ? '<img alt="' + escapeHtml(item.workshopName) + '" class="h-full w-full object-cover" src="' + escapeHtml(item.imageUrl) + '"/>'
      : '<div class="flex h-full w-full items-center justify-center text-outline"><span class="material-symbols-outlined">forum</span></div>';

    return (
      '<a class="group flex items-center gap-4 rounded-[1.6rem] border border-outline-variant/15 bg-surface-container-lowest px-4 py-4 transition-all hover:border-primary/20 hover:shadow-[0_16px_40px_rgba(26,28,27,0.05)]" data-conversation-item="" data-workshop-slug="' +
      escapeHtml(item.workshopSlug) +
      '" href="' +
      escapeHtml(item.detailPath) +
      '">' +
      '<div class="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface-container-low">' +
      image +
      '</div>' +
      '<div class="min-w-0 flex-1">' +
      '<div class="flex items-center justify-between gap-3">' +
      '<div class="min-w-0 flex items-center gap-2">' +
      '<h2 class="truncate text-base font-medium text-on-surface">' +
      escapeHtml(item.workshopName) +
      '</h2>' +
      unreadBadge +
      '</div>' +
      '<span class="shrink-0 text-xs text-outline">' +
      escapeHtml(item.timestamp) +
      '</span>' +
      '</div>' +
      '<p class="mt-1 truncate text-sm ' +
      previewClass +
      '">' +
      escapeHtml(item.lastMessagePreview) +
      '</p>' +
      '</div>' +
      '</a>'
    );
  };

  const syncList = (items) => {
    if (list) {
      list.innerHTML = items.map(renderItem).join('');
    }

    if (emptyState instanceof HTMLElement) {
      emptyState.hidden = items.length > 0;
      emptyState.classList.toggle('hidden', items.length > 0);
    }

    window.dispatchEvent(new CustomEvent('messages:updated'));
  };

  const fetchConversations = async () => {
    const response = await fetch('/api/conversations', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
      cache: 'no-store'
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login?error=auth_required&next=' + encodeURIComponent(window.location.pathname + window.location.search);
        return [];
      }
      if (response.status === 403) {
        window.location.href = '/onboarding?next=' + encodeURIComponent(window.location.pathname + window.location.search);
        return [];
      }
      throw new Error(result.message || '잠시 후 다시 시도해 주세요.');
    }

    return result && result.data && Array.isArray(result.data.items) ? result.data.items : [];
  };

  const openConversation = async (workshopSlug) => {
    if (!workshopSlug || starting) return;
    starting = true;

    try {
      setMessage('', '');

      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({ workshopSlug })
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login?error=auth_required&next=' + encodeURIComponent(window.location.pathname + window.location.search);
          return;
        }
        if (response.status === 403) {
          window.location.href = '/onboarding?next=' + encodeURIComponent(window.location.pathname + window.location.search);
          return;
        }
        throw new Error(result.message || '잠시 후 다시 시도해 주세요.');
      }

      window.location.replace(result && result.data && result.data.detailPath ? result.data.detailPath : '/messages');
    } catch (error) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? error.message
          : '잠시 후 다시 시도해 주세요.';
      setMessage('error', errorMessage);
      starting = false;
    }
  };

  const openLatestWorkshopConversation = async (workshopSlug) => {
    if (!workshopSlug || focusHandled) return;
    focusHandled = true;

    try {
      const items = await fetchConversations();
      syncList(items);
      const match = items.find((item) => item.workshopSlug === workshopSlug);
      if (match && match.detailPath) {
        window.location.replace(match.detailPath);
        return;
      }
      setMessage('error', '아직 이 공방의 대화가 없어요.');
    } catch (error) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? error.message
          : '잠시 후 다시 시도해 주세요.';
      setMessage('error', errorMessage);
    }
  };

  const beginPolling = () => {
    if (pollingTimer) {
      window.clearInterval(pollingTimer);
      pollingTimer = null;
    }

    const run = async () => {
      try {
        const items = await fetchConversations();
        syncList(items);
      } catch (error) {
        const errorMessage =
          error && typeof error === 'object' && 'message' in error
            ? error.message
            : '잠시 후 다시 시도해 주세요.';
        setMessage('error', errorMessage);
      }
    };

    run();
    pollingTimer = window.setInterval(run, 12000);
  };

  window.addEventListener('auth:resolved', (event) => {
    const detail = event.detail || {};
    if (pollingTimer) {
      window.clearInterval(pollingTimer);
      pollingTimer = null;
    }

    if (!detail.authenticated) return;

    if (startWorkshop) {
      openConversation(startWorkshop);
      return;
    }

    if (focusWorkshop) {
      openLatestWorkshopConversation(focusWorkshop);
    }

    beginPolling();
  });
})();
</script>`;

const messageRoomEnhancerBlock = `
<script>
(() => {
  const form = document.querySelector('[data-chat-form]');
  if (!form) return;

  const thread = document.querySelector('[data-chat-thread]');
  const input = form.querySelector('[data-chat-input]');
  const submitButton = form.querySelector('[data-chat-submit]');
  const message = form.querySelector('[data-chat-message]');
  const conversationId = form.getAttribute('data-conversation-id');
  const currentUserId = form.getAttribute('data-current-user-id') || '';
  const submitLabel = submitButton ? submitButton.textContent.trim() : '보내기';
  let isSending = false;
  let pollTimer = null;
  const knownMessageIds = new Set(
    Array.from(thread.querySelectorAll('[data-message-id]'))
      .map((node) => node.getAttribute('data-message-id'))
      .filter(Boolean)
  );

  const formatNow = () =>
    new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date());

  const setMessage = (type, text) => {
    if (!message) return;
    if (!text) {
      message.hidden = true;
      message.textContent = '';
      message.className = 'hidden mb-3 rounded-2xl border px-4 py-3 text-sm';
      return;
    }

    message.hidden = false;
    message.textContent = text;
    message.className = type === 'success'
      ? 'mb-3 rounded-2xl border border-[#d7e7d8] bg-[#f1f7f2] px-4 py-3 text-sm text-[#2f5a35]'
      : 'mb-3 rounded-2xl border border-[#f0d4cd] bg-[#fff4f1] px-4 py-3 text-sm text-[#8a3827]';
  };

  const scrollToBottom = () => {
    if (!thread) return;
    thread.scrollTop = thread.scrollHeight;
  };

  const isNearBottom = () => {
    if (!thread) return true;
    return thread.scrollHeight - thread.scrollTop - thread.clientHeight < 120;
  };

  const buildBubble = (messageId, senderId, content, timestamp) => {
    const isMine = senderId === currentUserId;
    const wrapper = document.createElement('div');
    wrapper.className = isMine ? 'flex justify-end' : 'flex justify-start';
    wrapper.setAttribute('data-chat-item', '');
    if (messageId) {
      wrapper.setAttribute('data-message-id', messageId);
    }
    wrapper.setAttribute('data-sender-id', senderId);

    const container = document.createElement('div');
    const bubble = document.createElement('div');
    bubble.className = isMine
      ? 'max-w-[78%] whitespace-pre-wrap rounded-[1.5rem] rounded-br-md bg-primary px-4 py-3 text-sm leading-6 text-white shadow-[0_12px_30px_rgba(115,92,0,0.16)]'
      : 'max-w-[78%] whitespace-pre-wrap rounded-[1.5rem] rounded-bl-md bg-white px-4 py-3 text-sm leading-6 text-on-surface shadow-[0_10px_24px_rgba(26,28,27,0.06)]';
    bubble.textContent = content;

    const meta = document.createElement('div');
    meta.className = isMine
      ? 'mt-1 text-right text-[11px] text-white/75'
      : 'mt-1 text-left text-[11px] text-outline';
    meta.textContent = timestamp;

    container.appendChild(bubble);
    container.appendChild(meta);
    wrapper.appendChild(container);
    return wrapper;
  };

  const appendMessage = (messageItem, forceScroll = false) => {
    if (!thread || !messageItem || !messageItem.id || knownMessageIds.has(messageItem.id)) {
      return false;
    }

    const shouldStick = forceScroll || isNearBottom();
    thread.querySelectorAll('[data-empty-chat]').forEach((node) => node.remove());
    thread.appendChild(
      buildBubble(
        messageItem.id,
        messageItem.senderId || '',
        messageItem.content || '',
        messageItem.timestamp || formatNow()
      )
    );
    knownMessageIds.add(messageItem.id);
    if (shouldStick) {
      scrollToBottom();
    }
    return true;
  };

  const syncMessages = async () => {
    if (!conversationId || isSending) return;

    try {
      const response = await fetch('/api/conversations/' + encodeURIComponent(conversationId) + '/messages', {
        method: 'GET',
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store'
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login?error=auth_required&next=' + encodeURIComponent(window.location.pathname);
          return;
        }
        if (response.status === 403) {
          window.location.href = '/onboarding?next=' + encodeURIComponent(window.location.pathname);
          return;
        }
        if (response.status === 404) {
          window.location.href = '/messages';
          return;
        }
        throw new Error(result.message || '잠시 후 다시 시도해 주세요.');
      }

      const items = result && result.data && Array.isArray(result.data.messages) ? result.data.messages : [];
      let appended = false;
      items.forEach((item) => {
        if (appendMessage(item)) {
          appended = true;
        }
      });

      if (appended) {
        window.dispatchEvent(new CustomEvent('messages:updated'));
      }
    } catch (error) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? error.message
          : '';
      if (errorMessage) {
        setMessage('error', errorMessage);
      }
    }
  };

  const startPolling = () => {
    if (pollTimer) {
      window.clearInterval(pollTimer);
    }
    pollTimer = window.setInterval(syncMessages, 5000);
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!input || !conversationId) {
      setMessage('error', '잠시 후 다시 시도해 주세요.');
      return;
    }

    const content = input.value.trim();
    if (!content) {
      setMessage('error', '메시지를 적어주세요.');
      return;
    }

    const optimisticBubble = buildBubble(
      'optimistic-' + Date.now(),
      currentUserId,
      content,
      formatNow()
    );
    thread.querySelectorAll('[data-empty-chat]').forEach((node) => node.remove());
    thread.appendChild(optimisticBubble);
    input.value = '';
    scrollToBottom();

    try {
      isSending = true;
      setMessage('', '');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = '보내는 중...';
      }

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          conversationId,
          content
        })
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login?error=auth_required&next=' + encodeURIComponent(window.location.pathname);
          return;
        }
        if (response.status === 403) {
          window.location.href = '/onboarding?next=' + encodeURIComponent(window.location.pathname);
          return;
        }
        const fieldErrors = result && typeof result === 'object' ? result.fieldErrors : null;
        const firstFieldError =
          fieldErrors && typeof fieldErrors === 'object'
            ? Object.values(fieldErrors).find((value) => typeof value === 'string' && value.trim())
            : '';
        throw new Error(firstFieldError || result.message || '잠시 후 다시 시도해 주세요.');
      }

      if (result && result.data) {
        optimisticBubble.setAttribute('data-message-id', result.data.id || '');
        knownMessageIds.add(result.data.id);
        const timestampNode = optimisticBubble.querySelector('div:last-child');
        if (timestampNode && result.data.timestamp) {
          timestampNode.textContent = result.data.timestamp;
        }
      }

      window.dispatchEvent(new CustomEvent('messages:updated'));
      scrollToBottom();
    } catch (error) {
      optimisticBubble.remove();
      input.value = content;
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? error.message
          : '잠시 후 다시 시도해 주세요.';
      setMessage('error', errorMessage);
    } finally {
      isSending = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitLabel;
      }
    }
  });

  if (input) {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
      }
    });
  }

  scrollToBottom();
  window.dispatchEvent(new CustomEvent('messages:updated'));
  startPolling();
})();
</script>`;

const onboardingEnhancerBlock = `
<script>
(() => {
  const form = document.querySelector('[data-onboarding-form]');
  if (!form) return;

  const submitButton = form.querySelector('[data-onboarding-submit]');
  const submitLabel = submitButton ? submitButton.textContent.trim() : '저장하기';
  const message = document.querySelector('[data-onboarding-message]');
  const displayNameInput = form.querySelector('[name="displayName"]');

  const setMessage = (type, text) => {
    if (!message) return;
    if (!text) {
      message.hidden = true;
      message.textContent = '';
      return;
    }
    message.hidden = false;
    message.textContent = text;
    message.className = type === 'success'
      ? 'mt-5 rounded-2xl border border-[#d7e7d8] bg-[#f1f7f2] px-5 py-4 text-sm text-[#2f5a35]'
      : 'mt-5 rounded-2xl border border-[#f0d4cd] bg-[#fff4f1] px-5 py-4 text-sm text-[#8a3827]';
  };

  const safeNext = (value) => {
    if (!value || typeof value !== 'string') return '/';
    const trimmed = value.trim();
    if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('\\\\')) {
      return '/';
    }
    return trimmed;
  };

  window.addEventListener('auth:resolved', (event) => {
    const detail = event.detail || {};
    if (detail.authenticated && detail.user && displayNameInput && !displayNameInput.value) {
      displayNameInput.value = detail.user.displayName || '';
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      displayName: String(form.elements.displayName.value || '').trim(),
      activityField: String(form.elements.activityField.value || '').trim(),
      region: String(form.elements.region.value || '').trim(),
      marketingOptIn: Boolean(form.elements.marketingOptIn.checked),
      agreedTerms: Boolean(form.elements.agreedTerms.checked),
      agreedPrivacy: Boolean(form.elements.agreedPrivacy.checked)
    };

    if (!payload.displayName || !payload.activityField || !payload.region) {
      setMessage('error', '빈칸을 채워주세요.');
      return;
    }

    if (!payload.agreedTerms || !payload.agreedPrivacy) {
      setMessage('error', '필수 동의가 필요해요.');
      return;
    }

    try {
      setMessage('', '');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = '저장 중...';
      }

      const response = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || '저장하지 못했어요.');
      }

      setMessage('success', '저장했어요.');
      const next = safeNext(new URLSearchParams(window.location.search).get('next'));
      window.setTimeout(() => {
        window.location.replace(next || result.redirectTo || '/');
      }, 250);
    } catch (error) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? error.message
          : '저장하지 못했어요.';
      setMessage('error', errorMessage);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitLabel;
      }
    }
  });
})();
</script>`;

const accountEnhancerBlock = `
<script>
(() => {
  const message = document.querySelector('[data-account-message]');
  const logoutButton = document.querySelector('[data-account-logout]');
  const deleteButton = document.querySelector('[data-account-delete]');

  const fields = {
    name: document.querySelector('[data-account-name]'),
    status: document.querySelector('[data-account-status]'),
    role: document.querySelector('[data-account-role]'),
    onboarding: document.querySelector('[data-account-onboarding]')
  };

  const setMessage = (type, text) => {
    if (!message) return;
    if (!text) {
      message.hidden = true;
      message.textContent = '';
      return;
    }
    message.hidden = false;
    message.textContent = text;
    message.className = type === 'success'
      ? 'mt-5 rounded-2xl border border-[#d7e7d8] bg-[#f1f7f2] px-5 py-4 text-sm text-[#2f5a35]'
      : 'mt-5 rounded-2xl border border-[#f0d4cd] bg-[#fff4f1] px-5 py-4 text-sm text-[#8a3827]';
  };

  const renderUser = (user) => {
    if (!user) return;
    const statusLabel = {
      ACTIVE: '이용 중',
      DELETED: '탈퇴',
      PENDING_PROFILE: '작성 전'
    }[user.status] || '-';
    const roleLabel = {
      ADMIN: '관리자',
      USER: '메이커'
    }[user.role] || '-';
    if (fields.name) fields.name.textContent = user.displayName || '메이커';
    if (fields.status) fields.status.textContent = statusLabel;
    if (fields.role) fields.role.textContent = roleLabel;
    if (fields.onboarding) fields.onboarding.textContent = user.onboardingCompleted ? '완료' : '미완료';
  };

  window.addEventListener('auth:resolved', (event) => {
    const detail = event.detail || {};
    if (detail.authenticated && detail.user) {
      renderUser(detail.user);
    }
  });

  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      try {
        setMessage('', '');
        logoutButton.disabled = true;
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Accept: 'application/json'
          },
          credentials: 'same-origin'
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.message || '잠시 후 다시 시도해 주세요.');
        }
        window.location.replace('/');
      } catch (error) {
        const errorMessage =
          error && typeof error === 'object' && 'message' in error
            ? error.message
            : '잠시 후 다시 시도해 주세요.';
        setMessage('error', errorMessage);
      } finally {
        logoutButton.disabled = false;
      }
    });
  }

  if (deleteButton) {
    deleteButton.addEventListener('click', async () => {
      const confirmed = window.confirm('계정을 정리할까요?');
      if (!confirmed) return;

      try {
        setMessage('', '');
        deleteButton.disabled = true;
        const response = await fetch('/api/auth/account', {
          method: 'DELETE',
          headers: {
            Accept: 'application/json'
          },
          credentials: 'same-origin'
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.message || '잠시 후 다시 시도해 주세요.');
        }
        window.location.replace('/login?message=account_deleted');
      } catch (error) {
        const errorMessage =
          error && typeof error === 'object' && 'message' in error
            ? error.message
            : '잠시 후 다시 시도해 주세요.';
        setMessage('error', errorMessage);
      } finally {
        deleteButton.disabled = false;
      }
    });
  }
})();
</script>`;

function getActiveSection(template: TemplateName): ActiveSection {
  if (
    template === 'community' ||
    template === 'community-new' ||
    template === 'community-post-detail'
  ) {
    return 'community';
  }

  if (
    template === 'market' ||
    template === 'market-new' ||
    template === 'market-detail' ||
    template === 'market-registration-mobile'
  ) {
    return 'market';
  }

  return 'none';
}

function navLinkClasses(active: boolean, mobile = false) {
  if (active) {
    return mobile
      ? 'text-[#735c00] dark:text-[#d4af37] border-b border-[#735c00] dark:border-[#d4af37] pb-1 font-medium text-[11px] tracking-[0.18em] uppercase'
      : 'font-sans text-xs uppercase tracking-widest text-[#735c00] dark:text-[#d4af37] border-b border-[#d4af37] pb-1';
  }

  return mobile
    ? 'text-[#1a1c1b] dark:text-[#faf9f7] opacity-70 hover:opacity-100 transition-opacity hover:text-[#735c00] dark:hover:text-[#d4af37] font-medium text-[11px] tracking-[0.18em] uppercase'
    : 'font-sans text-xs uppercase tracking-widest text-[#1a1c1b] dark:text-[#faf9f7] opacity-60 hover:opacity-100 transition-opacity';
}

function sharedHeader(active: ActiveSection) {
  const communityActive = active === 'community';
  const marketActive = active === 'market';

  return `
<header class="fixed top-0 w-full z-50 bg-[#faf9f7] dark:bg-[#1a1c1b] opacity-80 backdrop-blur-xl">
<div class="flex justify-between items-center px-10 py-6 max-w-[1440px] mx-auto w-full">
<a class="font-serif text-2xl tracking-tighter text-[#1a1c1b] dark:text-[#faf9f7]" href="/">은금슬쩍</a>
<nav class="flex md:hidden items-center gap-5">
<a class="${navLinkClasses(communityActive, true)}" href="/community">커뮤니티</a>
<a class="${navLinkClasses(marketActive, true)}" href="/market">공방 공유</a>
</nav>
<div class="md:hidden flex items-center gap-3">
<a class="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-outline/30 text-[#1a1c1b] dark:text-[#faf9f7]" data-message-nav-link="" href="/messages">
<span class="material-symbols-outlined" data-icon="forum">forum</span>
<span class="absolute -right-1 -top-1 hidden min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white" data-message-unread-badge=""></span>
</a>
<a class="inline-flex items-center justify-center px-4 py-2 rounded-full border border-outline text-[10px] font-label tracking-[0.18em] uppercase text-on-surface whitespace-nowrap" data-auth-guest="" href="/login">로그인</a>
<a class="items-center justify-center px-4 py-2 rounded-full border border-primary bg-primary text-[10px] font-label tracking-[0.18em] uppercase text-white whitespace-nowrap" data-auth-member="" href="#">마이페이지</a>
</div>
<nav class="hidden md:flex gap-12">
<a class="${navLinkClasses(communityActive)}" href="/community">커뮤니티</a>
<a class="${navLinkClasses(marketActive)}" href="/market">공방 공유</a>
</nav>
<div class="hidden md:flex items-center gap-4">
<a class="inline-flex items-center justify-center px-4 py-2 rounded-full border border-outline text-[10px] font-label tracking-[0.18em] uppercase text-on-surface whitespace-nowrap" data-auth-guest="" href="/login">로그인</a>
<a class="items-center justify-center px-4 py-2 rounded-full border border-primary bg-primary text-[10px] font-label tracking-[0.18em] uppercase text-white whitespace-nowrap" data-auth-member="" href="/account">마이페이지</a>
<button class="text-[#1a1c1b] dark:text-[#faf9f7] hover:scale-95 duration-200 ease-in-out">
<span class="material-symbols-outlined" data-icon="search">search</span>
</button>
<a class="relative text-[#1a1c1b] dark:text-[#faf9f7] hover:scale-95 duration-200 ease-in-out" data-message-nav-link="" href="/messages">
<span class="material-symbols-outlined" data-icon="forum">forum</span>
<span class="absolute -right-2 -top-2 hidden min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white" data-message-unread-badge=""></span>
</a>
</div>
</div>
<div class="bg-[#f4f3f1] dark:bg-[#2a2c2b] h-[1px] w-full"></div>
</header>`;
}

function sharedFooter() {
  return `
<footer class="w-full border-t border-[#d0c5af]/20 bg-[#f4f3f1] dark:bg-[#121413]">
<div class="flex flex-col md:flex-row justify-between items-center px-6 md:px-20 py-16 w-full mt-20 gap-8">
<div class="flex flex-col items-center md:items-start gap-4">
<div class="font-serif text-lg text-[#1a1c1b] dark:text-[#faf9f7]">은금슬쩍</div>
</div>
<div class="flex gap-10">
<a class="font-sans text-[10px] tracking-[0.2em] uppercase text-[#7f7663] hover:text-[#1a1c1b] dark:hover:text-white underline decoration-[#d4af37] underline-offset-4 transition-all duration-500" href="/community">커뮤니티</a>
<a class="font-sans text-[10px] tracking-[0.2em] uppercase text-[#7f7663] hover:text-[#1a1c1b] dark:hover:text-white underline decoration-[#d4af37] underline-offset-4 transition-all duration-500" href="/market">공방 공유</a>
<a class="font-sans text-[10px] tracking-[0.2em] uppercase text-[#7f7663] hover:text-[#1a1c1b] dark:hover:text-white underline decoration-[#d4af37] underline-offset-4 transition-all duration-500" data-auth-guest="" href="/login">로그인</a>
<a class="font-sans text-[10px] tracking-[0.2em] uppercase text-[#7f7663] hover:text-[#1a1c1b] dark:hover:text-white underline decoration-[#d4af37] underline-offset-4 transition-all duration-500" data-auth-member="" href="/account">마이페이지</a>
</div>
<div class="font-sans text-[10px] tracking-[0.2em] uppercase text-[#7f7663]">© 2026 은금슬쩍.</div>
</div>
</footer>`;
}

function ensureAuthStyles(html: string) {
  if (html.includes('[data-auth-member]')) {
    return html;
  }

  return html.replace('</head>', `${authStyleBlock}\n</head>`);
}

function injectAuthBootstrap(html: string) {
  if (html.includes('auth:resolved')) {
    return html;
  }

  return html.replace('</body>', `${authBootstrapBlock}\n</body>`);
}

function injectMessageBadgeEnhancer(html: string) {
  if (!html.includes('data-message-unread-badge')) {
    return html;
  }

  if (html.includes('/api/conversations/unread-count')) {
    return html;
  }

  return html.replace('</body>', `${messageBadgeEnhancerBlock}\n</body>`);
}

function replaceFirstElement(
  html: string,
  marker: string,
  closingTag: string,
  replacement: string
) {
  const start = html.indexOf(marker);
  if (start === -1) {
    return html;
  }

  const end = html.indexOf(closingTag, start);
  if (end === -1) {
    return html;
  }

  return `${html.slice(0, start)}${replacement}${html.slice(end + closingTag.length)}`;
}

function replaceTopBar(html: string, replacement: string) {
  const headerStart = html.indexOf('<header class="fixed top-0');
  const navStart = html.indexOf('<nav class="fixed top-0');

  if (headerStart !== -1 && (navStart === -1 || headerStart < navStart)) {
    return replaceFirstElement(html, '<header class="fixed top-0', '</header>', replacement);
  }

  if (navStart !== -1) {
    return replaceFirstElement(html, '<nav class="fixed top-0', '</nav>', replacement);
  }

  const bodyStart = html.indexOf('<body');
  if (bodyStart === -1) {
    return html;
  }

  const bodyTagEnd = html.indexOf('>', bodyStart);
  if (bodyTagEnd === -1) {
    return html;
  }

  return `${html.slice(0, bodyTagEnd + 1)}\n${replacement}${html.slice(bodyTagEnd + 1)}`;
}

function replaceFooter(html: string, replacement: string) {
  const footerStart = html.indexOf('<footer');

  if (footerStart === -1) {
    return html.replace('</body>', `${replacement}\n</body>`);
  }

  return replaceFirstElement(html, '<footer', '</footer>', replacement);
}

function normalizeLayout(html: string, template: TemplateName) {
  const activeSection = getActiveSection(template);
  const withAuthStyles = ensureAuthStyles(html);
  const withSharedHeader = replaceTopBar(withAuthStyles, sharedHeader(activeSection));
  const withSharedFooter = replaceFooter(withSharedHeader, sharedFooter());
  return injectMessageBadgeEnhancer(injectAuthBootstrap(withSharedFooter));
}

function injectStudioFormEnhancer(html: string, template: TemplateName) {
  if (template !== 'market-new' && template !== 'market-registration-mobile') {
    return html;
  }

  if (html.includes('data-studio-form')) {
    return html.replace('</body>', `${studioFormEnhancerBlock}\n</body>`);
  }

  return html;
}

function injectCommunityComposer(html: string, template: TemplateName) {
  if (template !== 'community-new') {
    return html;
  }

  if (html.includes('data-community-form')) {
    return html.replace('</body>', `${communityPostComposerBlock}\n</body>`);
  }

  return html;
}

function injectCommunityCommentComposer(html: string, template: TemplateName) {
  if (template !== 'community-post-detail') {
    return html;
  }

  if (html.includes('data-comment-form')) {
    return html.replace(
      '</body>',
      `${communityCommentComposerBlock}\n${communityPostOwnerActionsBlock}\n</body>`
    );
  }

  return html;
}

function injectOnboardingEnhancer(html: string, template: TemplateName) {
  if (template !== 'onboarding') {
    return html;
  }

  if (html.includes('data-onboarding-form')) {
    return html.replace('</body>', `${onboardingEnhancerBlock}\n</body>`);
  }

  return html;
}

function injectAccountEnhancer(html: string, template: TemplateName) {
  if (template !== 'account') {
    return html;
  }

  if (html.includes('data-account-name')) {
    return html.replace('</body>', `${accountEnhancerBlock}\n</body>`);
  }

  return html;
}

function injectMessagesEnhancers(html: string, template: TemplateName) {
  if (template === 'messages') {
    return html.replace('</body>', `${messagesInboxEnhancerBlock}\n</body>`);
  }

  if (template === 'messages-room') {
    return html.replace('</body>', `${messageRoomEnhancerBlock}\n</body>`);
  }

  return html;
}

function applyReplacements(html: string, replacements: Array<[string, string]>): string {
  return replacements.reduce((result, [from, to]) => result.split(from).join(to), html);
}

export function finalizeStitchHtml(template: TemplateName, rawHtml: string) {
  const normalizedHtml = normalizeLayout(rawHtml, template);
  const withCommonLinks = applyReplacements(normalizedHtml, commonReplacements);
  const withPageReplacements = applyReplacements(withCommonLinks, pageReplacements[template]);
  const withStudioEnhancer = injectStudioFormEnhancer(withPageReplacements, template);
  const withCommunityComposer = injectCommunityComposer(withStudioEnhancer, template);
  const withCommunityComments = injectCommunityCommentComposer(withCommunityComposer, template);
  const withOnboarding = injectOnboardingEnhancer(withCommunityComments, template);
  const withAccount = injectAccountEnhancer(withOnboarding, template);
  return injectMessagesEnhancers(withAccount, template);
}

export function renderStitchHtml(template: TemplateName) {
  const filePath = join(process.cwd(), 'stitch', templateFiles[template]);
  const rawHtml = readFileSync(filePath, 'utf8');
  return finalizeStitchHtml(template, rawHtml);
}

export function stitchHtmlResponse(template: TemplateName) {
  return new Response(renderStitchHtml(template), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
