import type { I18nMessages, PageDsl } from '@pactor-app/core';
import { Registry } from '@pactor-app/core';
import { createShadcnComponentRegistry } from '@pactor-app/ui/components';
import {
  createUiBridge,
  OverlayManager,
  registerInteractionActions,
  ShadcnInteractionProvider,
  ShadcnOverlayHost,
  type InteractionProviderProps,
  type OverlayHostProps,
  type UiBridge,
} from '@pactor-app/ui/interaction';
import {
  createShadcnLayoutRegistry,
  type AdminLayoutConfig,
  type LayoutRegistry,
} from '@pactor-app/ui/layout';
import { createPermissionAdapter, PermissionStore } from '@pactor-app/permission';
import {
  createFetchAdapter,
  HttpDslResourceLoader,
  type BootstrapResource,
  type DslResourceLoader,
  type HttpAdapter as ResourceHttpAdapter,
} from '@pactor-app/resource';
import {
  createRouterAdapter,
  MenuRegistry,
  type MenuItem,
  type NavigationBridge,
  type NavigationListener,
  type NavigationLocation,
  type RouteContext,
} from '@pactor-app/router';
import {
  createFetchHttpAdapter,
  createPageRuntime,
  type ActionHandler,
  type ActionRegistry,
  type CapabilityRegistry,
  type HttpAdapter,
  type PageRuntime,
  type ServiceHandler,
  type ServiceRegistry,
} from '@pactor-app/runtime';
import { createElement, type ComponentType, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { Application } from './app-shell.js';

/** 认证令牌提供者：同步或异步返回 Bearer token（无令牌返回 undefined） */
export type AuthTokenProvider = () =>
  | string
  | undefined
  | Promise<string | undefined>;

/** 路由配置（V1 支持 browser + basename；hash 预留） */
export interface PactorRouterOptions {
  /** 路由类型，缺省 'browser' */
  type?: 'browser' | 'hash';
  /** react-router basename（部署在子路径时配置） */
  basename?: string;
}

/** createPactorApplication 配置（设计决策 D1） */
export interface PactorApplicationOptions {
  /** 应用 id（必填）：app 上下文缺省 id、brand 缺省标题回退 */
  appId: string;
  /** DSL 资源 API 配置；未注入 loader 时按 baseURL 创建 HttpDslResourceLoader */
  api?: { baseURL?: string };
  /** 资源加载器（优先于 api；测试/本地可注入 StaticDslLoader） */
  loader?: DslResourceLoader;
  /** 布局类型覆盖（优先级：options.layout > bootstrap.layout.type > 'admin'） */
  layout?: string;
  /** 品牌区覆盖（缺省取 bootstrap.app.name，再回退 appId） */
  brand?: { title: string; logo?: ReactNode };
  /** 路由配置 */
  router?: PactorRouterOptions;
  /** 业务组件扩展（写入应用级共享 registry，可覆盖同名内置组件） */
  components?: Record<string, unknown>;
  /**
   * UI 库切换（设计决策 D4，ui-kit-selection spec）：组件注册表工厂，
   * 缺省 createShadcnComponentRegistry（shadcn，@pactor-app/ui——唯一内置
   * 实现）；传入自定义工厂可整体替换。
   * options.components 与运行期 registerComponent 叠加在所选注册表之上。
   * 注意：默认路径需导入 `@pactor-app/ui/styles.css`。
   */
  componentRegistry?: () => Registry<unknown>;
  /**
   * UI 库切换（shell-ui-kit-selection spec）：布局注册表工厂，
   * 缺省 createShadcnLayoutRegistry（shadcn，@pactor-app/ui——唯一内置
   * 实现）；传入自定义工厂可整体替换外壳布局。
   * bootstrap 的 layout.type 解析逻辑不变。
   */
  layoutRegistry?: () => LayoutRegistry;
  /**
   * UI 库切换（shell-ui-kit-selection spec）：交互层组件对，
   * 缺省 shadcn 版 ShadcnInteractionProvider / ShadcnOverlayHost
   * （@pactor-app/ui——唯一内置实现）；传入自定义组件对可替换
   * overlay / message / confirm 链路。props 类型为
   * @pactor-app/ui/interaction 的 InteractionProviderProps / OverlayHostProps。
   */
  interactionKit?: {
    Provider: ComponentType<InteractionProviderProps>;
    OverlayHost: ComponentType<OverlayHostProps>;
  };
  /**
   * UI kit 预设（ui-kit-preset spec）：一次性提供三个 UI 库切换槽位
   * （内置预设为 @pactor-app/ui 的 shadcnUiKit）。
   * 每个槽位独立合并，优先级：显式细粒度选项 > ui 预设 > 内置
   * shadcn 默认。
   */
  ui?: UiKit;
  /** 业务动作扩展（可覆盖同名内置/交互动作） */
  actions?: Record<string, ActionHandler>;
  /** 业务服务扩展 */
  services?: Record<string, ServiceHandler>;
  /** 业务能力扩展 */
  capabilities?: Record<string, unknown>;
  /**
   * 应用级包装组件（Router 之内、InteractionKit 之外）：业务
   * ConfigProvider / 全局 Context 由此进入应用树（message / modal /
   * overlay 均消费其上下文）。皮肤主题等运行时切换场景经此注入。
   */
  providers?: ComponentType<{ children?: ReactNode }>;
  /** admin 布局头部右侧插槽（透传 AdminLayout headerExtra） */
  headerExtra?: ReactNode;
  /** 认证令牌：注入 DSL 资源请求与页面 HTTP 出口（Authorization: Bearer） */
  authTokenProvider?: AuthTokenProvider;
  /** 当前语言代码（优先级高于 bootstrap.locale 与浏览器语言） */
  locale?: string;
  /** 回退语言代码（缺省 'zh-CN'） */
  defaultLocale?: string;
  /** 翻译消息表（优先级高于 bootstrap.messages） */
  messages?: I18nMessages;
}

/**
 * UI kit 预设对象（ui-kit-preset spec）：三个槽位的字段类型直接复用
 * PactorApplicationOptions 既有选项的类型（结构一致，天然向第三方 kit 开放）。
 */
export interface UiKit {
  /** 组件注册表工厂（同 options.componentRegistry） */
  componentRegistry?: PactorApplicationOptions['componentRegistry'];
  /** 布局注册表工厂（同 options.layoutRegistry） */
  layoutRegistry?: PactorApplicationOptions['layoutRegistry'];
  /** 交互层组件对（同 options.interactionKit） */
  interactionKit?: PactorApplicationOptions['interactionKit'];
}

/**
 * bootstrap 会话（设计决策 D1/D2）：启动编排的产物，
 * React 组合层据以渲染布局、菜单与动态路由。
 */
export interface PactorAppSession {
  /** 原始 bootstrap 资源 */
  bootstrap: BootstrapResource;
  /** 菜单注册表（bootstrap.menus，缺省 []） */
  menuRegistry: MenuRegistry;
  /** 解析后的布局类型 */
  layoutType: string;
  /** 布局区域开关（来自 bootstrap.layout，缺省交给布局组件自身缺省） */
  layoutConfig: AdminLayoutConfig;
  /** 品牌区 */
  brand: { title: string; logo?: ReactNode };
  /** 当前用户（注入页面运行时 user 作用域） */
  user: Record<string, unknown>;
  /** 应用信息（{ id: appId, ...bootstrap.app }，注入 app 作用域） */
  app: Record<string, unknown>;
  /** 当前语言代码 */
  locale: string;
  /** 回退语言代码 */
  defaultLocale: string;
  /** 翻译消息表 */
  messages: I18nMessages;
}

/** 应用实例（设计决策 D4）：mount/unmount 与扩展注册 API */
export interface PactorApplication {
  readonly appId: string;
  /** 以 createRoot 渲染到 selector 匹配的元素；重复 mount 先 unmount */
  mount(selector: string): void;
  /** 卸载根（未挂载时 no-op） */
  unmount(): void;
  /** 注册业务组件到应用级共享 registry（同名覆盖；新创建/重建的页面即可用） */
  registerComponent(name: string, component: unknown): void;
  /** 注册业务动作（同名覆盖） */
  registerAction(name: string, handler: ActionHandler): void;
  /** 注册业务服务（同名覆盖） */
  registerService(name: string, handler: ServiceHandler): void;
  /** 注册业务能力（同名覆盖） */
  registerCapability(name: string, capability: unknown): void;
  /** 运行时切换语言：更新应用级 i18n 配置并触发页面重建 */
  setLocale(locale: string, messages?: I18nMessages): void;
}

/**
 * 内部句柄：Application 组件经 props 访问应用级单例与工厂。
 * 不作为一站式 API 使用。
 */
export interface PactorApplicationHandle {
  readonly appId: string;
  readonly overlayManager: OverlayManager;
  readonly uiBridge: UiBridge;
  readonly permissionStore: PermissionStore;
  readonly layoutRegistry: LayoutRegistry;
  /** 交互层 UI kit（Provider / OverlayHost 组件对，缺省 shadcn 版） */
  readonly interactionKit: {
    Provider: ComponentType<InteractionProviderProps>;
    OverlayHost: ComponentType<OverlayHostProps>;
  };
  readonly routerOptions: PactorRouterOptions;
  /** 应用级包装组件（Router 之内、InteractionKit 之外；缺省不包装） */
  readonly providers?: ComponentType<{ children?: ReactNode }>;
  /** admin 布局头部右侧插槽（透传 AdminLayout headerExtra） */
  readonly headerExtra?: ReactNode;
  /** react-router 桥接绑定（RouterBridgeSync 挂载后委托到真实路由） */
  readonly navigation: ReactRouterBinding;
  /** 启动编排：加载 bootstrap 并组装会话（失败 reject，由组合层渲染重试页） */
  loadSession(): Promise<PactorAppSession>;
  /** 页面运行时工厂（设计决策 D2）：注入共享 registries / adapters / route / user / app */
  createPageRuntime(pageDsl: PageDsl, route: RouteContext): PageRuntime;
  /** OverlayHost 的 page overlay 页面加载（loader.loadPage → PageDsl） */
  resolvePage(pageId: string): Promise<PageDsl>;
}

/**
 * react-router 桥接绑定（NavigationBridge 实现）：
 * RouterBridgeSync 挂载时绑定真实 react-router 桥接并同步初始 location，
 * 之后每次 location 变化经 sync 通知订阅者（AdminLayout 页签/选中态、
 * DSL navigate 动作均走此桥）。
 */
export class ReactRouterBinding implements NavigationBridge {
  private delegate?: NavigationBridge;
  private location: NavigationLocation = { pathname: '/', search: '' };
  private readonly listeners = new Set<NavigationListener>();

  /** 绑定真实桥接与初始 location（RouterBridgeSync 挂载时调用） */
  bind(delegate: NavigationBridge, initial: NavigationLocation): void {
    this.delegate = delegate;
    this.location = initial;
  }

  /** location 变化同步并通知订阅者 */
  sync(location: NavigationLocation): void {
    this.location = location;
    for (const listener of [...this.listeners]) {
      listener(location);
    }
  }

  getLocation(): NavigationLocation {
    return this.location;
  }

  push(to: string): void {
    if (this.delegate === undefined) {
      console.warn(`[@pactor-app/app] 路由尚未挂载，push("${to}") 已忽略`);
      return;
    }
    this.delegate.push(to);
  }

  replace(to: string): void {
    if (this.delegate === undefined) {
      console.warn(`[@pactor-app/app] 路由尚未挂载，replace("${to}") 已忽略`);
      return;
    }
    this.delegate.replace(to);
  }

  subscribe(listener: NavigationListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** 同名覆盖式注册（Registry.register 对重名抛错，这里先注销再注册） */
function upsert<T>(registry: Registry<T>, name: string, item: T): void {
  if (registry.has(name)) {
    registry.unregister(name);
  }
  registry.register(name, item);
}

function upsertAll<T>(
  registry: Registry<T>,
  entries: Record<string, T> | undefined,
): void {
  for (const [name, item] of Object.entries(entries ?? {})) {
    upsert(registry, name, item);
  }
}

/** 创建 DSL 资源 loader 的 HTTP 适配器：注入 Authorization: Bearer 头 */
function createResourceHttpAdapter(
  authTokenProvider: AuthTokenProvider | undefined,
): ResourceHttpAdapter {
  const base = createFetchAdapter();
  if (authTokenProvider === undefined) {
    return base;
  }
  return async (request) => {
    const token = await authTokenProvider();
    if (token === undefined || token === '') {
      return base(request);
    }
    return base({
      ...request,
      headers: { ...request.headers, authorization: `Bearer ${token}` },
    });
  };
}

/** 创建页面运行时 HTTP 出口适配器：同样注入 Authorization 头 */
function createRuntimeHttpAdapter(
  authTokenProvider: AuthTokenProvider | undefined,
): HttpAdapter {
  const base = createFetchHttpAdapter();
  if (authTokenProvider === undefined) {
    return base;
  }
  return {
    async request(config) {
      const token = await authTokenProvider();
      if (token === undefined || token === '') {
        return base.request(config);
      }
      return base.request({
        ...config,
        headers: { ...config.headers, authorization: `Bearer ${token}` },
      });
    },
  };
}

const MENU_TYPES = new Set(['group', 'page', 'link']);

/**
 * 宽松整理 bootstrap.menus：仅保留含字符串 id 的条目，
 * 缺省 title 回退 id、缺省/非法 type 回退 'page'，children 递归整理。
 */
function sanitizeMenus(raw: unknown): MenuItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const menus: MenuItem[] = [];
  for (const item of raw) {
    if (!isRecord(item) || typeof item['id'] !== 'string') {
      continue;
    }
    const menu = item as unknown as MenuItem;
    menus.push({
      ...menu,
      title: typeof item['title'] === 'string' ? (item['title'] as string) : menu.id,
      type: MENU_TYPES.has(menu.type) ? menu.type : 'page',
      children:
        item['children'] !== undefined
          ? sanitizeMenus(item['children'])
          : undefined,
    });
  }
  return menus;
}

/**
 * 提取 bootstrap.layout 的布局配置：区域开关布尔字段
 * （header/sidebar/tabs/breadcrumb/footer）+ 结构模式与固定/收起/响应式
 * （mode/fixedHeader/fixedSider/collapsible/collapsed/breakpoint）。
 * 非法值（未知枚举）忽略，交给布局组件自身缺省。
 */
const LAYOUT_MODES = ['top-side', 'top-bottom', 'side-full', 'two-column'] as const;
const LAYOUT_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

function pickLayoutConfig(
  layout: Record<string, unknown> | undefined,
): AdminLayoutConfig {
  const config: AdminLayoutConfig = {};
  for (const key of [
    'header',
    'sidebar',
    'tabs',
    'breadcrumb',
    'footer',
    'fixedHeader',
    'fixedSider',
    'collapsible',
    'collapsed',
  ] as const) {
    const value = layout?.[key];
    if (typeof value === 'boolean') {
      config[key] = value;
    }
  }
  const mode = layout?.['mode'];
  if (typeof mode === 'string' && (LAYOUT_MODES as readonly string[]).includes(mode)) {
    config.mode = mode as AdminLayoutConfig['mode'];
  }
  const breakpoint = layout?.['breakpoint'];
  if (
    typeof breakpoint === 'string' &&
    (LAYOUT_BREAKPOINTS as readonly string[]).includes(breakpoint)
  ) {
    config.breakpoint = breakpoint as AdminLayoutConfig['breakpoint'];
  }
  return config;
}

/**
 * 创建 Pactor 应用（设计文档第 86–88 节，决策 D1–D4）：
 *
 * ```ts
 * createPactorApplication({ appId: 'risk-admin', api: { baseURL: '/api/runtime' } })
 *   .mount('#root');
 * ```
 *
 * - loader：options.loader 优先，否则按 api.baseURL（默认 '/api/runtime'）
 *   创建 HttpDslResourceLoader，authTokenProvider 注入 Authorization 头；
 * - 应用级共享 registries：内置组件 + 交互动作（应用级 OverlayManager /
 *   UiBridge 单例）+ navigate 动作 + options 扩展，全部被页面运行时共享；
 * - bootstrap 在 mount 后由组合层执行（失败渲染含重试的启动错误页）；
 * - 运行期 registerComponent/Action/Service/Capability 写入共享 registry，
 *   新创建/重建的页面即可用（当前已创建页面下次重建后生效）。
 */
export function createPactorApplication(
  options: PactorApplicationOptions,
): PactorApplication {
  if (typeof options.appId !== 'string' || options.appId === '') {
    throw new Error('[@pactor-app/app] createPactorApplication: appId 必填');
  }
  const { appId } = options;
  const routerOptions = options.router ?? {};

  // ---- 应用级单例（决策 D2）----
  const overlayManager = new OverlayManager();
  const uiBridge = createUiBridge();
  const permissionStore = new PermissionStore();
  // 外壳层 UI kit：每槽位独立合并（显式选项 > ui 预设 > shadcn 默认）
  const layoutRegistry =
    (options.layoutRegistry ?? options.ui?.layoutRegistry)?.() ??
    createShadcnLayoutRegistry();
  const interactionKit = options.interactionKit ??
    options.ui?.interactionKit ?? {
      Provider: ShadcnInteractionProvider,
      OverlayHost: ShadcnOverlayHost,
    };
  const navigation = new ReactRouterBinding();

  // ---- loader 与 adapters ----
  const loader =
    options.loader ??
    new HttpDslResourceLoader({
      baseUrl: options.api?.baseURL,
      adapter: createResourceHttpAdapter(options.authTokenProvider),
    });
  const httpAdapter = createRuntimeHttpAdapter(options.authTokenProvider);
  const permissionAdapter = createPermissionAdapter(permissionStore);
  const routerAdapter = createRouterAdapter(navigation);

  // ---- 共享 registries：所选 UI kit 注册表 + 交互 + 业务扩展 ----
  const components =
    (options.componentRegistry ?? options.ui?.componentRegistry)?.() ??
    createShadcnComponentRegistry();
  upsertAll(components, options.components);

  const actions: ActionRegistry = new Registry('ActionRegistry');
  registerInteractionActions(actions, overlayManager, uiBridge);
  // navigate 动作：DSL 导航经 NavigationBridge（react-router）
  upsert(actions, 'navigate', (action) => {
    const to = action.params?.['to'];
    if (typeof to !== 'string' || to === '') {
      return {
        ok: false,
        error: new Error('[@pactor-app/app] navigate 动作缺少 params.to（string）'),
      };
    }
    navigation.push(to);
    return { ok: true };
  });
  upsertAll(actions, options.actions);

  const services: ServiceRegistry = new Registry('ServiceRegistry');
  upsertAll(services, options.services);

  const capabilities: CapabilityRegistry = new Registry('CapabilityRegistry');
  upsertAll(capabilities, options.capabilities);

  // bootstrap 成功后缓存会话，供页面运行时工厂读取 user/app
  let session: PactorAppSession | null = null;

  const handle: PactorApplicationHandle = {
    appId,
    overlayManager,
    uiBridge,
    permissionStore,
    layoutRegistry,
    interactionKit,
    routerOptions,
    providers: options.providers,
    headerExtra: options.headerExtra,
    navigation,

    async loadSession(): Promise<PactorAppSession> {
      const bootstrap = await loader.loadBootstrap();
      permissionStore.setPermissions(
        Array.isArray(bootstrap.permissions)
          ? bootstrap.permissions.filter(
              (code): code is string => typeof code === 'string',
            )
          : [],
      );
      const menuRegistry = new MenuRegistry(sanitizeMenus(bootstrap.menus));
      const layout = isRecord(bootstrap.layout) ? bootstrap.layout : undefined;
      const layoutType =
        options.layout ??
        (typeof layout?.['type'] === 'string'
          ? (layout['type'] as string)
          : undefined) ??
        'admin';
      const appRecord: Record<string, unknown> = {
        id: appId,
        ...(isRecord(bootstrap.app) ? bootstrap.app : {}),
      };
      const brand = options.brand ?? {
        title: typeof appRecord['name'] === 'string' ? (appRecord['name'] as string) : appId,
        logo: undefined,
      };
      const browserLocale =
        typeof navigator !== 'undefined' && typeof navigator.language === 'string'
          ? navigator.language
          : 'zh-CN';
      const locale =
        options.locale ??
        (typeof bootstrap.locale === 'string' ? bootstrap.locale : undefined) ??
        browserLocale;
      const defaultLocale =
        options.defaultLocale ??
        (typeof bootstrap.defaultLocale === 'string'
          ? bootstrap.defaultLocale
          : undefined) ??
        'zh-CN';
      const messages =
        options.messages ??
        (isRecord(bootstrap.messages)
          ? (bootstrap.messages as I18nMessages)
          : undefined) ??
        {};
      const next: PactorAppSession = {
        bootstrap,
        menuRegistry,
        layoutType,
        layoutConfig: pickLayoutConfig(layout),
        brand,
        user: isRecord(bootstrap.user) ? bootstrap.user : {},
        app: appRecord,
        locale,
        defaultLocale,
        messages,
      };
      session = next;
      return next;
    },

    createPageRuntime(pageDsl: PageDsl, route: RouteContext): PageRuntime {
      return createPageRuntime(pageDsl, {
        components,
        actions,
        services,
        capabilities,
        permission: permissionAdapter,
        router: routerAdapter,
        http: httpAdapter,
        route: { params: route.params, query: route.query },
        user: session?.user ?? {},
        app: session?.app ?? { id: appId },
        locale: session?.locale ?? 'zh-CN',
        defaultLocale: session?.defaultLocale ?? 'zh-CN',
        messages: session?.messages ?? {},
      });
    },

    async resolvePage(pageId: string): Promise<PageDsl> {
      const resource = await loader.loadPage(pageId);
      return resource.schema;
    },
  };

  // ---- mount / unmount（决策 D4）----
  let root: Root | null = null;

  return {
    appId,

    mount(selector: string) {
      const target = document.querySelector(selector);
      if (target === null) {
        throw new Error(`[@pactor-app/app] mount 目标元素不存在: ${selector}`);
      }
      // 重复 mount 先卸载旧根
      if (root !== null) {
        root.unmount();
        root = null;
      }
      root = createRoot(target);
      root.render(createElement(Application, { app: handle }));
    },

    unmount() {
      if (root !== null) {
        root.unmount();
        root = null;
      }
    },

    registerComponent(name: string, component: unknown): void {
      upsert(components, name, component);
    },
    registerAction(name: string, handler: ActionHandler): void {
      upsert(actions, name, handler);
    },
    registerService(name: string, handler: ServiceHandler): void {
      upsert(services, name, handler);
    },
    registerCapability(name: string, capability: unknown): void {
      upsert(capabilities, name, capability);
    },

    setLocale(locale: string, messages?: I18nMessages): void {
      if (session === null) {
        console.warn('[@pactor-app/app] setLocale 在 bootstrap 完成前调用已忽略');
        return;
      }
      session = { ...session, locale, messages: messages ?? session.messages };
      // V1 策略：整页刷新以重建所有页面运行时
      window.location.reload();
    },
  };
}
