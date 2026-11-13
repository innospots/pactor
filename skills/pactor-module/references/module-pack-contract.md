# 模块打包契约（@pactor-app/module-pack）

## CLI（`@pactor-app/cli`）

```bash
pactor module init              # 一次性：pactor.module.json、module/client.ts、module.css、package.json 注入
pactor module init --server     # 同上 + module/server.ts、serverEntry、apiPrefixes
pactor module build             # dist-module/
pactor module validate          # Manifest V1 + profile 契约
pactor module pack              # build + 版本 bump（默认 patch）+ npm pack
pactor module pack --no-bump    # 固定版本（apps-shell file: 依赖常用）
```

可编程：`import { buildModule, validateModule, initModule } from '@pactor-app/module-pack'`。

## `pactor.module.json` 核心字段

| 字段 | 说明 |
| --- | --- |
| `id` | 模块 id → `globalPageId` 前缀、`/modules/<id>/` 资源路径 |
| `name` | 展示名 |
| `basePath` | 路由前缀，如 `/pactor-app-risk-analysis`；**禁止 `/`** |
| `yamlRoot` | 页面 DSL 根；默认 `src/server/yaml`；next-app-starter 为 `src/backend/pages/yaml` |
| `sitemap` | yamlRoot 内站点地图文件名；默认 `sitemap.yaml`；双模式用 `sitemap.module.yaml` |
| `clientEntry` | 默认 `module/client.ts`；须 `export const extensions = { components, actions }` |
| `serverEntry` | 如 `module/server.ts`；与 `apiPrefixes` **成对** |
| `apiPrefixes` | 逻辑 API 前缀数组，如 `["/api/d"]`；DSL 中命中前缀的 URL 改写为 `/api/modules/<id>/...` |
| `target` | 底座 profile，默认 `innospots-web-shell@3` |
| `access.default` | `public` \| `authenticated`；`public` 时给未声明权限的 page/menu 补 `public: true` |
| `tailwind` | `enabled`、`input`（如 `src/app/globals.css`）、`scan` |
| `rewrite.absoluteApiToRelative` | 默认 true |

禁用字段：`demo`（已移除，改用 `access`）。

## Target profile（摘要）

| Profile | 要点 |
| --- | --- |
| `innospots-web-shell@1` | `forceInlinePages: true`（兼容旧 Shell lazy） |
| `innospots-web-shell@2` | 保留 `lazy: true` |
| `innospots-web-shell@3` | **模块 server API**（`/api/modules/<id>/*`）；有 `serverEntry` 时必须用此 profile |

## 构建流水线（buildModule）

收集 yaml → 读 **`config.sitemap`** 并 `$include` 展开 → `transformSitemap`（profile）→ URL 重写（`basePath`、`apiPrefixes`）→ esbuild client → 可选 Tailwind 预编译 → 可选 server bundle → `dist-module/`（`dsl/`、`client/`、`server/`、`manifest.json`）。

**collect 规则**：`sitemap.yaml` 与 `sitemap.*.yaml` **不**当作页面 DSL。

## `package.json` 模块包约定（init 注入或手抄）

```json
{
  "files": ["dist-module"],
  "exports": {
    "./manifest": "./dist-module/manifest.json",
    "./client": "./dist-module/client/index.js",
    "./styles.css": "./dist-module/client/index.css",
    "./server": "./dist-module/server/index.mjs"
  },
  "scripts": {
    "build:module": "pactor module build",
    "pack:module": "pactor module pack",
    "validate:module": "pactor module validate"
  },
  "peerDependencies": {
    "react": "...",
    "react-dom": "...",
    "next": "...",
    "pactor-app": ">=1.55.0"
  }
}
```

纯 DSL 模块可无 client bundle；无 server 时可省略 `./server` export。

## `module/server.ts` 契约

- 导出 **`handlers`**：`Record<逻辑路径, Partial<Record<HTTP方法, handler>>>`
- 路径键为 **原始 `/api/...`**（非 `/api/modules/...`）
- handler：`(request, context) => Response | Promise<Response>`；`context.url` 为逻辑 URL（含 query）
- Shell 分发：公开 URL `/api/modules/<moduleId>/<原 /api 之后的路径>`

多变深度路径（如 `/api/d/*`）可在工程内用 **多段 `:param` 模式** 注册同一分发函数（见 next-app-starter `src/backend/mock/module-api-handlers.ts`）。

## 产物校验（validate）

Manifest 必填字段、sitemap 中每个 `pages[].id` 在 `dsl/` 有对应 YAML、client external 审计、server 与 profile 一致性等。失败时 **不留半成品**（build 先写临时目录再整体替换）。
