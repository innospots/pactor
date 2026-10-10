import type { DslSourceRef, I18nMessages, PageDsl } from '@pactor-app/core';
import { createI18nContext, isDslSourceRef } from '@pactor-app/core';
import { createPermissionAdapter, PermissionStore } from '@pactor-app/permission';
import type { DslResourceLoader } from '@pactor-app/resource';
import {
  createDefaultPermissionAdapter,
  createPageRuntime,
  DslSourceResolver,
  I18nContextProvider,
  PageRuntimeView,
  useI18n,
  type PageRuntime,
  type PermissionAdapter,
} from '@pactor-app/runtime';
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from 'react';

import {
  createPactorAssembly,
  type PactorAssembly,
  type PactorAssemblyOptions,
} from './assembly.js';
import type { AuthTokenProvider } from './application.js';
import { PageErrorBoundary } from './error-boundary.js';
import { BootstrapSpinner, PrimaryButton, ResultView } from './feedback.js';

/**
 * 嵌入式页面 props（spec: embedded-page-view）：
 * `pageId`（经 loader 加载）与 `pageDsl`（直接传入或动态引用）二选一。
 */
export interface PactorPageProps {
  /** 页面 id（经 options.loader 加载） */
  pageId?: string;
  /**
   * 直接传入的 PageDsl（不经 loader），或 DslSourceRef 动态引用——
   * 经 service/http 通道远端加载 PageDsl，校验通过后创建运行时；
   * 加载失败走错误态与 onError，重试重新请求
   */
  pageDsl?: PageDsl | DslSourceRef;
  /** 路由作用域注入：DSL 内 `${route.params.x}` / `${route.query.x}` 可读 */
  route?: { params?: Record<string, unknown>; query?: Record<string, unknown> };
}

/**
 * 嵌入式页面工厂选项（设计决策 D1/D2）：整应用模式的组装选项子集
 * （无路由、无外壳布局）；route 上下文经 props 纯数据注入。
 */
export interface PactorPageOptions extends Omit<PactorAssemblyOptions, 'navigate'> {
  /**
   * 站内导航实现（D2：可选注入宿主路由，缺省退化）——如 Next.js
   * `router.push` / react-router `navigate`；缺省以 `location.assign`
   * 整页跳转。DSL `navigate` 动作与链接类组件的站内点击（`route.navigate`）
   * 均走此实现。
   */
  navigate?: (to: string) => void;
  /** 资源加载器（按 pageId 加载页面时需要） */
  loader?: DslResourceLoader;
  /** 权限码列表（缺省全部放行；细粒度控制可传 permission 适配器） */
  permissions?: string[];
  /** 权限适配器（优先于 permissions） */
  permission?: PermissionAdapter;
  /** 认证令牌（注入页面 HTTP 出口） */
  authTokenProvider?: AuthTokenProvider;
  /** 当前语言代码（缺省 'zh-CN'） */
  locale?: string;
  /** 回退语言代码（缺省 'zh-CN'） */
  defaultLocale?: string;
  /** 翻译消息表 */
  messages?: I18nMessages;
  /** 页面加载/校验失败回调 */
  onError?: (error: Error) => void;
}

type EmbeddedPageState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'ready'; runtime: PageRuntime };

/**
 * 嵌入式页面工厂（spec: embedded-page-view）：返回预配置的 PactorPage 组件。
 * 组装一次（registries / 交互层 / i18n），每个组件实例自持独立
 * PageRuntime（多实例隔离）。
 */
export function createPactorPage(
  options: PactorPageOptions = {},
): ComponentType<PactorPageProps> {
  // 嵌入模式：navigate 可选注入宿主路由（方案：D2 可选注入），缺省退化为自然跳转
  const navigate =
    options.navigate ??
    ((to: string) => {
      if (typeof window !== 'undefined') {
        window.location.assign(to);
      }
    });
  const assembly = createPactorAssembly({
    ...options,
    navigate,
  });
  // 权限：显式适配器 > 权限码列表 > 缺省全部放行（嵌入模式无 bootstrap）
  let permission: PermissionAdapter;
  if (options.permission !== undefined) {
    permission = options.permission;
  } else if (options.permissions !== undefined) {
    const store = new PermissionStore();
    store.setPermissions(options.permissions);
    permission = createPermissionAdapter(store);
  } else {
    permission = createDefaultPermissionAdapter();
  }
  const i18n = createI18nContext({
    locale: options.locale,
    defaultLocale: options.defaultLocale,
    messages: options.messages,
  });

  function createRuntime(pageDsl: PageDsl, route: PactorPageProps['route']) {
    return createPageRuntime(pageDsl, {
      components: assembly.components,
      actions: assembly.actions,
      services: assembly.services,
      capabilities: assembly.capabilities,
      permission,
      // route.navigate 与 DSL navigate 动作共用同一实现（宿主注入或缺省整页跳转）
      router: { navigate },
      http: assembly.httpAdapter,
      route: { params: route?.params ?? {}, query: route?.query ?? {} },
      locale: options.locale ?? 'zh-CN',
      defaultLocale: options.defaultLocale ?? 'zh-CN',
      messages: options.messages ?? {},
    });
  }

  return function ConfiguredPactorPage(props: PactorPageProps) {
    // Provider 上提到工厂组件层：EmbeddedPage 自身（loading/error 态）
    // 与页面内容消费同一 i18n 上下文
    return (
      <I18nContextProvider value={i18n}>
        <EmbeddedPage
          assembly={assembly}
          options={options}
          createRuntime={createRuntime}
          resolvePage={options.loader ? resolvePage : undefined}
          {...props}
        />
      </I18nContextProvider>
    );
  };

  async function resolvePage(pageId: string): Promise<PageDsl> {
    if (!options.loader) {
      throw new Error('[@pactor-app/app] PactorPage: 按 pageId 加载需要 options.loader');
    }
    const resource = await options.loader.loadPage(pageId);
    return resource.schema;
  }
}

/**
 * PactorPage 组件（spec: embedded-page-view）：嵌入式 DSL 页面。
 * 直接使用时把工厂选项一并作为 props 传入（首次渲染时组装一次）；
 * 需要复用同一组装配时优先用 `createPactorPage(options)` 工厂。
 */
export function PactorPage(props: PactorPageProps & PactorPageOptions) {
  const { pageId, pageDsl, route, ...options } = props;
  const factoryRef = useRef<ComponentType<PactorPageProps> | null>(null);
  if (factoryRef.current === null) {
    factoryRef.current = createPactorPage(options);
  }
  const ConfiguredPage = factoryRef.current;
  return <ConfiguredPage pageId={pageId} pageDsl={pageDsl} route={route} />;
}

/** 嵌入页状态机：pageId/pageDsl → PageRuntime（对齐 DslPageLoader 语义） */
function EmbeddedPage({
  assembly,
  options,
  createRuntime,
  resolvePage,
  pageId,
  pageDsl,
  route,
}: PactorPageProps & {
  assembly: PactorAssembly;
  options: PactorPageOptions;
  createRuntime: (pageDsl: PageDsl, route: PactorPageProps['route']) => PageRuntime;
  resolvePage?: (pageId: string) => Promise<PageDsl>;
}) {
  const { t } = useI18n();
  const [state, setState] = useState<EmbeddedPageState>({ status: 'loading' });
  const [retryTick, setRetryTick] = useState(0);
  const onError = options.onError;

  useEffect(() => {
    let cancelled = false;
    let runtime: PageRuntime | null = null;
    void (async () => {
      try {
        let resolved = pageDsl;
        if (resolved === undefined) {
          if (pageId === undefined) {
            throw new Error('[@pactor-app/app] PactorPage: pageId 与 pageDsl 必传其一');
          }
          if (resolvePage === undefined) {
            throw new Error('[@pactor-app/app] PactorPage: 按 pageId 加载需要 options.loader');
          }
          resolved = await resolvePage(pageId);
        } else if (isDslSourceRef(resolved)) {
          // pageDsl 为动态引用：经 service/http 通道加载 PageDsl；
          // 每次 effect 执行（含重试）新建解析器——缓存不跨重试复用
          const resolver = new DslSourceResolver({
            services: assembly.services,
            http: assembly.httpAdapter,
            getScope: () => ({
              route: { params: route?.params ?? {}, query: route?.query ?? {} },
            }),
          });
          // createPageRuntime 会对结果做 validatePageDsl，校验失败按加载失败处理
          resolved = (await resolver.resolve(resolved)) as PageDsl;
        }
        if (cancelled) {
          return;
        }
        runtime = createRuntime(resolved, route);
        setState({ status: 'ready', runtime });
        void runtime.ready();
        void runtime.show();
      } catch (cause) {
        if (!cancelled) {
          const error = cause instanceof Error ? cause : new Error(String(cause));
          onError?.(error);
          setState({ status: 'error', error });
        }
      }
    })();
    return () => {
      cancelled = true;
      if (runtime !== null && !runtime.destroyed) {
        void runtime.hide();
        void runtime.destroy();
      }
    };
    // route 由宿主以 key 控制重建（与整应用模式一致）；retryTick 驱动重试
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId, pageDsl, retryTick]);

  const InteractionProvider = assembly.interactionKit.Provider;
  const OverlayHost = assembly.interactionKit.OverlayHost;

  let content;
  if (state.status === 'loading') {
    content = (
      <div className="pactor-app-page-loading">
        <BootstrapSpinner style={{ minHeight: 0, padding: 48 }} />
      </div>
    );
  } else if (state.status === 'error') {
    content = (
      <ResultView
        className="pactor-app-page-load-error"
        title={t('pactor.page.loadFailed')}
        subTitle={state.error.message}
        extra={
          <PrimaryButton onClick={() => setRetryTick((n) => n + 1)}>
            {t('pactor.page.retry')}
          </PrimaryButton>
        }
      />
    );
  } else {
    content = (
      <PageErrorBoundary>
        <PageRuntimeView runtime={state.runtime}>
          {resolvePage !== undefined ? (
            <OverlayHost manager={assembly.overlayManager} resolvePage={resolvePage} />
          ) : (
            <OverlayHost manager={assembly.overlayManager} />
          )}
        </PageRuntimeView>
      </PageErrorBoundary>
    );
  }

  return (
    <InteractionProvider bridge={assembly.uiBridge}>
      {content}
    </InteractionProvider>
  );
}
