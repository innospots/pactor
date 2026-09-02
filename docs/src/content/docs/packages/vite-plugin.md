---
title: "@pactor-app/vite-plugin"
description: Vite 插件——构建期把 .page.yaml / .fragment.yaml 转换为 JS 模块（Parse → Validate → Compile），支持 HMR
---

`@pactor-app/vite-plugin` 让业务工程可以 `import page from './user-list.page.yaml'`：YAML 是开发格式，插件在构建期执行 Parse → Validate → Compile，输出优化后的 JS 模块（浏览器不解析 YAML）。校验复用 @pactor-app/schema 的 `validatePageDsl`，fragment 做结构宽松检查（存在 `dsl` 与 `body`）。

```bash
pnpm add @pactor-app/vite-plugin
```

`vite >= 5` 为 peer dependency；插件零 React 依赖。

## 用法

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import pactor from '@pactor-app/vite-plugin';

export default defineConfig({
  plugins: [pactor()],
});
```

```ts
import page from './user-list.page.yaml';
import { dslVersion } from './user-list.page.yaml';
```

转换产物形如：

```ts
const page = { dsl: '1.0', page: { id: 'user-list' /* ... */ } /* ... */ };
export const dslVersion = page.dsl;
export default page;
```

约定与行为：

- **匹配**：默认仅 `*.page.yaml/.yml` 与 `*.fragment.yaml/.yml`，不误伤普通 yaml 配置；插件 `enforce: 'pre'`，先于其他插件处理。
- **校验**：page 走完整 Schema 校验，fragment 宽松检查 `dsl` + `body`；校验失败报错信息含文件标识与每条 `path: message (keyword)`，YAML 语法错误带行列位置，均使构建失败。
- **HMR**：dev 时修改 DSL 文件，依赖该模块的模块进入热更新；无模块记录时触发全量刷新。

## 选项

```ts
pactor({
  include: /\.dsl\.yaml$/, // 自定义匹配规则（覆盖默认后缀约定）
  validate: false,         // 关闭构建期 Schema 校验（默认 true），仅编译
});
```

自定义 `include` 时，文件名含 `.fragment.` 的按 FragmentDsl 处理，其余按 PageDsl 处理。

## TypeScript 模块声明

在业务工程中添加 `dsl-modules.d.ts`：

```ts
declare module '*.page.yaml' {
  import type { PageDsl } from '@pactor-app/core';
  const page: PageDsl;
  export const dslVersion: string;
  export default page;
}

declare module '*.fragment.yaml' {
  import type { FragmentDsl } from '@pactor-app/core';
  const fragment: FragmentDsl;
  export const dslVersion: string;
  export default fragment;
}
```

## 与 StaticDslLoader 组合

构建期 import 的 DSL 可喂给 @pactor-app/resource 的 `StaticDslLoader`，用于 examples、单测与本地 DSL 开发：

```ts
import { StaticDslLoader } from '@pactor-app/resource';
import userListPage from './user-list.page.yaml';

const loader = new StaticDslLoader({
  pages: { 'user-list': userListPage }, // 裸 DSL 自动包装为 version 1 的 envelope
});
```

:::note
主推荐模式仍是 Runtime API 动态加载：服务端按 Envelope 协议提供 DSL 端点，业务工程通过 `HttpDslResourceLoader`（或 @pactor-app/app 的 `api` 配置）在运行时拉取，支持版本控制与 ETag 缓存。本插件面向本地开发、示例与测试场景。
:::
