import type { MessageBundleSet } from '@pactor-app/core';

/** MessageProvider.load 输入（设计 6.0.3 统一契约） */
export interface LoadMessagesInput {
  appId: string;
  /** 来自服务端可信上下文，不接受浏览器任意指定 */
  tenantId?: string;
  locale: string;
  namespaces: string[];
  release: string;
}

/**
 * 渲染服务统一语言包 Provider 契约。
 * YamlMessageProvider 与 ApiMessageProvider 输出完全相同的 MessageBundleSet，
 * 消费方（如 DslLocalizer）只依赖此接口。
 */
export interface MessageProvider {
  load(input: LoadMessagesInput): Promise<MessageBundleSet>;
}
