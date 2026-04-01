import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type TemplateName =
  | 'home'
  | 'market'
  | 'market-new'
  | 'market-detail'
  | 'market-registration-mobile'
  | 'community'
  | 'community-new';

const templateFiles: Record<TemplateName, string> = {
  home: 'home.html',
  market: 'market.html',
  'market-new': 'market-new.html',
  'market-detail': 'market-detail.html',
  'market-registration-mobile': 'market-registration-mobile.html',
  community: 'community.html',
  'community-new': 'community-new.html'
};

const commonReplacements: Array<[string, string]> = [
  ['href="#">커뮤니티</a>', 'href="/community">커뮤니티</a>'],
  ['href="#">Community</a>', 'href="/community">커뮤니티</a>'],
  ['href="#">공방 공유</a>', 'href="/market">공방 공유</a>'],
  ['href="#">Studio Share</a>', 'href="/market">공방 공유</a>'],
  ['href="#">은금슬쩍</a>', 'href="/">은금슬쩍</a>']
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
  'market-detail': [],
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
  'community-new': []
};

function applyReplacements(html: string, replacements: Array<[string, string]>): string {
  return replacements.reduce((result, [from, to]) => result.split(from).join(to), html);
}

export function renderStitchHtml(template: TemplateName) {
  const filePath = join(process.cwd(), 'stitch', templateFiles[template]);
  const rawHtml = readFileSync(filePath, 'utf8');
  const withCommonLinks = applyReplacements(rawHtml, commonReplacements);
  return applyReplacements(withCommonLinks, pageReplacements[template]);
}

export function stitchHtmlResponse(template: TemplateName) {
  return new Response(renderStitchHtml(template), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
