import { createPactorApplication } from '@pactor-app/app';
import { StaticDslLoader } from '@pactor-app/resource';
import { createFileViewerComponent } from '@pactor-app/file-viewer';
import officePreset from '@file-viewer/preset-office';
// 默认 UI 为 @pactor-app/ui 内置实现，样式表导入为必需步骤
import '@pactor-app/ui/styles.css';

import homePage from './pages/home.page.yaml';
import filePreviewPage from './pages/file-preview.page.yaml';
import { demoServices } from './services';

// 最小 bootstrap：blank 布局 + 页面菜单（真实应用里这份资源由服务端下发）
const loader = new StaticDslLoader({
  bootstrap: {
    app: { name: 'Pactor Vite Starter 示例' },
    permissions: [],
    menus: [
      { id: 'home', type: 'page', title: '待办清单', path: '/', pageId: 'home' },
      { id: 'file-preview', type: 'page', title: '文件预览', path: '/file-preview', pageId: 'file-preview' },
    ],
    layout: { type: 'blank' },
    pageVersions: { home: 1, 'file-preview': 1 },
  },
  pages: { home: homePage, 'file-preview': filePreviewPage },
});

createPactorApplication({
  appId: 'example-vite-starter',
  loader,
  services: demoServices,
  components: {
    // 注册期注入 preset（DSL 无法表达 JS 对象），格式能力由 preset-office 决定
    FileViewer: createFileViewerComponent({ preset: officePreset }),
  },
}).mount('#root');
