/**
 * @pactor-app/grid-layout：基于 react-grid-layout v2 的 DSL 可拖拽栅格容器。
 * 与 chart/file-viewer 同模式：不进 ui 主注册表，接入方用
 * registerGridLayoutComponents 合并进既有 ComponentRegistry，
 * 或用 createGridLayoutComponentRegistry 创建纯栅格注册表。
 *
 * 样式为必需步骤：import '@pactor-app/grid-layout/styles.css'
 * （内含 react-grid-layout / react-resizable 官方样式与格子填充规则）。
 */
import { Registry } from '@pactor-app/core';
import type { ComponentRegistry } from '@pactor-app/runtime';

import { GridLayout } from './components/GridLayout/index.js';

export { GridLayout, buildGridLayout } from './components/GridLayout/index.js';
export type {
  GridLayoutProps,
  GridLayoutItemSpec,
  GridLayoutChangeEvent,
  GridLayoutItemEvent,
} from './components/GridLayout/index.js';

/**
 * 把 GridLayout 按 DSL 类型名注册到给定 ComponentRegistry（可与 ui 主注册表合并）。
 * 以 withScope 注册：组件自行渲染原始 DSL children（逐格包装 keyed 容器）。
 */
export function registerGridLayoutComponents(registry: ComponentRegistry): void {
  registry.register('GridLayout', { component: GridLayout, withScope: true });
}

/** 创建只注册了 GridLayout 的新 ComponentRegistry */
export function createGridLayoutComponentRegistry(): ComponentRegistry {
  const registry = new Registry<unknown>('ComponentRegistry');
  registerGridLayoutComponents(registry);
  return registry;
}
