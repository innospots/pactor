/**
 * 组件完整详情内容。
 * 仅收录已核对真实实现来源的组件；未收录组件的详情页渲染章节骨架，
 * 相关章节标「不适用 / 待资产接入」，不填充模拟内容。
 * - component.button：API 属性提炼自 packages/ui Button 适配器
 *   （packages/ui/src/components/components/Button/index.tsx 的 ButtonProps）；
 * - component.chat-message：消息模型提炼自 packages/chat 消息状态机
 *   （packages/chat/src/model.ts 的 ChatMessage / ChatPart），
 *   呈现结构参考 packages/chat/src/view/MessageBubble.tsx；
 * - 第五批 22 个组件（数据录入 8 / 数据展示 7 / 反馈 7）：API 属性与结构
 *   提炼自 packages/ui 对应适配器，见同目录 data-entry-details.ts /
 *   data-display-details.ts / feedback-details.ts。
 * - 第六批 8 个组件（通用 2 / 布局 2 / 导航 4：Tag / Status / Space /
 *   Container / Steps / Anchor / BackTop / Affix）：API 属性与结构提炼自
 *   packages/ui 对应适配器，见同目录 basic-details.ts。
 * - 第七批 11 个组件（媒体与内容）：API 属性与结构提炼自 packages/ui
 *   对应适配器（Markdown / CodeBlock 复用 @pactor-app/markdown），
 *   见同目录 media-details.ts。
 * - 第八批 15 个组件（AI 与会话，packages/ui chat 子目录）：
 *   见同目录 ai-chat-details.ts；其中 component.chat-message 以 ui 承接版
 *   覆盖下方早期（chat 消息模型）条目。
 * - 第九批 51 个组件（通用 7 / 布局 7 / 导航 6 / 数据录入 11 / 数据展示 8 /
 *   反馈 7）：API 属性与 DSL 结构核对自 packages/ui 对应适配器及
 *   previews/basic-a|b|c.tsx，见同目录 general-details.ts /
 *   layout-details.ts / navigation-details.ts，并追加至
 *   data-entry-details.ts / data-display-details.ts / feedback-details.ts。
 */

import type { DslNode } from '@pactor-app/core';

import { aiChatDetailContents } from './ai-chat-details.ts';
import { basicDetailContents } from './basic-details.ts';
import { generalDetailContents } from './general-details.ts';
import { layoutDetailContents } from './layout-details.ts';
import { navigationDetailContents } from './navigation-details.ts';
import { dataEntryDetailContents } from './data-entry-details.ts';
import { dataDisplayDetailContents } from './data-display-details.ts';
import { feedbackDetailContents } from './feedback-details.ts';
import { chartDetailContents } from './chart-details.ts';
import { mediaDetailContents } from './media-details.ts';

/** 变体条目 */
export interface ComponentVariant {
  name: string;
  /** 视觉 / 结构形态 */
  visual: string;
  /** 适用场景 */
  scene: string;
}

/** API 属性表条目 */
export interface ComponentApiProp {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

/** 组件完整详情章节内容（markdown 子集走 renderMarkdown，仅支持段落 / 列表 / 行内 code / 加粗） */
export interface ComponentDetailContent {
  /** 何时用 / 何时不用（markdown） */
  whenToUse: string;
  /** 预览章节不适用说明（运行态预览未接入），附静态结构描述 */
  previewNote: string;
  variants: ComponentVariant[];
  apiProps: ComponentApiProp[];
  /** DSL 调用结构（DslNode 示例，构建期 JSON 序列化后展示于「DSL 结构」章节） */
  dsl?: DslNode;
  /** 使用规范要点（markdown） */
  guidelines: string;
  /** 正例 */
  examplesDo: string[];
  /** 反例 */
  examplesDont: string[];
}

export const componentDetailContents: Record<string, ComponentDetailContent> = {
  'component.button': {
    dsl: {
      "type": "Button",
      "props": {
        "text": "提交订单",
        "variant": "primary",
        "size": "large"
      },
      "events": {
        "onClick": {
          "action": "setState",
          "params": {
            "submitted": true
          }
        }
      }
    },
    whenToUse: [
      '**何时使用**',
      '',
      '- 触发即时操作：提交表单、保存、创建、删除等改变数据或触发流程的动作。',
      '- 对话框 / 抽屉 / 卡片内的主、次操作（主操作每区最多一个）。',
      '- 工具栏、列表操作列中的动作入口。',
      '',
      '**何时不用**',
      '',
      '- 页面、位置或外部资源跳转：使用 Link / 导航组件，不使用 Button。',
      '- 状态切换（如启用 / 停用）：使用 Switch、Tag 或 Segmented。',
      '- 需要展示加载进度的长时间任务：使用 Progress 类反馈组件，Button 的 loading 仅表示操作进行中。',
    ].join('\n'),
    previewNote:
      '静态结构：Button 渲染为单个 <button> 根节点（vendored shadcn Button 适配），variant=primary 映射实心主按钮、default 映射描边按钮；loading 时前置旋转图标并禁用点击；icon 通道在文本前渲染 Icon；配置 tooltip 时以 Tooltip 包裹，但根节点仍为按钮本体。',
    variants: [
      { name: 'default 默认', visual: '描边按钮（outline）', scene: '常规操作；与主按钮成组出现的次操作' },
      { name: 'primary 主要', visual: '实心品牌色按钮', scene: '每区唯一的高权重主行动（提交、创建、确认）' },
      { name: 'dashed 虚线', visual: '虚线描边', scene: '配置 / 构建类操作、占位添加（如「添加字段」）' },
      { name: 'link 链接', visual: '文字按钮，hover 出现下划线', scene: '低权重、导航式操作（如「查看全部」）' },
      { name: 'text 文字', visual: '无边底文字按钮', scene: '最轻量操作，如工具栏、卡片角落动作' },
      { name: 'danger 危险（修饰）', visual: '上列变体叠加 danger，映射 destructive 或文字标红', scene: '删除等破坏性操作，需配合二次确认' },
      { name: '尺寸 small / middle / large', visual: '三档高度（small≈sm / middle≈默认 / large≈lg）', scene: '按容器密度选择；默认 middle' },
    ],
    apiProps: [
      { name: 'text', type: 'string', defaultValue: '—', description: '按钮文本；也可用 children 渲染内容' },
      { name: 'icon', type: 'string', defaultValue: '—', description: '图标名（Icon 白名单，kebab-case / PascalCase 均可），渲染在文本前' },
      { name: 'tooltip', type: 'string', defaultValue: '—', description: '提示文案：hover / focus 按钮时展示 Tooltip' },
      { name: 'variant', type: "'default' | 'primary' | 'dashed' | 'link' | 'text'", defaultValue: "'default'", description: '变体；default 映射 shadcn outline，primary 映射实心 default，text 映射 ghost' },
      { name: 'danger', type: 'boolean', defaultValue: 'false', description: '危险态；link / text 变体保持形态、文字标红' },
      { name: 'size', type: "'small' | 'middle' | 'large'", defaultValue: "'middle'", description: '尺寸，映射 shadcn sm / default / lg' },
      { name: 'loading', type: 'boolean', defaultValue: 'false', description: '加载中：显示旋转图标并禁用（优先于 icon）' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁用；未显式给定时 loading 也会禁用' },
      { name: 'submit', type: 'boolean', defaultValue: 'false', description: 'true 时作为 Form 的提交按钮（type=submit）' },
      { name: 'onClick', type: '() => void', defaultValue: '—', description: '点击事件（Renderer 绑定 events.onClick）' },
    ],
    guidelines: [
      '- 同一区域最多一个 primary 实心主按钮，其余操作降级为 default / text。',
      '- 危险操作（danger）必须配合二次确认（Popconfirm 或 Dialog），确认文案说明后果。',
      '- 提交类操作使用 submit + loading：进行中禁用并防重复提交。',
      '- 按钮文案用动词开头（「保存」「创建项目」），不超过 6 字，避免「确定 / 取消」以外的模糊文案。',
      '- link / text 变体不承载主流程动作；禁用态保持可见，不用隐藏代替。',
    ].join('\n'),
    examplesDo: [
      '表单底部：primary「保存」+ default「取消」，保存中按钮转 loading 并禁用。',
      '删除条目：text「删除」+ danger，点击后弹 Popconfirm 二次确认。',
      '列表操作列：text「编辑」「复制」，权重从低到高依次排列。',
    ],
    examplesDont: [
      '用 Button 实现页面跳转（应使用 Link / 导航组件）。',
      '同屏并排多个 primary 实心按钮，用户无法判断主行动。',
      '危险操作无确认直接执行，或 loading 期间仍可重复点击提交。',
    ],
  },

  'component.chat-message': {
    whenToUse: [
      '**何时使用**',
      '',
      '- 会话界面中展示用户提问、助手回复与系统提示。',
      '- 需要呈现生成过程：思考（thinking）、工具调用轨迹、流式正文。',
      '- 消息带附件、产出物（artifact）或来源引用（citation）的复合内容。',
      '',
      '**何时不用**',
      '',
      '- 全局应用通知（操作成功 / 失败反馈）：使用反馈分类的 Message / Notification，二者不是同一资产。',
      '- 非会话场景的静态内容展示：使用 Typography / Markdown 等数据展示组件。',
    ].join('\n'),
    previewNote:
      '组件运行态预览待接入（后续批次）。静态结构：ChatMessage 为消息模型（非独立渲染组件），由会话视图按 role 呈现——user 消息为右侧圆角气泡；assistant 消息为左侧通栏，顶部活动轨迹区（状态头 + thinking + 配对工具轨迹）、正文 parts 按序渲染、hover 操作条（复制 / 重新生成 / 编辑 / 重试）；system 消息为居中弱提示。连续 artifact part 归并为产出物卡片组（组内超 4 个收起）。',
    variants: [
      { name: 'user 用户消息', visual: '右侧圆角气泡', scene: '用户提问；支持编辑重发（提供 onEdit 时出示编辑入口）' },
      { name: 'assistant 助手消息', visual: '左侧通栏：ActivityTrace + parts 序列 + 操作条', scene: '助手回复，含生成过程、工具轨迹与产出物' },
      { name: 'system 系统消息', visual: '居中弱提示', scene: '会话内系统级说明（如「已开启新会话」）' },
      { name: 'status 流式中', visual: 'MessageStatus=pending / streaming', scene: '生成中：正文流式追加，操作条展示停止 / 暂停' },
      { name: 'status 已完成', visual: 'MessageStatus=completed', scene: '终态：操作条提供复制 / 重新生成 / 编辑（按角色）' },
      { name: 'status 错误 / 已取消', visual: 'MessageStatus=error / cancelled', scene: '失败给出重试入口；取消保留内容并标注中断' },
      { name: 'part 类型', visual: 'text / markdown / dsl / thinking / tool-call / tool-result / artifact / status / error', scene: '消息正文由有序 Part 数组组成，thinking 与正文分离' },
    ],
    apiProps: [
      { name: 'id', type: 'string', defaultValue: '—', description: '消息唯一标识（updateMessage 定位键，不可改）' },
      { name: 'role', type: "'user' | 'assistant' | 'system'", defaultValue: '—', description: '消息角色，决定呈现形态（气泡 / 通栏 / 弱提示）' },
      { name: 'status', type: "'pending' | 'streaming' | 'completed' | 'error' | 'cancelled'", defaultValue: '—', description: '消息状态机：流式生成 / 完成 / 失败 / 取消' },
      { name: 'parts', type: 'ChatPart[]', defaultValue: '[]', description: '有序正文段：text / markdown / dsl / thinking / tool-call / tool-result / artifact / status / error' },
      { name: 'createdAt', type: 'number', defaultValue: '—', description: '创建时间戳（毫秒）' },
      { name: 'attachments', type: 'ChatAttachment[]', defaultValue: '—', description: '附件引用（id / name / mimeType / size / url；上传与存储由调用方负责）' },
      { name: 'agent', type: 'ChatAgentIdentity', defaultValue: '—', description: '返回该消息的 Agent 身份（name + icon），assistant 消息顶部展示' },
    ],
    guidelines: [
      '- thinking 与正文分离呈现，活动轨迹区仅对 assistant 消息展示。',
      '- 同一消息内相邻 artifact part 归并为卡片组，组内超 4 个自动收起。',
      '- error 消息必须提供重试入口（onRetry）；末条已完成 assistant 消息提供重新生成（onRegenerate）。',
      '- user 消息编辑重发由调用方截断 store 并重跑 turn，组件不内置历史管理。',
      '- 与会话容器约定：消息操作经 ChatMessageAction 派发（builtin 或自定义 service），不直接写业务逻辑。',
    ].join('\n'),
    examplesDo: [
      '助手回复：ActivityTrace 展示「检索文档 → 生成回答」工具轨迹，正文 markdown 流式渲染。',
      '失败消息：正文展示错误原因，操作条提供「重试」，重试成功后被截断的后续消息重跑。',
      '用户上传文件后提问：attachments 携带文件引用，正文引用文件内容。',
    ],
    examplesDont: [
      '用 ChatMessage 展示全局操作反馈（应使用反馈分类 Message / Notification）。',
      '把 thinking 内容混进正文顺序渲染（应与正文分离，置于活动轨迹区）。',
      '对 error 消息不提供重试或解释，用户无法恢复会话。',
    ],
  },

  // 第五批 22 个组件（packages/ui 真实实现已核对）
  ...dataEntryDetailContents,
  ...dataDisplayDetailContents,
  ...feedbackDetailContents,
  // 第六批 8 个组件（packages/ui 真实实现已核对）
  ...basicDetailContents,
  // 第七批 11 个组件（packages/ui 真实实现已核对）
  ...mediaDetailContents,
  // 第八批 15 个组件（packages/ui 真实实现已核对；
  // component.chat-message 以 ui 承接版覆盖上方 chat 消息模型条目）
  ...aiChatDetailContents,
  // 图表组件集（packages/ui src/components/chart 目录，echarts 渲染；
  // 旧 recharts Chart 已移除，图表能力统一由本组件集提供）
  ...chartDetailContents,
  // 第九批 51 个组件（通用 / 布局 / 导航新文件；数据录入 / 数据展示 / 反馈
  // 已追加至各自分类文件）
  ...generalDetailContents,
  ...layoutDetailContents,
  ...navigationDetailContents,
};
