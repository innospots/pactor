import { createPactorApplication } from 'pactor-app';
import { StaticDslLoader } from 'pactor-resource';
import { antdUiKit } from 'pactor-ui-antd';
// antd v5+ 为 CSS-in-JS，仅需全局 reset（与 Radix 示例的 styles.css 对应位）
import 'antd/dist/reset.css';

import { readSession } from './auth';
import { createBootstrap } from './bootstrap';
import { demoServices } from './services';
import customerEditPage from './pages/customer-edit.page.yaml';
import customerListPage from './pages/customer-list.page.yaml';
import dashboardPage from './pages/dashboard.page.yaml';
import loginPage from './pages/login.page.yaml';

// 路由守卫（应用外壳职责，在 DSL 之外）：未登录访问业务页 → /login；
// 已登录访问 /login → /。整页跳转，bootstrap 随之按会话重新生成
const session = readSession();
if (!session && window.location.pathname !== '/login') {
  window.location.replace('/login');
} else if (session && window.location.pathname === '/login') {
  window.location.replace('/');
}

// 与 example-admin（Radix kit）完全相同的页面 DSL 与 bootstrap，
// 仅 ui 预设切换为 antdUiKit —— 演示"同一 DSL 双 UI kit 运行"
const loader = new StaticDslLoader({
  bootstrap: createBootstrap(),
  pages: {
    login: loginPage,
    dashboard: dashboardPage,
    'customer-list': customerListPage,
    'customer-edit': customerEditPage,
  },
});

createPactorApplication({
  appId: 'example-admin-antd',
  loader,
  ui: antdUiKit,
  services: demoServices,
  actions: {
    // 整页重载：登录/登出后需要重新加载 bootstrap（布局与菜单随会话变化），
    // react-router 的 navigate 不会触发 bootstrap 重取，故示例扩展此动作
    'app.reload': (action) => {
      const to = action.params?.['to'];
      window.location.assign(typeof to === 'string' && to !== '' ? to : '/');
      return { ok: true };
    },
    // 框架暂无内置"调用服务"动作（request 仅走 HTTP 出口），
    // 示例经 options.actions 扩展 service.call：写操作经 ServiceRegistry 调用，
    // params.params 由动作引擎完成表达式求值后传入
    'service.call': async (action, ctx) => {
      const name = action.params?.['service'];
      if (typeof name !== 'string' || name === '') {
        return {
          ok: false,
          error: new Error('[example-admin-antd] service.call 缺少 params.service'),
        };
      }
      const handler = ctx.context.services.get(name);
      if (!handler) {
        return {
          ok: false,
          error: new Error(`[example-admin-antd] service 未注册: ${name}`),
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
