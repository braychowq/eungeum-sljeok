export type NavItem = {
  id: string;
  label: string;
  href: string;
};

export type BannerItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
};

export type CommunityCategory = 'qna' | 'share' | 'free';

export type CommunityPost = {
  id: string;
  category: CommunityCategory;
  title: string;
  href: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  // Relative timestamp from now used for "최근 24시간" popular filtering.
  publishedHoursAgo: number;
  isNotice?: boolean;
  isPinned?: boolean;
};

export type SliderCard = {
  id: string;
  title: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
};

export type MenuFeature = {
  id: string;
  menu: string;
  feature: string;
  value: string;
};

export type LibraryEntry = {
  id: string;
  title: string;
  meta: string;
  href: string;
};
