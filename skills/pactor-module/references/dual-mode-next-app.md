# next-app 双模式：独立应用 + Shell 模块

**样板工程**：`starters/next-app-starter`。

## 目标

| 模式 | 命令 | 站点地图 | 宿主 API |
| --- | --- | --- | --- |
| 独立 | `pnpm dev` / `pnpm build` | `sitemap.yaml`（登录、NavigationShell、全菜单） | `src/app/api/*` |
| 模块 | `pnpm build:module` / `pnpm pack:module` | **`sitemap.module.yaml`** | **`module/server.ts`** → tgz |

业务页面 YAML、`src/frontend/components` **共用**；仅站点地图视图与服务端出口分流。

## 工程新增文件（不破坏现有 src）

```text
pactor.module.json
module/
  client.ts          # extensions.components ← pactorComponents
  module.css
  server.ts          # handlers ← mock / BFF
src/backend/pages/yaml/
  sitemap.yaml         # 独立（不变）
  sitemap.module.yaml  # 模块：无 login/register、layout: module（Content + PageOutlet）
```

## `pactor.module.json` 示例（next-app-starter）

```json
{
  "id": "next-app-starter",
  "basePath": "/next-app-starter",
  "yamlRoot": "src/backend/pages/yaml",
  "sitemap": "sitemap.module.yaml",
  "clientEntry": "module/client.ts",
  "serverEntry": "module/server.ts",
  "apiPrefixes": ["/api/d"],
  "target": "innospots-web-shell@3"
}
```

## `sitemap.module.yaml` 编写要点

- **去掉**：`login` / `register`、`auth.loginPath`（Shell 统一会话时）
- **布局**：不要用 `NavigationShell` + `${data.session.menus}`（避免与 Shell 双导航）
- **菜单**：模块内 `menus` 可设 **`hidden: true`**，由 Shell 一级菜单指向 `moduleId:pageId`
- **lazy**：与 `target` @2/@3 配合；旧 Shell 才考虑 @1 强内联

新增业务页：除改 `sitemap.yaml` 外，**同步** `sitemap.module.yaml` 的 `pages`（及 hidden 路由）。

## `module/client.ts`

```ts
import "./module.css";
import { pactorComponents } from "../src/frontend/components";
export const extensions = { components: pactorComponents, actions: {} };
```

- **不要**在 client 入口 `import` 含 `@import "tailwindcss"` 的 `globals.css`（esbuild 打包会失败）。
- 全局样式：在 `pactor.module.json` 设 **`tailwind.enabled: true`** + **`tailwind.input": "src/app/globals.css"`**（走 CLI 预编译追加到 `client/index.css`）。

## `module/server.ts` 与 `/api/d`

独立模式：`src/app/api/d/[...parts]/route.ts`（可含登录校验）。

模块模式：mock 打进 tgz；建议抽 **`mockBusinessData`** 或 **`module-api-handlers.ts`** 供 Next 路由与 `handlers` 共用。

## package.json 脚本

```json
"build:module": "pactor module build",
"validate:module": "pactor module validate",
"pack:module": "pactor module pack --no-bump"
```

devDependencies：`@pactor-app/cli`（monorepo 内 `link:../../packages/cli`）。

## 从 create-pactor-app 新建 next-app 后接入双模式

1. 复制 next-app-starter 的 `pactor.module.json`、`module/`、`sitemap.module.yaml` 结构。
2. 按工程实际调整 `yamlRoot`、组件 import 路径、`apiPrefixes`。
3. 裁剪 `sitemap.module.yaml` 与现有页面 id 对齐。
4. `pnpm pack:module` + Shell 装配冒烟。

若只需 **多 tgz 分域交付**，可在同一仓库用多个子目录各持一份 `pactor.module.json`（各自 `yamlRoot` 子集），不必拆 git 仓库。
