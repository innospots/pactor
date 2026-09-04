import type { LifecycleEventName, PageDsl } from '@pactor-app/core';
import {
  validatePageDsl,
  type DslValidationError,
} from '@pactor-app/schema';
import type { ReactNode } from 'react';

import { registerBuiltinActions } from '../action/builtins.js';
import { ActionEngine } from '../action/engine.js';
import {
  createRuntimeContext,
  type CreateRuntimeContextOptions,
  type RuntimeContext,
} from '../context/context.js';
import { DslRenderer } from '../renderer/renderer.js';

/** Page DSL 校验失败错误：内含结构化错误列表 */
export class PageRuntimeError extends Error {
  readonly errors: DslValidationError[];

  constructor(errors: DslValidationError[]) {
    super(
      `Page DSL 校验失败（${errors.length} 个错误）：${errors
        .map((error) => `${error.path}: ${error.message}`)
        .join('；')}`,
    );
    this.name = 'PageRuntimeError';
    this.errors = errors;
  }
}

/**
 * PageRuntime（设计文档第 20、89 节，决策 D6）：
 * PageDsl → 校验 → RuntimeContext → 初始化 state / dataSources（autoLoad）
 * → 生命周期 → 渲染 body 的完整链路。
 */
export interface PageRuntime {
  readonly pageDsl: PageDsl;
  readonly context: RuntimeContext;
  readonly engine: ActionEngine;
  /** 初始化完成的 Promise（autoLoad 触发 + onInit + onLoad 执行完毕） */
  readonly initialized: Promise<void>;
  /** 是否已销毁 */
  readonly destroyed: boolean;
  /** 渲染 body 子树；未配置 body 时渲染空内容 */
  render(): ReactNode;
  /** 宿主（Router）触发生命周期：onReady */
  ready(): Promise<void>;
  /** 宿主（Router）触发生命周期：onShow */
  show(): Promise<void>;
  /** 宿主（Router）触发生命周期：onHide */
  hide(): Promise<void>;
  /** 触发 onDestroy 并清理订阅 */
  destroy(): Promise<void>;
  /** 订阅生命周期事件，返回退订函数 */
  onLifecycle(listener: (event: LifecycleEventName) => void): () => void;
}

/**
 * 创建 PageRuntime：
 * 1. `validatePageDsl` 校验，失败抛 `PageRuntimeError`（含结构化错误列表）
 * 2. `createRuntimeContext`（page meta + 初始 state + registries / adapters）
 * 3. 注册 8 个 UI 无关内置动作
 * 4. 初始化 DataSources，触发 autoLoad
 * 5. 生命周期：onInit（创建后）→ onLoad（首次加载完成）自动执行；
 *    onReady / onShow / onHide / onDestroy 由宿主经方法触发
 */
export function createPageRuntime(
  pageDsl: PageDsl,
  options: CreateRuntimeContextOptions = {},
): PageRuntime {
  const validation = validatePageDsl(pageDsl);
  if (!validation.valid) {
    throw new PageRuntimeError(validation.errors);
  }

  const context = createRuntimeContext({
    ...options,
    page: pageDsl.page,
    state: pageDsl.state ?? options.state,
    dataSources: pageDsl.dataSources ?? options.dataSources,
    namedActions: pageDsl.actions ?? options.namedActions,
    pageComponents: pageDsl.components ?? options.pageComponents,
  });
  registerBuiltinActions(context.actions);
  const engine = new ActionEngine(context);

  let destroyed = false;
  const lifecycleListeners = new Set<(event: LifecycleEventName) => void>();

  const runLifecycle = async (name: LifecycleEventName): Promise<void> => {
    for (const listener of [...lifecycleListeners]) {
      listener(name);
    }
    const actions = pageDsl.lifecycle?.[name];
    if (actions) {
      await engine.executeAll(actions);
    }
  };

  // 触发 autoLoad（不阻塞 onInit），onLoad 等首次加载完成后执行。
  // 整条链路推迟到微任务：宿主在 createPageRuntime 返回后同步注册的
  // onLifecycle 监听器也能收到 onInit。
  const initialized = Promise.resolve().then(async () => {
    const loading = context.data.init();
    await runLifecycle('onInit');
    await loading;
    await runLifecycle('onLoad');
  });

  const triggerWhenAlive = async (
    name: LifecycleEventName,
  ): Promise<void> => {
    if (destroyed) {
      return;
    }
    await runLifecycle(name);
  };

  return {
    pageDsl,
    context,
    engine,
    initialized,
    get destroyed() {
      return destroyed;
    },
    render(): ReactNode {
      if (!pageDsl.body) {
        return null;
      }
      return (
        <DslRenderer context={context} node={pageDsl.body} engine={engine} />
      );
    },
    ready: () => triggerWhenAlive('onReady'),
    show: () => triggerWhenAlive('onShow'),
    hide: () => triggerWhenAlive('onHide'),
    async destroy() {
      if (destroyed) {
        return;
      }
      destroyed = true;
      await runLifecycle('onDestroy');
      lifecycleListeners.clear();
      // 页面级命名动作结果随运行时销毁一并清理（设计文档第 48 节）
      for (const key of Object.keys(context.actionResults)) {
        delete context.actionResults[key];
      }
    },
    onLifecycle(listener) {
      lifecycleListeners.add(listener);
      return () => {
        lifecycleListeners.delete(listener);
      };
    },
  };
}

/**
 * React 组件形式的渲染入口。
 *
 * `children`（最小补充，供 OverlayHost 等宿主扩展使用）渲染在
 * DslRenderer 的 React Context 之内——即页面 body 渲染完成后、
 * 同一 Renderer 上下文下，因此 children 内的组件可使用
 * `useRenderer()` 等 Renderer 能力。未传 children 时行为与此前一致。
 */
export function PageRuntimeView({
  runtime,
  children,
}: {
  runtime: PageRuntime;
  children?: ReactNode;
}) {
  const body = runtime.pageDsl.body;
  if (!body) {
    return <>{children ?? null}</>;
  }
  return (
    <DslRenderer context={runtime.context} node={body} engine={runtime.engine}>
      {children}
    </DslRenderer>
  );
}
