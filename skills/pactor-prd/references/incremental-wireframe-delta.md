# 已有工程：线框图增量（新增 / 调整）

当目标已是 Pactor 工程（由 `pactor-prd/template`、或已对齐 PRD 约定的 next-app 扩展仓）时，**不要**再复制 `template/`。根据 **新增或变更** 的线框图 markdown（及 README 增量）更新 DSL 与配套文件。

## 适用条件

工程至少具备：

- `src/server/yaml/sitemap.yaml`（或等价 sitemap 源）
- 页面 yaml 目录（**模式 B** `yaml/<模块>/<id>.yaml` 或 **模式 A** `yaml/pages/*.page.yaml` — 见 `pactor-dsl/references/page-catalog-and-layout.md`）
- 数据接口层：`app/api/d/[...parts]/route.ts` 纯转发（路径即契约、无服务层接口时返回空数据，见 `data-api.md`）；**无 mock 层**（若工程仍用 `type: service`，增量页 **仍须 http**，并迁移或仅对新页遵守红线）

不满足时：先 **`pactor-project`** 或 **新建工程 `pactor-prd` 模式** 搭壳，再回来做增量。

## 0. 摸底（只读）

1. 扫描 `src/server/yaml/**`（排除 `sitemap.yaml`），建立 **现状清单**：`page id`、文件路径、`sitemap.pages` 的 path、`menus` 引用。
2. 确认 `pageEndpoint` / 懒加载 API 路径（`src/pactor/config.ts`）与 `app/api/public/pages/[id]` 存在。
3. 读工程内 **同类页** 一份（同模块列表页或表单页）作为排版样板（增量时红线「以模板为准」= **以本工程同类页为准**）。

## 1. 解析线框图增量

输入可以是：

- 仅 **新增/修改** 的线框图 `.md` 文件列表；或
- PRD 目录 + 用户标明「只处理这些文件」

对 **每个** 线框图文件输出 delta 行：

| 变更 | page id | 模块 | 文件路径 | path | 菜单 | 说明 |
| --- | --- | --- | --- | --- | --- | --- |
| add | order-list | order | yaml/order/order-list.yaml | /orders | 进菜单 | 新列表 |
| update | order-list | order | （同上） | /orders | | 线框图改筛选区 |
| add | order-edit | order | yaml/order/order-edit.yaml | /orders/:id/edit | hidden | 新编辑页 |
| rename-id | order-detail → order-view | … | 需迁文件 + 改 sitemap | | | 少见，须用户确认 |
| deprecate | old-page | | | | 下架 | 用户确认后删 yaml + 从 sitemap 移除 |

**update** 不臆造新 page id；**deprecate** 必须用户明确，避免误删。

## 2. 改哪些文件（按变更类型）

| 变更 | 动作 |
| --- | --- |
| **add 页面** | `mkdir` 模块目录；新建 yaml；`sitemap.yaml` 增加 `pages` + `menus`；dataSources 直接声明最终接口路径（无需注册） |
| **update 页面** | 改对应 yaml（结构/字段/交互/文案）；若 path 或 id 变则同步 `sitemap.yaml`、检查 `router.push` / 菜单 `pageId` |
| **update 仅文案/字段** | 只改 yaml |
| **add 数据源** | yaml 内 `dataSources` 声明即可（路径即契约，转发层无需注册） |
| **样式** | 仅当线框图要求新页面级样式时改 `globals.css` / 皮肤；见 `theme-and-style.md` |
| **deprecate** | 删 yaml；从 `pages`/`menus` 移除；全局搜 `pageId` / 路径引用 |

**禁止**：为增量在仓库根再复制一份 `template/` 覆盖工程。

## 3. 与全量流程的差异

| 阶段 | 新建工程 | 增量（已有工程） |
| --- | --- | --- |
| 脚手架 | 复制 `template/` | **跳过**；仅摸底 |
| 页面 | 全量清单 N 文件 | 仅 **delta** 行对应文件 |
| 样式 | 全站移植 | 仅受影响页面/令牌 |
| 验收 | 全站清单 | **变更页全量验** + **抽 1～2 条旧页回归**（见 acceptance-checklist） |

## 4. 交叉检查（增量）

```text
对每个 add：存在 yaml 且 sitemap.pages 含 id 且 menus 正确
对每个 update：page.id 未变（除非走 rename 流程）且 validate 通过
数据接口：变更页涉及的所有 http 路径在 Network 200（无后端时为空数据 {}，页面按空态渲染）
```

`npx pactor validate` 仅覆盖改动的 yaml 路径。

## 5. 与 `pactor-dsl` 的分工

- **单页小改**、无线框图、只改 DSL 语法：可用 **`pactor-dsl`**。
- **线框图驱动**、含 数据接口/sitemap/多页联动：用 **本增量流程**（仍属 `pactor-prd`）。
