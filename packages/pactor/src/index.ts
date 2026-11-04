// Meta 包入口：转发 @pactor-app/app 的一站式 API；全部 @pactor-app/* 模块经 dependencies 一并安装，
// 需要更细粒度 API 时可直接从对应模块导入（如 @pactor-app/core、@pactor-app/ui）。
export * from '@pactor-app/app';
// SitemapApp 覆盖 export * 的同名导出（显式导出优先）：组件注册表缺省
// 含 chat 展示组件族与 Chat / ChatShell，以及 blocks 区块与 chart 图表
export { SitemapApp, createPactorComponentRegistry } from './sitemap-app.js';
export { createChatComponentRegistry } from '@pactor-app/chat';
export { registerBlockComponents } from '@pactor-app/blocks';
export { registerChartComponents } from '@pactor-app/chart';
// FileViewer 需注册期注入 preset（defaultOptions），不进 createPactorComponentRegistry 缺省注册表
export { registerFileViewerComponents, createFileViewerComponentRegistry } from '@pactor-app/file-viewer';
// GridLayout 为可选可拖拽仪表盘容器，不进缺省注册表（需额外引入 @pactor-app/grid-layout/styles.css）
export { registerGridLayoutComponents, createGridLayoutComponentRegistry } from '@pactor-app/grid-layout';
// Graph 为可选关系图 / 流程图组件（G6 引擎较大），不进缺省注册表
export { registerGraphComponents, createGraphComponentRegistry } from '@pactor-app/graph';
