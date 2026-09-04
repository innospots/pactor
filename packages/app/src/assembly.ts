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
  createFetchHttpAdapter,
  type ActionHandler,
  type ActionRegistry,
  type CapabilityRegistry,
  type HttpAdapter,
  type ServiceHandler,
  type ServiceRegistry,
} from '@pactor-app/runtime';
import type { ComponentType } from 'react';

import type { AuthTokenProvider, UiKit } from './application.js';

/** 同名覆盖式注册（Registry.register 对重名抛错，这里先注销再注册） */
export function upsert<T>(registry: Registry<T>, name: string, item: T): void {
  if (registry.has(name)) {
    registry.unregister(name);
  }
  registry.register(name, item);
}

export function upsertAll<T>(
  registry: Registry<T>,
  entries: Record<string, T> | undefined,
): void {
  for (const [name, item] of Object.entries(entries ?? {})) {
    upsert(registry, name, item);
  }
}

/** 创建页面运行时 HTTP 出口适配器：注入 Authorization 头 */
export function createRuntimeHttpAdapter(
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

/**
 * 组装内核选项（spec: embedded-page-view / application-bootstrap）：
 * 整应用模式与嵌入模式共享的装配输入。
 */
export interface PactorAssemblyOptions {
  /** 组件注册表工厂（槽位合并：显式选项 > ui 预设 > shadcn 默认） */
  componentRegistry?: () => Registry<unknown>;
  /** UI kit 预设（三槽位） */
  ui?: UiKit;
  /** 交互层组件对（缺省 shadcn 版） */
  interactionKit?: {
    Provider: ComponentType<InteractionProviderProps>;
    OverlayHost: ComponentType<OverlayHostProps>;
  };
  /** 业务组件扩展（同名覆盖内置） */
  components?: Record<string, unknown>;
  /** 业务动作扩展（同名覆盖内置/交互动作） */
  actions?: Record<string, ActionHandler>;
  /** 业务服务扩展 */
  services?: Record<string, ServiceHandler>;
  /** 业务能力扩展 */
  capabilities?: Record<string, unknown>;
  /** 认证令牌：注入页面 HTTP 出口 */
  authTokenProvider?: AuthTokenProvider;
  /**
   * DSL `navigate` 动作的跳转实现（两种形态的差异点）：
   * 整应用模式 = 导航桥 push（react-router）；嵌入模式 = location.assign
   */
  navigate: (to: string) => void;
}

/**
 * 组装产物：页面运行时所需的共享单例与 registries。
 * 嵌入模式每个 PactorPage 工厂自持一份（多实例隔离）。
 */
export interface PactorAssembly {
  readonly components: Registry<unknown>;
  readonly actions: ActionRegistry;
  readonly services: ServiceRegistry;
  readonly capabilities: CapabilityRegistry;
  readonly overlayManager: OverlayManager;
  readonly uiBridge: UiBridge;
  readonly interactionKit: {
    Provider: ComponentType<InteractionProviderProps>;
    OverlayHost: ComponentType<OverlayHostProps>;
  };
  readonly httpAdapter: HttpAdapter;
}

/**
 * 组装内核（设计决策：两种使用形态共享，见 spec application-bootstrap）：
 * 组件/动作/服务/能力 registries + 交互层单例 + HTTP 出口。
 */
export function createPactorAssembly(
  options: PactorAssemblyOptions,
): PactorAssembly {
  const overlayManager = new OverlayManager();
  const uiBridge = createUiBridge();
  const interactionKit = options.interactionKit ??
    options.ui?.interactionKit ?? {
      Provider: ShadcnInteractionProvider,
      OverlayHost: ShadcnOverlayHost,
    };

  const components =
    (options.componentRegistry ?? options.ui?.componentRegistry)?.() ??
    createShadcnComponentRegistry();
  upsertAll(components, options.components);

  const actions: ActionRegistry = new Registry('ActionRegistry');
  registerInteractionActions(actions, overlayManager, uiBridge);
  // navigate 动作：跳转实现由调用形态注入（整应用=路由桥 / 嵌入=自然跳转）
  upsert(actions, 'navigate', (action) => {
    const to = action.params?.['to'];
    if (typeof to !== 'string' || to === '') {
      return {
        ok: false,
        error: new Error('[@pactor-app/app] navigate 动作缺少 params.to（string）'),
      };
    }
    options.navigate(to);
    return { ok: true };
  });
  upsertAll(actions, options.actions);

  const services: ServiceRegistry = new Registry('ServiceRegistry');
  upsertAll(services, options.services);

  const capabilities: CapabilityRegistry = new Registry('CapabilityRegistry');
  upsertAll(capabilities, options.capabilities);

  return {
    components,
    actions,
    services,
    capabilities,
    overlayManager,
    uiBridge,
    interactionKit,
    httpAdapter: createRuntimeHttpAdapter(options.authTokenProvider),
  };
}
