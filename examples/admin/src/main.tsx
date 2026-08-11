import { createPactorApplication } from 'pactor-app';
import { StaticDslLoader } from 'pactor-resource';
// 默认 UI kit 为 Radix（pactor-ui-radix），样式表导入为必需步骤
import 'pactor-ui-radix/styles.css';
// 示例皮肤：换肤契约参考实现（须在 pactor-ui-radix/styles.css 之后导入）
import './theme.css';

import { bootstrap } from './bootstrap';
import { demoServices } from './services';
import customerEditPage from './pages/customer-edit.page.yaml';
import customerListPage from './pages/customer-list.page.yaml';
import dashboardPage from './pages/dashboard.page.yaml';

// 本地 DSL 开发：静态加载器直接喂入构建期 import 的页面与模拟 bootstrap
const loader = new StaticDslLoader({
  bootstrap,
  pages: {
    dashboard: dashboardPage,
    'customer-list': customerListPage,
    'customer-edit': customerEditPage,
  },
});

createPactorApplication({
  appId: 'example-admin',
  loader,
  services: demoServices,
  actions: {
    // 框架暂无内置"调用服务"动作（request 仅走 HTTP 出口），
    // 示例经 options.actions 扩展 service.call：写操作经 ServiceRegistry 调用，
    // params.params 由动作引擎完成表达式求值后传入
    'service.call': async (action, ctx) => {
      const name = action.params?.['service'];
      if (typeof name !== 'string' || name === '') {
        return {
          ok: false,
          error: new Error('[example-admin] service.call 缺少 params.service'),
        };
      }
      const handler = ctx.context.services.get(name);
      if (!handler) {
        return {
          ok: false,
          error: new Error(`[example-admin] service 未注册: ${name}`),
        };
      }
      try {
        const callParams = action.params?.['params'];
        const data = await handler(
          typeof callParams === 'object' && callParams !== null
            ? (callParams as Record<string, unknown>)
            : {},
        );
        return { ok: true, data };
      } catch (cause) {
        return {
          ok: false,
          error: cause instanceof Error ? cause : new Error(String(cause)),
        };
      }
    },
  },
}).mount('#root');
