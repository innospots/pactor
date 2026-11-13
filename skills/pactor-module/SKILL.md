---
name: pactor-module
description: |
  Use when building Shell-deliverable Pactor modules — pactor.module.json, pactor module init/build/pack/validate, dist-module/Manifest V1, module/client.ts, module/server.ts, apiPrefixes, apps-shell assemble:modules, dual-mode next-app (standalone + tgz). Triggers: module-pack, pack:module, build:module, Shell 模块, 模块化打包, 依赖应用, innospots-web-shell, npm tgz 装配. NOT for generic YAML page authoring (pactor-dsl) or empty scaffold only (pactor-project — pair with this skill when apps-shell or dual-mode).
version: 1.0.0
---

# Pactor 模块建设与 Shell 打包

帮助 Agent 将 **Pactor 应用工程**（next-app、apps-shell 子模块或双模式 next-app-starter）产出为 **Shell 可装配的 npm 模块**（`dist-module/` + `*.tgz`），并完成 **web-shell 构建期装配**。

## When to activate

- 用户要 **打包模块**、`pnpm pack:module`、`pactor module build|pack|validate|init`
- 问题涉及 **`pactor.module.json`**、**Manifest V1**、`globalPageId`、`basePath`、`target` profile
- **apps-shell**：`pactor-apps/*`、`assemble:modules`、`module-list.json`、Shell `sitemap.yaml` 挂菜单
- **双模式工程**：同一仓库既 `pnpm dev` 独立运行，又 `pack:module` 交付（`sitemap.yaml` + `sitemap.module.yaml`）
- 模块 **server entry**：`module/server.ts`、`/api/modules/<id>/*`、`apiPrefixes`
- 与 **`@pactor-app/module-pack`**、CLI `pactor module *` 相关

## What this skill does NOT cover

| 场景 | 使用 |
| --- | --- |
| 从零选 next-app / spa / apps-shell 模板 | `pactor-project` skill |
| 写页面 DSL、菜单文案、access-mode | `pactor-dsl` skill |
| PRD 整站批量出页 | `pactor-prd` skill |

## 快速决策

```text
交付形态？
  ├─ 多个业务包合一部署、模块独立开发/发版 → apps-shell（宿主 + N 个模块工程）
  ├─ 单仓库既要独立 Next 又要可装进 Shell → next-app 双模式（见 references/dual-mode-next-app.md）
  └─ 新建独立模块工程（无全站宿主） → 复制 starters/apps-shell-starter/pactor-apps/* + pactor module init
```

工具链归属：**`packages/module-pack`**（可编程 API）+ **`@pactor-app/cli`**（`pactor module *`）。

## Agent 标准流程

### A. 新建 Shell 模块工程（典型 apps-shell 子包）

1. 复制样板：`starters/apps-shell-starter/pactor-apps/risk-analysis`（含 server）或 `risk-decision`（纯 DSL）。
2. 一次性接入（幂等）：

```bash
pnpm add -D @pactor-app/cli
pactor module init              # pactor.module.json + module/client.ts + module.css
pactor module init --server     # 额外 module/server.ts + serverEntry / apiPrefixes
```

3. 改 `pactor.module.json`：`id`、`basePath`、`yamlRoot`、必要时 `target`。
4. 每次发版：

```bash
pnpm build:module    # 或 pactor module build
pnpm validate:module
pnpm pack:module     # 默认含 build；apps-shell 示例常用 --no-bump
```

5. Shell 侧：`pnpm add file:...tgz` → `module-list.json` → `src/shell/sitemap.yaml`（`pageId: "<moduleId>:<pageId>"`）→ `pnpm assemble:modules` → `pnpm dev`（:9020）。

细节：**`references/apps-shell-integration.md`**、**`references/module-pack-contract.md`**。

### B. next-app 双模式（独立 + 模块）

1. 以 **`starters/next-app-starter`** 为参考：已有 `pactor.module.json`、`module/*`、`sitemap.module.yaml`、`build:module` / `pack:module`。
2. 独立模式不改：`sitemap.yaml` + `src/app/api/*` + `pnpm dev`。
3. 模块模式：维护 **`sitemap.module.yaml`**（无登录/注册、无 `NavigationShell` 双层壳）、**`module/server.ts`** 承接 `/api/d` mock。
4. `pactor.module.json` 中 **`"sitemap": "sitemap.module.yaml"`**（需 module-pack ≥ 含该字段的版本）。

细节：**`references/dual-mode-next-app.md`**。

### C. 既有全站 next-app 改造为可 pack

1. 执行 `pactor module init`（按需 `--server`），不破坏现有 `dev`/`build`。
2. 新增 `sitemap.module.yaml` 与 `module/client.ts`（从 `src/frontend/components` 或 `src/pactor/components` re-export）。
3. 配置 `yamlRoot` 指向工程实际 YAML 根（next-app-starter 为 `src/backend/pages/yaml`）。
4. 业务 API：统一前缀 `apiPrefixes`（如 `/api/d`）；`module/server.ts` 导出 `handlers` 逻辑路径表。
5. `pnpm pack:module` + `pactor module validate`；在 Shell PoC 跑 `assemble:modules` 验收。

检查清单：**`references/module-scaffold-checklist.md`**。

## 红线

1. **`basePath` 禁止 `"/"`**（Shell join 会产生非法路径）；默认 `/<moduleId>`。
2. **`serverEntry` 与 `apiPrefixes` 必须成对**；启用 server 时 `target` 需 **`innospots-web-shell@3`**（`moduleServerApi`）。
3. **勿把全站 sitemap**（含 `NavigationShell`、登录流）**直接 pack** 进 Shell 模块 — 用 **`sitemap.module.yaml`** 或 apps-shell 式 content-only 布局。
4. **`module/client.ts` 勿 import 含 `@import "tailwindcss"` 的 globals**（esbuild 会失败）；样式走 **`tailwind.input`** 预编译或组件级 CSS。
5. 改模块 YAML/版本后：**模块侧重跑 `pack:module`**；Shell 侧 **`pnpm install --force && pnpm assemble:modules`**（`pnpm dev` 不自动装配）。
6. 打包前确认 **`@pactor-app/cli` / `module-pack` 已 build**（monorepo 内 `link:` 依赖）。

## 权威源码与样例

| 资产 | 路径 |
| --- | --- |
| 打包库与配置字段 | `packages/module-pack/README.md` |
| 双模式 starter | `starters/next-app-starter`（`pactor.module.json`、`module/`） |
| Shell + 两模块 | `starters/apps-shell-starter` |
| create 模板 | `packages/create-app/templates/apps-shell` |

## References

- `references/module-pack-contract.md` — Manifest、`pactor.module.json`、`target` profile、CLI
- `references/dual-mode-next-app.md` — 独立与模块双流水线、sitemap 分流、server 适配
- `references/apps-shell-integration.md` — 宿主装配、菜单、module-list、运行时 API
- `references/module-scaffold-checklist.md` — 新建/改造模块逐步验收
