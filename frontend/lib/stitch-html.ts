import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type TemplateName =
  | 'home'
  | 'market'
  | 'market-new'
  | 'market-detail'
  | 'market-registration-mobile'
  | 'community'
  | 'community-new'
  | 'community-post-detail'
  | 'login';

type ActiveSection = 'none' | 'community' | 'market';

const templateFiles: Record<TemplateName, string> = {
  home: 'home.html',
  market: 'market.html',
  'market-new': 'market-new.html',
  'market-detail': 'market-detail.html',
  'market-registration-mobile': 'market-registration-mobile.html',
  community: 'community.html',
  'community-new': 'community-new.html',
  'community-post-detail': 'community-post-detail.html',
  login: 'login.html'
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
  community: [
    [
      `<button class="mt-6 flex items-center gap-2 text-primary font-label text-xs uppercase tracking-widest border-b border-primary/20 hover:border-primary transition-all pb-1">`,
      `<a href="/community/new" class="inline-flex items-center gap-2 mt-6 text-primary font-label text-xs uppercase tracking-widest border-b border-primary/20 hover:border-primary transition-all pb-1">`
    ],
    ['</button>\n</article>', '</a>\n</article>'],
    [
      `<button class="w-full mt-8 py-4 border border-outline/20 rounded-full font-label text-[10px] uppercase tracking-widest hover:bg-white transition-all">전체 상품 보기</button>`,
      `<a href="/market" class="inline-flex w-full items-center justify-center mt-8 py-4 border border-outline/20 rounded-full font-label text-[10px] uppercase tracking-widest hover:bg-white transition-all">전체 상품 보기</a>`
    ],
    [
      `<button class="px-10 py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-label text-[10px] uppercase tracking-widest hover:shadow-lg transition-all">마켓 구매하기</button>`,
      `<a href="/market" class="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-label text-[10px] uppercase tracking-widest hover:shadow-lg transition-all">마켓 구매하기</a>`
    ],
    [
      `<button class="w-16 h-16 rounded-full bg-primary shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95 group">`,
      `<a href="/community/new" class="w-16 h-16 rounded-full bg-primary shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95 group">`
    ],
    ['</button>\n<span class="absolute right-full mr-4 px-4 py-2 bg-on-surface text-surface text-[10px] font-label uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">이야기 공유하기</span>', '</a>\n<span class="absolute right-full mr-4 px-4 py-2 bg-on-surface text-surface text-[10px] font-label uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">이야기 공유하기</span>']
  ],
  'community-new': [],
  'community-post-detail': [],
  login: []
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

const studioFormEnhancerBlock = `
<script>
(() => {
  const form = document.querySelector('[data-studio-form]');
  if (!form) return;

  const message = document.querySelector('[data-studio-form-message]');
  const submitButton = form.querySelector('[data-studio-submit]');
  const submitButtonLabel = submitButton ? submitButton.textContent.trim() : '공방 등록하기';
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
      ? '선택한 사진 ' + selectedFiles.length + '장'
      : '사진을 아직 선택하지 않았어요.';

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
        '<input class="min-w-0 flex-1 bg-transparent border-none p-0 text-sm font-medium focus:ring-0 placeholder:text-outline-variant/60" placeholder="장비나 편의시설을 직접 입력해주세요" type="text" />' +
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
        ? trimmed + ' 위치 미리보기'
        : fallbackQuery + '을 기준으로 위치 미리보기를 표시합니다.';
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
      setMessage('error', missing.join(', ') + ' 항목을 입력해주세요.');
      return;
    }

    try {
      setMessage('', '');

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute('aria-busy', 'true');
        submitButton.textContent = '등록 중...';
      }

      const response = await fetch('/api/studios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || '등록에 실패했어요. 잠시 후 다시 시도해주세요.');
      }

      setMessage('success', '"' + (result.name || payload.name) + '" 공방 등록 요청이 접수됐어요.');
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
    } catch (error) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? error.message
          : '등록에 실패했어요. 잠시 후 다시 시도해주세요.';
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

const communityPostComposerBlock = `
<script>
(() => {
  const form = document.querySelector('[data-community-form]');
  if (!form) return;

  const message = form.querySelector('[data-form-message]');
  const submitButton = form.querySelector('[data-submit]');
  const submitLabel = submitButton ? submitButton.textContent.trim() : '게시물 발행';
  const fileInput = form.querySelector('[data-image-input]');
  const uploadTrigger = form.querySelector('[data-upload-trigger]');
  const imageCount = form.querySelector('[data-image-count]');
  const titleInput = form.querySelector('[data-field="title"]');
  const authorInput = form.querySelector('[data-field="author"]');
  const bodyInput = form.querySelector('[data-field="body"]');
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
      ? '선택한 이미지 ' + selectedFiles.length + '장'
      : '고해상도 JPG 또는 PNG';
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
      author: authorInput && authorInput.value.trim() ? authorInput.value.trim() : '익명 메이커',
      body: bodyInput ? bodyInput.value.trim() : '',
      category: categoryInput ? categoryInput.value : '',
      imageNames: selectedFiles.map((file) => file.name),
      title: titleInput ? titleInput.value.trim() : ''
    };

    if (!payload.category || !payload.title || !payload.body) {
      setMessage('error', '카테고리, 제목, 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setMessage('', '');

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = '등록 중...';
      }

      const response = await fetch('/community/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || '게시물 등록에 실패했습니다.');
      }

      setMessage('success', '게시물을 등록했어요. 상세 페이지로 이동합니다.');
      window.setTimeout(() => {
        window.location.href = '/community/post/' + result.id;
      }, 300);
    } catch (error) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? error.message
          : '게시물 등록에 실패했습니다.';
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
<div class="md:hidden flex items-center">
<a class="inline-flex items-center justify-center px-4 py-2 rounded-full border border-outline text-[10px] font-label tracking-[0.18em] uppercase text-on-surface whitespace-nowrap" data-auth-guest="" href="/login">로그인</a>
<a class="items-center justify-center px-4 py-2 rounded-full border border-primary bg-primary text-[10px] font-label tracking-[0.18em] uppercase text-white whitespace-nowrap" data-auth-member="" href="#">마이페이지</a>
</div>
<nav class="hidden md:flex gap-12">
<a class="${navLinkClasses(communityActive)}" href="/community">커뮤니티</a>
<a class="${navLinkClasses(marketActive)}" href="/market">공방 공유</a>
<a class="font-sans text-xs uppercase tracking-widest text-[#1a1c1b] dark:text-[#faf9f7] opacity-60 hover:opacity-100 transition-opacity" href="#">마이 페이지</a>
</nav>
<div class="hidden md:flex items-center gap-6">
<button class="text-[#1a1c1b] dark:text-[#faf9f7] hover:scale-95 duration-200 ease-in-out">
<span class="material-symbols-outlined" data-icon="search">search</span>
</button>
<button class="text-[#1a1c1b] dark:text-[#faf9f7] hover:scale-95 duration-200 ease-in-out">
<span class="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
</button>
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
<p class="font-sans text-[10px] tracking-[0.2em] uppercase text-[#7f7663]">작업실을 나누고 이야기를 잇는 메이커 커뮤니티</p>
</div>
<div class="flex gap-10">
<a class="font-sans text-[10px] tracking-[0.2em] uppercase text-[#7f7663] hover:text-[#1a1c1b] dark:hover:text-white underline decoration-[#d4af37] underline-offset-4 transition-all duration-500" href="/community">커뮤니티</a>
<a class="font-sans text-[10px] tracking-[0.2em] uppercase text-[#7f7663] hover:text-[#1a1c1b] dark:hover:text-white underline decoration-[#d4af37] underline-offset-4 transition-all duration-500" href="/market">공방 공유</a>
<a class="font-sans text-[10px] tracking-[0.2em] uppercase text-[#7f7663] hover:text-[#1a1c1b] dark:hover:text-white underline decoration-[#d4af37] underline-offset-4 transition-all duration-500" href="/login">로그인</a>
</div>
<div class="font-sans text-[10px] tracking-[0.2em] uppercase text-[#7f7663]">© 2026 은금슬쩍. For makers.</div>
</div>
</footer>`;
}

function ensureAuthStyles(html: string) {
  if (html.includes('[data-auth-member]')) {
    return html;
  }

  return html.replace('</head>', `${authStyleBlock}\n</head>`);
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
  return replaceFooter(withSharedHeader, sharedFooter());
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

function applyReplacements(html: string, replacements: Array<[string, string]>): string {
  return replacements.reduce((result, [from, to]) => result.split(from).join(to), html);
}

export function finalizeStitchHtml(template: TemplateName, rawHtml: string) {
  const normalizedHtml = normalizeLayout(rawHtml, template);
  const withCommonLinks = applyReplacements(normalizedHtml, commonReplacements);
  const withPageReplacements = applyReplacements(withCommonLinks, pageReplacements[template]);
  const withStudioEnhancer = injectStudioFormEnhancer(withPageReplacements, template);
  return injectCommunityComposer(withStudioEnhancer, template);
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
