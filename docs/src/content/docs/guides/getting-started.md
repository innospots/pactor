---
title: 快速开始
description: 面向框架使用者——安装、最小接入、createPactorApplication 参数与 UI kit 自定义
---

Pactor 是一套基于 YAML/JSON DSL 的 Server-Driven UI 前端运行时框架：页面用 YAML 描述，浏览器里的公共 Runtime 负责渲染，业务页面无需随前端代码一起打包。本页带你 5 分钟跑起一个应用。

## 环境要求

- Node.js >= 18
- pnpm >= 9（npm / yarn 亦可）
- React >= 18 的 Vite 工程（React 19 为开发基准）

## 安装

最简单的方式是装聚合包 `pactor`（meta package）——一次带入全部 `@pactor/*` 模块与 CLI，入口直接转发 `@pactor/app`：

```bash
pnpm add pactor
```

也可以按场景只装需要的 `@pactor/*` scope 模块：

| 场景 | 安装 |
| --- | --- |
| 完整应用 | `pnpm add @pactor/app @pactor/ui`（shadcn kit，唯一内置实现） |
| 只要 DSL 渲染器（自己组合） | `pnpm add @pactor/runtime` |
| AI 对话视图 | `pnpm add @pactor/chat @pactor/markdown` |
| YAML 即模块（构建期校验 + HMR） | `pnpm add -D @pactor/vite-plugin` |
| 命令行校验 / 脚手架 | `pnpm add -D @pactor/cli` |

两种方式可混用：meta 包只是依赖聚合，与各模块统一版本发布，功能无差异。下面的最小接入以 `pnpm add pactor` 为例。

## 最小接入（四步）

与 `examples/vite-starter` 等效的最小工程：

**1. vite.config.ts 挂插件**

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import pactor from '@pactor/vite-plugin';

export default defineConfig({
  plugins: [react(), pactor()],
});
```

**2. 添加 `src/dsl-modules.d.ts`**（让 TS 识别 YAML 模块）

```ts
declare module '*.page.yaml' {
  import type { PageDsl } from '@pactor/core';
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
import { createPactorApplication } from 'pactor'; // meta 包入口，转发 @pactor/app
import { StaticDslLoader } from '@pactor/resource'; // 已由 meta 包带入，直接导入即可
import '@pactor/ui/styles.css'; // shadcn kit 预建样式（必需）

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

> 若选择按需安装（`@pactor/app` + `@pactor/ui`）而非 meta 包，把第 4 步的 `from 'pactor'` 改为 `from '@pactor/app'` 即可，其余代码不变。

## createPactorApplication 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `appId` | string（必填） | 应用 id；brand 缺省标题回退 |
| `api` | `{ baseURL? }` | DSL 资源 API（未注入 loader 时创建 HttpDslResourceLoader） |
| `loader` | DslResourceLoader | 资源加载器，优先于 `api`（本地/测试用 StaticDslLoader） |
| `ui` | UiKit | UI kit 预设（内置为 `shadcnUiKit`），一次提供三个槽位 |
| `componentRegistry` | `() => Registry` | 组件注册表工厂（槽位之一，优先级高于 `ui` 预设） |
| `layoutRegistry` | `() => LayoutRegistry` | 布局注册表工厂（槽位之一） |
| `interactionKit` | `{ Provider, OverlayHost }` | 交互层组件对（overlay / message / confirm，槽位之一） |
| `components` | `Record<string, unknown>` | 业务组件扩展，叠加在所选注册表之上，可覆盖同名内置组件 |
| `actions` | `Record<string, ActionHandler>` | 业务动作扩展（如 `service.call`） |
| `services` | `Record<string, ServiceHandler>` | 业务服务（`type: service` 数据源按名引用） |
| `capabilities` | `Record<string, unknown>` | 业务能力扩展 |
| `layout` | string | 布局类型覆盖（> bootstrap.layout.type > 'admin'） |
| `brand` | `{ title, logo? }` | 品牌区覆盖（缺省取 bootstrap.app.name） |
| `router` | `{ type?: 'browser'\|'hash', basename? }` | 路由配置 |
| `authTokenProvider` | AuthTokenProvider | 认证令牌，注入 DSL 资源请求与页面 HTTP 出口 |

槽位合并优先级：**显式细粒度选项（componentRegistry 等）> `ui` 预设 > 内置 shadcn 默认**。

## 自定义 UI kit

内置 UI 实现只有 shadcn 一套（`@pactor/ui`）。业务需要自定义组件 / 布局 / 交互层时，通过保留的覆盖点逐槽位替换（详见 [@pactor/ui](/packages/ui/) 的「自定义 UI kit」与迁移对照表）：

```tsx
import { shadcnUiKit } from '@pactor/ui';

createPactorApplication({
  appId: 'my-app',
  loader,
  ui: shadcnUiKit, // 显式预设（与缺省一致）；配合 componentRegistry 等细粒度选项逐槽位覆盖
  // ...
});
```

从旧 `pactor-ui-antd` / `pactor-ui-radix` 包迁移的符号对照见 [@pactor/ui 迁移说明](/packages/ui/#从-pactor-ui-antd--pactor-ui-radix-迁移)。

## 命令行（@pactor/cli）

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
