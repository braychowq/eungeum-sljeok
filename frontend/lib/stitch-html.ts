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
<a class="font-sans text-[10px] tracking-[0.2em] uppercase text-[#7f7663] hover:text-[#1a1c1b] dark:hover:text-white underline decoration-[#d4af37] underline-offset-4 transition-all duration-500" href="/community">Community</a>
<a class="font-sans text-[10px] tracking-[0.2em] uppercase text-[#7f7663] hover:text-[#1a1c1b] dark:hover:text-white underline decoration-[#d4af37] underline-offset-4 transition-all duration-500" href="/market">Workshop</a>
<a class="font-sans text-[10px] tracking-[0.2em] uppercase text-[#7f7663] hover:text-[#1a1c1b] dark:hover:text-white underline decoration-[#d4af37] underline-offset-4 transition-all duration-500" href="/login">Login</a>
</div>
<div class="font-sans text-[10px] tracking-[0.2em] uppercase text-[#7f7663]">© 2024 은금슬쩍. For makers.</div>
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

function applyReplacements(html: string, replacements: Array<[string, string]>): string {
  return replacements.reduce((result, [from, to]) => result.split(from).join(to), html);
}

export function finalizeStitchHtml(template: TemplateName, rawHtml: string) {
  const normalizedHtml = normalizeLayout(rawHtml, template);
  const withCommonLinks = applyReplacements(normalizedHtml, commonReplacements);
  return applyReplacements(withCommonLinks, pageReplacements[template]);
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
