import { createPactorApplication } from '@pactor/app';
import { StaticDslLoader } from '@pactor/resource';
// 默认 UI kit 为 shadcn（@pactor/ui），样式表导入为必需步骤
import '@pactor/ui/styles.css';

import homePage from './pages/home.page.yaml';

// 本地 DSL 开发：静态加载器直接喂入构建期 import 的页面；
// 接入服务端后改回 api: { baseURL: '/api/runtime' }（HttpDslResourceLoader）
const loader = new StaticDslLoader({
  pages: { home: homePage },
  bootstrap: {
    app: { name: '__APP_NAME__' },
    menus: [{ id: 'home', title: '首页', path: '/', pageId: 'home' }],
    pageVersions: { home: 1 },
  },
});

createPactorApplication({
  appId: '__APP_NAME__',
  loader,
}).mount('#root');
