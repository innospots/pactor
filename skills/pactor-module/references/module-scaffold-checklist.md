# 模块工程脚手架与验收清单

Agent 在 **新建模块** 或 **改造为可 pack** 时，按序勾选。

## 一次性接入

- [ ] 工程根存在 `package.json`（Next 或独立模块包）
- [ ] `pnpm add -D @pactor-app/cli`（或 monorepo `link:../../packages/cli`）
- [ ] `pactor module init`（需要 API 则 `--server`）
- [ ] `pactor.module.json`：`id`（URL 安全）、`basePath`（非 `/`）、`yamlRoot` 指向真实 YAML 根
- [ ] 双模式时配置 **`sitemap`** 指向模块专用站点地图文件
- [ ] `module/client.ts` 导出 `extensions`；样式策略正确（无 globals tailwind 直 import）
- [ ] 有业务 API 时：`serverEntry`、`apiPrefixes`、`target: innospots-web-shell@3`

## 内容与契约

- [ ] 模块 sitemap 的每个 `pages[].id` 在 `yamlRoot` 下有 `*.page.yaml` 或 `*.yaml`
- [ ] 布局适合 Shell（content-only，无重复 NavigationShell / 登录流）
- [ ] DSL 内 `/api/...` 命中已声明 `apiPrefixes`，或走 Shell 宿主 BFF
- [ ] `module/server.ts` 的 `handlers` 覆盖 mock/真实逻辑路径（含多段路径策略）

## 构建与打包

- [ ] `pnpm build:module` 成功，`dist-module/manifest.json` 存在
- [ ] `pnpm validate:module` 通过
- [ ] `pnpm pack:module` 生成 `*.tgz`，`files` 仅含 `dist-module`
- [ ] monorepo：已 `pnpm build` 过 `module-pack` / `cli`（`link:` 依赖）

## Shell 侧（若验收端到端）

- [ ] `web-shell` 安装 tgz（`file:` 或私服）
- [ ] `module-list.json` 启用模块
- [ ] `src/shell/sitemap.yaml` 增加菜单，`pageId: "<moduleId>:<pageId>"`
- [ ] `pnpm assemble:modules` 无报错
- [ ] `pnpm dev`（:9020）目标页可渲染；涉及 `/api/d` 的页数据正常

## 与 pactor-project / pactor-prd 协作

| 步骤 | Skill |
| --- | --- |
| `create-pactor-app -t apps-shell` 或复制 starter | `pactor-project` |
| 模块内写 YAML、加页 | `pactor-dsl` |
| PRD 批量出页后再 pack | `pactor-prd` → 本清单 |
| pack / assemble / 双模式 | **`pactor-module`** |

## 常见失败

| 现象 | 处理 |
| --- | --- |
| `Could not resolve "tailwindcss"` | client 勿 import globals；用 `tailwind.input` |
| `basePath: "/"` | 改为 `/<id>` |
| serverEntry 与 @2 profile | 升到 `innospots-web-shell@3` |
| `sitemap.module.yaml` 被当成页面 id `module` | 升级 module-pack（排除 `sitemap.*`）或改名遵循 collect 规则 |
| Shell 双导航 | 模块 sitemap 去掉 NavigationShell 布局 |
| 改模块后 Shell 仍旧版 | 重 `pack:module` + `assemble:modules` |
