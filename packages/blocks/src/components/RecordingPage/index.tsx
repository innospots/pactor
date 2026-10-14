import { useState } from 'react';

import { cn } from '../../lib/utils.js';
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
  RecordingLanguageChange,
  RecordingLanguageOption,
  RecordingMemory,
  RecordingMemoryGroup,
  RecordingMemoryItem,
  RecordingPageProps,
  RecordingPlayer,
  RecordingShareOption,
  RecordingStatusType,
  RecordingSummary,
  RecordingSummaryAction,
  RecordingSummaryConclusion,
  RecordingSummaryMaterial,
  RecordingSummaryMindmap,
  RecordingSummaryTodo,
  RecordingSummaryTopic,
  RecordingSpeaker,
  RecordingSpeakerChange,
  RecordingTabItem,
  RecordingTranscriptSegment,
  RecordingTranslation,
  RecordingTranslationSegment,
} from './types.js';

/**
 * RecordingPage 录音工作区（business 目录）：左列录音记录列表（浅色
 * 圆角块容器，无右边框——标题 / 过滤 pills / 处理状态横幅 / 新建录音钮 /
 * 分组条目——条目含波形
 * 图标、标题、状态标与日期时长，选中白底高亮；点「选择」进入多选模式：
 * 条目左侧圆形复选框、顶部「已选 N 条 + 全选」、底部红色「删除」（点击先弹
 * 二次确认弹层，确认才经 onDeleteRecordings 传出选中 id 列表），勾选
 * 经 onRecordingSelectionChange 传出 id
 * 列表），右列转写详情（标题 +
 * 元信息头部、编辑 / 分享操作（提供 shareOptions 时分享按钮下方弹出
 * 「选择分享内容」复选 Popover，确定经 onShareConfirm 传出选中 key 列表
 * 并打开「分享会议内容」对话框：链接 + 复制链接 / 邮件 / 系统分享，渠道
 * 点击经 onShareChannel 传出）、胶囊页签——transcriptTabKey 页签内建渲染
 * segments 说话人段落（头像 + 姓名 + 改名铅笔（打开内建修改发言人弹层，
 * 应用经 onSpeakerChange 传出 { index, previous, name }）+ 时间戳 +
 * 正文，可附「已标记」徽标），summaryTabKey 页签内建渲染 summary 结构化纪要
 * （思维导图 / 会议概况 / 主要议题 / 评审结论表 / 后续说明 / 相关材料 /
 * 待办事项（点击切换选中态，变更经 onTodoSelectionChange 传出完整选中
 * id 列表）/ 底部操作条，各段提供才展示），insightTabKey 页签内建渲染
 * insight AI 解读（视角横幅 / 解读身份弹层（修改入口，应用经
 * onPerspectiveApply 传出文本）/ 基础信息 / 章节速览 / 观点分析 /
 * 操作条），
 * memoryTabKey 页签内建渲染 memory 知识记忆（分组卡片，组标题自动拼接
 * 条目计数；底部操作条），translationTabKey 页签内建渲染 translation
 * 翻译（语言选择器 + 内建语种弹层（原文语言识别 / 译文语言选择单选，
 * 确定经 onLanguageChange 传出 { source, sourceLabel, target,
 * targetLabel }）+ 双语对照段落 + 操作条），其余页签可传 content 槽）、
 * 底部播放条（快退 / 播放 /
 * 快进 + 进度，提供 player 才渲染）。
 * 数据与行为全部经 props / events 进出；过滤、选中录音与页签缺省非受控，
 * 均可经受控 prop + change 事件闭环。常作为 ChatPage 的 content 槽使用。
 * 实现拆分：list.tsx（左列列表）/ detail.tsx（右列详情）/
 * summary.tsx（详细纪要）/ insight.tsx（AI 解读）/ memory.tsx（知识记忆）/
 * translation.tsx（翻译）/ language-dialog.tsx（翻译语种弹层）/
 * perspective-dialog.tsx（解读身份弹层）/ speaker-dialog.tsx（修改发言人
 * 弹层）/ share.tsx（分享 Popover + 分享对话框）/ types.ts（公开类型）。
 */
export function RecordingPage({
  listTitle = '录音记录列表',
  selectLabel,
  selectDoneLabel,
  selectAllLabel,
  selectedCountText,
  deleteLabel,
  deleteConfirmTitle,
  deleteConfirmText,
  deleteCancelLabel,
  deleteConfirmLabel,
  selectedRecordingIds,
  defaultSelectedRecordingIds,
  onRecordingSelectionChange,
  onDeleteRecordings,
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
  shareOptions,
  shareSelectedKeys,
  defaultShareSelectedKeys,
  sharePopoverTitle,
  shareCancelLabel,
  shareConfirmLabel,
  shareDialogTitle,
  shareLink,
  shareCopyLinkLabel,
  shareCopiedLabel,
  shareMailLabel,
  shareSystemLabel,
  onShareConfirm,
  onShareChannel,
  onEdit,
  onShare,
  tabs = [],
  activeTabKey,
  defaultActiveTabKey,
  onTabChange,
  transcriptTabKey = 'transcript',
  segments = [],
  speakers,
  speakerDialogTitle,
  speakerDialogHint,
  speakerInputPlaceholder,
  speakerApplyLabel,
  onSpeakerChange,
  summary,
  summaryTabKey = 'summary',
  onMindmapAction,
  onMaterialClick,
  onTodoClick,
  selectedTodoIds,
  defaultSelectedTodoIds,
  onTodoSelectionChange,
  onSummaryAction,
  insight,
  insightTabKey = 'ai',
  onPerspectiveEdit,
  onPerspectiveApply,
  onInsightAction,
  memory,
  memoryTabKey = 'knowledge',
  onMemoryAction,
  translation,
  translationTabKey = 'translation',
  onLanguageClick,
  onLanguageChange,
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

  // 待办选中：受控 prop 优先，缺省内部维护（初始取 done=true 条目）
  const todoControlled = selectedTodoIds !== undefined;
  const [innerTodos, setInnerTodos] = useState<(string | number)[]>(
    () =>
      defaultSelectedTodoIds ??
      (summary?.todos ?? []).flatMap((todo, index) =>
        todo.done === true ? [todo.id ?? index] : [],
      ),
  );
  const selectedTodos = todoControlled ? selectedTodoIds : innerTodos;
  const toggleTodo = (id: string | number): void => {
    const next = selectedTodos.includes(id)
      ? selectedTodos.filter((item) => item !== id)
      : [...selectedTodos, id];
    if (!todoControlled) setInnerTodos(next);
    onTodoClick?.(id);
    onTodoSelectionChange?.(next);
  };

  // 分享内容选中：受控 prop 优先，缺省内部维护（初始全部选项）
  const shareControlled = shareSelectedKeys !== undefined;
  const [innerShareKeys, setInnerShareKeys] = useState<string[]>(
    () => defaultShareSelectedKeys ?? (shareOptions ?? []).map((option) => option.key),
  );
  const shareKeys = shareControlled ? shareSelectedKeys : innerShareKeys;
  const commitShareKeys = (next: string[]): void => {
    if (!shareControlled) setInnerShareKeys(next);
  };

  // 多选模式：模式开关内部维护；选中 id 列表受控 prop 优先
  const [selecting, setSelecting] = useState(false);
  const recSelControlled = selectedRecordingIds !== undefined;
  const [innerSelectedRecs, setInnerSelectedRecs] = useState<string[]>(
    () => defaultSelectedRecordingIds ?? [],
  );
  const selectedRecs = recSelControlled ? selectedRecordingIds : innerSelectedRecs;
  const commitSelectedRecs = (next: string[]): void => {
    if (!recSelControlled) setInnerSelectedRecs(next);
    onRecordingSelectionChange?.(next);
  };
  const allRecordingIds = groups.flatMap((group) => group.items.map((item) => item.id));
  const toggleRecordingSelect = (id: string): void => {
    commitSelectedRecs(
      selectedRecs.includes(id)
        ? selectedRecs.filter((item) => item !== id)
        : [...selectedRecs, id],
    );
  };
  const toggleSelectAll = (): void => {
    commitSelectedRecs(
      selectedRecs.length === allRecordingIds.length ? [] : allRecordingIds,
    );
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
        selectDoneLabel={selectDoneLabel}
        selectAllLabel={selectAllLabel}
        selectedCountText={selectedCountText}
        deleteLabel={deleteLabel}
        deleteConfirmTitle={deleteConfirmTitle}
        deleteConfirmText={deleteConfirmText}
        deleteCancelLabel={deleteCancelLabel}
        deleteConfirmLabel={deleteConfirmLabel}
        selecting={selecting}
        selectedRecordingIds={selectedRecs}
        onEnterSelectMode={() => {
          setSelecting(true);
          onSelectClick?.();
        }}
        onExitSelectMode={() => setSelecting(false)}
        onToggleRecordingSelect={toggleRecordingSelect}
        onToggleSelectAll={toggleSelectAll}
        onDeleteSelected={() => onDeleteRecordings?.(selectedRecs)}
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
        shareOptions={shareOptions}
        shareSelectedKeys={shareKeys}
        sharePopoverTitle={sharePopoverTitle}
        shareCancelLabel={shareCancelLabel}
        shareConfirmLabel={shareConfirmLabel}
        shareDialogTitle={shareDialogTitle}
        shareLink={shareLink}
        shareCopyLinkLabel={shareCopyLinkLabel}
        shareCopiedLabel={shareCopiedLabel}
        shareMailLabel={shareMailLabel}
        shareSystemLabel={shareSystemLabel}
        onShareSelectionCommit={commitShareKeys}
        onShareConfirm={onShareConfirm}
        onShareChannel={onShareChannel}
        onEdit={onEdit}
        onShare={onShare}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        transcriptTabKey={transcriptTabKey}
        segments={segments}
        speakers={speakers}
        speakerDialogTitle={speakerDialogTitle}
        speakerDialogHint={speakerDialogHint}
        speakerInputPlaceholder={speakerInputPlaceholder}
        speakerApplyLabel={speakerApplyLabel}
        onSpeakerChange={onSpeakerChange}
        summary={summary}
        summaryTabKey={summaryTabKey}
        onMindmapAction={onMindmapAction}
        onMaterialClick={onMaterialClick}
        selectedTodoIds={selectedTodos}
        onTodoToggle={toggleTodo}
        onSummaryAction={onSummaryAction}
        insight={insight}
        insightTabKey={insightTabKey}
        onPerspectiveEdit={onPerspectiveEdit}
        onPerspectiveApply={onPerspectiveApply}
        onInsightAction={onInsightAction}
        memory={memory}
        memoryTabKey={memoryTabKey}
        onMemoryAction={onMemoryAction}
        translation={translation}
        translationTabKey={translationTabKey}
        onLanguageClick={onLanguageClick}
        onLanguageChange={onLanguageChange}
        onTranslationAction={onTranslationAction}
        player={player}
        onPlay={onPlay}
        onSkipBack={onSkipBack}
        onSkipForward={onSkipForward}
      />
    </div>
  );
}
