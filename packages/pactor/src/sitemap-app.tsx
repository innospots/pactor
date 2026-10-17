import {
  SitemapApp as BaseSitemapApp,
  type SitemapAppProps,
} from '@pactor-app/app';
import { createChatComponentRegistry } from '@pactor-app/chat';
import { registerBlockComponents } from '@pactor-app/blocks';
import { registerChartComponents } from '@pactor-app/chart';

/**
 * pactor-app 元包全量组件注册表：ui 内置组件 + chat 展示组件族
 *（ChatPage / ConversationList / Composer 等）+ Chat / ChatShell
 * + blocks 复合区块 + chart 图表组件。
 */
export function createPactorComponentRegistry() {
  const registry = createChatComponentRegistry();
  registerBlockComponents(registry);
  registerChartComponents(registry);
  return registry;
}

/**
 * pactor-app 元包版 SitemapApp：组件注册表缺省为
 * createPactorComponentRegistry，业务侧无需再按名注册
 * chat / blocks / chart 组件；显式传 componentRegistry 可覆盖。
 */
export function SitemapApp(props: SitemapAppProps) {
  return (
    <BaseSitemapApp
      componentRegistry={createPactorComponentRegistry}
      {...props}
    />
  );
}
