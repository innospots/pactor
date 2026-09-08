import {
  ChatServicesProvider,
  ConversationStore,
  type ChatServices,
} from '@pactor-app/chat';
import { InteractionProvider } from '@pactor-app/ui/interaction';
import { useMemo, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { readAsAttachment } from './attachments';
import { createChatCapabilities } from './capabilities';
import { createMockAiTransport } from './mock-ai';
import { MOCK_AGENTS, MOCK_CONTEXT_ENTRIES } from './mock-data';
import { createChatSafeRegistry } from './safe-registry';
import { showConfirm, showMessage, uiBridge } from './ui-bridge';

/**
 * 聊天服务注入（spec: example-chat-on-pactor-app，设计决策 D4）：
 * createPactorApplication 的 providers 槽（Router 之内、InteractionKit
 * 之外），向 DSL 页内 Chat 注入全部运行时依赖。
 *
 * - 稳定服务（transport / safeRegistry / capabilities / callService /
 *   confirm / 附件伪上传与点击回调）模块加载即创建一次，会话内不变；
 * - ConversationStore 按会话 id 缓存于模块级 Map，provider 内按当前
 *   URL 的 ?id= 取实例就近注入——框架按 pageId+query key 重建页面
 *   （app-shell pageLoaderKey），切换「最近」会话或往返其他页面后
 *   消息不丢。
 */

/** 缺省会话 id（/chat 无 ?id= 时） */
const DEFAULT_CONVERSATION_ID = 'conv-demo';

const transport = createMockAiTransport();
const safeRegistry = createChatSafeRegistry();
const capabilities = createChatCapabilities();

/**
 * 声明式数据源服务桥（spec: chat-context-sources，设计决策 D1）：
 * chat.page.yaml contexts 的 service 引用（agents / contexts）经此解析为
 * ChatContextItem[]（{ id, label, data }——label 用于弹层与 chip 展示，
 * data 为原始条目，transport 可结构化消费）；
 * quoteMessage（spec: chat-message-actions）：消息操作条自定义 quote 动作
 * 的派发服务——入参 { actionId, message }，演示实现把引用文本 toast 出来
 * （真实场景可写入 Composer 草稿或引用回复区）
 */
const callService: NonNullable<ChatServices['callService']> = (
  name,
  params,
) => {
  switch (name) {
    case 'agents':
      return Promise.resolve(
        MOCK_AGENTS.map((agent) => ({
          id: agent.id,
          label: agent.name,
          data: agent,
        })),
      );
    case 'contexts':
      return Promise.resolve(
        MOCK_CONTEXT_ENTRIES.map((entry) => ({
          id: entry.id,
          label: entry.name,
          data: entry,
        })),
      );
    case 'quoteMessage': {
      const message = params?.['message'] as
        | { id?: string; parts?: Array<{ type: string; content?: string }> }
        | undefined;
      const text = (message?.parts ?? [])
        .filter(
          (part) =>
            (part.type === 'text' || part.type === 'markdown') &&
            typeof part.content === 'string',
        )
        .map((part) => part.content)
        .join('\n');
      console.info('[example-chat] quoteMessage', params);
      showMessage(
        'info',
        `已引用回复：${text.length > 40 ? `${text.slice(0, 40)}…` : text}`,
      );
      return Promise.resolve({ ok: true });
    }
    default:
      return Promise.reject(new Error(`未知服务：${name}`));
  }
};

/** 稳定服务集：store 以外的全部运行时依赖（附件受控状态由 Chat 组件自持） */
const baseServices: Omit<ChatServices, 'store'> = {
  transport,
  safeRegistry,
  capabilities,
  callService,
  confirm: ({ name }) => showConfirm(`高风险操作「${name}」，确认执行？`),
  onAttachFiles: (files) => Promise.all(files.map(readAsAttachment)),
  onAttachmentClick: (attachment) => {
    if (attachment.url) {
      window.open(attachment.url, '_blank');
    } else {
      showMessage('info', `附件「${attachment.name}」无 url（伪上传未产出 data URL）`);
    }
  },
};

/** 会话 store 缓存：按会话 id 复用实例，跨页面 / 跨会话切换不丢消息 */
const stores = new Map<string, ConversationStore>();

function getStore(conversationId: string): ConversationStore {
  let store = stores.get(conversationId);
  if (!store) {
    store = new ConversationStore();
    stores.set(conversationId, store);
  }
  return store;
}

export function ChatProvider({ children }: { children?: ReactNode }) {
  const location = useLocation();
  // 仅 chat 页消费 store；其余页面 query 无 id，落到缺省会话（不被读取）
  const conversationId =
    new URLSearchParams(location.search).get('id') || DEFAULT_CONVERSATION_ID;

  const value = useMemo<ChatServices>(
    () => ({ ...baseServices, store: getStore(conversationId) }),
    [conversationId],
  );

  return (
    // 示例级交互层：聊天服务侧 toast / confirm 经示例 uiBridge 注入
    // （DSL 页内 message 动作走框架内建动作，两套桥并行互不干扰）
    <InteractionProvider bridge={uiBridge}>
      <ChatServicesProvider value={value}>{children}</ChatServicesProvider>
    </InteractionProvider>
  );
}
