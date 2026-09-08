import { createPactorApplication } from '@pactor-app/app';
import { StaticDslLoader } from '@pactor-app/resource';
// 默认 UI 为 @pactor-app/ui 内置实现，样式表导入为必需步骤
import '@pactor-app/ui/styles.css';

import homePage from './pages/home.page.yaml';
import { demoServices } from './services';

// 最小 bootstrap：blank 布局 + 单个页面菜单（真实应用里这份资源由服务端下发）
const loader = new StaticDslLoader({
  bootstrap: {
    app: { name: 'Pactor Vite Starter 示例' },
    permissions: [],
    menus: [{ id: 'home', type: 'page', title: '待办清单', path: '/', pageId: 'home' }],
    layout: { type: 'blank' },
    pageVersions: { home: 1 },
  },
  pages: { home: homePage },
});

createPactorApplication({
  appId: 'example-vite-starter',
  loader,
  services: demoServices,
}).mount('#root');
