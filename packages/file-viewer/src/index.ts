/**
 * @pactor-app/file-viewer：基于 @file-viewer/react 的 DSL 文件预览组件。
 * 与 chart/blocks 同模式：不进 ui 主注册表，接入方用
 * registerFileViewerComponents 合并进既有 ComponentRegistry，
 * 或用 createFileViewerComponentRegistry 创建纯预览注册表。
 *
 * 格式能力（PDF / Office / CAD / 压缩包 …）由接入方安装的
 * @file-viewer/preset-* 决定，经 createFileViewerComponent /
 * registerFileViewerComponents 的 defaultOptions.preset 注入；
 * 静态资产（Worker / WASM / 字体）由宿主构建工具供给：
 * Vite 项目用 @file-viewer/vite-plugin，其他项目跑 file-viewer-copy-assets。
 */
import { Registry } from '@pactor-app/core';
import type { ComponentRegistry } from '@pactor-app/runtime';

import {
  createFileViewerComponent,
  type FileViewerDefaultOptions,
} from './components/FileViewer/index.js';

export { FileViewer, createFileViewerComponent } from './components/FileViewer/index.js';
export type { FileViewerProps, FileViewerDefaultOptions } from './components/FileViewer/index.js';

/**
 * 把预览组件按 DSL 类型名注册到给定 ComponentRegistry（可与 ui 主注册表合并）。
 * defaultOptions 在注册期绑定（典型为 preset / 自托管资源路径），DSL 页面只传数据 props。
 */
export function registerFileViewerComponents(
  registry: ComponentRegistry,
  defaultOptions: FileViewerDefaultOptions = {},
): void {
  registry.register('FileViewer', createFileViewerComponent(defaultOptions));
}

/** 创建只注册了预览组件的新 ComponentRegistry */
export function createFileViewerComponentRegistry(
  defaultOptions: FileViewerDefaultOptions = {},
): ComponentRegistry {
  const registry = new Registry<unknown>('ComponentRegistry');
  registerFileViewerComponents(registry, defaultOptions);
  return registry;
}
