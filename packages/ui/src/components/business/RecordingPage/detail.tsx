import type { DslNode } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';
import { isValidElement, type ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import { Avatar } from '../../components/Avatar/index.js';
import { Badge } from '../../components/Badge/index.js';
import { Button } from '../../components/Button/index.js';
import { Icon } from '../../components/Icon/index.js';
import { Progress } from '../../components/Progress/index.js';
import { Text } from '../../components/Text/index.js';
import { RecordingInsightView } from './insight.js';
import { RecordingMemoryView } from './memory.js';
import { RecordingSummaryView } from './summary.js';
import { RecordingTranslationView } from './translation.js';
import type {
  RecordingInsight,
  RecordingMemory,
  RecordingPlayer,
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
  onEdit?: () => void;
  onShare?: () => void;
  tabs: RecordingTabItem[];
  /** 当前激活页签 key（已解析受控 / 非受控） */
  activeTab?: string;
  onTabChange: (key: string) => void;
  transcriptTabKey: string;
  segments: RecordingTranscriptSegment[];
  summary?: RecordingSummary;
  summaryTabKey: string;
  onMindmapAction?: () => void;
  onMaterialClick?: (id: string | number) => void;
  onTodoClick?: (id: string | number) => void;
  onSummaryAction?: (key: string) => void;
  insight?: RecordingInsight;
  insightTabKey: string;
  onPerspectiveEdit?: () => void;
  onInsightAction?: (key: string) => void;
  memory?: RecordingMemory;
  memoryTabKey: string;
  onMemoryAction?: (key: string) => void;
  translation?: RecordingTranslation;
  translationTabKey: string;
  onLanguageClick?: () => void;
  onTranslationAction?: (key: string) => void;
  player?: RecordingPlayer;
  onPlay?: () => void;
  onSkipBack?: () => void;
  onSkipForward?: () => void;
}

function TranscriptSegment({
  segment,
}: {
  segment: RecordingTranscriptSegment;
}) {
  return (
    <div data-slot="recording-segment" className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar fallback={segment.avatarText ?? segment.speaker?.charAt(0) ?? '?'} />
          <Text text={segment.speaker} strong size="small" />
          <Icon name="pencil" size={14} className="text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          {segment.marked ? <Badge text="⚑ 已标记" variant="outline" /> : null}
          <Text text={segment.time} size="small" type="secondary" />
        </div>
      </div>
      <Text text={segment.content} />
    </div>
  );
}

/**
 * 转写详情（RecordingPage 右列）：标题 + 元信息头部（编辑 / 分享操作）、
 * 胶囊页签（transcriptTabKey 页签内建说话人段落、summaryTabKey 页签内建
 * 详细纪要，其余页签走 content 槽）、底部播放条（player 提供才渲染）。
 */
export function RecordingDetail({
  title,
  meta,
  editLabel,
  shareLabel,
  onEdit,
  onShare,
  tabs,
  activeTab,
  onTabChange,
  transcriptTabKey,
  segments,
  summary,
  summaryTabKey,
  onMindmapAction,
  onMaterialClick,
  onTodoClick,
  onSummaryAction,
  insight,
  insightTabKey,
  onPerspectiveEdit,
  onInsightAction,
  memory,
  memoryTabKey,
  onMemoryAction,
  translation,
  translationTabKey,
  onLanguageClick,
  onTranslationAction,
  player,
  onPlay,
  onSkipBack,
  onSkipForward,
}: RecordingDetailProps) {
  const { renderChildren } = useRenderer();
  // 槽位渲染：React 元素直接渲染，其余按 DslNode 走 Renderer
  const renderSlot = (slot: DslNode | ReactNode): ReactNode =>
    isValidElement(slot) || typeof slot !== 'object' || slot === null
      ? slot
      : renderChildren([slot as DslNode]);

  const activeTabItem = tabs.find((tab) => tab.key === activeTab);

  return (
    <div data-slot="recording-page-detail" className="flex h-full min-w-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
        <div className="flex min-w-0 flex-col gap-1">
          <Text text={title} strong size="large" className="truncate" />
          {meta !== undefined ? <Text text={meta} size="small" type="secondary" /> : null}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {editLabel !== undefined ? (
            <Button text={editLabel} variant="link" size="small" onClick={() => onEdit?.()} />
          ) : null}
          {shareLabel !== undefined ? (
            <Button text={shareLabel} size="small" onClick={() => onShare?.()} />
          ) : null}
        </div>
      </div>
      {tabs.length > 0 ? (
        <>
          <div data-slot="recording-page-tabs" className="flex shrink-0 justify-center px-6 pt-3">
            <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
              {tabs.map((tab) => {
                const active = tab.key === activeTab;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={cn(
                      'cursor-pointer rounded-md px-3 py-1 text-sm',
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
                  <TranscriptSegment key={segment.time ?? index} segment={segment} />
                ))}
              </div>
            ) : activeTabItem?.key === summaryTabKey && summary !== undefined ? (
              <RecordingSummaryView
                summary={summary}
                onMindmapAction={onMindmapAction}
                onMaterialClick={onMaterialClick}
                onTodoClick={onTodoClick}
                onSummaryAction={onSummaryAction}
              />
            ) : activeTabItem?.key === insightTabKey && insight !== undefined ? (
              <RecordingInsightView
                insight={insight}
                onPerspectiveEdit={onPerspectiveEdit}
                onInsightAction={onInsightAction}
              />
            ) : activeTabItem?.key === memoryTabKey && memory !== undefined ? (
              <RecordingMemoryView memory={memory} onMemoryAction={onMemoryAction} />
            ) : activeTabItem?.key === translationTabKey && translation !== undefined ? (
              <RecordingTranslationView
                translation={translation}
                onLanguageClick={onLanguageClick}
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
    </div>
  );
}
