import type { ServiceHandler } from '@pactor-app/runtime';

import type { SitemapNavItem } from './merge.js';

/**
 * 会话上下文（session.context 服务返回值）：布局 / 页面 DSL 经
 * service dataSource 消费（${data.session.*}）。
 * 框架原生 user / menus 作用域属设计目标（design/dynamic-page.md
 * 落地影响 #3），当前经服务桥实现。
 */
export interface SitemapSessionContext {
  user?: Record<string, unknown>;
  app: Record<string, unknown>;
  menus: SitemapNavItem[];
}

/** 注册会话桥服务（缺省名 session.context，与 loader 注入的 dataSource 对应） */
export function createSitemapSessionServices(
  session: SitemapSessionContext,
  serviceName = 'session.context',
): Record<string, ServiceHandler> {
  return {
    [serviceName]: () => Promise.resolve(session),
  };
}
