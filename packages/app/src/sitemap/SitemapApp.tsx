import type { PageDsl } from '@pactor-app/core';
import { MenuRegistry } from '@pactor-app/router';
import type { ActionHandler, ServiceHandler } from '@pactor-app/runtime';
import { Menu } from '@pactor-app/ui/components';
import {
  createContext,
  use,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';

import { PactorPage } from '../embedded.js';
import type { PactorHttpHooks } from '../assembly.js';

import { fetchSitemap, type FetchSitemapOptions } from './fetch.js';
import { createSitemapLoader, type SitemapLoaderOptions } from './loader.js';
import {
  mergeSitemapMenus,
  toSitemapNavItems,
} from './merge.js';
import {
  createSitemapSessionServices,
  type SitemapSessionContext,
} from './session.js';
import type { SitemapMenuItem, SitemapResource } from './types.js';

/**
 * SitemapApp（design/dynamic-page.md）：sitemap 驱动的动态页面应用组件。
 * 简单配置即可实现动态页面——框架不持有路由（宿主传 pathname / navigate，
 * 兼容 Next App Router、react-router 或任意宿主）：
 *
 * ```tsx
 * <SitemapApp
 *   sources={['/api/sitemap']}
 *   pathname={usePathname()}
 *   navigate={(to) => router.push(to)}
 *   services={{ 'auth.login': login }}
 * />
 * ```
 *
 * 内置：多源拉取合并、menus×pages 继承、MenuRegistry 路由解析、匿名守卫
 * （非 public 且无 user → navigate 到 auth.loginPath）、DSL 布局渲染
 * （PageOutlet 页面出口 + SitemapMenu 选中态 / activeMenu 高亮）、
 * 页面内联 / 懒加载（id@version 缓存）、session.context 服务桥
 * （${data.session.*}）。
 *
 * 布局常驻：切换导航（同布局名）时仅 PageOutlet 内页面随路由重建。
 */
export interface SitemapAppProps {
  /** sitemap 接口 URL 列表（多源合并，冲突后源覆盖前源） */
  sources: string[];
  /** 当前路径（宿主路由注入，如 Next usePathname） */
  pathname: string;
  /** 站内导航实现（如 Next router.push）；http(s) 外链自动新标签打开 */
  navigate: (to: string) => void;
  /** 当前 query（宿主注入，DSL ${route.query.x} 可读） */
  query?: Record<string, string>;
  /** 懒加载页面端点，缺省 /api/pages/{id} */
  pageEndpoint?: SitemapLoaderOptions['pageEndpoint'];
  /** 业务服务（auth.login 等）；session.context 由组件自动注册 */
  services?: Record<string, ServiceHandler>;
  /** 业务动作（app.reload 等） */
  actions?: Record<string, ActionHandler>;
  /** 业务组件（同名覆盖内建；PageOutlet / SitemapMenu 为布局保留名） */
  components?: Record<string, unknown>;
  /** HTTP 钩子：页面运行时所有 HTTP 出口的统一加工（跨域改写 / 拆包） */
  httpAdapter?: PactorHttpHooks;
  /** fetch 实现（缺省全局 fetch；SSR / 测试可注入） */
  fetcher?: FetchSitemapOptions['fetcher'];
  /** 会话服务名（缺省 session.context） */
  sessionService?: string;
  /** 加载中视图 */
  loading?: ReactNode;
  /** sitemap 加载失败视图 */
  renderError?: (error: Error) => ReactNode;
  /** 路由未命中视图 */
  renderNotFound?: (path: string) => ReactNode;
}

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'ready'; sitemap: SitemapResource };

/** 页面内容出口：布局 DSL 中 `{ type: 'PageOutlet' }` 处渲染当前路由页面 */
const OutletContext = createContext<ReactNode>(null);

function PageOutlet() {
  return use(OutletContext);
}

/** 菜单高亮 key（activeMenu 解析结果，随导航更新） */
const NavHighlightContext = createContext('');

type UiMenuProps = ComponentProps<typeof Menu>;

/** 布局菜单（布局 DSL `{ type: 'SitemapMenu' }`）：选中态 = activeMenu 高亮 key */
function SitemapMenu({
  items,
  collapsible,
  onSelect,
}: Pick<UiMenuProps, 'items' | 'collapsible' | 'onSelect'>) {
  const highlight = use(NavHighlightContext);
  return (
    <Menu
      items={items}
      collapsible={collapsible}
      selectedKey={highlight}
      onSelect={onSelect}
    />
  );
}

export function SitemapApp(props: SitemapAppProps) {
  const { sources, pathname, navigate, fetcher } = props;
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    fetchSitemap(sources, { fetcher })
      .then((sitemap) => {
        if (!cancelled) {
          setState({ status: 'ready', sitemap });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      });
    return () => {
      cancelled = true;
    };
    // sources 由宿主以稳定引用传入（模块级常量或 memo）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher, JSON.stringify(sources)]);

  const registry = useMemo(
    () =>
      state.status === 'ready'
        ? new MenuRegistry(mergeSitemapMenus(state.sitemap))
        : null,
    [state],
  );
  const match = useMemo(
    () => registry?.findByPath(pathname) ?? null,
    [registry, pathname],
  );

  const sitemap = state.status === 'ready' ? state.sitemap : null;
  const loginPath = sitemap?.auth?.loginPath ?? '/login';
  const needsLogin =
    sitemap !== null &&
    (match === null || (match.menu as SitemapMenuItem).public !== true) &&
    sitemap.user === undefined &&
    pathname !== loginPath;

  // 匿名守卫：未登录访问非 public 页 → 重定向登录页
  useEffect(() => {
    if (needsLogin) {
      navigate(loginPath);
    }
  }, [needsLogin, loginPath, navigate]);

  if (state.status === 'loading') {
    return <Centered>{props.loading ?? '加载中…'}</Centered>;
  }
  if (state.status === 'error') {
    return props.renderError !== undefined ? (
      <>{props.renderError(state.error)}</>
    ) : (
      <Centered>sitemap 加载失败：{state.error.message}</Centered>
    );
  }
  if (sitemap === null || registry === null || needsLogin) {
    return <Centered>跳转登录页…</Centered>;
  }
  if (match === null || match.menu.pageId === undefined) {
    return props.renderNotFound !== undefined ? (
      <>{props.renderNotFound(pathname)}</>
    ) : (
      <Centered>页面不存在（{pathname}）</Centered>
    );
  }
  const layoutName =
    (match.menu as SitemapMenuItem).layout ?? sitemap.layout ?? 'admin';

  // 菜单高亮：activeMenu 指向其他菜单 id 时高亮该项（隐藏页场景）；
  // key 与 toSitemapNavItems 一致（path ?? id）
  const highlightId = match.menu.activeMenu ?? match.menu.id;
  const highlightItem = registry.findById(highlightId);
  const highlightKey = highlightItem?.path ?? highlightId;

  return (
    // key 只随布局名变化：切换导航（同布局）时布局常驻，
    // 仅 PageOutlet 内的页面随路由重建
    <NavHighlightContext.Provider value={highlightKey}>
      <SitemapLayout
        key={layoutName}
        sitemap={sitemap}
        registry={registry}
        pageId={match.menu.pageId}
        layoutName={layoutName}
        pathname={pathname}
        routeParams={match.params}
        props={props}
      />
    </NavHighlightContext.Provider>
  );
}

function SitemapLayout({
  sitemap,
  registry,
  pageId,
  layoutName,
  pathname,
  routeParams,
  props,
}: {
  sitemap: SitemapResource;
  registry: MenuRegistry;
  pageId: string;
  layoutName: string;
  pathname: string;
  routeParams: Record<string, string>;
  props: SitemapAppProps;
}) {
  const sessionService = props.sessionService ?? 'session.context';
  const session: SitemapSessionContext = useMemo(
    () => ({
      user: sitemap.user,
      app: { name: 'Pactor App', ...sitemap.app },
      menus: toSitemapNavItems(registry.tree()),
    }),
    [sitemap, registry],
  );

  const navigate = useMemo(
    () => (to: string) => {
      // 外链新标签打开，站内走宿主路由
      if (/^https?:\/\//.test(to)) {
        window.open(to, '_blank', 'noopener');
      } else {
        props.navigate(to);
      }
    },
    [props],
  );

  const loader = useMemo(
    () =>
      createSitemapLoader(sitemap, {
        pageEndpoint: props.pageEndpoint,
        fetcher: props.fetcher,
        sessionService,
      }),
    [sitemap, props.pageEndpoint, props.fetcher, sessionService],
  );
  const services = useMemo(
    () => ({
      ...createSitemapSessionServices(session, sessionService),
      ...props.services,
    }),
    [session, sessionService, props.services],
  );

  const layoutDsl = sitemap.layouts[layoutName];
  // LayoutDsl → 合成 PageDsl：注入 session dataSource（${data.session.*}）。
  // memo 保持引用稳定——PactorPage 以 pageDsl 为依赖重建运行时
  const layoutPage: PageDsl | null = useMemo(() => {
    if (layoutDsl === undefined) {
      return null;
    }
    return {
      dsl: layoutDsl.dsl,
      page: { id: `layout:${layoutName}`, title: layoutName },
      dataSources: {
        session: { type: 'service', service: sessionService, autoLoad: true },
      },
      body: layoutDsl.body,
    };
  }, [layoutDsl, layoutName, sessionService]);

  if (layoutDsl === undefined || layoutPage === null) {
    return <Centered>布局未定义：{layoutName}</Centered>;
  }
  return (
    <OutletContext.Provider
      value={
        // 页面实例：key 随 pageId + pathname 变化（route 参数变化需重建，
        // PactorPage 的 route prop 不参与运行时重建）——布局保持挂载
        <PactorPage
          key={`${pageId}@${pathname}`}
          pageId={pageId}
          route={{ params: routeParams, query: props.query }}
          loader={loader}
          services={services}
          actions={props.actions}
          permissions={sitemap.permissions ?? []}
          navigate={navigate}
          httpAdapter={props.httpAdapter}
          components={props.components}
        />
      }
    >
      <PactorPage
        pageDsl={layoutPage}
        services={services}
        actions={props.actions}
        navigate={navigate}
        httpAdapter={props.httpAdapter}
        components={{ PageOutlet, SitemapMenu, ...props.components }}
      />
    </OutletContext.Provider>
  );
}

function Centered({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: 'var(--muted-foreground, #6b7280)',
      }}
    >
      {children}
    </div>
  );
}
