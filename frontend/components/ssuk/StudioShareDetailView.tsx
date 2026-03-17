'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import ProductChoiceCard from '../common/ProductChoiceCard';
import { ProductAnchor, ProductButton, ProductLink } from '../common/ProductControl';
import ProductRail from '../common/ProductRail';
import productRailStyles from '../common/ProductRail.module.css';
import ProductSectionHeader from '../common/ProductSectionHeader';
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

const bookingUnitDescriptionMap: Record<PriceUnit, string> = {
  day: '짧은 테스트 작업이나 하루 집중 제작에 적합해요.',
  week: '프로젝트 단위 몰입 제작과 장비 적응에 좋아요.',
  month: '상시 작업 루틴이나 클래스 운영까지 염두에 둔 선택이에요.'
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

export default function StudioShareDetailView({ studioId }: StudioShareDetailViewProps) {
  const studio = studioDetails[studioId] ?? defaultStudio;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState<PriceUnit>('day');
  const [saved, setSaved] = useState(false);
  const swipeStartXRef = useRef<number | null>(null);
  const swipeCurrentXRef = useRef<number | null>(null);

  const statusLabel = studio.status === 'open' ? '쉐어중' : '마감';
  const primaryCtaLabel = studio.status === 'open' ? '즉시 문의' : '대기 요청';
  const selectedUnitLabel = unitLabelMap[selectedUnit];
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
    { id: 'unit', label: '선택 단위', value: `${selectedUnitLabel} 단위` },
    { id: 'available', label: '다음 가능일', value: formatDate(studio.nextAvailableDate) },
    { id: 'refund', label: '환불 정책', value: studio.refundPolicyLabel },
    { id: 'response', label: '응답 속도', value: studio.responseLabel }
  ];
  const bookingUnitOptions = (Object.keys(unitLabelMap) as PriceUnit[]).map((unit) => ({
    id: unit,
    priceText: `₩${formatKrw(studio.priceByUnit[unit])}`,
    title: `${unitLabelMap[unit]} 단위`,
    description: bookingUnitDescriptionMap[unit]
  }));

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
            <div className={styles.bookingLead}>
              <div className={styles.bookingLeadCopy}>
                <span className={styles.bookingEyebrow}>Booking signal</span>
                <strong className={styles.bookingPrice} aria-live="polite">
                  {priceText}
                </strong>
                <p className={styles.bookingCaption}>
                  {formatDate(studio.nextAvailableDate)}부터 이용 가능하며, {studio.responseLabel} 문의 응답을 제공합니다.
                </p>
              </div>

              <div className={styles.bookingStatusStrip}>
                <span
                  className={`${styles.bookingStatusBadge} ${studio.status === 'open' ? styles.bookingStatusOpen : styles.bookingStatusClosed}`}
                >
                  {statusLabel}
                </span>
                <span className={styles.bookingStatusNote}>
                  {studio.status === 'open'
                    ? '지금 바로 문의해 운영 톤과 장비 사용 범위를 확인할 수 있어요.'
                    : '지금은 마감 상태지만 대기 요청으로 다음 가능 회차를 먼저 잡을 수 있어요.'}
                </span>
              </div>
            </div>

            <div className={styles.unitDeck} role="radiogroup" aria-label="가격 단위 선택">
              {bookingUnitOptions.map((option) => {
                const isSelected = selectedUnit === option.id;

                return (
                  <ProductChoiceCard
                    key={option.id}
                    variant="metric"
                    size="sm"
                    className={styles.unitCard}
                    eyebrow={option.priceText}
                    title={option.title}
                    description={option.description}
                    selected={isSelected}
                    onClick={() => setSelectedUnit(option.id)}
                    role="radio"
                    aria-checked={isSelected}
                  />
                );
              })}
            </div>

            <dl className={styles.bookingFacts}>
              {bookingFacts.map((item) => (
                <div key={item.id} className={styles.bookingFact}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className={styles.bookingActions}>
              <ProductAnchor
                href={inquiryHref}
                tone="forest"
                variant="primary"
                className={styles.bookingPrimaryAction}
                onClick={() => {
                  handleInquiryClick('lead_card');
                }}
              >
                {primaryCtaLabel}
              </ProductAnchor>
              <ProductButton
                type="button"
                tone="warm"
                variant="secondary"
                selected={saved}
                className={styles.bookingSecondaryAction}
                onClick={toggleSaved}
              >
                {saved ? '저장됨' : '저장'}
              </ProductButton>
            </div>

            <ProductLink
              href="/market/new"
              tone="neutral"
              variant="ghost"
              className={styles.ownerLink}
              onClick={() => {
                emitStudioEvent('studio_owner_cta_click', { from: 'detail' });
              }}
            >
              내 공방 쉐어 등록하기
            </ProductLink>
          </aside>
        </section>

        <section className={styles.gallerySection} aria-label="공방 이미지 갤러리">
          <ProductSectionHeader
            eyebrow="Space cut"
            title="공간을 먼저 느껴보세요"
            description="작업대 배치, 채광, 동선 감도를 먼저 훑고 지금 찾는 공간 결인지 빠르게 판단할 수 있게 구성했습니다."
            compact
            className={styles.sectionHeader}
            action={
              <ProductRail
                label="공방 이미지"
                summary={`${currentImageIndex + 1}/${studio.images.length} 컷`}
                canScrollPrev={thumbnailRail.canScrollPrev}
                canScrollNext={thumbnailRail.canScrollNext}
                onPrev={thumbnailRail.scrollPrev}
                onNext={thumbnailRail.scrollNext}
                className={styles.sectionRailControl}
              />
            }
          />

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
                <ProductButton
                  type="button"
                  tone="neutral"
                  variant="secondary"
                  size="sm"
                  iconOnly
                  className={styles.imageNavButton}
                  onClick={goToPrevImage}
                  aria-label="이전 이미지"
                >
                  &lt;
                </ProductButton>
                <ProductButton
                  type="button"
                  tone="neutral"
                  variant="secondary"
                  size="sm"
                  iconOnly
                  className={styles.imageNavButton}
                  onClick={goToNextImage}
                  aria-label="다음 이미지"
                >
                  &gt;
                </ProductButton>
              </div>
            </div>
          </div>

          <ul ref={thumbnailRail.railRef} className={`${styles.thumbnailRow} ${productRailStyles.track}`}>
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
          <ProductSectionHeader
            eyebrow="Field notes"
            title="현장 정보"
            description="위치, 가능일, 연락 수단처럼 문의 전에 바로 판단해야 할 기준을 카드처럼 모았습니다."
            compact
            className={styles.sectionHeader}
            action={
              <ProductRail
                label="현장 정보"
                summary={`${overviewCards.length}개 노트`}
                canScrollPrev={infoRail.canScrollPrev}
                canScrollNext={infoRail.canScrollNext}
                onPrev={infoRail.scrollPrev}
                onNext={infoRail.scrollNext}
                className={styles.sectionRailControl}
              />
            }
          />
          <dl ref={infoRail.railRef} className={`${styles.infoGrid} ${productRailStyles.track}`}>
            {overviewCards.map((item) => (
              <div key={item.id} className={styles.infoCard}>
                <dt>{item.label}</dt>
                <dd>{item.href ? <a href={item.href}>{item.value}</a> : item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.trustSection} aria-label="신뢰 및 정책 정보">
          <ProductSectionHeader
            eyebrow="Trust layer"
            title="운영 정책"
            description="계약, 환불, 응답 정책을 눌러 읽지 않아도 한 흐름으로 비교할 수 있게 정리했습니다."
            compact
            className={styles.sectionHeader}
            action={
              <ProductRail
                label="운영 정책"
                summary={`${trustItems.length}개 레이어`}
                canScrollPrev={trustRail.canScrollPrev}
                canScrollNext={trustRail.canScrollNext}
                onPrev={trustRail.scrollPrev}
                onNext={trustRail.scrollNext}
                className={styles.sectionRailControl}
              />
            }
          />
          <ul ref={trustRail.railRef} className={`${styles.trustList} ${productRailStyles.track}`}>
            {trustItems.map((item) => (
              <li key={item.key} className={styles.trustItem}>
                <span className={styles.trustKey}>{item.label}</span>
                <span className={styles.trustValue}>{item.value}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.descriptionSection} aria-label="공간 설명">
          <ProductSectionHeader
            eyebrow="Studio narrative"
            title="공간 설명"
            description="운영자가 직접 적은 설명을 요약 카드 뒤에 숨기지 않고 읽기 흐름 중심으로 배치했습니다."
            compact
            className={styles.sectionHeader}
          />
          <div className={styles.descriptionBody}>
            {studio.description.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>

        <section className={styles.equipmentSection} aria-label="장비 및 시설">
          <ProductSectionHeader
            eyebrow="Available tools"
            title="장비 및 시설"
            description="실제로 쓰게 될 장비와 시설 범위를 빠르게 비교하고, 공간 적합성을 바로 가늠할 수 있습니다."
            compact
            className={styles.sectionHeader}
            action={
              <ProductRail
                label="장비 및 시설"
                summary={`${studio.equipments.length}개 도구`}
                canScrollPrev={equipmentRail.canScrollPrev}
                canScrollNext={equipmentRail.canScrollNext}
                onPrev={equipmentRail.scrollPrev}
                onNext={equipmentRail.scrollNext}
                className={styles.sectionRailControl}
              />
            }
          />
          <ul ref={equipmentRail.railRef} className={`${styles.equipmentList} ${productRailStyles.track}`}>
            {studio.equipments.map((equipment) => (
              <li key={equipment} className={styles.equipmentItem}>
                {equipment}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.socialSection} aria-label="리뷰 및 문의 요약">
          <ProductSectionHeader
            eyebrow="Market pulse"
            title="리뷰/문의 요약"
            description="평점, 문의량, 최근 질문까지 묶어 이 공간이 현재 어떤 반응을 받고 있는지 한 번에 보여줍니다."
            compact
            className={styles.sectionHeader}
          />

          <div className={styles.socialBlock}>
            <div className={styles.subsectionHeader}>
              <p className={styles.subsectionLabel}>요약 지표</p>
              <ProductRail
                label="요약 지표"
                summary="3개 지표"
                canScrollPrev={statsRail.canScrollPrev}
                canScrollNext={statsRail.canScrollNext}
                onPrev={statsRail.scrollPrev}
                onNext={statsRail.scrollNext}
                className={styles.subsectionRailControl}
              />
            </div>
            <div ref={statsRail.railRef} className={`${styles.socialStats} ${productRailStyles.track}`}>
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
              <ProductRail
                label="최근 문의"
                summary={`${studio.recentInquiries.length}개 미리보기`}
                canScrollPrev={inquiryRail.canScrollPrev}
                canScrollNext={inquiryRail.canScrollNext}
                onPrev={inquiryRail.scrollPrev}
                onNext={inquiryRail.scrollNext}
                className={styles.subsectionRailControl}
              />
            </div>
            <ul ref={inquiryRail.railRef} className={`${styles.inquiryList} ${productRailStyles.track}`}>
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
            <div className={styles.stickySummary}>
              <span className={styles.stickyEyebrow}>Selected rhythm</span>
              <strong>{priceText}</strong>
              <p>
                {selectedUnitLabel} 단위 선택 · {formatDate(studio.nextAvailableDate)}부터 문의 가능
              </p>
            </div>
            <div className={styles.stickyActions}>
              <ProductAnchor
                href={inquiryHref}
                tone="forest"
                variant="primary"
                className={styles.stickyPrimaryAction}
                onClick={() => {
                  handleInquiryClick('detail_sticky');
                }}
              >
                {primaryCtaLabel}
              </ProductAnchor>
              <ProductButton
                type="button"
                tone="warm"
                variant="secondary"
                selected={saved}
                className={styles.stickySecondaryAction}
                onClick={toggleSaved}
              >
                {saved ? '저장됨' : '저장'}
              </ProductButton>
            </div>
          </div>
        </div>

        <section className={styles.backSection} aria-label="뒤로가기">
          <Link href="/market">공방 쉐어 목록으로 돌아가기</Link>
        </section>
      </article>
    </TwoMenuShell>
  );
}
