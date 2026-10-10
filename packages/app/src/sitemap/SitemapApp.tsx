import type { I18nMessages, PageDsl } from '@pactor-app/core';
import { createI18nContext } from '@pactor-app/core';
import { MenuRegistry } from '@pactor-app/router';
import {
  I18nContextProvider,
  useI18n,
  type ActionHandler,
  type ServiceHandler,
} from '@pactor-app/runtime';
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

import { createPactorPage } from '../embedded.js';
import type { PactorHttpHooks } from '../assembly.js';

import { defaultSitemapActions } from './actions.js';
import { useBrowserRoute } from './browser-route.js';
import { fetchSitemap, type FetchSitemapOptions } from './fetch.js';
import { createSitemapLoader, type SitemapLoaderOptions } from './loader.js';
import {
  mergeSitemapMenus,
  toSitemapNavItems,
} from './merge.js';
import {
  defaultSitemapGuard,
  resolveSitemapRoute,
  type SitemapGuard,
  type SitemapGuardDecision,
} from './route.js';
import {
  createSitemapSessionServices,
  type SitemapSessionContext,
} from './session.js';
import type { SitemapResource } from './types.js';

/**
 * SitemapApp（design/dynamic-page.md）：sitemap 驱动的动态页面应用组件。
 * 简单配置即可实现动态页面。两种路由模式：
 * - 纯前端 SPA：不传路由 props，内置浏览器路由（History API + popstate）；
 * - 宿主路由（Next App Router / react-router / 任意宿主）：注入 pathname / navigate。
 *
 * ```tsx
 * <SitemapApp
 *   sources={['/api/sitemap']}
 *   baseUrl="https://api.example.com"
 *   pathname={usePathname()}
 *   navigate={(to) => router.push(to)}
 *   services={{ 'auth.login': login }}
 * />
 * ```
 *
 * baseUrl 可选：sources / pageEndpoint 只写相对路径时以此为基准补全。
 *
 * 内置：多源拉取合并、menus×pages 继承、MenuRegistry 路由解析、访问守卫
 * （缺省匿名守卫：非 public 且无 user → navigate 到 auth.loginPath，
 * 可经 guard prop 替换）、DSL 布局渲染
 * （PageOutlet 页面出口 + SitemapMenu 选中态 / activeMenu 高亮）、
 * 页面内联 / 懒加载（id@version 缓存）、session.context 服务桥
 * （${data.session.*}）、缺省动作（app.reload / service.call）。
 *
 * 布局常驻：切换导航（同布局名）时仅 PageOutlet 内页面随路由重建。
 */
export interface SitemapAppProps {
  /** sitemap 接口 URL 列表（多源合并，冲突后源覆盖前源）；相对路径以 baseUrl 补全 */
  sources: string[];
  /** 接口基准地址：sources / pageEndpoint 中的相对路径以此为基准补全 */
  baseUrl?: string;
  /** 当前路径（宿主路由注入，如 Next usePathname）；缺省用内置浏览器路由 */
  pathname?: string;
  /** 站内导航实现（如 Next router.push）；http(s) 外链自动新标签打开；
   * 缺省用内置浏览器路由（History API） */
  navigate?: (to: string) => void;
  /** 当前 query（DSL ${route.query.x} 可读）；缺省自 location.search 解析 */
  query?: Record<string, string>;
  /** 懒加载页面端点，缺省 /api/pages/{id} */
  pageEndpoint?: SitemapLoaderOptions['pageEndpoint'];
  /** 业务服务（auth.login 等）；session.context 由组件自动注册 */
  services?: Record<string, ServiceHandler>;
  /** 业务动作；框架内置 app.reload / service.call 默认值，同名覆盖 */
  actions?: Record<string, ActionHandler>;
  /** 业务组件（同名覆盖内建；PageOutlet / SitemapMenu 为布局保留名） */
  components?: Record<string, unknown>;
  /** HTTP 钩子：所有 HTTP 出口（sitemap 源 / 页面端点 / 页面运行时）的统一加工（跨域改写 / 拆包） */
  httpAdapter?: PactorHttpHooks;
  /** fetch 实现（缺省全局 fetch；SSR / 测试可注入） */
  fetcher?: FetchSitemapOptions['fetcher'];
  /** 访问守卫（缺省 defaultSitemapGuard：匿名访问非 public 页 → 重定向 auth.loginPath） */
  guard?: SitemapGuard;
  /** 会话服务名（缺省 session.context） */
  sessionService?: string;
  /** 当前语言代码（透传页面与布局运行时；缺省 'zh-CN'）。切换即重建页面 */
  locale?: string;
  /** 回退语言代码（缺省 'zh-CN'） */
  defaultLocale?: string;
  /**
   * 翻译消息表（透传页面与布局运行时）。按值参与重建判定：
   * 宿主每次渲染新建等值对象不会触发重建，但内容变化会。
   */
  messages?: I18nMessages;
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

/**
 * SitemapApp 外壳（设计 D7）：按 props 组装 i18n 上下文并经 Provider
 * 包裹——自身状态文案与页面/布局运行时消费同一语言配置。
 */
export function SitemapApp(props: SitemapAppProps) {
  const i18n = useMemo(
    () =>
      createI18nContext({
        locale: props.locale,
        defaultLocale: props.defaultLocale,
        messages: props.messages,
      }),
    [props.locale, props.defaultLocale, props.messages],
  );
  return (
    <I18nContextProvider value={i18n}>
      <SitemapAppInner {...props} />
    </I18nContextProvider>
  );
}

function SitemapAppInner(props: SitemapAppProps) {
  const { t } = useI18n();
  const { sources, fetcher, baseUrl } = props;
  // 宿主未注入路由时回退到内置浏览器路由（纯前端 SPA 模式）
  const browserRoute = useBrowserRoute();
  const pathname = props.pathname ?? browserRoute.pathname;
  const query = props.query ?? browserRoute.query;
  const navigate = props.navigate ?? browserRoute.navigate;
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    fetchSitemap(sources, {
      fetcher,
      baseUrl,
      httpHooks: props.httpAdapter,
    })
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
  }, [fetcher, baseUrl, props.httpAdapter, JSON.stringify(sources)]);

  const registry = useMemo(
    () =>
      state.status === 'ready'
        ? new MenuRegistry(mergeSitemapMenus(state.sitemap))
        : null,
    [state],
  );
  // 路由解析（纯函数）：菜单命中 + 布局名 + activeMenu 高亮 key
  const resolution = useMemo(
    () =>
      state.status === 'ready' && registry !== null
        ? resolveSitemapRoute(state.sitemap, registry, pathname)
        : null,
    [state, registry, pathname],
  );

  const sitemap = state.status === 'ready' ? state.sitemap : null;
  const guard = props.guard ?? defaultSitemapGuard;
  const decision: SitemapGuardDecision = useMemo(
    () =>
      sitemap !== null && resolution !== null
        ? guard({ sitemap, pathname, menu: resolution.menu })
        : { allow: true },
    [sitemap, resolution, guard, pathname],
  );

  // 访问守卫：判定重定向时执行 navigate（缺省 = 匿名访问非 public 页 → 登录页）
  useEffect(() => {
    if (!decision.allow) {
      navigate(decision.redirectTo);
    }
  }, [decision, navigate]);

  if (state.status === 'loading') {
    return <Centered>{props.loading ?? t('pactor.table.loading')}</Centered>;
  }
  if (state.status === 'error') {
    return props.renderError !== undefined ? (
      <>{props.renderError(state.error)}</>
    ) : (
      <Centered>
        {t('pactor.sitemap.loadError', { message: state.error.message })}
      </Centered>
    );
  }
  if (sitemap === null || registry === null || resolution === null) {
    return null;
  }
  if (!decision.allow) {
    return <Centered>{t('pactor.sitemap.redirecting')}</Centered>;
  }
  if (resolution.route === null) {
    return props.renderNotFound !== undefined ? (
      <>{props.renderNotFound(pathname)}</>
    ) : (
      <Centered>{t('pactor.sitemap.notFound', { path: pathname })}</Centered>
    );
  }
  const { pageId, layoutName, highlightKey, params } = resolution.route;

  return (
    // key 只随布局名变化：切换导航（同布局）时布局常驻，
    // 仅 PageOutlet 内的页面随路由重建
    <NavHighlightContext.Provider value={highlightKey}>
      <SitemapLayout
        key={layoutName}
        sitemap={sitemap}
        registry={registry}
        pageId={pageId}
        layoutName={layoutName}
        pathname={pathname}
        query={query}
        navigate={navigate}
        routeParams={params}
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
  query,
  navigate: hostNavigate,
  routeParams,
  props,
}: {
  sitemap: SitemapResource;
  registry: MenuRegistry;
  pageId: string;
  layoutName: string;
  pathname: string;
  query: Record<string, string>;
  navigate: (to: string) => void;
  routeParams: Record<string, string>;
  props: SitemapAppProps;
}) {
  const { t } = useI18n();
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
        hostNavigate(to);
      }
    },
    [hostNavigate],
  );

  const loader = useMemo(
    () =>
      createSitemapLoader(sitemap, {
        pageEndpoint: props.pageEndpoint,
        fetcher: props.fetcher,
        sessionService,
        baseUrl: props.baseUrl,
        httpHooks: props.httpAdapter,
      }),
    [
      sitemap,
      props.pageEndpoint,
      props.fetcher,
      props.baseUrl,
      props.httpAdapter,
      sessionService,
    ],
  );
  const services = useMemo(
    () => ({
      ...createSitemapSessionServices(session, sessionService),
      ...props.services,
    }),
    [session, sessionService, props.services],
  );
  // 缺省动作（app.reload / service.call）开箱即用，宿主同名覆盖
  const actions = useMemo(
    () => ({ ...defaultSitemapActions, ...props.actions }),
    [props.actions],
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
    return (
      <Centered>
        {t('pactor.sitemap.layoutMissing', { name: layoutName })}
      </Centered>
    );
  }

  // 语言配置（设计 D7）：locale/messages 变化时经工厂重建 PactorPage——
  // PactorPage 直接形态首次渲染组装一次，切换语言必须产生新工厂
  // （组件类型变化触发卸载重建）。messages 按值签名参与依赖：
  // 宿主每次渲染新建等值对象不会导致重建。
  const messagesSignature = JSON.stringify(props.messages ?? {});
  const pageFactory = useMemo(
    () =>
      createPactorPage({
        loader,
        services,
        actions,
        navigate,
        httpAdapter: props.httpAdapter,
        permissions: sitemap.permissions ?? [],
        components: props.components,
        locale: props.locale,
        defaultLocale: props.defaultLocale,
        messages: props.messages,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      loader,
      services,
      actions,
      navigate,
      props.httpAdapter,
      props.components,
      sitemap,
      props.locale,
      props.defaultLocale,
      messagesSignature,
    ],
  );
  const layoutFactory = useMemo(
    () =>
      createPactorPage({
        services,
        actions,
        navigate,
        httpAdapter: props.httpAdapter,
        components: { PageOutlet, SitemapMenu, ...props.components },
        locale: props.locale,
        defaultLocale: props.defaultLocale,
        messages: props.messages,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      services,
      actions,
      navigate,
      props.httpAdapter,
      props.components,
      props.locale,
      props.defaultLocale,
      messagesSignature,
    ],
  );
  const Page = pageFactory;
  const LayoutPage = layoutFactory;

  return (
    <OutletContext.Provider
      value={
        // 页面实例：key 随 pageId + pathname 变化（route 参数变化需重建，
        // PactorPage 的 route prop 不参与运行时重建）——布局保持挂载
        <Page
          key={`${pageId}@${pathname}`}
          pageId={pageId}
          route={{ params: routeParams, query }}
        />
      }
    >
      <LayoutPage pageDsl={layoutPage} />
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
