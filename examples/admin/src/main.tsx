import { createPactorApplication } from 'pactor-app';
import { StaticDslLoader } from 'pactor-resource';
// 默认 UI kit 为 Radix（pactor-ui-radix），样式表导入为必需步骤
import 'pactor-ui-radix/styles.css';
// 示例皮肤：换肤契约参考实现（须在 pactor-ui-radix/styles.css 之后导入）
import './theme.css';

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

// 本地 DSL 开发：静态加载器直接喂入构建期 import 的页面与模拟 bootstrap
// （bootstrap 按当前会话返回 login 或 admin 布局形态）
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
  appId: 'example-admin',
  loader,
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
