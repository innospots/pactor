import type { DslNode } from '@pactor-app/core';

import type { ChatArtifact } from './artifact.js';

/**
 * 消息模型（设计决策 D1，设计文档第 58/59/70 节）：
 * AI Message Rendering Protocol 的数据层——消息 + Part 联合类型 +
 * 状态机。零 React，可纯 Node 测试。
 */

/** 消息角色 */
export type ChatRole = 'user' | 'assistant' | 'system';

/** 消息状态机 */
export type MessageStatus =
  | 'pending'
  | 'streaming'
  | 'completed'
  | 'error'
  | 'cancelled';

/** Part 状态机（tool-call / tool-result / error / status 使用各自的状态字段） */
export type PartStatus = 'pending' | 'streaming' | 'ready' | 'error';

/** tool-call part 的执行状态 */
export type ToolCallStatus = 'waiting' | 'running' | 'success' | 'failed';

/**
 * Part 联合类型：一条消息由有序 Part 数组组成，
 * thinking 与正文分离（设计文档第 72 节）。
 *
 * 各 variant 的 `id` 可选：streaming 事件携带 partId 时按 id 定位，
 * 缺省时 reducer 按"最后一个同类 part"定位。
 */
export type ChatPart =
  | { id?: string; type: 'text'; content: string; status?: PartStatus }
  | { id?: string; type: 'markdown'; content: string; status?: PartStatus }
  | {
      id?: string;
      type: 'dsl';
      /** dsl.complete 事件写入；dsl.start 占位阶段缺省（渲染为占位） */
      schema?: DslNode;
      status?: PartStatus;
    }
  | { id?: string; type: 'thinking'; content: string; status?: PartStatus }
  | {
      id?: string;
      type: 'tool-call';
      name: string;
      title?: string;
      /** 调用参数（tool.start 事件携带；供活动轨迹参数摘要 / 详情渲染） */
      args?: unknown;
      status: ToolCallStatus;
    }
  | {
      id?: string;
      type: 'tool-result';
      name: string;
      status: 'success' | 'failed';
      result?: unknown;
      error?: string;
    }
  | { id?: string; type: 'error'; message: string }
  | { id?: string; type: 'status'; text: string }
  | {
      id?: string;
      /** 产出物 part（spec: chat-artifact-panel，设计决策 D4）：内联渲染为产出物卡片 */
      type: 'artifact';
      artifact: ChatArtifact;
      status?: PartStatus;
    };

/** 消息附件引用（上传与存储由调用方负责，包内只持有引用） */
export interface ChatAttachment {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  url?: string;
}

/**
 * 上下文项（spec: chat-context-sources，设计决策 D6）：
 * 选中候选追加为 Composer 上方 chips；`label` 用于 chip 展示，
 * `trigger` 标记来源入口（'@' 提及 / '+' 菜单），`data` 为 source 项
 * 原始数据（如 agentId），transport 可结构化消费。
 */
export interface ChatContextItem {
  id: string;
  label: string;
  trigger?: '@' | '+';
  data?: unknown;
}

/**
 * 上下文数据源（spec: chat-context-sources，设计决策 D1）：
 * `trigger` 标记入口（'@' 提及弹层 / '+' 菜单）；`items` 为静态候选
 * 数组；`service` + `params` 为声明式服务引用，经注入的
 * `ChatServices.callService(name, params)` 解析为 `ChatContextItem[]`
 * （结果按 source 键会话级缓存）。全部为 DSL 可表达数据。
 */
export interface ChatContextSource {
  trigger: '@' | '+';
  /** 来源名（弹层分组展示 / 错误提示用） */
  label: string;
  /** 静态候选数组；与 service 二选一 */
  items?: ChatContextItem[];
  /** 声明式服务引用（经 callService 解析） */
  service?: string;
  /** service 调用参数 */
  params?: Record<string, unknown>;
}

/** 模型选项（spec: chat-model-selector）：value 进 ChatInput.model，label 用于 chip 展示 */
export interface ChatModelOption {
  value: string;
  label: string;
}

/**
 * 内建消息动作名（spec: chat-message-actions，设计决策 D1）：
 * 数组项为字符串时等价于 `{ id: <name>, builtin: <name> }`
 */
export type BuiltinMessageAction = 'copy' | 'regenerate' | 'retry' | 'edit';

/**
 * 消息操作条动作描述（spec: chat-message-actions，设计决策 D1）：
 * 全部为 DSL 可表达数据——`builtin` 指定时复用内建行为（label / icon /
 * roles / visibleWhen 按字段覆盖内建默认描述）；无 `builtin` 为自定义
 * 动作，点击经 `ChatServices.callService(service, { actionId, message })`
 * 派发并并行触发 `onMessageAction` 通知。
 */
export interface ChatMessageAction {
  /** 动作标识（服务派发 actionId 与事件 event.action 用） */
  id: string;
  /** 指定则复用内建行为与默认描述（可逐字段覆盖） */
  builtin?: BuiltinMessageAction;
  /** tooltip 文案；缺省用内建默认（自定义动作缺省回退为 id） */
  label?: string;
  /** 图标名（MESSAGE_ACTION_ICONS 白名单）；未知名渲染占位图标 */
  icon?: string;
  /** 可见角色；自定义动作缺省 ['assistant'] */
  roles?: Array<'user' | 'assistant'>;
  /**
   * 可见状态：'completed' 匹配非流式非错误终态（含 cancelled），
   * 'error' 匹配 error，'always' 含 streaming；自定义动作缺省 'completed'
   */
  visibleWhen?: 'completed' | 'error' | 'always';
  /** 自定义动作的派发服务名（经注入的 callService 解析） */
  service?: string;
}

/** Chat 消息 */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  status: MessageStatus;
  parts: ChatPart[];
  createdAt?: number;
  attachments?: ChatAttachment[];
}

/** updatePart 的定位参数：数组下标或 part id */
export type PartRef = number | string;

/** updateMessage 的补丁：id 不可改 */
export type MessagePatch = Partial<Omit<ChatMessage, 'id'>>;

/** updatePart 的补丁（宽类型：按目标 part variant 取子集） */
export type PartPatch = Partial<{
  content: string;
  schema: DslNode;
  status: string;
  name: string;
  title: string;
  args: unknown;
  result: unknown;
  error: string;
  message: string;
  text: string;
  artifact: ChatArtifact;
}>;

let idCounter = 0;

/** 生成 Chat 侧消息 / part id（单调后缀保证同毫秒唯一） */
export function createChatId(prefix: string = 'chat'): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}
