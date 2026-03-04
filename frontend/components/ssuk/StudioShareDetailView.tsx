'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import TwoMenuShell from './TwoMenuShell';
import styles from './StudioShareDetailView.module.css';

type StudioShareDetailViewProps = {
  studioId: string;
};

type ShareStatus = 'open' | 'closed';
type PriceUnit = 'day' | 'week' | 'month';
type CommentAuthorMode = 'nickname' | 'anonymous';

type StudioShareDetail = {
  id: string;
  name: string;
  author: string;
  status: ShareStatus;
  createdAt: string;
  address: string;
  email: string;
  areaPyeong: number;
  description: string[];
  equipments: string[];
  images: string[];
  priceByUnit: Record<PriceUnit, number>;
};

type StudioComment = {
  id: string;
  author: string;
  createdAt: string;
  text: string;
};

const studioDetails: Record<string, StudioShareDetail> = {
  'studio-1': {
    id: 'studio-1',
    name: '휴대 작업실 A',
    author: '실버메이커',
    status: 'open',
    createdAt: '2026-03-04',
    address: '서울시 성동구 연무장길 17, 3층',
    email: 'studio.share.a@naver.com',
    areaPyeong: 18,
    description: [
      '성수동 메인 골목에서 도보 5분 거리의 소형 공방입니다.',
      '기본 작업대 3석이 있고, 소규모 클래스/개인 작업 모두 가능합니다.',
      '환기 설비와 세척 공간이 분리되어 있어 금속 작업에 적합합니다.'
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
    }
  },
  'studio-2': {
    id: 'studio-2',
    name: '성수 공동공방 B',
    author: '공방운영자 B',
    status: 'closed',
    createdAt: '2026-03-02',
    address: '서울시 성동구 아차산로 12, 2층',
    email: 'share.studio.b@gmail.com',
    areaPyeong: 24,
    description: [
      '공유 작업석 중심으로 운영되는 공동 공방입니다.',
      '주요 장비가 넓게 분산되어 있어 동시 작업 5인까지 수용 가능합니다.',
      '현재는 마감 상태지만 댓글 문의는 열려 있습니다.'
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
    }
  }
};

const defaultStudio = studioDetails['studio-1'];

const initialComments: StudioComment[] = [
  {
    id: 'comment-1',
    author: 'silveron',
    createdAt: '12분 전',
    text: '주차 가능한가요? 평일 저녁 사용도 가능한지 궁금합니다.'
  },
  {
    id: 'comment-2',
    author: '익명',
    createdAt: '4분 전',
    text: '마감 상태여도 대기 신청이 가능한지 알고 싶어요.'
  }
];

const unitLabelMap: Record<PriceUnit, string> = {
  day: '일',
  week: '주',
  month: '월'
};

function formatKrw(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value);
}

export default function StudioShareDetailView({ studioId }: StudioShareDetailViewProps) {
  const studio = studioDetails[studioId] ?? defaultStudio;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState<PriceUnit>('day');
  const [comments, setComments] = useState<StudioComment[]>(initialComments);
  const [authorMode, setAuthorMode] = useState<CommentAuthorMode>('nickname');
  const [nickname, setNickname] = useState('');
  const [commentText, setCommentText] = useState('');
  const swipeStartXRef = useRef<number | null>(null);
  const swipeCurrentXRef = useRef<number | null>(null);

  const priceText = useMemo(
    () => `₩${formatKrw(studio.priceByUnit[selectedUnit])} / ${unitLabelMap[selectedUnit]}`,
    [selectedUnit, studio.priceByUnit]
  );

  const statusLabel = studio.status === 'open' ? '쉐어중' : '마감';

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % studio.images.length);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + studio.images.length) % studio.images.length);
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

  const onSubmitComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) {
      return;
    }

    const resolvedAuthor =
      authorMode === 'anonymous' ? '익명' : nickname.trim().length > 0 ? nickname.trim() : '닉네임';

    const nextComment: StudioComment = {
      id: `comment-${Date.now()}`,
      author: resolvedAuthor,
      createdAt: '방금 전',
      text: trimmed
    };

    setComments((prev) => [nextComment, ...prev]);
    setCommentText('');
  };

  return (
    <TwoMenuShell
      activeMenu="market"
      title="공방 쉐어 상세"
      subtitle="공간 정보를 확인하고 댓글로 자유롭게 문의할 수 있어요."
      ctaLabel="← 목록으로"
      ctaHref="/market?tab=studio"
      hideHero
    >
      <article className={styles.page} aria-label="공방 쉐어 상세">
        <section className={styles.headerSection} aria-label="상단 핵심 정보">
          <div className={styles.titleRow}>
            <h1>{studio.name}</h1>
            <span className={`${styles.statusText} ${studio.status === 'open' ? styles.open : styles.closed}`}>
              {statusLabel}
            </span>
          </div>
          <div className={styles.metaRow}>
            <span>작성자 {studio.author}</span>
            <span>등록일 {studio.createdAt}</span>
          </div>
        </section>

        <section className={styles.gallerySection} aria-label="공방 이미지">
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
              alt={`${studio.name} 사진 ${currentImageIndex + 1}`}
              loading="eager"
            />
            <div className={styles.imageControls} aria-live="polite">
              <span>
                {currentImageIndex + 1} / {studio.images.length}
              </span>
              <span>좌우로 밀어 넘기기</span>
            </div>
          </div>
          <ul className={styles.thumbnailRow}>
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

        <section className={styles.infoSection} aria-label="공방 주요 정보">
          <div className={styles.infoGrid}>
            <div>
              <dt>주소(위치)</dt>
              <dd>{studio.address}</dd>
            </div>
            <div>
              <dt>연락처(email)</dt>
              <dd>
                <a href={`mailto:${studio.email}`}>{studio.email}</a>
              </dd>
            </div>
            <div>
              <dt>평수</dt>
              <dd>{studio.areaPyeong}평</dd>
            </div>
            <div>
              <dt>가격</dt>
              <dd>
                <div className={styles.priceBlock}>
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
                  <strong>{priceText}</strong>
                </div>
              </dd>
            </div>
          </div>
        </section>

        <section className={styles.descriptionSection} aria-label="공간 설명">
          <h2>공간 설명</h2>
          <div className={styles.descriptionBody}>
            {studio.description.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>

        <section className={styles.equipmentSection} aria-label="보유 장비">
          <h2>보유 장비</h2>
          <ul>
            {studio.equipments.map((equipment) => (
              <li key={equipment}>{equipment}</li>
            ))}
          </ul>
        </section>

        <section className={styles.commentSection} aria-label="댓글">
          <div className={styles.commentHeader}>
            <h2>댓글 {comments.length}</h2>
            <span>마감 상태에서도 댓글 작성이 가능합니다.</span>
          </div>
          <div className={styles.commentInputBox}>
            <div className={styles.authorModeRow}>
              <label>
                <input
                  type="radio"
                  name="authorMode"
                  value="nickname"
                  checked={authorMode === 'nickname'}
                  onChange={() => setAuthorMode('nickname')}
                />
                닉네임
              </label>
              <label>
                <input
                  type="radio"
                  name="authorMode"
                  value="anonymous"
                  checked={authorMode === 'anonymous'}
                  onChange={() => setAuthorMode('anonymous')}
                />
                익명
              </label>
            </div>

            {authorMode === 'nickname' ? (
              <input
                type="text"
                placeholder="닉네임을 입력해 주세요."
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
              />
            ) : null}

            <div className={styles.commentEditorRow}>
              <textarea
                placeholder="댓글을 입력해 주세요."
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
              />
              <button type="button" onClick={onSubmitComment}>
                등록
              </button>
            </div>
          </div>

          <ul className={styles.commentList}>
            {comments.map((comment) => (
              <li key={comment.id}>
                <div>
                  <strong>{comment.author}</strong>
                  <span>{comment.createdAt}</span>
                </div>
                <p>{comment.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.backSection} aria-label="뒤로가기">
          <Link href="/market?tab=studio">공방 쉐어 목록으로 돌아가기</Link>
        </section>
      </article>
    </TwoMenuShell>
  );
}
