import type { DslNode } from '@pactor-app/core';
import type { CSSProperties, ReactNode } from 'react';

import type { TextType } from '@pactor-app/ui/components';

/** 过滤 pill 项（全部 / 会议 / 来自设备 / 未整理…） */
export interface RecordingFilterItem {
  key: string;
  label: string;
}

/** 录音条目状态语义色（缺省 secondary 弱提示灰） */
export type RecordingStatusType = Extract<TextType, 'success' | 'danger' | 'secondary'>;

/** 录音记录条目 */
export interface RecordingItem {
  id: string;
  title: string;
  /** 日期时间（如 07 月 28 日 14:02） */
  time?: string;
  /** 时长（如 42:18） */
  duration?: string;
  /** 状态标签（如 纪要已生成 / 上传失败 / 转写中）；提供才渲染 */
  status?: string;
  /** 状态语义色：success（绿）/ danger（红）/ secondary（灰，缺省） */
  statusType?: RecordingStatusType;
  /** 条目图标（Icon 白名单），缺省 audio-lines */
  icon?: string;
  [key: string]: unknown;
}

/** 录音分组（今天 / 昨天 / 本周…） */
export interface RecordingGroup {
  key?: string;
  label: string;
  items: RecordingItem[];
}

/** 原文转写说话人段落 */
export interface RecordingTranscriptSegment {
  /** 说话人名（如 王原 / 发言人 1） */
  speaker?: string;
  /** 头像占位字（缺省取 speaker 首字符，无 speaker 为 ?） */
  avatarText?: string;
  /** 段起始时间戳（如 00:42），展示在行右 */
  time?: string;
  /** 已标记：行右展示「⚑ 已标记」徽标 */
  marked?: boolean;
  /** 段落正文 */
  content?: string;
}

/** 修改发言人弹层的人员选项 */
export interface RecordingSpeaker {  /** 姓名 */
  name: string;
  /** 头像占位字（缺省取 name 首字符） */
  avatarText?: string;
  /** 角色 / 组织（如 产品负责人 · Hojo） */
  role?: string;
  /** 行右来源标签（如 参会人 / 自动识别 / 用户创建）；提供才渲染 */
  tag?: string;
}

/** 发言人修改（onSpeakerChange 事件载荷） */
export interface RecordingSpeakerChange {
  /** 段落索引（segments 下标） */
  index: number;
  /** 修改前发言人 */
  previous?: string;
  /** 修改后发言人姓名 */
  name: string;
}

/** 分享内容选项（头部「分享」Popover 复选列表） */
export interface RecordingShareOption {
  key: string;
  label: string;
  /** 禁用（勾选态锁定，不可取消） */
  disabled?: boolean;
}

/** 详情页签项；content 缺省且 key 命中 transcriptTabKey 时渲染 segments */
export interface RecordingTabItem {
  key: string;
  label: string;
  /** 页签自定义内容（React 元素或 DslNode），优先于内建转写段落 */
  content?: DslNode | ReactNode;
}

/** 播放条数据；提供才渲染底部播放条 */
export interface RecordingPlayer {
  /** 当前进度文案（如 14:22） */
  currentTime?: string;
  /** 总时长文案（如 42:18） */
  totalTime?: string;
  /** 进度百分比（0-100） */
  progress?: number;
}

/** 详细纪要 - 思维导图（中心节点 + 左右两侧子节点） */
export interface RecordingSummaryMindmap {
  /** 中心节点（深色胶囊） */
  center: string;
  /** 左侧节点 */
  left?: string[];
  /** 右侧节点 */
  right?: string[];
}

/** 详细纪要 - 主要议题卡 */
export interface RecordingSummaryTopic {
  title: string;
  content?: string;
}

/** 详细纪要 - 评审结论行（事项 / 会议结论 / 负责人） */
export interface RecordingSummaryConclusion {
  item: string;
  conclusion?: string;
  owner?: string;
}

/** 详细纪要 - 相关材料条目 */
export interface RecordingSummaryMaterial {
  id?: string;
  title: string;
  /** 右侧元信息（如 7 月 21 日 · 文档） */
  meta?: string;
  /** 左侧图标（Icon 白名单），缺省 file-text */
  icon?: string;
  [key: string]: unknown;
}

/** 详细纪要 - 待办事项条目 */
export interface RecordingSummaryTodo {
  id?: string;
  title: string;
  /** 右侧归属（如 李珂 · 本周） */
  owner?: string;
  /** 完成态（绿色对勾）；作为非受控选中态的初始值（点击可切换） */
  done?: boolean;
  [key: string]: unknown;
}

/** 详细纪要 - 底部操作项（复制 / 分享 / 赞 / 踩…），点击经 onSummaryAction 传出 key */
export interface RecordingSummaryAction {
  key: string;
  /** 图标名（Icon 白名单） */
  icon?: string;
}

/** AI 解读 - 章节速览条目（时间戳 + 标题 + 解读正文） */export interface RecordingInsightChapter {
  /** 章节起始时间戳（如 00:05） */
  time?: string;
  title: string;
  content?: string;
}

/** AI 解读 - 观点分析条目（发言人视角观点） */
export interface RecordingInsightViewpoint {
  /** 发言人名（如 李珂） */
  speaker: string;
  /** 头像占位字（缺省取 speaker 首字符） */
  avatarText?: string;
  /** 行右标签（如「自动识别」）；缺省「自动识别」，置空字符串不渲染 */
  tag?: string;
  /** 观点加粗前缀（如「数据优先」） */
  label?: string;
  /** 观点正文 */
  content?: string;
}

/** AI 解读结构化内容（insightTabKey 页签内建渲染，各段提供才展示） */
export interface RecordingInsight {
  /** 视角横幅标题（如「AI 判断你负责产品战略与关键业务决策」） */
  perspectiveTitle?: string;
  /** 视角横幅右上操作文案（如「修改」）；提供才渲染，点击打开内建解读身份弹层 */
  perspectiveActionLabel?: string;
  /** 解读身份弹层文本受控值（提供即受控，配合 onPerspectiveApply 闭环） */
  perspectiveInput?: string;
  /** 解读身份弹层文本非受控初始值 */
  defaultPerspectiveInput?: string;
  /** 解读身份弹层标题，缺省「修改解读身份」 */
  perspectiveDialogTitle?: string;
  /** 解读身份弹层说明，缺省「用自然语言说明你在本次会议中的身份与关注点。」 */
  perspectiveDialogHint?: string;
  /** 解读身份弹层输入框占位文案 */
  perspectivePlaceholder?: string;
  /** 解读身份弹层取消按钮文案，缺省「取消」 */
  perspectiveCancelLabel?: string;
  /** 解读身份弹层确定按钮文案，缺省「应用身份」 */
  perspectiveConfirmLabel?: string;
  /** 视角横幅说明（如「本页会从决策者视角解读会议…」） */
  perspectiveHint?: string;
  /** 基础信息段标题，缺省「基础信息」 */
  basicsTitle?: string;
  /** 基础信息正文 */
  basics?: string;
  /** 章节速览段标题，缺省「章节速览与解读」 */
  chaptersTitle?: string;
  /** 章节速览条目 */
  chapters?: RecordingInsightChapter[];
  /** 观点分析段标题，缺省「观点分析」 */
  viewpointsTitle?: string;
  /** 观点分析条目 */
  viewpoints?: RecordingInsightViewpoint[];
  /** 底部操作项（如复制 / 分享 / 赞 / 踩）；提供才渲染操作条 */
  actions?: RecordingSummaryAction[];
}

/** 知识记忆 - 条目（标题 + 正文卡片） */
export interface RecordingMemoryItem {
  title: string;
  content?: string;
}

/** 知识记忆 - 分组（客观事实 / 决策 / 核心观点…；标题自动拼接条目计数） */
export interface RecordingMemoryGroup {
  key?: string;
  label: string;
  items: RecordingMemoryItem[];
}

/** 知识记忆结构化内容（memoryTabKey 页签内建渲染，各段提供才展示） */
export interface RecordingMemory {
  /** 分组列表；组标题展示为「label · 条目数」 */
  groups?: RecordingMemoryGroup[];
  /** 底部操作项（如复制 / 分享 / 赞 / 踩）；提供才渲染操作条 */
  actions?: RecordingSummaryAction[];
}

/** 翻译 - 双语对照段落（说话人原文 + 译文） */
export interface RecordingTranslationSegment {
  /** 说话人名（如 王原） */
  speaker?: string;
  /** 头像占位字（缺省取 speaker 首字符，无 speaker 为 ?） */
  avatarText?: string;
  /** 原文 */
  source?: string;
  /** 译文 */
  target?: string;
}

/** 翻译 - 语言选项（原文语言识别 / 译文语言选择弹层条目） */
export interface RecordingLanguageOption {
  key: string;
  label: string;
}

/** 翻译语种变更（onLanguageChange 事件载荷） */
export interface RecordingLanguageChange {
  /** 原文语言识别选中 key */
  source?: string;
  /** 原文语言识别选中项文案 */
  sourceLabel?: string;
  /** 译文语言选择选中 key */
  target?: string;
  /** 译文语言选择选中项文案 */
  targetLabel?: string;
}

/** 翻译结构化内容（translationTabKey 页签内建渲染） */
export interface RecordingTranslation {
  /** 语言选择器文案（如「自动判断 → English」）；提供才渲染选择器 */
  languageLabel?: string;
  /** 译文列标题（如「译文 · 英语」），缺省「译文」 */
  targetLabel?: string;
  /** 双语对照段落 */
  segments?: RecordingTranslationSegment[];
  /** 原文语言识别选项（弹层左列）；与 targetLanguages 任一提供即启用语种弹层 */
  sourceLanguages?: RecordingLanguageOption[];
  /** 译文语言选择选项（弹层右列） */
  targetLanguages?: RecordingLanguageOption[];
  /** 原文语言受控选中 key（提供即受控，配合 onLanguageChange 闭环） */
  sourceLanguage?: string;
  /** 译文语言受控选中 key */
  targetLanguage?: string;
  /** 原文语言非受控初始选中 key，缺省首项 */
  defaultSourceLanguage?: string;
  /** 译文语言非受控初始选中 key，缺省首项 */
  defaultTargetLanguage?: string;
  /** 语种弹层标题，缺省「选择翻译语言」 */
  languageDialogTitle?: string;
  /** 弹层左列标题，缺省「原文语言识别」 */
  sourceLanguagesTitle?: string;
  /** 弹层右列标题，缺省「译文语言选择」 */
  targetLanguagesTitle?: string;
  /** 弹层取消按钮文案，缺省「取消」 */
  cancelLabel?: string;
  /** 弹层确定按钮文案，缺省「确定」 */
  confirmLabel?: string;
  /** 底部操作项（如复制 / 分享 / 赞 / 踩）；提供才渲染操作条 */
  actions?: RecordingSummaryAction[];
}

/** 详细纪要结构化内容（summaryTabKey 页签内建渲染，各段提供才展示） */
export interface RecordingSummary {
  /** 思维导图段标题，缺省「思维导图」 */
  mindmapTitle?: string;
  /** 思维导图段右上操作文案（如「查看思维导图」）；提供才渲染 */
  mindmapActionLabel?: string;
  /** 思维导图节点 */
  mindmap?: RecordingSummaryMindmap;
  /** 会议概况段标题，缺省「会议概况」 */
  overviewTitle?: string;
  /** 会议概况正文 */
  overview?: string;
  /** 主要议题段标题，缺省「主要议题」 */
  topicsTitle?: string;
  /** 主要议题卡（两列网格） */
  topics?: RecordingSummaryTopic[];
  /** 评审结论段标题，缺省「评审结论与后续安排」 */
  conclusionsTitle?: string;
  /** 评审结论表行 */
  conclusions?: RecordingSummaryConclusion[];
  /** 后续说明段标题（如「资源缺口与后续」）；提供 followUp 时展示 */
  followUpTitle?: string;
  /** 后续说明正文 */
  followUp?: string;
  /** 相关材料段标题，缺省「相关材料」 */
  materialsTitle?: string;
  /** 相关材料条目 */
  materials?: RecordingSummaryMaterial[];
  /** 待办事项段标题，缺省「待办事项」 */
  todosTitle?: string;
  /** 待办事项条目 */
  todos?: RecordingSummaryTodo[];
  /** 底部操作项（如复制 / 分享 / 赞 / 踩）；提供才渲染操作条 */
  actions?: RecordingSummaryAction[];
}

export interface RecordingPageProps {
  /** 左列列表标题，缺省「录音记录列表」 */
  listTitle?: string;
  /** 列表标题右侧操作文案（如「选择」）；提供才渲染，点击进入多选模式 */
  selectLabel?: string;
  /** 多选模式标题右侧操作文案，缺省「完成」 */
  selectDoneLabel?: string;
  /** 多选模式全选文案，缺省「全选」 */
  selectAllLabel?: string;
  /** 多选模式已选计数文案（{count} 占位），缺省「已选 {count} 条」 */
  selectedCountText?: string;
  /** 多选模式底部删除按钮文案，缺省「删除」 */
  deleteLabel?: string;
  /** 删除二次确认弹层标题，缺省「删除录音」 */
  deleteConfirmTitle?: string;
  /** 删除二次确认弹层正文（{count} 占位选中条数），缺省「确定删除选中的 {count} 条录音吗？删除后不可恢复。」 */
  deleteConfirmText?: string;
  /** 删除二次确认取消按钮文案，缺省「取消」 */
  deleteCancelLabel?: string;
  /** 删除二次确认确定按钮文案，缺省「删除」 */
  deleteConfirmLabel?: string;
  /** 多选模式选中录音 id 列表（提供即受控，配合 onRecordingSelectionChange 闭环） */
  selectedRecordingIds?: string[];
  /** 多选模式非受控初始选中 id 列表，缺省空 */
  defaultSelectedRecordingIds?: string[];
  /** 多选模式勾选变化事件，传出完整选中 id 列表 */
  onRecordingSelectionChange?: (ids: string[]) => void;
  /** 多选模式「删除」点击后先弹二次确认弹层，确认经 onDeleteRecordings 传出选中 id 列表 */
  onDeleteRecordings?: (ids: string[]) => void;
  /** 「选择」点击事件（同时进入多选模式） */
  onSelectClick?: () => void;
  /** 过滤 pill 组（缺省不渲染） */
  filters?: RecordingFilterItem[];
  /** 过滤受控选中 key（提供即受控，配合 onFilterChange 闭环） */
  activeFilterKey?: string;
  /** 过滤非受控初始选中 key，缺省首项 */
  defaultActiveFilterKey?: string;
  /** 过滤切换事件，传出 key */
  onFilterChange?: (key: string) => void;
  /** 处理中横幅主文案（如「3 条录音处理中」）；提供才渲染横幅 */
  processingText?: string;
  /** 处理中横幅副文案（如「另有 3 条处理失败」） */
  processingHint?: string;
  /** 处理中横幅点击事件 */
  onProcessingClick?: () => void;
  /** 新建录音按钮文案，缺省「开始新录音」；置 null 不渲染 */
  newRecordingLabel?: string | null;
  /** 新建录音点击事件 */
  onNewRecording?: () => void;
  /** 录音分组列表（今天 / 昨天 / 本周…） */
  groups?: RecordingGroup[];
  /** 选中录音 id（提供即受控，配合 onSelectRecording 闭环） */
  activeRecordingId?: string;
  /** 非受控初始选中录音 id */
  defaultActiveRecordingId?: string;
  /** 录音条目点击事件，传出 id */
  onSelectRecording?: (id: string) => void;
  /** 左列宽度（px），缺省 300 */
  listWidth?: number;
  /** 列表空数据文案 */
  emptyText?: string;
  /** 右列详情标题（通常为当前录音标题） */
  title?: string;
  /** 标题下元信息（如 07 月 28 日 14:02 · 42:18） */
  meta?: string;
  /** 头部右侧「编辑」文案；提供才渲染 */
  editLabel?: string;
  /** 头部右侧「分享」按钮文案；提供才渲染 */
  shareLabel?: string;
  /** 分享内容选项（Popover 复选列表）；提供非空时「分享」点击打开内建 Popover */
  shareOptions?: RecordingShareOption[];
  /** 分享内容受控选中 key 列表（提供即受控，配合 onShareConfirm 闭环） */
  shareSelectedKeys?: string[];
  /** 分享内容非受控初始选中 key 列表，缺省全部选项 */
  defaultShareSelectedKeys?: string[];
  /** 分享 Popover 标题，缺省「选择分享内容」 */
  sharePopoverTitle?: string;
  /** 分享 Popover 取消按钮文案，缺省「取消」 */
  shareCancelLabel?: string;
  /** 分享 Popover 确定按钮文案，缺省「确定」 */
  shareConfirmLabel?: string;
  /** 分享对话框标题，缺省「分享会议内容」 */
  shareDialogTitle?: string;
  /** 分享对话框链接；提供才渲染链接行 */
  shareLink?: string;
  /** 复制链接按钮文案，缺省「复制链接」 */
  shareCopyLinkLabel?: string;
  /** 复制成功后的短暂按钮文案，缺省「已复制」 */
  shareCopiedLabel?: string;
  /** 邮件按钮文案，缺省「邮件」 */
  shareMailLabel?: string;
  /** 系统分享按钮文案，缺省「系统分享」 */
  shareSystemLabel?: string;
  /** 分享 Popover「确定」事件，传出选中内容 key 列表（同时打开分享对话框） */
  onShareConfirm?: (keys: string[]) => void;
  /** 分享对话框渠道点击事件，传出 'copyLink' | 'mail' | 'system' */
  onShareChannel?: (channel: string) => void;
  /** 编辑点击事件 */
  onEdit?: () => void;
  /** 分享点击事件（提供 shareOptions 时点击同时打开内建 Popover） */
  onShare?: () => void;
  /** 详情页签（原文转写 / 详细纪要 / AI 解读…）；缺省不渲染页签 */
  tabs?: RecordingTabItem[];
  /** 页签受控激活 key（提供即受控，配合 onTabChange 闭环） */
  activeTabKey?: string;
  /** 页签非受控初始激活 key，缺省首项 */
  defaultActiveTabKey?: string;
  /** 页签切换事件，传出 key */
  onTabChange?: (key: string) => void;
  /** 原文转写页签 key，缺省 transcript：该页签渲染 segments 说话人段落 */
  transcriptTabKey?: string;
  /** 原文转写说话人段落 */
  segments?: RecordingTranscriptSegment[];
  /** 修改发言人弹层的人员选项列表（参会人 / 自动识别 / 用户创建…） */
  speakers?: RecordingSpeaker[];
  /** 修改发言人弹层标题，缺省「修改发言人」 */
  speakerDialogTitle?: string;
  /** 修改发言人弹层说明，缺省「选择参会信息、已识别人员或你曾手动创建的联系人。」 */
  speakerDialogHint?: string;
  /** 修改发言人弹层姓名输入框占位，缺省「输入姓名」 */
  speakerInputPlaceholder?: string;
  /** 修改发言人弹层确定按钮文案，缺省「应用姓名」 */
  speakerApplyLabel?: string;
  /** 发言人修改事件（点段落改名铅笔，弹层「应用姓名」触发），传出 { index, previous, name } */
  onSpeakerChange?: (change: RecordingSpeakerChange) => void;
  /** 详细纪要结构化内容（summaryTabKey 页签内建渲染） */
  summary?: RecordingSummary;
  /** 详细纪要页签 key，缺省 summary */
  summaryTabKey?: string;
  /** 「查看思维导图」点击事件 */
  onMindmapAction?: () => void;
  /** 相关材料条目点击事件，传出 id（无 id 传 index） */
  onMaterialClick?: (id: string | number) => void;
  /** 待办事项条目点击事件，传出 id（无 id 传 index）；点击同时在组件内切换选中态 */
  onTodoClick?: (id: string | number) => void;
  /** 待办选中 id 列表（提供即受控，配合 onTodoSelectionChange 闭环；无 id 用行索引） */
  selectedTodoIds?: (string | number)[];
  /** 待办非受控初始选中 id 列表，缺省取 done=true 的条目 */
  defaultSelectedTodoIds?: (string | number)[];
  /** 待办选中变更事件，传出变更后的完整选中 id 列表 */
  onTodoSelectionChange?: (ids: (string | number)[]) => void;
  /** 纪要底部操作点击事件，传出 action key */
  onSummaryAction?: (key: string) => void;
  /** AI 解读结构化内容（insightTabKey 页签内建渲染） */
  insight?: RecordingInsight;
  /** AI 解读页签 key，缺省 ai */
  insightTabKey?: string;
  /** 视角横幅「修改」点击事件（点击同时打开内建解读身份弹层） */
  onPerspectiveEdit?: () => void;
  /** 解读身份弹层「应用身份」事件，传出文本值 */
  onPerspectiveApply?: (value: string) => void;
  /** AI 解读底部操作点击事件，传出 action key */
  onInsightAction?: (key: string) => void;
  /** 知识记忆结构化内容（memoryTabKey 页签内建渲染） */
  memory?: RecordingMemory;
  /** 知识记忆页签 key，缺省 knowledge */
  memoryTabKey?: string;
  /** 知识记忆底部操作点击事件，传出 action key */
  onMemoryAction?: (key: string) => void;
  /** 翻译结构化内容（translationTabKey 页签内建渲染） */
  translation?: RecordingTranslation;
  /** 翻译页签 key，缺省 translation */
  translationTabKey?: string;
  /** 语言选择器点击事件（点击同时打开内建语种弹层） */
  onLanguageClick?: () => void;
  /** 语种弹层「确定」事件，传出 { source, sourceLabel, target, targetLabel } */
  onLanguageChange?: (change: RecordingLanguageChange) => void;
  /** 翻译底部操作点击事件，传出 action key */
  onTranslationAction?: (key: string) => void;
  /** 底部播放条数据；提供才渲染 */
  player?: RecordingPlayer;
  /** 播放 / 暂停点击事件 */
  onPlay?: () => void;
  /** 快退点击事件 */
  onSkipBack?: () => void;
  /** 快进点击事件 */
  onSkipForward?: () => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}
