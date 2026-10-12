import { useState } from 'react';

import { cn } from '../../../lib/utils.js';
import { RecordingDetail } from './detail.js';
import { RecordingList } from './list.js';
import type { RecordingPageProps } from './types.js';

export type {
  RecordingFilterItem,
  RecordingGroup,
  RecordingInsight,
  RecordingInsightChapter,
  RecordingInsightViewpoint,
  RecordingItem,
  RecordingMemory,
  RecordingMemoryGroup,
  RecordingMemoryItem,
  RecordingPageProps,
  RecordingPlayer,
  RecordingStatusType,
  RecordingSummary,
  RecordingSummaryAction,
  RecordingSummaryConclusion,
  RecordingSummaryMaterial,
  RecordingSummaryMindmap,
  RecordingSummaryTodo,
  RecordingSummaryTopic,
  RecordingTabItem,
  RecordingTranscriptSegment,
  RecordingTranslation,
  RecordingTranslationSegment,
} from './types.js';

/**
 * RecordingPage 录音工作区（business 目录）：左列录音记录列表
 * （标题 / 过滤 pills / 处理状态横幅 / 新建录音钮 / 分组条目——条目含波形
 * 图标、标题、状态标与日期时长，选中底色高亮），右列转写详情（标题 +
 * 元信息头部、编辑 / 分享操作、胶囊页签——transcriptTabKey 页签内建渲染
 * segments 说话人段落（头像 + 姓名 + 改名铅笔 + 时间戳 + 正文，可附
 * 「已标记」徽标），summaryTabKey 页签内建渲染 summary 结构化纪要
 * （思维导图 / 会议概况 / 主要议题 / 评审结论表 / 后续说明 / 相关材料 /
 * 待办事项 / 底部操作条，各段提供才展示），insightTabKey 页签内建渲染
 * insight AI 解读（视角横幅 / 基础信息 / 章节速览 / 观点分析 / 操作条），
 * memoryTabKey 页签内建渲染 memory 知识记忆（分组卡片，组标题自动拼接
 * 条目计数；底部操作条），translationTabKey 页签内建渲染 translation
 * 翻译（语言选择器 + 双语对照段落 + 操作条），其余页签可传 content 槽）、
 * 底部播放条（快退 / 播放 /
 * 快进 + 进度，提供 player 才渲染）。
 * 数据与行为全部经 props / events 进出；过滤、选中录音与页签缺省非受控，
 * 均可经受控 prop + change 事件闭环。常作为 ChatPage 的 content 槽使用。
 * 实现拆分：list.tsx（左列列表）/ detail.tsx（右列详情）/
 * summary.tsx（详细纪要）/ insight.tsx（AI 解读）/ memory.tsx（知识记忆）/
 * translation.tsx（翻译）/ types.ts（公开类型）。
 */
export function RecordingPage({
  listTitle = '录音记录列表',
  selectLabel,
  onSelectClick,
  filters = [],
  activeFilterKey,
  defaultActiveFilterKey,
  onFilterChange,
  processingText,
  processingHint,
  onProcessingClick,
  newRecordingLabel = '开始新录音',
  onNewRecording,
  groups = [],
  activeRecordingId,
  defaultActiveRecordingId,
  onSelectRecording,
  listWidth = 300,
  emptyText = '暂无录音',
  title,
  meta,
  editLabel,
  shareLabel,
  onEdit,
  onShare,
  tabs = [],
  activeTabKey,
  defaultActiveTabKey,
  onTabChange,
  transcriptTabKey = 'transcript',
  segments = [],
  summary,
  summaryTabKey = 'summary',
  onMindmapAction,
  onMaterialClick,
  onTodoClick,
  onSummaryAction,
  insight,
  insightTabKey = 'ai',
  onPerspectiveEdit,
  onInsightAction,
  memory,
  memoryTabKey = 'knowledge',
  onMemoryAction,
  translation,
  translationTabKey = 'translation',
  onLanguageClick,
  onTranslationAction,
  player,
  onPlay,
  onSkipBack,
  onSkipForward,
  className,
  style,
}: RecordingPageProps) {
  // 受控 prop 优先，缺省内部维护（同 ChatPage artifactOpen 模式）
  const filterControlled = activeFilterKey !== undefined;
  const [innerFilter, setInnerFilter] = useState(
    defaultActiveFilterKey ?? filters[0]?.key,
  );
  const activeFilter = filterControlled ? activeFilterKey : innerFilter;
  const setActiveFilter = (next: string): void => {
    if (!filterControlled) setInnerFilter(next);
    onFilterChange?.(next);
  };

  const recControlled = activeRecordingId !== undefined;
  const [innerRec, setInnerRec] = useState(defaultActiveRecordingId);
  const activeRec = recControlled ? activeRecordingId : innerRec;
  const setActiveRec = (next: string): void => {
    if (!recControlled) setInnerRec(next);
    onSelectRecording?.(next);
  };

  const tabControlled = activeTabKey !== undefined;
  const [innerTab, setInnerTab] = useState(defaultActiveTabKey ?? tabs[0]?.key);
  const activeTab = tabControlled ? activeTabKey : innerTab;
  const setActiveTab = (next: string): void => {
    if (!tabControlled) setInnerTab(next);
    onTabChange?.(next);
  };

  return (
    <div
      data-slot="recording-page"
      className={cn('flex h-full w-full min-h-0 items-stretch', className)}
      style={style}
    >
      <RecordingList
        listTitle={listTitle}
        selectLabel={selectLabel}
        onSelectClick={onSelectClick}
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        processingText={processingText}
        processingHint={processingHint}
        onProcessingClick={onProcessingClick}
        newRecordingLabel={newRecordingLabel}
        onNewRecording={onNewRecording}
        groups={groups}
        activeRecordingId={activeRec}
        onSelectRecording={setActiveRec}
        listWidth={listWidth}
        emptyText={emptyText}
      />
      <RecordingDetail
        title={title}
        meta={meta}
        editLabel={editLabel}
        shareLabel={shareLabel}
        onEdit={onEdit}
        onShare={onShare}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        transcriptTabKey={transcriptTabKey}
        segments={segments}
        summary={summary}
        summaryTabKey={summaryTabKey}
        onMindmapAction={onMindmapAction}
        onMaterialClick={onMaterialClick}
        onTodoClick={onTodoClick}
        onSummaryAction={onSummaryAction}
        insight={insight}
        insightTabKey={insightTabKey}
        onPerspectiveEdit={onPerspectiveEdit}
        onInsightAction={onInsightAction}
        memory={memory}
        memoryTabKey={memoryTabKey}
        onMemoryAction={onMemoryAction}
        translation={translation}
        translationTabKey={translationTabKey}
        onLanguageClick={onLanguageClick}
        onTranslationAction={onTranslationAction}
        player={player}
        onPlay={onPlay}
        onSkipBack={onSkipBack}
        onSkipForward={onSkipForward}
      />
    </div>
  );
}
