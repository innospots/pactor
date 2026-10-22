import type { DslNode } from '@pactor-app/core';
import { useI18n, useRenderer } from '@pactor-app/runtime';
import { isValidElement, useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '../../lib/utils.js';
import { Avatar } from '@pactor-app/ui/components';
import { Badge } from '@pactor-app/ui/components';
import { Button } from '@pactor-app/ui/components';
import { Icon } from '@pactor-app/ui/components';
import { Progress } from '@pactor-app/ui/components';
import { Text } from '@pactor-app/ui/components';
import { RecordingInsightView } from './insight.js';
import { RecordingMemoryView } from './memory.js';
import { RecordingShare } from './share.js';
import { RecordingSpeakerDialog } from './speaker-dialog.js';
import { RecordingSummaryView } from './summary.js';
import { RecordingTranslationView } from './translation.js';
import type {
  RecordingInsight,
  RecordingLanguageChange,
  RecordingMemory,
  RecordingPlayer,
  RecordingShareOption,
  RecordingSpeaker,
  RecordingSpeakerChange,
  RecordingSummary,
  RecordingTabItem,
  RecordingTranscriptSegment,
  RecordingTranslation,
} from './types.js';

export interface RecordingDetailProps {
  title?: string;
  meta?: string;
  editLabel?: string;
  shareLabel?: string;
  /** 分享内容选项（Popover 复选列表）；非空时「分享」打开内建 Popover */
  shareOptions?: RecordingShareOption[];
  /** 分享内容选中 key 列表（已解析受控 / 非受控） */
  shareSelectedKeys?: string[];
  sharePopoverTitle?: string;
  shareCancelLabel?: string;
  shareConfirmLabel?: string;
  shareDialogTitle?: string;
  shareLink?: string;
  shareCopyLinkLabel?: string;
  shareCopiedLabel?: string;
  shareMailLabel?: string;
  shareSystemLabel?: string;
  onShareSelectionCommit?: (keys: string[]) => void;
  onShareConfirm?: (keys: string[]) => void;
  onShareChannel?: (channel: string) => void;
  onEdit?: () => void;
  onShare?: () => void;
  tabs: RecordingTabItem[];
  /** 当前激活页签 key（已解析受控 / 非受控） */
  activeTab?: string;
  onTabChange: (key: string) => void;
  transcriptTabKey: string;
  segments: RecordingTranscriptSegment[];
  /** 修改发言人弹层的人员选项列表 */
  speakers?: RecordingSpeaker[];
  speakerDialogTitle?: string;
  speakerDialogHint?: string;
  speakerInputPlaceholder?: string;
  speakerApplyLabel?: string;
  onSpeakerChange?: (change: RecordingSpeakerChange) => void;
  summary?: RecordingSummary;
  summaryTabKey: string;
  onMindmapAction?: () => void;
  onMaterialClick?: (id: string | number) => void;
  /** 当前选中的待办 id 列表（已解析受控 / 非受控） */
  selectedTodoIds: (string | number)[];
  /** 待办条目点击（组件内切换选中态并外发事件） */
  onTodoToggle: (id: string | number) => void;
  onSummaryAction?: (key: string) => void;
  insight?: RecordingInsight;
  insightTabKey: string;
  onPerspectiveEdit?: () => void;
  onPerspectiveApply?: (value: string) => void;
  onInsightAction?: (key: string) => void;
  memory?: RecordingMemory;
  memoryTabKey: string;
  onMemoryAction?: (key: string) => void;
  translation?: RecordingTranslation;
  translationTabKey: string;
  onLanguageClick?: () => void;
  onLanguageChange?: (change: RecordingLanguageChange) => void;
  onTranslationAction?: (key: string) => void;
  player?: RecordingPlayer;
  onPlay?: () => void;
  onSkipBack?: () => void;
  onSkipForward?: () => void;
}

function TranscriptSegment({
  segment,
  speaker,
  onRename,
}: {
  segment: RecordingTranscriptSegment;
  /** 展示用说话人名（可能被弹层改名覆盖） */
  speaker?: string;
  /** 点击改名铅笔 */
  onRename?: () => void;
}) {
  const { t } = useI18n();
  return (
    <div data-slot="recording-segment" className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar fallback={segment.avatarText ?? speaker?.charAt(0) ?? '?'} />
          <Text text={speaker} strong size="small" />
          <button
            type="button"
            data-slot="recording-speaker-edit"
            aria-label={t('pactor.recording.speakerDialogTitle')}
            className="cursor-pointer text-muted-foreground"
            onClick={() => onRename?.()}
          >
            <Icon name="pencil" size={14} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {segment.marked ? (
            <Badge text={t('pactor.recording.marked')} variant="outline" />
          ) : null}
          <Text text={segment.time} size="small" type="secondary" />
        </div>
      </div>
      <Text text={segment.content} />
    </div>
  );
}

/**
 * 转写详情（RecordingPage 右列）：标题 + 元信息头部（编辑 / 分享操作——
 * 提供 shareOptions 时「分享」下方弹出选择分享内容 Popover，确定后打开
 * 分享会议内容对话框）、胶囊页签（transcriptTabKey 页签内建说话人段落——改名铅笔打开内建
 * 「修改发言人」弹层（人员单选 + 自由输入，应用经 onSpeakerChange 传出
 * { index, previous, name }，组件内同步更新展示名）、summaryTabKey 页签
 * 内建详细纪要，其余页签走 content 槽）、底部播放条（player 提供才渲染）。
 */
export function RecordingDetail({
  title,
  meta,
  editLabel,
  shareLabel,
  shareOptions = [],
  shareSelectedKeys = [],
  sharePopoverTitle,
  shareCancelLabel,
  shareConfirmLabel,
  shareDialogTitle,
  shareLink,
  shareCopyLinkLabel,
  shareCopiedLabel,
  shareMailLabel,
  shareSystemLabel,
  onShareSelectionCommit,
  onShareConfirm,
  onShareChannel,
  onEdit,
  onShare,
  tabs,
  activeTab,
  onTabChange,
  transcriptTabKey,
  segments,
  speakers = [],
  speakerDialogTitle,
  speakerDialogHint,
  speakerInputPlaceholder,
  speakerApplyLabel,
  onSpeakerChange,
  summary,
  summaryTabKey,
  onMindmapAction,
  onMaterialClick,
  selectedTodoIds,
  onTodoToggle,
  onSummaryAction,
  insight,
  insightTabKey,
  onPerspectiveEdit,
  onPerspectiveApply,
  onInsightAction,
  memory,
  memoryTabKey,
  onMemoryAction,
  translation,
  translationTabKey,
  onLanguageClick,
  onLanguageChange,
  onTranslationAction,
  player,
  onPlay,
  onSkipBack,
  onSkipForward,
}: RecordingDetailProps) {
  const { t } = useI18n();
  const { renderChildren } = useRenderer();
  // 槽位渲染：React 元素直接渲染，其余按 DslNode 走 Renderer
  const renderSlot = (slot: DslNode | ReactNode): ReactNode =>
    isValidElement(slot) || typeof slot !== 'object' || slot === null
      ? slot
      : renderChildren([slot as DslNode]);

  const activeTabItem = tabs.find((tab) => tab.key === activeTab);

  // 发言人改名：弹层状态 + 草稿 + 组件内覆盖（segments 说话人名单变化时
  // 重置；DSL 下父级重渲染会产生新数组引用，故按内容签名比较而非引用）
  const [renameIndex, setRenameIndex] = useState<number | null>(null);
  const [draftSpeakerIndex, setDraftSpeakerIndex] = useState(-1);
  const [draftSpeakerName, setDraftSpeakerName] = useState('');
  const [speakerOverrides, setSpeakerOverrides] = useState<Record<number, string>>({});
  const speakerSignature = useRef('');
  useEffect(() => {
    const signature = JSON.stringify(segments.map((segment) => segment.speaker ?? ''));
    if (speakerSignature.current !== signature) {
      speakerSignature.current = signature;
      setSpeakerOverrides((prev) => (Object.keys(prev).length > 0 ? {} : prev));
    }
  }, [segments]);

  const displaySpeaker = (index: number): string | undefined =>
    speakerOverrides[index] ?? segments[index]?.speaker;
  const openRename = (index: number): void => {
    const current = displaySpeaker(index);
    setDraftSpeakerIndex(speakers.findIndex((item) => item.name === current));
    setDraftSpeakerName('');
    setRenameIndex(index);
  };
  const confirmRename = (): void => {
    if (renameIndex === null) return;
    const name =
      draftSpeakerName.trim() !== ''
        ? draftSpeakerName.trim()
        : speakers[draftSpeakerIndex]?.name;
    if (name === undefined || name === '') return;
    const previous = displaySpeaker(renameIndex);
    setSpeakerOverrides((prev) => ({ ...prev, [renameIndex]: name }));
    onSpeakerChange?.({ index: renameIndex, previous, name });
    setRenameIndex(null);
  };

  return (
    <div data-slot="recording-page-detail" className="flex h-full min-w-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between px-6 py-4">
        <div className="flex min-w-0 flex-col gap-1">
          <Text text={title} strong size="large" className="truncate" />
          {meta !== undefined ? <Text text={meta} size="small" type="secondary" /> : null}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {editLabel !== undefined ? (
            <Button text={editLabel} variant="link" size="small" onClick={() => onEdit?.()} />
          ) : null}
          {shareLabel !== undefined ? (
            shareOptions.length > 0 ? (
              <RecordingShare
                shareLabel={shareLabel}
                options={shareOptions}
                selectedKeys={shareSelectedKeys}
                popoverTitle={
                  sharePopoverTitle ?? t('pactor.recording.sharePopoverTitle')
                }
                cancelLabel={shareCancelLabel ?? t('pactor.overlay.cancel')}
                confirmLabel={
                  shareConfirmLabel ?? t('pactor.alertDialog.confirm')
                }
                dialogTitle={
                  shareDialogTitle ?? t('pactor.recording.shareDialogTitle')
                }
                link={shareLink}
                copyLinkLabel={
                  shareCopyLinkLabel ?? t('pactor.recording.copyLink')
                }
                copiedLabel={shareCopiedLabel ?? t('pactor.recording.copied')}
                mailLabel={shareMailLabel ?? t('pactor.recording.mail')}
                systemLabel={
                  shareSystemLabel ?? t('pactor.recording.systemShare')
                }
                onShare={onShare}
                onSelectionCommit={(keys) => onShareSelectionCommit?.(keys)}
                onShareConfirm={onShareConfirm}
                onShareChannel={onShareChannel}
              />
            ) : (
              <Button text={shareLabel} size="small" onClick={() => onShare?.()} />
            )
          ) : null}
        </div>
      </div>
      {tabs.length > 0 ? (
        <>
          <div data-slot="recording-page-tabs" className="flex shrink-0 px-6 pt-3">
            <div className="flex w-full items-center gap-1 rounded-lg bg-muted p-1">
              {tabs.map((tab) => {
                const active = tab.key === activeTab;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={cn(
                      'flex-1 cursor-pointer rounded-md px-3 py-1 text-sm',
                      active ? 'bg-background shadow-sm' : 'text-muted-foreground',
                    )}
                    onClick={() => onTabChange(tab.key)}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div
            data-slot="recording-page-tab-body"
            className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto px-6 py-4"
          >
            {activeTabItem?.content !== undefined ? (
              renderSlot(activeTabItem.content)
            ) : activeTabItem?.key === transcriptTabKey ? (
              <div className="flex flex-col gap-6">
                {segments.map((segment, index) => (
                  <TranscriptSegment
                    key={segment.time ?? index}
                    segment={segment}
                    speaker={displaySpeaker(index)}
                    onRename={() => openRename(index)}
                  />
                ))}
              </div>
            ) : activeTabItem?.key === summaryTabKey && summary !== undefined ? (
              <RecordingSummaryView
                summary={summary}
                onMindmapAction={onMindmapAction}
                onMaterialClick={onMaterialClick}
                selectedTodoIds={selectedTodoIds}
                onTodoToggle={onTodoToggle}
                onSummaryAction={onSummaryAction}
              />
            ) : activeTabItem?.key === insightTabKey && insight !== undefined ? (
              <RecordingInsightView
                insight={insight}
                onPerspectiveEdit={onPerspectiveEdit}
                onPerspectiveApply={onPerspectiveApply}
                onInsightAction={onInsightAction}
              />
            ) : activeTabItem?.key === memoryTabKey && memory !== undefined ? (
              <RecordingMemoryView memory={memory} onMemoryAction={onMemoryAction} />
            ) : activeTabItem?.key === translationTabKey && translation !== undefined ? (
              <RecordingTranslationView
                translation={translation}
                onLanguageClick={onLanguageClick}
                onLanguageChange={onLanguageChange}
                onTranslationAction={onTranslationAction}
              />
            ) : null}
          </div>
        </>
      ) : null}
      {player !== undefined ? (
        <div
          data-slot="recording-page-player"
          className="flex shrink-0 items-center gap-3 border-t border-border px-6 py-3"
        >
          <Button icon="rotate-ccw" variant="text" onClick={() => onSkipBack?.()} />
          <Button
            icon="play"
            style={{ borderRadius: 999 }}
            onClick={() => onPlay?.()}
          />
          <Button icon="rotate-cw" variant="text" onClick={() => onSkipForward?.()} />
          <Text text={player.currentTime} size="small" type="secondary" />
          <Progress value={player.progress} style={{ flex: 1 }} />
          <Text text={player.totalTime} size="small" type="secondary" />
        </div>
      ) : null}
      <RecordingSpeakerDialog
        open={renameIndex !== null}
        title={speakerDialogTitle ?? t('pactor.recording.speakerDialogTitle')}
        hint={speakerDialogHint ?? t('pactor.recording.speakerDialogHint')}
        speakers={speakers}
        selectedIndex={draftSpeakerIndex}
        customName={draftSpeakerName}
        inputPlaceholder={
          speakerInputPlaceholder ?? t('pactor.recording.speakerInputPlaceholder')
        }
        applyLabel={speakerApplyLabel ?? t('pactor.recording.speakerApply')}
        onSelect={setDraftSpeakerIndex}
        onInputName={setDraftSpeakerName}
        onCancel={() => setRenameIndex(null)}
        onConfirm={confirmRename}
      />
    </div>
  );
}
