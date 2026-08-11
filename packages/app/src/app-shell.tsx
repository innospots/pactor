import { Button, Result, Spin } from 'antd';
import { resolveLayout } from 'pactor-ui-antd/layout';
import { resolveRoute } from 'pactor-router';
import { DynamicDslRoute, useReactRouterBridge } from 'pactor-router/react';
import { useEffect, useState, type ReactNode } from 'react';
import {
  BrowserRouter,
  HashRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import type {
  PactorAppSession,
  PactorApplicationHandle,
  ReactRouterBinding,
} from './application.js';
import { DslPageLoader } from './page-loader.js';

/** Application props：app 为 createPactorApplication 的内部句柄 */
export interface ApplicationProps {
  app: PactorApplicationHandle;
}

type BootstrapState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'ready'; session: PactorAppSession };

/**
 * Application（设计决策 D3）：bootstrap 状态机 + React 组合。
 *
 * mount 后依次：加载 bootstrap（loading 态）→ 失败渲染含重试的启动错误页 →
 * 成功渲染组合：Router → RouterBridgeSync → interactionKit.Provider
 * （缺省 antd InteractionProvider）→ 布局（resolveLayout）→
 * Routes path="*" → DynamicDslRoute（404/403）。
 */
export function Application({ app }: ApplicationProps) {
  const [state, setState] = useState<BootstrapState>({ status: 'loading' });
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void app.loadSession().then(
      (session) => {
        if (!cancelled) {
          setState({ status: 'ready', session });
        }
      },
      (cause: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            error: cause instanceof Error ? cause : new Error(String(cause)),
          });
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [app, retryTick]);

  if (state.status === 'loading') {
    return (
      <div
        className="pactor-app-bootstrap-loading"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
  if (state.status === 'error') {
    return (
      <Result
        className="pactor-app-bootstrap-error"
        status="error"
        title="应用启动失败"
        subTitle={state.error.message}
        extra={
          <Button type="primary" onClick={() => setRetryTick((n) => n + 1)}>
            重试
          </Button>
        }
      />
    );
  }
  return <AppShell app={app} session={state.session} />;
}

/** bootstrap 就绪后的组合：Router → 桥接同步 → interactionKit.Provider → 布局 → 动态路由 */
function AppShell({
  app,
  session,
}: {
  app: PactorApplicationHandle;
  session: PactorAppSession;
}) {
  const Router = app.routerOptions.type === 'hash' ? HashRouter : BrowserRouter;
  const InteractionKit = app.interactionKit.Provider;
  return (
    <Router basename={app.routerOptions.basename}>
      <RouterBridgeSync binding={app.navigation} />
      <InteractionKit bridge={app.uiBridge}>
        <ShellLayout app={app} session={session} />
      </InteractionKit>
    </Router>
  );
}

/**
 * 把 react-router 绑定到应用级 NavigationBridge（决策 D3）：
 * 挂载时 bind（真实桥接 + 初始 location），此后 location 变化经 sync
 * 通知订阅者（AdminLayout 选中态/页签、DSL navigate 动作）。
 */
function RouterBridgeSync({ binding }: { binding: ReactRouterBinding }) {
  const bridge = useReactRouterBridge();
  const location = useLocation();

  useEffect(() => {
    binding.bind(bridge, {
      pathname: location.pathname,
      search: location.search,
    });
    // 仅在桥接创建时绑定一次（location 初值随之捕获）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bridge, binding]);

  useEffect(() => {
    binding.sync({ pathname: location.pathname, search: location.search });
  }, [binding, location.pathname, location.search]);

  return null;
}

/** 布局包裹 + 动态路由出口 */
function ShellLayout({
  app,
  session,
}: {
  app: PactorApplicationHandle;
  session: PactorAppSession;
}) {
  const location = useLocation();
  const route = resolveRoute(session.menuRegistry, {
    pathname: location.pathname,
    search: location.search,
  });
  const LayoutComponent = resolveLayout(app.layoutRegistry, session.layoutType);

  const outlet = (
    <Routes>
      <Route
        path="*"
        element={
          <DynamicDslRoute
            registry={session.menuRegistry}
            permissionChecker={app.permissionStore}
            fallback={<NotFoundPage />}
            forbidden={<ForbiddenPage />}
            render={({ pageId, route: pageRoute }) => (
              <DslPageLoader
                key={pageLoaderKey(pageId, pageRoute)}
                app={app}
                pageId={pageId}
                route={pageRoute}
              />
            )}
          />
        }
      />
    </Routes>
  );

  if (session.layoutType === 'admin') {
    return (
      <LayoutComponent
        config={session.layoutConfig}
        brand={session.brand}
        registry={session.menuRegistry}
        bridge={app.navigation}
        route={route ?? undefined}
        permissionChecker={app.permissionStore}
      >
        {outlet}
      </LayoutComponent>
    );
  }
  // 其他布局（blank / login / landing 及业务自定义）：传递 brand 与内容出口
  return <LayoutComponent brand={session.brand}>{outlet}</LayoutComponent>;
}

/**
 * 页面加载器 key（决策 D2）：pageId 或 route.params/query 变化时
 * 卸载旧页面并重建运行时（V1 无 keepAlive）。
 */
function pageLoaderKey(
  pageId: string,
  route: { params: Record<string, string>; query: Record<string, string> },
): string {
  return `${pageId}|${JSON.stringify(route.params)}|${JSON.stringify(route.query)}`;
}

/** 404：路径未命中任何菜单页 */
function NotFoundPage(): ReactNode {
  return (
    <Result
      className="pactor-app-not-found"
      status="404"
      title="404"
      subTitle="页面不存在或尚未注册"
    />
  );
}

/** 403：命中页面但无访问权限 */
function ForbiddenPage(): ReactNode {
  return (
    <Result
      className="pactor-app-forbidden"
      status="403"
      title="403"
      subTitle="没有访问该页面的权限"
    />
  );
}
