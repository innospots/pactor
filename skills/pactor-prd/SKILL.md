---
name: pactor-prd
description: |
  Use when PRD or markdown wireframes drive Pactor YAML pages (skill id pactor-prd). Greenfield: copy template/ into a new repo. Incremental: in an existing Pactor project, add or update pages from new/changed wireframe files (DSL, sitemap, menus, mock API, styles). Triggers: pactor-prd, prd-to-app, 线框图增量, 已有项目加页面, PRD 更新页面.
version: 1.3.0
---

# PRD → YAML 页面应用生成

把「产品文档 + Markdown 线框图」落到 **YAML 页面 + sitemap/mock/样式**；支持 **两种模式**（先选型再执行）：

| 模式 | 何时用 | 脚手架 |
| --- | --- | --- |
| **新建工程** | 空目录 / 新仓库 / 首次从 PRD 出整站 | 复制 `template/` |
| **增量（已有工程）** | 仓库已是 Pactor 后台，线框图新增或调整 | **不复制 template**；按 delta 改文件 |

## 输入要求

- PRD/线框图：总览 README（模块 × 页面 × 优先级）+ 分页线框 markdown（ASCII + 区域 + 交互）
- **增量**：可只提供 **变更的线框图文件** 列表（或 PRD 目录 + 标明 diff 范围）
- 原产品代码仓（可选）：抽设计令牌、自定义 CSS、交互
- 目标：空目录（新建工程）或已有工程根目录（增量）

输入格式不同时，先归纳「模块 → 页面 → 区域 → 交互」，再套用流程。

## 红线（必须遵守）

1. **dataSources 一律 `type: http`**，指向 `/api/data/...`，不写 `type: service`，便于后续替换真实接口
2. **布局与间距以样板页为准**：新建工程时以 `template/` 同类页为准；**增量时以目标工程内同模块/同类型页**为准。线框图只提取结构与功能，不逐像素还原 ASCII
3. **样式与原产品一致**：主题令牌（含深浅色）、自定义 CSS（如登录页）、换肤入口全部移植对齐，见 `references/theme-and-style.md`
4. **功能与原产品一致**：线框图描述的筛选/搜索/跳转/弹窗/提交等交互必须经 events/actions 闭环可用，禁止只画静态骨架；错误分支（校验失败提示等）也要实现
5. **表单一律用 `Form` 组件**：凡是一组「字段 + 校验 + 提交」的表单——独立表单页、页面内嵌的配置面板（如树/列表右侧的编辑表单）、弹窗/抽屉表单、**搜索栏（关键词 + 查询/重置 的筛选区，用 `Form layout: inline`）**——都必须用 `Form` 包裹，字段经 `props.name` 绑定，校验用字段级 `rules`（required + message），提交用 `submit: true` 的 Button 触发 `onSubmit`；**禁止**散放 `Input`/`Select` + `setState` 攒草稿 + `if` 动作手写校验。上下结构的字段一律用 `Field` 包裹：label、必填星号（`required: true`）、行右提示（`labelHint`）由 `Field` 渲染，控件上只留 `name`/`rules` 等（`Form layout: inline` 的搜索栏除外，label 直接挂控件）；禁止手写 `Text("*") + Label` 拼标签。回填联动（如点击列表/树节点填充表单）用 `form.setValues` 动作，不要绑 `${state.x}` 到字段 value；即点即生效的 ChipFilter 快筛行没有提交语义，不属于表单
6. **列表页操作列规范**：操作列按钮样式统一 `Button variant: link`；「编辑」与「新建」指向同一个表单（同一路由页或同一弹窗），唯一区别是编辑以行数据预填（路由页 `initialValues: ${data.detail}`，弹窗/内嵌面板 `form.setValues`）；**数据列表页（搜索 + 表格 + 新建/编辑）以 `template/src/server/yaml/models/data-list.yaml` 为标准骨架生成**（结构与要点见 `references/page-templates.md`「数据列表标准模型」）
7. **文案以线框图为准**：标题、按钮、空态文案逐字取自线框图/PRD
8. DSL 语法细节（组件 props、表达式、动作）以 `pactor-dsl` skill 与 packages/ui 当前导出为准，本 skill 只约定流程与产出物

## 流程总览

```text
选型 → 1 解析 → 2 脚手架（仅新建工程）→ 3 页面 → 4 mock → 5 样式 → 6 验收
增量：2 改为「摸底」；1/3 只处理 delta；6 变更页全验 + 少量回归
```

详细增量步骤：**`references/incremental-wireframe-delta.md`**。

### 1. 输入解析

- 读 README / 变更线框图：模块树、页面 id（kebab-case）、path、菜单、P0/P1/P2
- 逐页读线框：页面类型、区域、字段、交互
- **新建工程**：输出全量 **页面清单表**（`references/page-inventory-and-files.md`）
- **增量**：扫描工程现状清单 + 输出 **delta 表**（add / update / deprecate，`references/incremental-wireframe-delta.md`）；P2 不建文件

### 2. 脚手架

**新建工程**

- **整体复制 `template/`** 为新项目起点；不要用 `pnpm create pactor-app` 替代
- 工程名：README 产品名 → kebab-case 英文名，创建前确认一次
- `pnpm install` + dev 验证；核对 `references/project-structure.md`
- 参考模块 provider/route 作样板；`yaml/models/` 是页面骨架目录（按模块目录结构存放，已注册 sitemap、菜单「页面骨架」分组可直接预览），生成时复制到目标模块目录改字段与文案；**全站生成完成后删除**参考模块、models/ 及对应 mock

**增量**

- **跳过复制 template**；执行 `incremental-wireframe-delta.md` 的「摸底」
- 确认 yaml 布局模式 A/B 与 `sitemap`、data API 接线完整；缺则先补壳或转新建工程

### 3. 页面生成（按清单或 delta 改文件）

- **新建工程**：清单一行 = 一个文件 `yaml/<模块>/<page-id>.yaml`（或工程既定 A/B 规则）；`mkdir` 模块目录；N = P0/P1 行数
- **增量**：仅 **add** 新建文件；**update** 改已有 yaml；**deprecate** 删文件并改 sitemap（须用户确认）
- 校验见 `page-inventory-and-files.md`（全量）或 `incremental-wireframe-delta.md`（增量）
- 按 `references/component-mapping.md` 映射组件；按 `references/page-templates.md` 选列表/详情/表单模板（**数据列表页直接复制 `yaml/models/data-list.yaml` 替换占位符**）；表单一律 `Form` 包裹
- 同步更新 `sitemap.yaml` 的 `pages` + `menus`（hidden 详情/编辑带 `activeMenu`）
- 每页 dataSources 全部 `type: http`；交互 events + actions 闭环

### 4. mock 服务

- 按 `references/mock-data-routes.md` 注册/更新路由表与 `src/pactor/mocks/`；**增量只动变更页涉及的接口**

### 5. 样式移植

- 按 `references/theme-and-style.md`；**增量**仅受影响页面/令牌（新建工程做全站对齐）

### 6. 功能与视觉验收（必经，不可跳过）

- `references/acceptance-checklist.md`：**新建工程**逐页全站验收；**增量**对 **所有变更页** 全项验收 + **至少 1～2 个未改页回归**（菜单可达、控制台无新增 error）

## references 索引

| 文件 | 何时加载 |
| --- | --- |
| `template/` | 阶段 2 **仅新建工程**：复制为新工程起点；增量勿用 |
| `references/incremental-wireframe-delta.md` | **已有工程**：线框图 add/update/deprecate、改 sitemap/mock/样式 |
| `references/project-structure.md` | 阶段 2：目录结构约定与 sitemap.yaml 骨架 |
| `references/component-mapping.md` | 阶段 3：线框图区域 → pactor 组件映射 |
| `references/page-templates.md` | 阶段 3：列表/详情/表单页 yaml 模板；数据列表页默认用「数据列表标准模型」（搜索 Form + 表格 + 抽屉新建/编辑） |
| `references/mock-data-routes.md` | 阶段 4：mock 路由表模板与命名约定 |
| `references/theme-and-style.md` | 阶段 5：主题令牌提取、皮肤、自定义 CSS、换肤 |
| `references/acceptance-checklist.md` | 阶段 6：验收清单与结果输出格式 |
| `references/page-inventory-and-files.md` | 阶段 1–3：清单列 → 目录与文件批量创建、与 sitemap 对齐 |

## Sibling skills

- **`pactor-dsl`** — 无线框图的单页/清单加页；**有线框图 + mock/sitemap 联动**仍用本 skill 增量模式
- **`pactor-project`** — `pnpm create pactor-app` 空壳（**不要**用其替代本 skill 的 template 复制）
