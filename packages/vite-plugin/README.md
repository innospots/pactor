# @pactor-app/vite-plugin

[Pactor](https://github.com/426-330/pactor) 的 Vite 插件：把 `.page.yaml` / `.fragment.yaml` DSL 文件在构建期转换为 JS 模块（Parse → Validate → Compile），支持 HMR。校验复用 @pactor-app/schema 的 `validatePageDsl`。

## 安装

```bash
npm install @pactor-app/vite-plugin
# 或
pnpm add @pactor-app/vite-plugin
```

`vite >= 5` 为 peer dependency。

## 用法

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import pactor from '@pactor-app/vite-plugin';

export default defineConfig({
  plugins: [pactor()],
});
```

之后即可直接 import YAML DSL 文件：

```ts
import page from './user-list.page.yaml';
import { dslVersion } from './user-list.page.yaml';

console.log(page.page.id, dslVersion);
```

约定：

- 默认仅匹配 `*.page.yaml/.yml` 与 `*.fragment.yaml/.yml`（不误伤普通 yaml 配置）。
- `*.page.*` 走 `validatePageDsl` 完整 Schema 校验；`*.fragment.*` 做结构宽松检查（存在 `dsl` 与 `body`）。
- 校验失败或 YAML 语法错误（带行列位置）使构建报错，错误信息含文件标识与每条 `path: message (keyword)`。
- dev 时修改 DSL 文件触发热更新；无模块记录时全量刷新。

## 选项

```ts
pactor({
  // 自定义匹配规则（覆盖默认后缀约定）
  include: /\.dsl\.yaml$/,
  // 关闭构建期 Schema 校验（默认 true），仅编译
  validate: false,
});
```

自定义 `include` 时，文件名含 `.fragment.` 的按 FragmentDsl 处理，其余按 PageDsl 处理。

## TypeScript 模块声明

在业务工程中添加 `dsl-modules.d.ts`，让 TS 识别 YAML 模块：

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

构建期 import 的 DSL 可喂给 @pactor-app/resource 的 `StaticDslLoader`（examples / 单测 / 本地 DSL 开发）：

```ts
import { StaticDslLoader } from '@pactor-app/resource';
import userListPage from './user-list.page.yaml';

const loader = new StaticDslLoader({
  pages: { 'user-list': userListPage },
});
```

注意：主推荐模式仍是 Runtime API 动态加载（`HttpDslResourceLoader` + 服务端 DSL 端点），本插件适用于本地开发、示例与测试场景。

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
