/**
 * @pactor-app/graph：基于 AntV G6 v5 的 DSL 关系图 / 流程图组件。
 * 与 chart/grid-layout 同模式：不进 ui 主注册表，接入方用
 * registerGraphComponents 合并进既有 ComponentRegistry，
 * 或用 createGraphComponentRegistry 创建纯图注册表。
 *
 * 纯客户端渲染，无需引入样式文件。
 */
import { Registry } from '@pactor-app/core';
import type { ComponentRegistry } from '@pactor-app/runtime';

import { Graph } from './components/Graph/index.js';

export { Graph, buildGraphOptions, normalizeGraphData } from './components/Graph/index.js';
export type {
  GraphProps,
  GraphDataSpec,
  GraphNodeSpec,
  GraphEdgeSpec,
  GraphComboSpec,
  GraphPluginSwitches,
  GraphNodeEventPayload,
  GraphEdgeEventPayload,
  GraphCanvasEventPayload,
} from './components/Graph/index.js';

/** 把 Graph 按 DSL 类型名注册到给定 ComponentRegistry（可与 ui 主注册表合并） */
export function registerGraphComponents(registry: ComponentRegistry): void {
  registry.register('Graph', Graph);
}

/** 创建只注册了 Graph 的新 ComponentRegistry */
export function createGraphComponentRegistry(): ComponentRegistry {
  const registry = new Registry<unknown>('ComponentRegistry');
  registerGraphComponents(registry);
  return registry;
}
