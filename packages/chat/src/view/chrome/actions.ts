import type { Registry } from '@pactor-app/core';
import type { ActionHandler } from '@pactor-app/runtime';

import type { ChatArtifact } from '../../artifact.js';

/**
 * chat chrome 内建动作（spec: chat-chrome-dsl / chat 内建动作接入）：
 * chrome DSL 片段的 events 引用 `chat.*` 动作，trampolines 把调用
 * 桥接回 chat 包内行为——行为实现零外迁：
 *
 * - `chat.sendSuggestion`（params.text）：空态建议点击 → ChatView 发送路径；
 * - `chat.openArtifact`（params.artifact）：artifact 卡片打开 →
 *   ChatView 的 onOpenArtifact 回调（全消息同一函数，可包级共享）；
 * - `chat.messageAction`（params.token / params.actionId）：操作条点击 →
 *   按 token（message.id）寻址的 per-instance dispatcher——编辑等回调
 *   挂在各 MessageBubble 上，必须按实例寻址。
 *
 * 包级 handlers 由 ChatView 挂载时注入（单活动 chat 语义：多实例
 * 并存时后挂载者优先，与 DslNode 槽的环境约束一致）。
 */
export interface ChatChromeHandlers {
  sendSuggestion?: (text: string) => void;
  openArtifact?: (artifact: ChatArtifact) => void;
  /** Composer 发送桥接（spec: chat-composer-on-chatinput）：ChatInput onSubmit 载荷为当前文本 */
  composerSubmit?: (value: string) => void;
  /** 侧栏菜单选择（spec: chat-on-ui-components）：Menu onSelect 传出的 key */
  menuSelect?: (key: string) => void;
  /** 模型选择（spec: chat-on-ui-components）：Select onChange 传出的 value */
  modelChange?: (value: string) => void;
  /** header 操作组（spec: chat-on-ui-components）：export / theme / clear */
  headerAction?: (action: string) => void;
  /** 产出物面板关闭（spec: chat-on-ui-components） */
  panelClose?: () => void;
}

let handlers: ChatChromeHandlers = {};

/** ChatView / Composer 注入包级 chrome 行为（effect 内调用；refs 保证回调最新）。按键合并：ChatView 注入建议/面板，Composer 注入发送，互不覆盖 */
export function setChatChromeHandlers(next: ChatChromeHandlers): void {
  handlers = { ...handlers, ...next };
}

/** 操作条 per-instance dispatcher 注册表（token = message.id） */
const messageActionDispatchers = new Map<string, (actionId: string) => void>();

export function setMessageActionDispatcher(
  token: string,
  dispatch: (actionId: string) => void,
): void {
  messageActionDispatchers.set(token, dispatch);
}

export function clearMessageActionDispatcher(token: string): void {
  messageActionDispatchers.delete(token);
}

const CHROME_ACTION_HANDLERS: Record<string, ActionHandler> = {
  'chat.sendSuggestion': (action) => {
    const text = action.params?.['text'];
    if (typeof text === 'string') {
      handlers.sendSuggestion?.(text);
    }
    return { ok: true };
  },
  'chat.openArtifact': (action) => {
    const artifact = action.params?.['artifact'] as ChatArtifact | undefined;
    if (artifact) {
      handlers.openArtifact?.(artifact);
    }
    return { ok: true };
  },
  'chat.messageAction': (action) => {
    const token = action.params?.['token'];
    const actionId = action.params?.['actionId'];
    if (typeof token === 'string' && typeof actionId === 'string') {
      messageActionDispatchers.get(token)?.(actionId);
    }
    return { ok: true };
  },
  'chat.composerSubmit': (action) => {
    const value = action.params?.['value'];
    if (typeof value === 'string') {
      handlers.composerSubmit?.(value);
    }
    return { ok: true };
  },
  'chat.menuSelect': (action) => {
    const key = action.params?.['key'];
    if (typeof key === 'string') {
      handlers.menuSelect?.(key);
    }
    return { ok: true };
  },
  'chat.modelChange': (action) => {
    const value = action.params?.['value'];
    if (typeof value === 'string') {
      handlers.modelChange?.(value);
    }
    return { ok: true };
  },
  'chat.headerAction': (action) => {
    const name = action.params?.['action'];
    if (typeof name === 'string') {
      handlers.headerAction?.(name);
    }
    return { ok: true };
  },
  'chat.panelClose': () => {
    handlers.panelClose?.();
    return { ok: true };
  },
};

/**
 * 向 ambient 页面运行时 action registry 注册 chat.* 内建动作；
 * 已存在的同名动作 MUST NOT 覆盖（宿主实现优先，spec: chat-chrome-dsl）。
 * 幂等：ChromeSlot 每次渲染调用，has 守卫保证只注册一次。
 */
export function ensureChatChromeActions(
  actions: Registry<ActionHandler>,
): void {
  for (const [name, handler] of Object.entries(CHROME_ACTION_HANDLERS)) {
    if (!actions.has(name)) {
      actions.register(name, handler);
    }
  }
}
