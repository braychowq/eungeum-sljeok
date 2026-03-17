'use client';

import Link from 'next/link';
import { useState } from 'react';
import ProductChoiceCard from '../common/ProductChoiceCard';
import ProductField from '../common/ProductField';
import ProductSectionHeader from '../common/ProductSectionHeader';
import { communityTabs, type CommunityTabId } from './mockData';
import TwoMenuShell from './TwoMenuShell';
import {
  buildCommunityComposeDraft,
  communityComposeData,
  communityComposePublishingSteps
} from './communityComposeData';
import styles from './ComposeWorkspace.module.css';

type CommunityComposeViewProps = {
  initialTab: CommunityTabId;
};

export default function CommunityComposeView({ initialTab }: CommunityComposeViewProps) {
  const [draft, setDraft] = useState(() => buildCommunityComposeDraft(initialTab));

  const guide = communityComposeData[draft.activeTab];
  const selectedTemplate =
    guide.templates.find((template) => template.id === draft.selectedTemplateId) ?? guide.templates[0];
  const requiredFieldStatus = [
    { label: '제목', filled: draft.title.trim().length > 0 },
    { label: '첫 문장', filled: draft.context.trim().length > 0 },
    { label: '본문 핵심', filled: draft.details.trim().length > 0 },
    { label: '마지막 한 줄', filled: draft.request.trim().length > 0 }
  ];
  const missingFieldLabels = requiredFieldStatus.filter((field) => !field.filled).map((field) => field.label);
  const previewTags = draft.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 4);
  const completedRequiredFields = [
    draft.title,
    draft.context,
    draft.details,
    draft.request
  ].filter((field) => field.trim().length > 0).length;
  const totalChecklistItems = guide.checklist.length;
  const readinessScore = Math.round(
    ((completedRequiredFields + draft.completedChecklistIds.length) /
      (4 + totalChecklistItems)) *
      100
  );
  const activeStepIndex =
    readinessScore >= 100 ? communityComposePublishingSteps.length - 1 : Math.min(2, Math.floor(readinessScore / 34));
  const activePublishingStep = communityComposePublishingSteps[activeStepIndex];
  const readinessMessage =
    missingFieldLabels.length > 0
      ? `아직 ${missingFieldLabels.join(', ')} 입력이 남아 있습니다. 핵심 맥락부터 채우면 게시 준비가 더 빨라집니다.`
      : '핵심 입력은 모두 채워졌습니다. 체크리스트만 정리하면 바로 게시 흐름으로 이어갈 수 있습니다.';

  const applyDraftPreset = (tabId: CommunityTabId, templateId?: string) => {
    setDraft(buildCommunityComposeDraft(tabId, templateId));
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
      completedChecklistIds: guide.checklist.map((item) => item.id)
    }));
  };

  const listHref = `/community?tab=${draft.activeTab}`;

  return (
    <TwoMenuShell
      activeMenu="community"
      title="커뮤니티 글 올리기"
      subtitle="탭 분위기에 맞는 포맷과 체크리스트를 먼저 고르고, 사람에게 읽히는 문장 흐름까지 한 번에 정리하세요."
      ctaLabel="커뮤니티로 돌아가기"
      ctaHref={listHref}
    >
      <section className={styles.overviewSection} aria-label="작성 흐름 소개">
        <div className={styles.overviewCard}>
          <span className={styles.eyebrow}>{guide.eyebrow}</span>
          <h2 className={styles.overviewTitle}>{guide.intro}</h2>
          <p className={styles.overviewDescription}>{guide.valuePitch}</p>
          <div className={styles.pillRow}>
            <span>{guide.label} 글감</span>
            <span>{guide.boardPulse}</span>
            <span>체크리스트 {guide.checklist.length}개</span>
          </div>
          <div className={styles.signalRow}>
            <div className={styles.signalCard}>
              <span className={styles.signalLabel}>Board pulse</span>
              <strong>{guide.label} 대화 톤</strong>
              <p>{guide.boardPulse}</p>
            </div>
            <div className={styles.signalCard}>
              <span className={styles.signalLabel}>Selected format</span>
              <strong>{selectedTemplate.label}</strong>
              <p>{selectedTemplate.description}</p>
            </div>
            <div className={styles.signalCard}>
              <span className={styles.signalLabel}>Next focus</span>
              <strong>{activePublishingStep}</strong>
              <p>신뢰 체크 {draft.completedChecklistIds.length}/{guide.checklist.length}</p>
            </div>
          </div>
        </div>

        <aside className={styles.progressCard}>
          <span className={styles.progressLabel}>게시 준비 점수</span>
          <strong className={styles.progressValue}>{readinessScore}%</strong>
          <p className={styles.progressStage}>현재 집중: {activePublishingStep}</p>
          <div
            className={styles.progressMeter}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={readinessScore}
            aria-label="게시 준비도"
          >
            <span className={styles.progressFill} style={{ width: `${readinessScore}%` }} />
          </div>
          <p className={styles.progressDescription}>
            필수 입력 {completedRequiredFields}/4 · 신뢰 체크 {draft.completedChecklistIds.length}/
            {guide.checklist.length}
          </p>
          <p className={styles.progressNote}>{guide.moderationNote}</p>
        </aside>
      </section>

      <div className={styles.workspaceGrid}>
        <div className={styles.mainColumn}>
          <section className={styles.sectionCard} aria-label="주제 선택">
            <ProductSectionHeader
              eyebrow="Step 1"
              title="어떤 분위기의 글을 쓸지 고르기"
              description="커뮤니티 탭과 템플릿을 함께 바꾸면 문장 구조와 체크리스트가 즉시 맞춰집니다."
              titleAs="h3"
              compact
              className={styles.sectionHeader}
            />

            <div className={styles.tabGrid}>
              {communityTabs.map((tab) => {
                const tabGuide = communityComposeData[tab.id];
                const isActive = tab.id === draft.activeTab;

                return (
                  <ProductChoiceCard
                    key={tab.id}
                    className={styles.communityChoiceCard}
                    eyebrow={tab.label}
                    title={tabGuide.intro}
                    description={tabGuide.boardPulse}
                    selected={isActive}
                    onClick={() => applyDraftPreset(tab.id)}
                    aria-pressed={isActive}
                  />
                );
              })}
            </div>

            <div className={styles.templateGrid}>
              {guide.templates.map((template) => {
                const isSelected = template.id === draft.selectedTemplateId;

                return (
                  <ProductChoiceCard
                    key={template.id}
                    className={styles.communityChoiceCard}
                    eyebrow="Template"
                    title={template.label}
                    description={template.description}
                    selected={isSelected}
                    onClick={() => applyDraftPreset(draft.activeTab, template.id)}
                    aria-pressed={isSelected}
                  />
                );
              })}
            </div>
          </section>

          <section className={styles.sectionCard} aria-label="글 내용 작성">
            <ProductSectionHeader
              eyebrow="Step 2"
              title="핵심 정보 먼저 채우기"
              description="제목, 상황, 시도한 내용, 받고 싶은 답변까지 한 번에 정리하면 읽히는 속도가 달라집니다."
              titleAs="h3"
              compact
              className={styles.sectionHeader}
            />

            <div className={styles.fieldPromptGrid}>
              <div className={styles.fieldPrompt}>
                <span>Title cue</span>
                <strong>{selectedTemplate.titleSuggestion}</strong>
                <p>제목에서 글의 목적이 바로 드러나면 열람과 답변 전환이 빨라집니다.</p>
              </div>
              <div className={styles.fieldPrompt}>
                <span>Context note</span>
                <strong>{guide.supportNotes[0]}</strong>
                <p>첫 문단은 상황 설명보다 현재 조건을 읽히게 만드는 데 집중합니다.</p>
              </div>
              <div className={styles.fieldPrompt}>
                <span>Closing line</span>
                <strong>{guide.supportNotes[1]}</strong>
                <p>마지막 한 줄은 독자가 답하기 쉬운 질문이나 요청으로 닫는 편이 좋습니다.</p>
              </div>
            </div>

            <div className={styles.fieldGrid}>
              <ProductField
                label="제목"
                caption="질문이나 공유 목적이 첫눈에 보이게 적어주세요."
                className={styles.communityField}
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                placeholder={guide.titlePlaceholder}
              />

              <ProductField
                kind="textarea"
                className={`${styles.communityField} ${styles.fieldBlockWide}`}
                label="첫 문장"
                caption="지금의 상황과 맥락을 2~3문장 안에서 잡아주세요."
                value={draft.context}
                onChange={(event) => setDraft((current) => ({ ...current, context: event.target.value }))}
                placeholder="지금 겪는 상황이나 공유하려는 맥락을 먼저 적어보세요."
              />

              <ProductField
                kind="textarea"
                className={`${styles.communityField} ${styles.fieldBlockWide}`}
                label="본문 핵심"
                caption="이미 시도한 방법, 조건값, 핵심 포인트를 중심으로 적어주세요."
                value={draft.details}
                onChange={(event) => setDraft((current) => ({ ...current, details: event.target.value }))}
                placeholder="이미 시도한 것, 핵심 포인트, 독자가 꼭 알아야 할 조건을 적어주세요."
              />

              <ProductField
                kind="textarea"
                className={`${styles.communityField} ${styles.fieldBlockWide}`}
                label="마지막 한 줄"
                caption="받고 싶은 피드백이나 이어질 질문으로 글을 마무리하세요."
                value={draft.request}
                onChange={(event) => setDraft((current) => ({ ...current, request: event.target.value }))}
                placeholder="받고 싶은 피드백이나 이어질 질문을 적어보세요."
              />

              <ProductField
                label="태그"
                caption="검색보다 대화 맥락을 돕는 단어를 쉼표로 적어주세요."
                className={styles.communityField}
                value={draft.tags}
                onChange={(event) => setDraft((current) => ({ ...current, tags: event.target.value }))}
                placeholder="쉼표로 구분해 적어주세요."
              />
            </div>
          </section>

          <section className={styles.sectionCard} aria-label="게시 전 체크리스트">
            <ProductSectionHeader
              eyebrow="Step 3"
              title="신뢰 체크리스트 확인"
              description="운영 기준과 독자 이해도를 동시에 맞추기 위한 최소 확인 항목입니다."
              titleAs="h3"
              compact
              className={styles.sectionHeader}
            />

            <div className={styles.checklistGrid}>
              {guide.checklist.map((item) => {
                const isChecked = draft.completedChecklistIds.includes(item.id);

                return (
                  <ProductChoiceCard
                    key={item.id}
                    className={styles.communityChoiceCard}
                    eyebrow={isChecked ? 'Checked' : 'Checklist'}
                    title={item.label}
                    description={item.description}
                    selected={isChecked}
                    onClick={() => toggleChecklistItem(item.id)}
                    aria-pressed={isChecked}
                  />
                );
              })}
            </div>
          </section>
        </div>

        <aside className={styles.sideColumn}>
          <section className={styles.sideCard} aria-label="작성 가이드">
            <span className={styles.sideEyebrow}>Writing Guide</span>
            <h3 className={styles.sideTitle}>{selectedTemplate.label}</h3>
            <p className={styles.sideDescription}>{selectedTemplate.description}</p>
            <ul className={styles.noteList}>
              {guide.supportNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>

          <section id="compose-preview" className={styles.sideCard} aria-label="게시 미리보기">
            <span className={styles.sideEyebrow}>Preview</span>
            <div className={styles.previewCard}>
              <span className={styles.previewMeta}>
                {guide.label} · {selectedTemplate.label}
              </span>
              <strong className={styles.previewTitle}>{draft.title || guide.titlePlaceholder}</strong>
              <p className={styles.previewBody}>{draft.context || guide.intro}</p>
              <p className={styles.previewSecondary}>{draft.details || selectedTemplate.description}</p>
              <p className={styles.previewFootnote}>{draft.request || guide.valuePitch}</p>
              <div className={styles.previewTags}>
                {previewTags.length > 0 ? previewTags.map((tag) => <span key={tag}>#{tag}</span>) : <span>#태그를_추가해보세요</span>}
              </div>
            </div>
          </section>

          <section className={styles.sideCard} aria-label="게시 준비 상태">
            <span className={styles.sideEyebrow}>Publishing tray</span>
            <div className={styles.launchTray}>
              <div className={styles.launchSummary}>
                <span className={styles.launchLabel}>Readiness</span>
                <div className={styles.launchHeadline}>
                  <strong>{readinessScore}%</strong>
                  <span>{activePublishingStep}</span>
                </div>
                <p className={styles.launchDescription}>{readinessMessage}</p>
              </div>

              <div className={styles.launchChecklist} aria-label="핵심 입력 상태">
                {requiredFieldStatus.map((field) => (
                  <span
                    key={field.label}
                    className={`${styles.launchItem} ${field.filled ? styles.launchItemComplete : ''}`}
                  >
                    {field.label}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.stepList}>
              {communityComposePublishingSteps.map((step, index) => (
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
                게시 준비 흐름 정리
              </button>
              <p className={styles.actionFootnote}>
                필수 입력 {completedRequiredFields}/4 · 신뢰 체크 {draft.completedChecklistIds.length}/
                {guide.checklist.length}
              </p>
              <div className={styles.actionRowSecondary}>
                <Link href={listHref} className={styles.secondaryAction}>
                  이 주제 흐름 보기
                </Link>
                <a href="#compose-preview" className={styles.secondaryAction}>
                  미리보기로 이동
                </a>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </TwoMenuShell>
  );
}
