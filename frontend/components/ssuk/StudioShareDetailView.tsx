'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ProductButton } from '../common/ProductControl';
import { type StudioTrustBadge } from './mockData';
import TwoMenuShell from './TwoMenuShell';
import { useHorizontalRail } from './useHorizontalRail';
import styles from './StudioShareDetailView.module.css';

type StudioShareDetailViewProps = {
  studioId: string;
};

type ShareStatus = 'open' | 'closed';
type PriceUnit = 'day' | 'week' | 'month';

type StudioInquiryPreview = {
  id: string;
  author: string;
  createdAt: string;
  text: string;
};

type StudioShareDetail = {
  id: string;
  name: string;
  status: ShareStatus;
  createdAt: string;
  ownerName: string;
  address: string;
  locationLabel: string;
  email: string;
  areaPyeong: number;
  capacityLabel: string;
  minUnit: 'hour' | 'day' | 'week';
  nextAvailableDate: string;
  responseLabel: string;
  refundPolicyLabel: string;
  contractPolicyLabel: string;
  trustBadges: StudioTrustBadge[];
  description: string[];
  equipments: string[];
  images: string[];
  priceByUnit: Record<PriceUnit, number>;
  reviewScore: number;
  reviewCount: number;
  inquiryCount: number;
  recentInquiries: StudioInquiryPreview[];
};

type StudioEventName =
  | 'studio_detail_view'
  | 'studio_contact_click'
  | 'studio_save_click'
  | 'studio_owner_cta_click';

type RailButtonsProps = {
  label: string;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

const trustBadgeLabel: Record<StudioTrustBadge, string> = {
  verified: '검증됨',
  policy: '정책확인',
  fast_response: '응답빠름'
};

const trustBadgeClass: Record<StudioTrustBadge, string> = {
  verified: styles.badgeVerified,
  policy: styles.badgePolicy,
  fast_response: styles.badgeFast
};

const unitLabelMap: Record<PriceUnit, string> = {
  day: '일',
  week: '주',
  month: '월'
};

const minUnitLabelMap: Record<StudioShareDetail['minUnit'], string> = {
  hour: '시간',
  day: '일',
  week: '주'
};

const studioDetails: Record<string, StudioShareDetail> = {
  'studio-1': {
    id: 'studio-1',
    name: '휴대 작업실 A',
    status: 'open',
    createdAt: '2026-03-04',
    ownerName: '실버메이커',
    address: '서울시 성동구 연무장길 17, 3층',
    locationLabel: '성수',
    email: 'studio.share.a@naver.com',
    areaPyeong: 18,
    capacityLabel: '최대 4인',
    minUnit: 'day',
    nextAvailableDate: '2026-03-09',
    responseLabel: '평균 1시간 이내',
    refundPolicyLabel: '이용 48시간 전 100% 환불',
    contractPolicyLabel: '표준 쉐어 계약서 확인 완료',
    trustBadges: ['verified', 'policy', 'fast_response'],
    description: [
      '성수동 메인 골목에서 도보 5분 거리의 소형 공방입니다.',
      '기본 작업대 3석과 소규모 클래스 운영 동선을 분리해 작업 집중도가 높습니다.',
      '환기 설비와 세척 공간이 분리되어 금속 작업에 적합합니다.'
    ],
    equipments: ['작업대 3석', '토치 2대', '집진기 1대', '초음파 세척기', '폴리싱 모터'],
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1489641493513-ba4ee84ccea9?auto=format&fit=crop&w=1200&q=80'
    ],
    priceByUnit: {
      day: 55000,
      week: 290000,
      month: 980000
    },
    reviewScore: 4.8,
    reviewCount: 37,
    inquiryCount: 112,
    recentInquiries: [
      {
        id: 'studio-1-inquiry-1',
        author: '실버온',
        createdAt: '18분 전',
        text: '평일 저녁 7시 이후 입실 가능한지 문의드렸습니다.'
      },
      {
        id: 'studio-1-inquiry-2',
        author: '하루공방',
        createdAt: '52분 전',
        text: '주 단위 이용 시 장비 교육 포함 여부를 확인하고 싶습니다.'
      }
    ]
  },
  'studio-2': {
    id: 'studio-2',
    name: '성수 공동공방 B',
    status: 'closed',
    createdAt: '2026-03-02',
    ownerName: '공방운영자 B',
    address: '서울시 성동구 아차산로 12, 2층',
    locationLabel: '성수',
    email: 'share.studio.b@gmail.com',
    areaPyeong: 24,
    capacityLabel: '최대 6인',
    minUnit: 'day',
    nextAvailableDate: '2026-03-12',
    responseLabel: '평균 3시간 이내',
    refundPolicyLabel: '이용 72시간 전 100% 환불',
    contractPolicyLabel: '표준 쉐어 계약서 확인 완료',
    trustBadges: ['verified', 'policy'],
    description: [
      '공유 작업석 중심으로 운영되는 공동 공방입니다.',
      '주요 장비가 넓게 분산되어 동시 작업 6인까지 수용 가능합니다.',
      '현재는 마감 상태이며 문의 시 대기 요청으로 접수됩니다.'
    ],
    equipments: ['작업대 5석', '왁스 카빙 세트', '소형 레이저 각인기', '도금기', '초음파 세척기'],
    images: [
      'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1489641493513-ba4ee84ccea9?auto=format&fit=crop&w=1200&q=80'
    ],
    priceByUnit: {
      day: 60000,
      week: 320000,
      month: 1120000
    },
    reviewScore: 4.6,
    reviewCount: 21,
    inquiryCount: 84,
    recentInquiries: [
      {
        id: 'studio-2-inquiry-1',
        author: '익명',
        createdAt: '33분 전',
        text: '마감 상태인데 다음 가능일 알림 신청 가능한가요?'
      },
      {
        id: 'studio-2-inquiry-2',
        author: '페어링랩',
        createdAt: '1시간 전',
        text: '월 단위 이용 시 보증금 조건 문의드립니다.'
      }
    ]
  }
};

const defaultStudio = studioDetails['studio-1'];

function formatKrw(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value);
}

function formatDate(dateText: string) {
  const [year, month, day] = dateText.split('-');
  return `${year}.${month}.${day}`;
}

function emitStudioEvent(eventName: StudioEventName, payload: Record<string, unknown>) {
  if (typeof window === 'undefined') {
    return;
  }

  const detail = { eventName, ...payload };
  window.dispatchEvent(new CustomEvent('ssuk-market-analytics', { detail }));

  if (process.env.NODE_ENV !== 'production') {
    console.info('[ssuk-market-analytics]', detail);
  }
}

function RailButtons({
  label,
  canScrollPrev,
  canScrollNext,
  onPrev,
  onNext
}: RailButtonsProps) {
  return (
    <div className={styles.railActions} aria-label={`${label} 이동`}>
      <ProductButton
        type="button"
        tone="neutral"
        variant="secondary"
        size="sm"
        iconOnly
        className={styles.railButton}
        onClick={onPrev}
        disabled={!canScrollPrev}
        aria-label={`${label} 이전`}
      >
        &lt;
      </ProductButton>
      <ProductButton
        type="button"
        tone="neutral"
        variant="secondary"
        size="sm"
        iconOnly
        className={styles.railButton}
        onClick={onNext}
        disabled={!canScrollNext}
        aria-label={`${label} 다음`}
      >
        &gt;
      </ProductButton>
    </div>
  );
}

export default function StudioShareDetailView({ studioId }: StudioShareDetailViewProps) {
  const studio = studioDetails[studioId] ?? defaultStudio;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState<PriceUnit>('day');
  const [saved, setSaved] = useState(false);
  const swipeStartXRef = useRef<number | null>(null);
  const swipeCurrentXRef = useRef<number | null>(null);

  const statusLabel = studio.status === 'open' ? '쉐어중' : '마감';
  const primaryCtaLabel = studio.status === 'open' ? '즉시 문의' : '대기 요청';
  const trustItems = [
    { key: 'verified', label: '본인 인증', value: '운영자 인증 완료' },
    { key: 'policy', label: '계약 정책', value: studio.contractPolicyLabel },
    { key: 'refund', label: '환불 정책', value: studio.refundPolicyLabel },
    { key: 'response', label: '응답 속도', value: studio.responseLabel }
  ];
  const leadSignals = [
    { id: 'capacity', label: '수용 인원', value: studio.capacityLabel },
    { id: 'scale', label: '공간 규모', value: `${studio.areaPyeong}평` },
    { id: 'minimum', label: '최소 이용', value: `${minUnitLabelMap[studio.minUnit]} 단위` }
  ];
  const overviewCards = [
    { id: 'location', label: '지역', value: studio.locationLabel },
    { id: 'address', label: '주소', value: studio.address },
    { id: 'available', label: '다음 가능일', value: formatDate(studio.nextAvailableDate) },
    { id: 'response', label: '응답 속도', value: studio.responseLabel },
    { id: 'policy', label: '계약 정책', value: studio.contractPolicyLabel },
    { id: 'contact', label: '문의 메일', value: studio.email, href: `mailto:${studio.email}` }
  ];
  const bookingFacts = [
    { id: 'refund', label: '환불 정책', value: studio.refundPolicyLabel },
    { id: 'contract', label: '계약 정책', value: studio.contractPolicyLabel },
    { id: 'response', label: '응답 속도', value: studio.responseLabel }
  ];

  const priceText = useMemo(
    () => `₩${formatKrw(studio.priceByUnit[selectedUnit])} / ${unitLabelMap[selectedUnit]}`,
    [selectedUnit, studio.priceByUnit]
  );

  const inquiryHref = useMemo(() => {
    const subject = `[공방쉐어 문의] ${studio.name}`;
    const body = `${studio.name} (${studio.locationLabel}) 문의드립니다.`;

    return `mailto:${studio.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [studio.email, studio.locationLabel, studio.name]);

  const thumbnailRail = useHorizontalRail<HTMLUListElement>(`${studio.id}-${studio.images.length}`);
  const infoRail = useHorizontalRail<HTMLDListElement>(`${studio.id}-${selectedUnit}`);
  const trustRail = useHorizontalRail<HTMLUListElement>(`${studio.id}-trust`);
  const equipmentRail = useHorizontalRail<HTMLUListElement>(`${studio.id}-equipment`);
  const statsRail = useHorizontalRail<HTMLDivElement>(`${studio.id}-stats`);
  const inquiryRail = useHorizontalRail<HTMLUListElement>(`${studio.id}-inquiry`);

  useEffect(() => {
    emitStudioEvent('studio_detail_view', { studioId: studio.id });
  }, [studio.id]);

  useEffect(() => {
    const railNode = thumbnailRail.railRef.current;

    if (!railNode) {
      return;
    }

    const activeItem = railNode.children[currentImageIndex] as HTMLElement | undefined;

    activeItem?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  }, [currentImageIndex, thumbnailRail.railRef]);

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % studio.images.length);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + studio.images.length) % studio.images.length);
  };

  const toggleSaved = () => {
    const nextSaved = !saved;
    setSaved(nextSaved);
    emitStudioEvent('studio_save_click', {
      studioId: studio.id,
      saved: nextSaved
    });
  };

  const handleInquiryClick = (sourceSection: string) => {
    emitStudioEvent('studio_contact_click', {
      studioId: studio.id,
      sourceSection,
      status: studio.status
    });
  };

  const onSwipeStart = (clientX: number) => {
    swipeStartXRef.current = clientX;
    swipeCurrentXRef.current = clientX;
  };

  const onSwipeMove = (clientX: number) => {
    if (swipeStartXRef.current === null) {
      return;
    }

    swipeCurrentXRef.current = clientX;
  };

  const onSwipeEnd = () => {
    if (swipeStartXRef.current === null || swipeCurrentXRef.current === null) {
      swipeStartXRef.current = null;
      swipeCurrentXRef.current = null;
      return;
    }

    const deltaX = swipeCurrentXRef.current - swipeStartXRef.current;
    const swipeThreshold = 40;

    if (deltaX <= -swipeThreshold) {
      goToNextImage();
    } else if (deltaX >= swipeThreshold) {
      goToPrevImage();
    }

    swipeStartXRef.current = null;
    swipeCurrentXRef.current = null;
  };

  return (
    <TwoMenuShell
      activeMenu="market"
      title="공방 쉐어 상세"
      subtitle="공간 정보를 빠르게 확인하고 문의할 수 있어요."
      ctaLabel="← 목록으로"
      ctaHref="/market"
      hideHero
    >
      <article className={styles.page} aria-label="공방 쉐어 상세">
        <section className={styles.leadSection} aria-label="공방 상태 및 예약 요약">
          <div className={styles.leadCopy}>
            <div className={styles.leadEyebrowRow}>
              <span className={styles.leadEyebrow}>Studio share</span>
              <span
                className={`${styles.statusBadge} ${studio.status === 'open' ? styles.statusOpen : styles.statusClosed}`}
              >
                {statusLabel}
              </span>
            </div>

            <h1>{studio.name}</h1>
            <p className={styles.leadSummary}>
              {studio.description[0]} 작업 집중도와 운영 감도를 먼저 읽고 문의까지 바로 이어갈 수 있도록 정리했습니다.
            </p>

            <div className={styles.metaRow}>
              <span>{studio.locationLabel}</span>
              <span>등록일 {formatDate(studio.createdAt)}</span>
              <span>운영자 {studio.ownerName}</span>
            </div>

            <div className={styles.signalRow}>
              {leadSignals.map((signal) => (
                <article key={signal.id} className={styles.signalCard}>
                  <span>{signal.label}</span>
                  <strong>{signal.value}</strong>
                </article>
              ))}
            </div>

            <div className={styles.trustBadgeRow}>
              {studio.trustBadges.map((badge) => (
                <span key={`${studio.id}-${badge}`} className={`${styles.trustBadge} ${trustBadgeClass[badge]}`}>
                  {trustBadgeLabel[badge]}
                </span>
              ))}
            </div>
          </div>

          <aside className={styles.bookingCard} aria-label="문의 카드">
            <span className={styles.bookingEyebrow}>Booking signal</span>
            <div className={styles.unitRow} role="tablist" aria-label="가격 단위 선택">
              {(Object.keys(unitLabelMap) as PriceUnit[]).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  className={selectedUnit === unit ? styles.unitButtonActive : styles.unitButton}
                  onClick={() => setSelectedUnit(unit)}
                  role="tab"
                  aria-selected={selectedUnit === unit}
                >
                  {unitLabelMap[unit]}
                </button>
              ))}
            </div>
            <strong className={styles.bookingPrice}>{priceText}</strong>
            <p className={styles.bookingCaption}>
              {formatDate(studio.nextAvailableDate)}부터 이용 가능하며, {studio.responseLabel} 문의 응답을 제공합니다.
            </p>

            <dl className={styles.bookingFacts}>
              {bookingFacts.map((item) => (
                <div key={item.id} className={styles.bookingFact}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className={styles.bookingActions}>
              <a
                href={inquiryHref}
                className={styles.primaryCta}
                onClick={() => {
                  handleInquiryClick('lead_card');
                }}
              >
                {primaryCtaLabel}
              </a>
              <button
                type="button"
                className={`${styles.secondaryCta} ${saved ? styles.secondaryCtaActive : ''}`}
                onClick={toggleSaved}
              >
                {saved ? '저장됨' : '저장'}
              </button>
            </div>

            <Link
              href="/market/new"
              className={styles.ownerLink}
              onClick={() => {
                emitStudioEvent('studio_owner_cta_click', { from: 'detail' });
              }}
            >
              내 공방 쉐어 등록하기
            </Link>
          </aside>
        </section>

        <section className={styles.gallerySection} aria-label="공방 이미지 갤러리">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeadingGroup}>
              <span className={styles.sectionEyebrow}>Space cut</span>
              <h2 className={styles.sectionTitle}>공간을 먼저 느껴보세요</h2>
            </div>
            <RailButtons
              label="공방 이미지"
              canScrollPrev={thumbnailRail.canScrollPrev}
              canScrollNext={thumbnailRail.canScrollNext}
              onPrev={thumbnailRail.scrollPrev}
              onNext={thumbnailRail.scrollNext}
            />
          </div>

          <div
            className={styles.mainImageFrame}
            onTouchStart={(event) => onSwipeStart(event.touches[0].clientX)}
            onTouchMove={(event) => onSwipeMove(event.touches[0].clientX)}
            onTouchEnd={onSwipeEnd}
            onPointerDown={(event) => {
              if (event.pointerType === 'mouse' && event.button !== 0) {
                return;
              }

              event.currentTarget.setPointerCapture(event.pointerId);
              onSwipeStart(event.clientX);
            }}
            onPointerMove={(event) => onSwipeMove(event.clientX)}
            onPointerUp={onSwipeEnd}
            onPointerCancel={onSwipeEnd}
          >
            <img
              src={studio.images[currentImageIndex]}
              alt={`${studio.name} 공간 사진 ${currentImageIndex + 1}`}
              loading="eager"
            />
            <div className={styles.imageControls}>
              <div className={styles.imageMeta}>
                <strong>
                  {currentImageIndex + 1} / {studio.images.length}
                </strong>
                <span>좌우 이동 버튼과 썸네일로 다른 공간 컷을 확인하세요.</span>
              </div>
              <div className={styles.imageNavButtons}>
                <button type="button" onClick={goToPrevImage} aria-label="이전 이미지">
                  &lt;
                </button>
                <button type="button" onClick={goToNextImage} aria-label="다음 이미지">
                  &gt;
                </button>
              </div>
            </div>
          </div>

          <ul ref={thumbnailRail.railRef} className={`${styles.thumbnailRow} ${styles.railTrack}`}>
            {studio.images.map((image, index) => (
              <li key={`${studio.id}-${index}`}>
                <button
                  type="button"
                  className={index === currentImageIndex ? styles.thumbnailActive : ''}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`${index + 1}번 이미지 보기`}
                >
                  <img src={image} alt="" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.infoSection} aria-label="핵심 정보">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeadingGroup}>
              <span className={styles.sectionEyebrow}>Field notes</span>
              <h2 className={styles.sectionTitle}>현장 정보</h2>
            </div>
            <RailButtons
              label="현장 정보"
              canScrollPrev={infoRail.canScrollPrev}
              canScrollNext={infoRail.canScrollNext}
              onPrev={infoRail.scrollPrev}
              onNext={infoRail.scrollNext}
            />
          </div>
          <dl ref={infoRail.railRef} className={`${styles.infoGrid} ${styles.railTrack}`}>
            {overviewCards.map((item) => (
              <div key={item.id} className={styles.infoCard}>
                <dt>{item.label}</dt>
                <dd>{item.href ? <a href={item.href}>{item.value}</a> : item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.trustSection} aria-label="신뢰 및 정책 정보">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeadingGroup}>
              <span className={styles.sectionEyebrow}>Trust layer</span>
              <h2 className={styles.sectionTitle}>운영 정책</h2>
            </div>
            <RailButtons
              label="운영 정책"
              canScrollPrev={trustRail.canScrollPrev}
              canScrollNext={trustRail.canScrollNext}
              onPrev={trustRail.scrollPrev}
              onNext={trustRail.scrollNext}
            />
          </div>
          <ul ref={trustRail.railRef} className={`${styles.trustList} ${styles.railTrack}`}>
            {trustItems.map((item) => (
              <li key={item.key} className={styles.trustItem}>
                <span className={styles.trustKey}>{item.label}</span>
                <span className={styles.trustValue}>{item.value}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.descriptionSection} aria-label="공간 설명">
          <div className={styles.sectionHeadingGroup}>
            <span className={styles.sectionEyebrow}>Studio narrative</span>
            <h2 className={styles.sectionTitle}>공간 설명</h2>
          </div>
          <div className={styles.descriptionBody}>
            {studio.description.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>

        <section className={styles.equipmentSection} aria-label="장비 및 시설">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeadingGroup}>
              <span className={styles.sectionEyebrow}>Available tools</span>
              <h2 className={styles.sectionTitle}>장비 및 시설</h2>
            </div>
            <RailButtons
              label="장비 및 시설"
              canScrollPrev={equipmentRail.canScrollPrev}
              canScrollNext={equipmentRail.canScrollNext}
              onPrev={equipmentRail.scrollPrev}
              onNext={equipmentRail.scrollNext}
            />
          </div>
          <ul ref={equipmentRail.railRef} className={`${styles.equipmentList} ${styles.railTrack}`}>
            {studio.equipments.map((equipment) => (
              <li key={equipment} className={styles.equipmentItem}>
                {equipment}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.socialSection} aria-label="리뷰 및 문의 요약">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeadingGroup}>
              <span className={styles.sectionEyebrow}>Market pulse</span>
              <h2 className={styles.sectionTitle}>리뷰/문의 요약</h2>
            </div>
          </div>

          <div className={styles.socialBlock}>
            <div className={styles.subsectionHeader}>
              <p className={styles.subsectionLabel}>요약 지표</p>
              <RailButtons
                label="요약 지표"
                canScrollPrev={statsRail.canScrollPrev}
                canScrollNext={statsRail.canScrollNext}
                onPrev={statsRail.scrollPrev}
                onNext={statsRail.scrollNext}
              />
            </div>
            <div ref={statsRail.railRef} className={`${styles.socialStats} ${styles.railTrack}`}>
              <article className={styles.statCard}>
                <strong>{studio.reviewScore.toFixed(1)}</strong>
                <span>평점</span>
              </article>
              <article className={styles.statCard}>
                <strong>{studio.reviewCount}</strong>
                <span>리뷰 수</span>
              </article>
              <article className={styles.statCard}>
                <strong>{studio.inquiryCount}</strong>
                <span>문의 수</span>
              </article>
            </div>
          </div>

          <div className={styles.socialBlock}>
            <div className={styles.subsectionHeader}>
              <p className={styles.subsectionLabel}>최근 문의</p>
              <RailButtons
                label="최근 문의"
                canScrollPrev={inquiryRail.canScrollPrev}
                canScrollNext={inquiryRail.canScrollNext}
                onPrev={inquiryRail.scrollPrev}
                onNext={inquiryRail.scrollNext}
              />
            </div>
            <ul ref={inquiryRail.railRef} className={`${styles.inquiryList} ${styles.railTrack}`}>
              {studio.recentInquiries.map((inquiry) => (
                <li key={inquiry.id} className={styles.inquiryItem}>
                  <div>
                    <strong>{inquiry.author}</strong>
                    <span>{inquiry.createdAt}</span>
                  </div>
                  <p>{inquiry.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className={styles.stickyBar}>
          <div className={styles.stickyInner}>
            <a
              href={inquiryHref}
              className={styles.primaryCta}
              onClick={() => {
                handleInquiryClick('detail_sticky');
              }}
            >
              {primaryCtaLabel}
            </a>
            <button
              type="button"
              className={`${styles.secondaryCta} ${saved ? styles.secondaryCtaActive : ''}`}
              onClick={toggleSaved}
            >
              {saved ? '저장됨' : '저장'}
            </button>
          </div>
        </div>

        <section className={styles.backSection} aria-label="뒤로가기">
          <Link href="/market">공방 쉐어 목록으로 돌아가기</Link>
        </section>
      </article>
    </TwoMenuShell>
  );
}
