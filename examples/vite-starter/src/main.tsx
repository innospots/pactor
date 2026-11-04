import { createPactorApplication } from '@pactor-app/app';
import { StaticDslLoader } from '@pactor-app/resource';
import { createFileViewerComponent } from '@pactor-app/file-viewer';
import { Graph } from '@pactor-app/graph';
import { GridLayout } from '@pactor-app/grid-layout';
import officePreset from '@file-viewer/preset-office';
// 默认 UI 为 @pactor-app/ui 内置实现，样式表导入为必需步骤
import '@pactor-app/ui/styles.css';
// GridLayout（react-grid-layout）样式
import '@pactor-app/grid-layout/styles.css';

import homePage from './pages/home.page.yaml';
import filePreviewPage from './pages/file-preview.page.yaml';
import dashboardPage from './pages/dashboard.page.yaml';
import graphPage from './pages/graph.page.yaml';
import { demoServices } from './services';

// 最小 bootstrap：blank 布局 + 页面菜单（真实应用里这份资源由服务端下发）
const loader = new StaticDslLoader({
  bootstrap: {
    app: { name: 'Pactor Vite Starter 示例' },
    permissions: [],
    menus: [
      { id: 'home', type: 'page', title: '待办清单', path: '/', pageId: 'home' },
      { id: 'file-preview', type: 'page', title: '文件预览', path: '/file-preview', pageId: 'file-preview' },
      { id: 'dashboard', type: 'page', title: '可拖拽仪表盘', path: '/dashboard', pageId: 'dashboard' },
      { id: 'graph', type: 'page', title: '关系图', path: '/graph', pageId: 'graph' },
    ],
    layout: { type: 'blank' },
    pageVersions: { home: 1, 'file-preview': 1, dashboard: 1, graph: 1 },
  },
  pages: { home: homePage, 'file-preview': filePreviewPage, dashboard: dashboardPage, graph: graphPage },
});

createPactorApplication({
  appId: 'example-vite-starter',
  loader,
  services: demoServices,
  components: {
    // 注册期注入 preset（DSL 无法表达 JS 对象），格式能力由 preset-office 决定
    FileViewer: createFileViewerComponent({ preset: officePreset }),
    // GridLayout 需以 withScope 注册（组件自行渲染原始 DSL children 并逐格包装）
    GridLayout: { component: GridLayout, withScope: true },
    // Graph（G6 关系图）：纯客户端渲染，无需样式表
    Graph,
  },
}).mount('#root');
