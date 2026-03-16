'use client';

import Link from 'next/link';
import { useState } from 'react';
import TwoMenuShell from './TwoMenuShell';
import styles from './ComposeWorkspace.module.css';
import {
  buildMarketComposeDraft,
  marketComposeGuide,
  marketComposePublishingSteps
} from './marketComposeData';

export default function MarketComposeView() {
  const [draft, setDraft] = useState(() => buildMarketComposeDraft());

  const selectedTemplate =
    marketComposeGuide.templates.find((template) => template.id === draft.selectedTemplateId) ??
    marketComposeGuide.templates[0];
  const previewTags = draft.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 4);
  const completedRequiredFields = [
    draft.title,
    draft.region,
    draft.availability,
    draft.priceLabel,
    draft.summary,
    draft.highlights,
    draft.hostNote
  ].filter((field) => field.trim().length > 0).length;
  const totalChecklistItems = marketComposeGuide.checklist.length;
  const readinessScore = Math.round(
    ((completedRequiredFields + draft.completedChecklistIds.length) /
      (7 + totalChecklistItems)) *
      100
  );
  const activeStepIndex =
    readinessScore >= 100
      ? marketComposePublishingSteps.length - 1
      : Math.min(2, Math.floor(readinessScore / 34));
  const listHref = '/market';

  const applyTemplatePreset = (templateId: string) => {
    setDraft(buildMarketComposeDraft(templateId));
  };

  const toggleChecklistItem = (itemId: string) => {
    setDraft((current) => ({
      ...current,
      completedChecklistIds: current.completedChecklistIds.includes(itemId)
        ? current.completedChecklistIds.filter((id) => id !== itemId)
        : [...current.completedChecklistIds, itemId]
    }));
  };

  const markChecklistComplete = () => {
    setDraft((current) => ({
      ...current,
      completedChecklistIds: marketComposeGuide.checklist.map((item) => item.id)
    }));
  };

  return (
    <TwoMenuShell
      activeMenu="market"
      title="공방 등록하기"
      subtitle="운영 방식에 맞는 소개 톤을 먼저 고르고, 가격·이용 조건·공간 분위기를 한 흐름으로 정리하세요."
      ctaLabel="마켓으로 돌아가기"
      ctaHref={listHref}
    >
      <section className={styles.overviewSection} aria-label="공방 등록 흐름 소개">
        <div className={styles.overviewCard}>
          <span className={styles.eyebrow}>{marketComposeGuide.eyebrow}</span>
          <h2 className={styles.overviewTitle}>{marketComposeGuide.intro}</h2>
          <p className={styles.overviewDescription}>{marketComposeGuide.valuePitch}</p>
          <div className={styles.pillRow}>
            <span>소개 템플릿 {marketComposeGuide.templates.length}개</span>
            <span>{marketComposeGuide.boardPulse}</span>
            <span>신뢰 체크 {marketComposeGuide.checklist.length}개</span>
          </div>
        </div>

        <aside className={styles.progressCard}>
          <span className={styles.progressLabel}>등록 준비 점수</span>
          <strong className={styles.progressValue}>{readinessScore}%</strong>
          <div
            className={styles.progressMeter}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={readinessScore}
            aria-label="공방 등록 준비도"
          >
            <span className={styles.progressFill} style={{ width: `${readinessScore}%` }} />
          </div>
          <p className={styles.progressDescription}>
            필수 입력 {completedRequiredFields}/7 · 신뢰 체크 {draft.completedChecklistIds.length}/
            {marketComposeGuide.checklist.length}
          </p>
          <p className={styles.progressNote}>{marketComposeGuide.moderationNote}</p>
        </aside>
      </section>

      <div className={styles.workspaceGrid}>
        <div className={styles.mainColumn}>
          <section className={styles.sectionCard} aria-label="소개 템플릿 선택">
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Step 1</span>
                <h3 className={styles.sectionTitle}>운영 방식에 맞는 소개 템플릿 고르기</h3>
              </div>
              <p className={styles.sectionDescription}>
                하루 쉐어, 고정 입주, 클래스 겸용처럼 문의 성격에 맞는 템플릿을 먼저 고르면 기본 문장이
                바로 맞춰집니다.
              </p>
            </div>

            <div className={styles.templateGrid}>
              {marketComposeGuide.templates.map((template) => {
                const isSelected = template.id === draft.selectedTemplateId;

                return (
                  <button
                    key={template.id}
                    type="button"
                    className={`${styles.templateButton} ${isSelected ? styles.templateButtonActive : ''}`}
                    onClick={() => applyTemplatePreset(template.id)}
                    aria-pressed={isSelected}
                  >
                    <span>{template.label}</span>
                    <strong>{template.description}</strong>
                  </button>
                );
              })}
            </div>
          </section>

          <section className={styles.sectionCard} aria-label="공방 등록 정보 작성">
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Step 2</span>
                <h3 className={styles.sectionTitle}>문의 전에 필요한 핵심 조건 채우기</h3>
              </div>
              <p className={styles.sectionDescription}>
                위치, 가격, 시간표만이 아니라 공간의 분위기와 사용 경험이 함께 보이도록 입력 흐름을
                구성했습니다.
              </p>
            </div>

            <div className={styles.fieldGrid}>
              <label className={styles.fieldBlock}>
                <span>등록 제목</span>
                <input
                  className={styles.textInput}
                  value={draft.title}
                  onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                  placeholder={marketComposeGuide.titlePlaceholder}
                />
              </label>

              <label className={styles.fieldBlock}>
                <span>지역 / 접근성</span>
                <input
                  className={styles.textInput}
                  value={draft.region}
                  onChange={(event) => setDraft((current) => ({ ...current, region: event.target.value }))}
                  placeholder="예: 성수 · 서울숲 도보 8분"
                />
              </label>

              <label className={styles.fieldBlock}>
                <span>이용 가능 시간</span>
                <input
                  className={styles.textInput}
                  value={draft.availability}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, availability: event.target.value }))
                  }
                  placeholder="예: 평일 11:00-19:00"
                />
              </label>

              <label className={styles.fieldBlock}>
                <span>가격 / 최소 이용 단위</span>
                <input
                  className={styles.textInput}
                  value={draft.priceLabel}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, priceLabel: event.target.value }))
                  }
                  placeholder="예: 1일 85,000원"
                />
              </label>

              <label className={`${styles.fieldBlock} ${styles.fieldBlockWide}`}>
                <span>공간 소개</span>
                <textarea
                  className={styles.textArea}
                  value={draft.summary}
                  onChange={(event) => setDraft((current) => ({ ...current, summary: event.target.value }))}
                  placeholder="이 공간이 누구에게 잘 맞는지, 어떤 분위기인지 적어보세요."
                />
              </label>

              <label className={`${styles.fieldBlock} ${styles.fieldBlockWide}`}>
                <span>하이라이트</span>
                <textarea
                  className={styles.textArea}
                  value={draft.highlights}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, highlights: event.target.value }))
                  }
                  placeholder="예: 채광, 기본 공구, 클래스 좌석, 촬영 존"
                />
                <p className={styles.fieldHint}>쉼표로 나열해도 좋고, 장비/좌석/촬영 요소를 짧게 적어도 충분합니다.</p>
              </label>

              <label className={`${styles.fieldBlock} ${styles.fieldBlockWide}`}>
                <span>운영 메모</span>
                <textarea
                  className={styles.textArea}
                  value={draft.hostNote}
                  onChange={(event) => setDraft((current) => ({ ...current, hostNote: event.target.value }))}
                  placeholder="문의 전에 알려주고 싶은 운영 원칙이나 안내를 적어보세요."
                />
              </label>

              <label className={styles.fieldBlock}>
                <span>태그</span>
                <input
                  className={styles.textInput}
                  value={draft.tags}
                  onChange={(event) => setDraft((current) => ({ ...current, tags: event.target.value }))}
                  placeholder="쉼표로 구분해 적어주세요."
                />
              </label>
            </div>
          </section>

          <section className={styles.sectionCard} aria-label="등록 전 체크리스트">
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Step 3</span>
                <h3 className={styles.sectionTitle}>문의 전환을 위한 신뢰 체크리스트</h3>
              </div>
              <p className={styles.sectionDescription}>
                등록 화면이 상품 관리 화면처럼 보이지 않도록, 사용자가 실제로 궁금해하는 조건을 먼저
                정리하는 항목들입니다.
              </p>
            </div>

            <div className={styles.checklistGrid}>
              {marketComposeGuide.checklist.map((item) => {
                const isChecked = draft.completedChecklistIds.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.checklistButton} ${isChecked ? styles.checklistButtonActive : ''}`}
                    onClick={() => toggleChecklistItem(item.id)}
                    aria-pressed={isChecked}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.description}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className={styles.sideColumn}>
          <section className={styles.sideCard} aria-label="등록 가이드">
            <span className={styles.sideEyebrow}>Hosting Guide</span>
            <h3 className={styles.sideTitle}>{selectedTemplate.label}</h3>
            <p className={styles.sideDescription}>{selectedTemplate.description}</p>
            <ul className={styles.noteList}>
              {marketComposeGuide.supportNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>

          <section className={styles.sideCard} aria-label="등록 미리보기">
            <span className={styles.sideEyebrow}>Preview</span>
            <div className={styles.previewCard}>
              <span className={styles.previewMeta}>공방 쉐어 · {selectedTemplate.label}</span>
              <strong className={styles.previewTitle}>{draft.title || marketComposeGuide.titlePlaceholder}</strong>
              <p className={styles.previewBody}>{draft.summary || marketComposeGuide.valuePitch}</p>
              <p className={styles.previewFootnote}>
                {draft.region || '지역 입력'} · {draft.priceLabel || '가격 입력'} ·{' '}
                {draft.availability || '시간 입력'}
              </p>
              <p className={styles.previewFootnote}>{draft.hostNote || marketComposeGuide.moderationNote}</p>
              <div className={styles.previewTags}>
                {previewTags.length > 0 ? previewTags.map((tag) => <span key={tag}>#{tag}</span>) : <span>#공방_태그를_추가해보세요</span>}
              </div>
            </div>
          </section>

          <section className={styles.sideCard} aria-label="등록 준비 단계">
            <span className={styles.sideEyebrow}>Publishing Rail</span>
            <div className={styles.stepList}>
              {marketComposePublishingSteps.map((step, index) => (
                <div
                  key={step}
                  className={`${styles.stepItem} ${index <= activeStepIndex ? styles.stepItemActive : ''}`}
                >
                  <span>{index + 1}</span>
                  <strong>{step}</strong>
                </div>
              ))}
            </div>
            <div className={styles.actionRow}>
              <button type="button" className={styles.primaryAction} onClick={markChecklistComplete}>
                체크리스트 모두 완료
              </button>
              <Link href={listHref} className={styles.secondaryAction}>
                공방 흐름 보기
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </TwoMenuShell>
  );
}
