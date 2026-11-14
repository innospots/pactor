# apps-shell：宿主装配与模块接入

**样板**：`starters/apps-shell-starter`（`web-shell/` + `pactor-apps/*`）。

## 拓扑

```text
apps-shell-starter/
  web-shell/                 # 统一宿主 :9020
    scripts/assemble-modules.mjs
    src/shell/sitemap.yaml     # 固定一级菜单 → globalPageId
    src/modules/module-list.json
    .generated/pactor/         # 装配产出（勿手改）
  pactor-apps/
    risk-analysis/           # 模块独立 dev :8021，含 server entry
    risk-decision/           # 纯 DSL :8022
```

## 标准工作流

```bash
# 1. 各模块
cd pactor-apps/<name> && pnpm install && pnpm pack:module

# 2. 宿主（file: 或 registry tgz）
cd web-shell && pnpm install && pnpm assemble:modules && pnpm dev
```

模块源码变更后：**重跑 `pack:module`** → Shell **`pnpm install --force && pnpm assemble:modules`**。

## Shell `sitemap.yaml`

- 菜单项 **`pageId`**：`"<moduleId>:<pageId>"`（与 `pactor.module.json` 的 `id` 一致）
- **`path`**：通常对应模块 `basePath` 或具体页 path（含 basePath 前缀后由运行时解析）
- 模块自带菜单常在 **`module-list.json`** 设 **`menuMode: "hidden"`**，仅保留隐藏路由（详情页）

## `module-list.json`

启停模块、菜单接入模式、访问默认值等（见 web-shell README）。增删模块 **必须** `assemble:modules`。

## 运行时 API（宿主）

| 路径 | 用途 |
| --- | --- |
| `/api/runtime/bootstrap` | 装配后 sitemap / 注册表元数据 |
| `/api/runtime/pages/[pageId]` | lazy 页面 DSL |
| `/api/modules/<moduleId>/...` | 模块 server `handlers`（@3） |

客户端：**`PactorHost`** + `runtimeSitemapSource` + `mergeModuleComponents(moduleExtensions)`。

## 新建业务模块（复制样板）

1. 复制 `pactor-apps/risk-analysis` 或 `risk-decision`。
2. 改 `package.json` `name`、dev 端口、`pactor.module.json`（`id`、`basePath`、`yamlRoot`）。
3. 替换 `src/server/yaml`（或工程约定路径）内 DSL。
4. `pnpm pack:module` → web-shell `package.json` 用 `file:../pactor-apps/<name>/<name>-0.1.0.tgz` 或 `pnpm add`。
5. 更新 `module-list.json` + Shell `sitemap.yaml` 菜单项。

## 与双模式 next-app 的关系

- **apps-shell**：宿主 + **多个独立模块仓库/子包**，各模块 **仅** 模块视图（无全站 Next API）。
- **双模式 next-app**：**单包** 既可 `next start` 又可 `pack:module`；装配方式与上相同（安装 tgz → assemble）。

选型见 `pactor-module/SKILL.md` 快速决策。
