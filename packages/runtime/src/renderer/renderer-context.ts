import type { DslChildren } from '@pactor-app/core';
import type { ExpressionScope } from '@pactor-app/expression';
import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

import type { ActionEngine } from '../action/engine.js';
import type { RuntimeContext } from '../context/context.js';
import type { DataSourceStatus } from '../datasource/data-store.js';

/** Renderer 经 React Context 透传给被渲染组件的能力 */
export interface RendererContextValue {
  context: RuntimeContext;
  engine: ActionEngine;
  /** 当前局部作用域（row / rowIndex / event / item 等） */
  scope: ExpressionScope;
  /** 内部：命名组件引用链（PageDsl.components 的循环引用守卫） */
  referenceStack?: string[];
  /**
   * 渲染 DSL 子节点（内联数组或 DslSourceRef 动态引用——引用形态经
   * DslSourceBoundary 异步解析渲染）；`extraScope` 注入的局部作用域
   * 覆盖同名全局键，且仅作用于该子树（Table 行、Repeat 项等场景，
   * 设计文档第 21 节）。
   */
  renderChildren(
    children: DslChildren | undefined,
    extraScope?: ExpressionScope,
  ): ReactNode;
}

const RendererReactContext = createContext<RendererContextValue | null>(null);

export const RendererContextProvider = RendererReactContext.Provider;

/** 在被渲染组件内获取 Renderer 能力（renderChildren / engine / context） */
export function useRenderer(): RendererContextValue {
  const value = useContext(RendererReactContext);
  if (!value) {
    throw new Error('[@pactor-app/runtime] useRenderer 必须在 <DslRenderer> 内使用');
  }
  return value;
}

/**
 * 订阅 StateStore（决策 D5）。`path` 为点路径；缺省返回整个 state。
 * 基于 `useSyncExternalStore`，state 变化时组件重渲染。
 */
export function useRuntimeState<T = unknown>(path?: string): T {
  const { context } = useRenderer();
  return useSyncExternalStore(
    (onChange) => context.state.subscribe(onChange),
    () =>
      (path === undefined
        ? context.state.getState()
        : context.state.get(path)) as T,
  );
}

/** 订阅指定数据源的 `{ loading, error, data }` 状态 */
export function useDataSource(name: string): DataSourceStatus {
  const { context } = useRenderer();
  return useSyncExternalStore(
    (onChange) => context.data.subscribe(onChange),
    () => context.data.get(name),
  );
}
