---
name: prd-to-app
description: |
  Use when generating a complete pactor (pactor-app) project from product documents / markdown wireframes — pages described in YAML DSL (*.page.yaml). Triggers: 根据 PRD / 产品文档 / 线框图 (wireframe) 创建 / 生成管理后台或 Web 应用原型; turning a PRD directory (overview README + per-page ASCII wireframe markdown) into a runnable Next.js + pactor project, including sitemap.yaml, page yaml, http dataSources, mock API routes, theme/skin alignment with the original product, and browser acceptance.
version: 1.0.0
---

# PRD → YAML 页面应用生成

把「产品文档 + Markdown 线框图」翻译成可运行的 pactor 项目：页面全部 YAML DSL 描述，数据一律 http 数据源 + mock 路由，样式与功能与原产品一致。

## 输入要求

- PRD/线框图目录：总览 README（模块 × 页面 × 优先级表格）+ 分页线框图 markdown（ASCII 线框 + 区域说明 + 交互描述）
- 原产品代码仓（可选但强烈建议）：用于提取设计令牌、自定义 CSS、交互行为
- 目标目录：空目录或目标仓库

输入格式与样例不同时，先归纳其「模块 → 页面 → 区域 → 交互」的等价结构，再套用本流程，不要因格式差异中止。

## 红线（必须遵守）

1. **dataSources 一律 `type: http`**，指向 `/api/data/...`，不写 `type: service`，便于后续替换真实接口
2. **样式与原产品一致**：主题令牌（含深浅色）、自定义 CSS（如登录页）、换肤入口全部移植对齐，见 `references/theme-and-style.md`
3. **功能与原产品一致**：线框图描述的筛选/搜索/跳转/弹窗/提交等交互必须经 events/actions 闭环可用，禁止只画静态骨架；错误分支（校验失败提示等）也要实现
4. **文案以线框图为准**：标题、按钮、空态文案逐字取自线框图/PRD
5. DSL 语法细节（组件 props、表达式、动作）以 pactor skill 与 packages/ui 当前导出为准，本 skill 只约定流程与产出物

## 流程（六阶段）

### 1. 输入解析

- 读总览 README：提取模块树、页面清单（页面 id kebab-case、标题、路由路径、菜单分组、P0/P1/P2 优先级）
- 逐页读线框图：提取页面类型（列表/详情/表单/仪表盘）、布局区域、组件清单、字段与数据需求、交互（跳转/弹窗/操作）
- 输出一页纸页面清单供确认；P2 等未排期页面登记但不生成

### 2. 脚手架

- 确定工程名称：**用户未明确指定时，根据原型目录 README 中的产品名生成英文名**（kebab-case）：取 README 主标题/产品名（如「订单管理系统产品原型线框图」→ `order-console`），中文名先译为简洁英文；派生出的名称在创建前向用户确认一次
- `pnpm create pactor-app <name>`（next-app 模板）创建项目，`pnpm install` + 启动 dev server 验证模板可运行
- 按 `references/project-structure.md` 建立 `src/server/yaml/`（sitemap.yaml + 按模块分目录的页面 yaml）与 `app/api/` 路由（sitemap / public/pages/[id] / data/[...path]）

### 3. 页面生成

- 按 `references/component-mapping.md` 把线框图区域映射为 pactor 组件
- 按 `references/page-templates.md` 的三类模板逐页生成 `yaml/<模块>/<id>.yaml`：列表页（筛选 + 表格/卡片 + 操作列）、详情页（描述列表 + Tab/分区）、表单页（校验 + 提交闭环）
- 每页 dataSources 全部 `type: http`；交互经 events + actions 闭环（setState → reload dataSource → router.push 等）

### 4. mock 服务

- 按 `references/mock-data-routes.md` 在 `app/api/data/[...path]/route.ts` 注册路由表 handler，返回符合线框图字段的 mock 数据（含空态/多态数据各至少一条）

### 5. 样式移植

- 按 `references/theme-and-style.md`：提取原产品设计令牌写入皮肤文件（深浅色俱全）、移植页面级自定义 CSS 并挂载、对齐换肤入口与皮肤数量、确认图表随肤切换

### 6. 功能与视觉验收（必经，不可跳过）

- 按 `references/acceptance-checklist.md` 逐页浏览器验收并输出验收结果表：路由可达、数据源 200、渲染符合线框、交互逐项操作（含错误分支）、控制台无错、深浅色切换、与原产品同页面对比

## references 索引

| 文件 | 何时加载 |
| --- | --- |
| `references/project-structure.md` | 阶段 2：目录结构约定与 sitemap.yaml 骨架 |
| `references/component-mapping.md` | 阶段 3：线框图区域 → pactor 组件映射 |
| `references/page-templates.md` | 阶段 3：列表/详情/表单页 yaml 模板 |
| `references/mock-data-routes.md` | 阶段 4：mock 路由表模板与命名约定 |
| `references/theme-and-style.md` | 阶段 5：主题令牌提取、皮肤、自定义 CSS、换肤 |
| `references/acceptance-checklist.md` | 阶段 6：验收清单与结果输出格式 |
