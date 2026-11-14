# @pactor-app/skills

面向 AI Agent 的 [Pactor](https://github.com/innospots/pactor) 开发技能集。技能目录均以 **`pactor-`** 为前缀，与 npm 脚手架包 `create-pactor-app` 区分。

本仓库路径：**根目录 `skills/`**（pnpm workspace 包 `@pactor-app/skills`）。

| 目录 / skill id | 用途 |
| --- | --- |
| **`pactor-dsl`** | 框架、`*.page.yaml` DSL、页面授权与 sitemap/navigation 编写 |
| **`pactor-module`** | Shell 模块打包（`pactor module *`）、`pactor.module.json`、apps-shell 装配、next-app 双模式 |
| **`pactor-project`** | 新建工程、`pnpm create pactor-app`、模板选型 |
| **`pactor-prd`** | PRD / 线框图 → 完整可运行后台（经 `create-pactor-app` 脚手架） |

## 在本仓库使用（Cursor / Claude Code）

`pactor-prd` 须连同 **`references/`**、**`template-placeholders.json`** 与技能根目录的 **`scripts/prd-template.mjs`** 一起可见。

```bash
mkdir -p .cursor/skills
ln -sf ../../skills/pactor-dsl .cursor/skills/pactor-dsl
ln -sf ../../skills/pactor-module .cursor/skills/pactor-module
ln -sf ../../skills/pactor-project .cursor/skills/pactor-project
ln -sf ../../skills/pactor-prd .cursor/skills/pactor-prd
```

## 安装（业务仓库）

```bash
pnpm add -D @pactor-app/skills
```

```bash
ln -s node_modules/@pactor-app/skills/pactor-dsl ~/.claude/skills/pactor-dsl
ln -s node_modules/@pactor-app/skills/pactor-module ~/.claude/skills/pactor-module
ln -s node_modules/@pactor-app/skills/pactor-project ~/.claude/skills/pactor-project
ln -s node_modules/@pactor-app/skills/pactor-prd ~/.claude/skills/pactor-prd
```

---

## 技能一览

| Skill | 典型触发 | 产出 |
| --- | --- | --- |
| **`pactor-dsl`** | 写/改 YAML 页面、表达式、动作、组件、主题、Chat、access-mode/grantGroup、请求级 action 过滤、sitemap/navigation | 规范与示例（不生成新仓库） |
| **`pactor-module`** | `pactor module pack`、`pactor.module.json`、apps-shell 装配、双模式 next-app、模块 server API | 模块契约、流程、验收清单 |
| **`pactor-project`** | 初始化项目、`pnpm create pactor-app` | next-app / spa / apps-shell 或最小 Vite 壳工程 |
| **`pactor-prd`** | PRD/线框图 → 页面（**新工程**经 `create-pactor-app` 创建并渲染，**已有工程**线框图增量） | 逐页 UI 计划 + YAML + 访问元数据 + sitemap/navigation + http 数据源/样式 + 三层验收 |

关系：**`pactor-project`** 选型与脚手架；**`pactor-prd`** 新建模式经 `create-pactor-app` + 逐页铺页；**`pactor-dsl`** 日常改页；需 **Shell npm 模块交付** 时启用 **`pactor-module`**（可与 project 串联：`-t apps-shell` 或 next-app 双模式）。

---

## `pactor-dsl`

- **入口**：`pactor-dsl/SKILL.md`，深参考 `pactor-dsl/references/dsl-authoring.md`
- **权限与导航**：`pactor-dsl/references/authorization-and-sitemap.md` 说明通用 Pactor 与 Nexus/Console 的差异、`access-mode`、`domain`/`module`/`pageKey`/`grantGroup`、endpoint `@EndpointGrant`、请求 method/url 批量鉴权、组件可见性/禁用规则、后端导航与 hidden route
- **能力**：DSL 语法；**按清单批量加页**（目录 A/B、通用 `sitemap`/menus、host-owned navigation、`StaticDslLoader`）— `pactor-dsl/references/page-catalog-and-layout.md`；组件、dataSources、权限、Chat、`pactor validate`

---

## `pactor-module`

- **入口**：`pactor-module/SKILL.md`
- **references**：`module-pack-contract.md`（Manifest / CLI / 配置）、`dual-mode-next-app.md`、`apps-shell-integration.md`、`module-scaffold-checklist.md`
- **能力**：`pactor module init|build|validate|pack`、双 sitemap、module client/server、Shell `assemble:modules` 与菜单 `globalPageId`
- **样板**：`packages/module-pack/README.md`、`starters/next-app-starter`、`starters/apps-shell-starter`

---

## `pactor-project`

- **入口**：`pactor-project/SKILL.md`，`references/templates.md`、`references/minimal-vite.md`
- **能力**：`pnpm create pactor-app -t next-app|spa|apps-shell`（npm 包名仍为 **`create-pactor-app`**）、`pactor create`、starters 复制、脚手架后检查清单
- **模块交付**：选型 apps-shell 或双模式 next-app 后，交接 **`pactor-module`** 完成 pack/装配

---

## `pactor-prd`（PRD → 可运行应用）

**版本**：见 `pactor-prd/SKILL.md` frontmatter。

### 能力摘要

- 输入：产品总览 README + 分页 Markdown 线框图（可选原产品仓抽样式）
- 产出：Next + Pactor 工程 — `docs/prd/ui-plan.md`、sitemap/navigation、分模块 YAML、页面访问元数据、http 数据源 + `app/api/d/[...parts]` 转发层、懒加载页面 API、neutral 默认皮肤与验收证据
- **新建工程**：解析与页面清单 → `create-pactor-app` + PRD values render → rendered check → install/dev 冒烟 → 完成全量 P0/P1 UI 计划 → 按计划建 `yaml/<模块>/<id>.yaml` → 访问元数据/数据接口/样式 → 静态检查 + 浏览器功能 + 截图目检（`page-inventory-and-files.md`、`ui-quality.md`）
- **增量**：现状清单 / delta 与摸底 → 只更新 **add/update** 页的 UI 计划 → 按计划只改相关 YAML、sitemap、数据接口；**deprecate** 经确认处理 → 变更页三层验收 + 回归（`incremental-wireframe-delta.md`）
- 红线：dataSources 仅 `http`；表单一律 `Form`；列表操作列规范；功能闭环；文案跟线框图；新建工程的 rendered check / 冒烟未通过，或任一模式的完整 UI 计划门禁未通过时，不得生成页面；不得擅自偏离计划，三层验收任一失败均修复并重验

### 捆绑资产

| 路径 | 作用 |
| --- | --- |
| `pactor-prd/template-placeholders.json` | 模板 values 的完整键清单、说明与冒烟示例值 |
| `pactor-prd/references/*.md` | 目录结构、UI 质量契约（`ui-quality.md`）、组件映射、页模板、数据接口、主题、验收清单、资产库查找（`doc/` 组件/模板/业务组件文档） |

详见 [`pactor-prd/SKILL.md`](pactor-prd/SKILL.md) 与 `starters/next-app-starter/`。

---

## 校验与发布

```bash
cd skills && pnpm validate   # 目录名、SKILL frontmatter、references 与 starter/placeholder 契约
```

## 新增技能

1. 在 `skills/` 下新建 **`pactor-<topic>/`**，`SKILL.md` 的 `name` 与目录名一致。  
2. 更新本 README 表格；`pnpm validate` 通过后发布 `@pactor-app/skills`。

## License

MIT
