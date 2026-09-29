---
title: 手动安装
description: 在已有工程中手动接入 Pactor——安装、最小接入、createPactorApplication 参数与 UI 自定义覆盖点
---

Pactor 是一套基于 YAML/JSON DSL 的 Server-Driven UI 前端运行时框架：页面用 YAML 描述，浏览器里的公共 Runtime 负责渲染，业务页面无需随前端代码一起打包。新项目建议从模板生成（见[快速开始](/guides/getting-started/)）；本页面向**已有工程的手动接入**，并列出 `createPactorApplication` 的全部参数与自定义覆盖点。

## 环境要求

- Node.js >= 18
- pnpm >= 9（npm / yarn 亦可）
- React >= 18 的 Vite 工程（React 19 为开发基准）

## 安装

最简单的方式是装聚合包 `pactor-app`（meta package）——一次带入全部 `@pactor-app/*` 模块与 CLI，入口直接转发 `@pactor-app/app`：

```bash
pnpm add pactor-app
```

也可以按场景只装需要的 `@pactor-app/*` scope 模块：

| 场景 | 安装 |
| --- | --- |
| 完整应用 | `pnpm add @pactor-app/app @pactor-app/ui`（内置默认 UI 实现） |
| 只要 DSL 渲染器（自己组合） | `pnpm add @pactor-app/runtime` |
| AI 对话视图 | `pnpm add @pactor-app/chat @pactor-app/markdown` |
| YAML 即模块（构建期校验 + HMR） | `pnpm add -D @pactor-app/vite-plugin` |
| 命令行校验 / 脚手架 | `pnpm add -D @pactor-app/cli` |

两种方式可混用：meta 包只是依赖聚合，与各模块统一版本发布，功能无差异。下面的最小接入以 `pnpm add pactor-app` 为例。

## 最小接入（四步）

与 `examples/vite-starter` 等效的最小工程：

**1. vite.config.ts 挂插件**

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import pactor from '@pactor-app/vite-plugin';

export default defineConfig({
  plugins: [react(), pactor()],
});
```

**2. 添加 `src/dsl-modules.d.ts`**（让 TS 识别 YAML 模块）

```ts
declare module '*.page.yaml' {
  import type { PageDsl } from '@pactor-app/core';
  const page: PageDsl;
  export const dslVersion: string;
  export default page;
}
```

**3. 写页面 `src/pages/home.page.yaml`**

```yaml
dsl: '1.0'
page:
  id: home
  title: 待办清单

dataSources:
  todos:
    type: service
    service: todo.list
    autoLoad: true
    params:
      keyword: ${state.keyword}

body:
  type: Page
  props: { title: 待办清单 }
  children:
    - type: Form
      props: { layout: inline }
      events:
        onSubmit:
          - action: setState
            params: { keyword: ${event.keyword} }
          - action: reload
            params: { dataSource: todos }
      children:
        - type: Input
          props: { name: keyword, label: 关键词 }
        - type: Button
          props: { text: 查询, variant: primary, submit: true }
    - type: Table
      props:
        dataSource: ${data.todos}
        columns:
          - { title: 标题, dataIndex: title }
          - { title: 负责人, dataIndex: owner }
```

**4. `src/main.tsx` 挂载**

```tsx
import { createPactorApplication } from 'pactor-app'; // meta 包入口，转发 @pactor-app/app
import { StaticDslLoader } from '@pactor-app/resource'; // 已由 meta 包带入，直接导入即可
import '@pactor-app/ui/styles.css'; // 预建样式（必需）

import homePage from './pages/home.page.yaml';

const loader = new StaticDslLoader({
  bootstrap: {
    app: { name: '我的应用' },
    menus: [{ id: 'home', type: 'page', title: '待办清单', path: '/', pageId: 'home' }],
    layout: { type: 'blank' },
  },
  pages: { home: homePage },
});

createPactorApplication({
  appId: 'my-app',
  loader,
  services: {
    'todo.list': async (params) =>
      fetch(`/api/todos?keyword=${params.keyword ?? ''}`).then((r) => r.json()),
  },
}).mount('#root');
```

真实项目中 bootstrap 与页面 DSL 由服务端下发：把 `loader` 换成 `api: { baseURL: 'https://your-dsl-center' }`（HttpDslResourceLoader）即可，本地 import 的 yaml 只是静态开发形态。

> 若选择按需安装（`@pactor-app/app` + `@pactor-app/ui`）而非 meta 包，把第 4 步的 `from 'pactor-app'` 改为 `from '@pactor-app/app'` 即可，其余代码不变。

## createPactorApplication 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `appId` | string（必填） | 应用 id；brand 缺省标题回退 |
| `api` | `{ baseURL? }` | DSL 资源 API（未注入 loader 时创建 HttpDslResourceLoader） |
| `loader` | DslResourceLoader | 资源加载器，优先于 `api`（本地/测试用 StaticDslLoader） |
| `componentRegistry` | `() => Registry` | 组件注册表工厂（自定义覆盖点） |
| `layoutRegistry` | `() => LayoutRegistry` | 布局注册表工厂（自定义覆盖点） |
| `interactionKit` | `{ Provider, OverlayHost }` | 交互层组件对（overlay / message / confirm，自定义覆盖点） |
| `components` | `Record<string, unknown>` | 业务组件扩展，叠加在所选注册表之上，可覆盖同名内置组件 |
| `actions` | `Record<string, ActionHandler>` | 业务动作扩展（如 `service.call`） |
| `services` | `Record<string, ServiceHandler>` | 业务服务（`type: service` 数据源按名引用） |
| `capabilities` | `Record<string, unknown>` | 业务能力扩展 |
| `layout` | string | 布局类型覆盖（> bootstrap.layout.type > 'admin'） |
| `brand` | `{ title, logo? }` | 品牌区覆盖（缺省取 bootstrap.app.name） |
| `router` | `{ type?: 'browser'\|'hash', basename? }` | 路由配置 |
| `authTokenProvider` | AuthTokenProvider | 认证令牌，注入 DSL 资源请求与页面 HTTP 出口 |

各覆盖点独立合并，显式传入的选项优先于内置默认。

## 自定义 UI 覆盖点

内置 UI 实现为 `@pactor-app/ui`。业务需要自定义组件 / 布局 / 交互层时，通过上述覆盖点逐槽位替换（详见 [@pactor-app/ui](/packages/ui/) 的「自定义覆盖点」）：

```tsx
import { createComponentRegistry } from '@pactor-app/ui/components';

createPactorApplication({
  appId: 'my-app',
  loader,
  componentRegistry: () => {
    const registry = createComponentRegistry();
    // 在内置注册表之上叠加 / 覆盖业务组件……
    return registry;
  },
  // ...
});
```

## 两种使用形态

**整应用模式**（上文）：`createPactorApplication` 接管整个应用——按 bootstrap 菜单生成路由、外壳布局、权限与页面装配全部由框架负责。

**嵌入模式**：存量项目（已有自己的路由，或 Next.js 等框架）中局部嵌入 DSL 页面，框架**不接管路由**：

```tsx
import { createPactorPage } from '@pactor-app/app';
import { StaticDslLoader } from '@pactor-app/resource';
import '@pactor-app/ui/styles.css';

// 工厂：组装一次（registries / 交互层 / i18n），多页面实例共享
const Page = createPactorPage({ loader, services });

// 嵌入任意位置；route 上下文经 props 纯数据注入
<Page pageId="customer-detail" route={{ params: { id }, query: searchParams }} />

// 或直接传 PageDsl 对象（不经 loader）
<Page pageDsl={pageDsl} />

// 或传动态引用：经 service/http 通道远端加载 PageDsl（失败走错误态，可重试）
<Page pageDsl={{ source: { type: 'service', service: 'dsl.page' } }} />
<Page pageDsl={{ source: { type: 'http', request: { url: '/api/dsl/login' } } }} />
```

DSL 内部的局部子树也支持同样的动态引用（根级 `children`、节点 `children`、`components` 命名组件），完整语义见 [DSL 参考 - 动态 DSL 引用](/reference/dsl/#动态-dsl-引用dlsourceref)。

嵌入模式的站内导航：`Link` / `Breadcrumb` 等链接类组件渲染原生 `<a href>`（保留 SEO、中键/Cmd+点击新窗口、右键复制链接等原生语义），并拦截「站内路径（`/` 开头）+ 左键无修饰键」的点击改走导航实现。`navigate` 动作与链接点击共用同一实现——缺省退化为 `location.assign` 整页跳转（目标页由宿主路由系统承接）；也可经工厂选项 `navigate` 注入宿主路由实现 SPA 导航：

```tsx
// Next.js（App Router）
const router = useRouter();
const Page = createPactorPage({ loader, navigate: (to) => router.push(to) });

// React Router
const navigate = useNavigate();
const Page = createPactorPage({ loader, navigate: (to) => navigate(to) });
```

需要完全自定义链接渲染（如 prefetch、scroll restoration）时，可经 `components` 注册表覆盖同名组件，样式子组件从 `@pactor-app/ui/ui` 导入（`BreadcrumbLink` 支持 `render` prop 换成宿主路由组件）。

权限默认全部放行，需管控时传 `permissions: string[]`。

**HTTP 钩子**（`httpAdapter`）：对页面运行时所有 HTTP 出口做统一加工——`request` 在发出前加工请求配置（如注入 token），`response` 在收到后加工返回数据（如归一化后端包裹结构）：

```tsx
const Page = createPactorPage({
  loader,
  services,
  httpAdapter: {
    // 发出前：注入认证头
    request: (config) => ({
      ...config,
      headers: { ...config.headers, authorization: `Bearer ${getToken()}` },
    }),
    // 收到后：把 { code, data } 归一化为 Pactor 需要的结构
    response: (data) => (data as { data?: unknown })?.data ?? data,
  },
});
```

`httpAdapter` 同样可用于 `createPactorApplication`，与 `authTokenProvider` 叠加生效（authTokenProvider 先注入 Authorization 头，httpAdapter.request 再加工）。

## 命令行（@pactor-app/cli）

```bash
pnpm pactor validate src/pages/**/*.page.yaml   # 校验 DSL
pnpm pactor inspect src/pages/home.page.yaml    # 查看结构摘要
pnpm pactor create my-app                        # 脚手架
```

## 下一步

- [数据流](/guides/data-flow/)：`${data.x}` 从哪来、何时更新、谁重渲染
- [事件与表单联动](/guides/events/)：动作编排、表单三级联动
- [自定义组件](/guides/custom-components/)：注册你的业务组件
- [DSL 参考](/reference/dsl/)：全部字段与组件 props 手册

## 参与框架开发（monorepo）

```bash
git clone https://github.com/426-330/pactor.git && cd pactor
pnpm install
pnpm build        # 构建全部包（ESM + CJS + d.ts）
pnpm test         # 全部测试
pnpm typecheck    # 全部包 TS 检查
pnpm docs:dev     # 本文档站（端口 4334）
```

示例工程：`examples/vite-starter`（最小上手）、`examples/admin`（shadcn 管理后台，含换肤）、`examples/chat`（AI 对话）。
