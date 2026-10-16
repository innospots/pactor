# 资产库查找（doc/ 组件 · 模板 · 业务组件文档）

生成页面时，组件选型、DSL 写法、页面模板拿不准，**先到资产库查现成方案**，不要凭空拼装。

资产库有两种访问方式：

1. **线上站点**：https://pactor.innospots.com —— 任何环境可用（含增量模式接入的外部工程）。
   常用路径（注意带尾斜杠）：
   - 组件分类清单：`/components/<分类>/`（如 `/components/business/`、`/components/data-entry/`），总览 `/components/overview/`
   - 组件详情（DSL 示例 / whenToUse / 变体）：`/components/<分类>/<slug>/`（如 `/components/business/login/`）
   - 线框模板：`/templates/wireframe/<slug>/`（如 `/templates/wireframe/login-layouts/`）
   - 主题：`/themes/`
2. **源码数据层**：本 monorepo 的 `doc/` 目录，全部是可直读的结构化静态文件（见下表）。

> 适用前提：源码方式要求工作区是本 monorepo（含 `doc/`）；其他环境一律用线上站点。

## 数据分布

| 查找目标 | 位置 | 内容 |
| --- | --- | --- |
| 组件目录（有什么组件） | `doc/src/assets-data/components/<分类>.ts` | 条目含 `id`（规范 ID，如 `component.login`）、`name`、`purpose`、`maturity`、`description`；分类文件：general / layout / navigation / data-entry / data-display / feedback / media / charts / ai-chat / business |
| 组件详情 + DSL 示例 | `doc/src/assets-data/details/<分类>-details.ts` | 每个条目含 **`dsl`（可直接套用的 DSL 片段，含 props/events）**、`whenToUse`（何时用/何时不用）、`variants`（变体与适用场景）、`previewNote`（结构说明） |
| 页面模板 | `doc/src/content/wireframe-templates/<slug>/` | 14 个模板：`admin-shell` `dashboard` `search-list` `card-list` `form-page` `drawer-form` `modal-confirm` `detail-tabs` `detail-sections` `tree-master-detail` `login-layouts` `chat-page` `grant-panel` `info-text-cards`；`index.md` 为模板文档，`previews/*.yaml` 为**可渲染的提炼 DSL**，可直接复制改造 |
| 主题 / 令牌 | `doc/src/assets-data/themes/`、`doc/src/assets-data/tokens/` | 主题家族与令牌定义，阶段 4 换肤对齐用 |

## 怎么用（按阶段）

**阶段 3 · 组件映射**
1. 先按 `references/component-mapping.md` 粗选组件；
2. 拿不准选型或写法时，在 `details/<分类>-details.ts` 找对应条目：`whenToUse` 确认是否该用，`dsl` 片段直接作为页面片段的起点，`variants` 决定 props 组合；
3. 线框图整页结构接近某个线框模板时，读 `content/wireframe-templates/<slug>/index.md` + `previews/*.yaml`，以模板骨架改造，优于逐区域拼。

**阶段 3 · 业务组件**
- `components/business.ts` 有 26 个文档条目，但 **catalog 的 `integration` 字段不可信**（文档规范条目也标 integrated）；
- 业务组件已从 `packages/ui` 拆出为 **`@pactor-app/blocks`**（不进 ui 内置注册表，接入方用 `registerBlockComponents` 合并）。**真实导出的 10 个**（Login / EntityCard / CardList / RecordingPage / SiteFooter / ExpressionEditor / FieldCondition / RuleConfig / RuleExpression / ScriptEditor）可直接用；`SearchableSelect` 已转为内部实现（`internal/`），不对外导出；
- 其余条目（高级表格、人员选择器等）只有产品文档定义、无实现——线框图命中时用基础组件组合近似，并在交付说明中标注差距。

**阶段 4 · 样式**：主题家族与令牌定义在 `assets-data/themes/` / `tokens/`，与 `references/theme-and-style.md` 配合。

## 权威顺序与核对

1. packages 当前导出（`packages/ui/src/components/register.ts` 内置注册表 + `@pactor-app/blocks` / `@pactor-app/chart` 导出）——最终以代码为准；
2. `details/*-details.ts` 的 `dsl` 示例——已按真实实现核对过；
3. `components/*.ts` catalog 描述——仅作选型参考。

三处冲突时以 1 为准，并提示同步资产库数据。

## 可选：本地运行态预览

本地调试资产库站点本体时，在 `doc/` 下 `pnpm dev`（默认 4336 端口）；
日常查找优先用线上站点 https://pactor.innospots.com 或直读数据文件，不必本地起服务。
