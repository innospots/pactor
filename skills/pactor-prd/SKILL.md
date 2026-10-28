---
name: pactor-prd
description: |
  Use when PRD or markdown wireframes drive Pactor YAML pages (skill id pactor-prd). Greenfield: scaffold a new repo via create-pactor-app (next-app template). Incremental: in an existing Pactor project, add or update pages from new/changed wireframe files (DSL, sitemap, menus, data API, styles). Triggers: pactor-prd, prd-to-app, 线框图增量, 已有项目加页面, PRD 更新页面.
version: 1.7.0
---

# PRD → YAML 页面应用生成

把「产品文档 + Markdown 线框图」落到 **YAML 页面 + sitemap/数据接口/样式**；支持 **两种模式**（先选型再执行）：

| 模式 | 何时用 | 脚手架 |
| --- | --- | --- |
| **新建工程** | 空目录 / 新仓库 / 首次从 PRD 出整站 | create-pactor-app 脚手架（next-app 模板） |
| **增量（已有工程）** | 仓库已是 Pactor 后台，线框图新增或调整 | **不重跑脚手架**；按 delta 改文件 |

## 输入要求

- PRD/线框图：总览 README（模块 × 页面 × 优先级）+ 分页线框 markdown（ASCII + 区域 + 交互）
- **接口文档/说明（可选）**：API 路径、方法、参数、返回结构；存在时页面 dataSources 直接对接文档接口，不再走 `/api/d/...` 约定
- **增量**：可只提供 **变更的线框图文件** 列表（或 PRD 目录 + 标明 diff 范围）
- 原产品代码仓（可选）：抽设计令牌、自定义 CSS、交互
- 目标：空目录（新建工程）或已有工程根目录（增量）

输入格式不同时，先归纳「模块 → 页面 → 区域 → 交互」，再套用流程。

## 红线（必须遵守）

1. **dataSources 一律 `type: http`，不写 `type: service`**；**PRD 含接口文档/说明时，url 取文档中的接口地址**（方法、路径、返回形状对齐，见「1. 输入解析」）；无接口文档时指向 `/api/d/...`（转发层空数据回退，后续按 `references/data-api.md` 接真实接口）
2. **布局与间距以样板页为准**：新建工程时以脚手架生成工程内 `src/server/yaml/models/` 骨架与同类页为准；**增量时以目标工程内同模块/同类型页**为准。线框图只提取结构与功能，不逐像素还原 ASCII
3. **样式与视觉依据一致**：原产品存在时，主题令牌（含深浅色）、自定义 CSS、换肤入口全部移植对齐；原产品不存在时以 PRD + UI 计划 + 同类标准骨架 / 模板目检，不虚报原产品对比，见 `references/theme-and-style.md` 与 `references/acceptance-checklist.md`
4. **功能与 PRD / 原产品一致**：线框图描述的筛选/搜索/跳转/弹窗/提交等交互必须经 events/actions 闭环可用，禁止只画静态骨架；错误分支（校验失败提示等）也要实现
5. **表单一律用 `Form` 组件**：凡是一组「字段 + 校验 + 提交」的表单——独立表单页、页面内嵌的配置面板（如树/列表右侧的编辑表单）、弹窗/抽屉表单、**搜索栏（关键词 + 查询/重置 的筛选区，用 `Form layout: inline`）**——都必须用 `Form` 包裹，字段经 `props.name` 绑定，校验用字段级 `rules`（required + message），提交用 `submit: true` 的 Button 触发 `onSubmit`；**禁止**散放 `Input`/`Select` + `setState` 攒草稿 + `if` 动作手写校验。上下结构字段及 data-list 搜索结构一律用 `Field` 包裹：label、必填星号（`required: true`）、行右提示（`labelHint`）由 `Field` 渲染，控件上只留 `name`/`rules` 等；直接使用控件自身 label 时不得在外层 `Field` 重复声明 label，禁止手写 `Text("*") + Label` 拼标签。回填联动（如点击列表/树节点填充表单）用 `form.setValues` 动作，不要绑 `${state.x}` 到字段 value；即点即生效的 ChipFilter 快筛行没有提交语义，不属于表单
6. **列表页操作列规范**：操作列按钮样式统一 `Button variant: link`；「编辑」与「新建」指向同一个表单（同一路由页或同一弹窗），唯一区别是编辑以行数据预填（路由页按接口约定整体预填，通常为 `initialValues: ${data.detail}`，route 等预整形接口为 `${data.detail.form}`；弹窗/内嵌面板用 `form.setValues`）；**数据列表页（搜索 + 表格 + 新建/编辑）以生成工程内 `src/server/yaml/models/data-list.yaml` 为标准骨架生成**（结构与要点见 `references/page-templates.md`「数据列表标准模型」）
7. **文案以线框图为准**：标题、按钮、空态文案逐字取自线框图/PRD
8. **登录页用 `Login` 业务组件**：PRD 含登录页时，以生成工程内 `src/server/yaml/common/login.yaml`（`type: Login`）为样板生成，禁止手写 Card+Form+自定义 CSS；**原型未明确布局方式时必须向用户提问**选择 `layout`（`split` 左右分栏 / `centered` 居中 / `brand-card` 品牌卡片 / `overlap` 卡片叠加 / `backdrop` 整页渐变背景，附效果简述，必要时含 `brandSide`/`brandRatio`/`authVariant` 修饰项），原型可判定布局则直接用、不提问；用户不答默认 `split` + `authVariant: card`；品牌区文案/logo/插画取自 PRD，提交闭环沿用 `onSubmit` → `request` + `message` + `app.reload` 模式
9. DSL 语法细节（组件 props、表达式、动作）以 `pactor-dsl` skill 与 packages 当前导出（ui 内置注册表 / `@pactor-app/blocks` / `@pactor-app/chart`）为准，本 skill 只约定流程与产出物

## 流程总览

```text
选型 → 1 解析与页面清单 → 2 脚手架 / 摸底 → UI 计划门禁 → 3 按计划生成页面 → 4 样式 → 5 三层验收
增量：2 为「摸底」；1/3 只处理 delta；UI 计划只更新 add / update 页；5 变更页全验 + 少量回归
```

详细增量步骤：**`references/incremental-wireframe-delta.md`**。

### 1. 输入解析

- 读 README / 变更线框图：模块树、页面 id（kebab-case）、path、菜单、P0/P1/P2
- 逐页读线框：页面类型、区域、字段、交互
- **接口文档解析**：PRD 含接口文档/说明时，提取「资源 → 路径 / 方法 / 返回形状」接口清单，页面 dataSources 以该清单为准；无接口文档则按 `references/data-api.md` 命名约定写 `/api/d/...`
- **新建工程**：输出全量 **页面清单表**（`references/page-inventory-and-files.md`）
- **增量**：扫描工程现状清单 + 输出 **delta 表**（add / update / deprecate，`references/incremental-wireframe-delta.md`）；P2 不建文件
- 页面清单 / delta 完成后不得直接生成 YAML；必须经过阶段 2 和下方 UI 计划门禁。

### 2. 脚手架

**新建工程**

严格按 **create-pactor-app 脚手架（带 values）→ rendered check → install/dev 冒烟** 的顺序执行；冒烟后先通过 UI 计划门禁，再进入页面生成：

1. 工程名由 README 产品名派生为 kebab-case 英文名，创建前确认一次；**工程必须经 create-pactor-app 脚手架创建**（模板唯一事实来源是 `starters/next-app-starter`，脚手架产物自带 PRD 起点内容：`/api/d` 转发层、`src/server/yaml/{common,models,provider,route}` 骨架、换肤支持），禁止从任何位置复制模板工程副本替代脚手架。
2. 按 **`template-placeholders.json`** 准备 flat values JSON：键必须恰好是清单登记的全部键，每个值都是字符串；键含义与示例直接读清单，不自行增删键。
3. 用 `--values` 一次性完成脚手架与占位符渲染，然后做渲染后检查（`<values.json>` 为上一步的文件）：

   ```bash
   pnpm dlx create-pactor-app@latest <project> -t next-app --values <values.json>
   node skills/scripts/prd-template.mjs check <project> --rendered
   ```

   必须用支持 `--values` 的 CLI 版本（`@latest`）；`APP_NAME` 由脚手架按目录名替换，其余 `{{KEY}}` 由 `--values` 渲染。旧 CLI 不支持 `--values` 导致占位符残留时，rendered check 会拦截，可用 `node skills/scripts/prd-template.mjs render <project> --values <values.json>` 补渲染后复查；禁止手工逐文件替换或只改 `package.json`。**rendered check 未通过、仍有占位或真实项目残留时，禁止生成页面。**
4. 执行 `pnpm -C <project> install` 与 `pnpm -C <project> dev` 完成模板冒烟（默认端口 9011），并核对 `references/project-structure.md`。冒烟通过后才进入 UI 计划门禁；门禁通过才进入阶段 3。
5. 参考模块 provider/route 作样板；`yaml/models/` 是页面骨架目录（按模块目录结构存放，已注册 sitemap、菜单「页面骨架」分组可直接预览），阶段 3 按计划生成时复制到目标模块目录改字段与文案；**全站生成完成后删除**参考模块与 models/。

**增量**

- **跳过脚手架**；执行 `incremental-wireframe-delta.md` 的「摸底」
- 确认 yaml 布局模式 A/B 与 `sitemap`、data API 接线完整；缺则先补壳或转新建工程

### 阶段 3 前置门禁：逐页 UI 计划（新建 / 增量必经）

阶段 1 的页面清单 / delta 已确定且阶段 2 完成后，先加载 **`references/ui-quality.md`**，在**目标项目**的 **`docs/prd/ui-plan.md`** 完成逐页计划；全部应生成的 P0/P1 页面通过门禁后，才进入阶段 3。

- **新建工程**：为页面清单中每个 P0/P1 页面写一行唯一、完整的计划；全部完成前不得生成其中任何页面。
- **增量**：只新增或重写 delta 中 **add / update** 的 P0/P1 页面计划行，不批量改写未变更页面；**deprecate** 不进入页面生成，仍按 `references/incremental-wireframe-delta.md` 经用户明确确认后处理 YAML 与 sitemap。
- 计划格式与字段判据以 `references/ui-quality.md` 第 2 节为准：每行九列均须填写可定位的 PRD 来源、page id / type、布局或变体、逐区组件及理由、Form / Field 间距、数据与交互闭环、四类状态、桌面与窄屏行为、可判定验收项；不适用项也必须写明依据。
- 只有表头、空行、空单元格、占位内容，或缺少来源、组件选择理由、状态、两种视口及通过结果的计划均视为未完成；不得用「适当调整」「按需美化」等不可验收措辞充数，也不得从已生成 YAML 反填计划。**任一 P0/P1 页面没有完整计划行，就不得生成或修改该页 YAML。**

### 3. 页面生成（按 UI 计划与清单或 delta 改文件）

- **逐页按计划生成**：开始每页前核对该页完整计划行，不得绕过门禁从清单或线框图直接生成 YAML。不得擅自改变计划中的区域顺序、布局 / 容器、组件、Form / Field 结构、数据与交互、状态及响应式规则。
- **变体先回写理由**：生成中确需变体或发现计划遗漏时，先停止该页生成 / 修改，在 `docs/prd/ui-plan.md` 的「布局模式」回写 PRD 依据、基准限制、采用结构、保留项、窄屏与状态影响，并补齐受影响单元格，再按更新后的计划继续；不得先改 YAML 后补理由。实现偏离已有 PRD 依据的计划时修实现，不得把计划反改成错误实现。
- **新建工程**：清单一行 = 一个文件 `yaml/<模块>/<page-id>.yaml`（或工程既定 A/B 规则）；`mkdir` 模块目录；N = P0/P1 行数
- **增量**：仅 **add** 新建文件；**update** 改已有 yaml；**deprecate** 删文件并改 sitemap（须用户确认）
- 校验见 `page-inventory-and-files.md`（全量）或 `incremental-wireframe-delta.md`（增量）
- 用 `references/component-mapping.md` 与 `references/page-templates.md` 核对计划所选组件、骨架的合法 DSL（**数据列表页直接复制 `yaml/models/data-list.yaml` 替换占位符**）；表单一律 `Form` 包裹，不在生成时无理由重选布局或组件
- **组件/模板/业务组件拿不准时先查资产库**（`references/asset-library.md`）：组件详情含可套用的 DSL 示例与 whenToUse，线框模板含可渲染的提炼 DSL；业务组件以 details 条目 + `@pactor-app/blocks` 导出为准（catalog 的 integration 字段不可信）
- 同步更新 `sitemap.yaml` 的 `pages` + `menus`（hidden 详情/编辑带 `activeMenu`）
- 每页 dataSources 全部 `type: http`：**有接口文档 → url 取文档接口地址**；无 → 按 `references/data-api.md` 命名约定写 `/api/d/...`（转发层空数据回退，无需 mock）；交互 events + actions 闭环

### 4. 样式移植

- 按 `references/theme-and-style.md`；**增量**仅受影响页面/令牌（新建工程做全站对齐）

### 5. 静态、浏览器功能与截图目检验收（三层必经，不可跳过）

**新建工程**对逐页全站执行三层验收；**增量**对所有 add / update 页执行三层全项验收，并抽至少 1～2 个未改页做菜单可达、控制台无新增 error 的回归。三层互相不能替代：

1. **静态检查**：按 `references/ui-quality.md` 第 7.1 节逐页执行 S1–S8，运行 `npx pactor validate <实际文件路径>`，核对 UI 计划门禁、DSL / 路由、骨架与间距、Form / Field、组件语义与 props、数据与交互、状态接线及计划一致性。
2. **浏览器功能验收**：使用目标项目真实 dev server，按 `references/acceptance-checklist.md` 在浏览器逐项操作路由、数据源、查询 / 重置、新建 / 编辑 / 提交、删除确认、重试、清空、禁用及适用的 hover / focus；检查成功与失败反馈、Network 和控制台。实际功能通过不免除静态检查或截图目检。
3. **截图目检**：按 `references/ui-quality.md` 第 7.2～7.3 节生成真实页面的适用截图矩阵并执行 V1–V9，覆盖桌面 `1440×900`、窄屏 `390×844`、亮色 / 暗色及计划中适用的状态，证据保存到 `docs/prd/ui-evidence/<page-id>/`；逐项目检信息层级、Field 间距、溢出、主题可读性、状态和计划一致性。

任一层任何一项失败，都按 `references/ui-quality.md` 第 8 节登记并修复，然后对该页重新执行三层全部检查与完整适用截图矩阵，不得只复查失败项或降低矩阵。共享骨架、主题或公共组件修复影响多页时，所有受影响变更页都要重验，并执行未改页回归；仍有未处理失败时不得交付。

## references 索引

| 文件 | 何时加载 |
| --- | --- |
| `create-pactor-app` 脚手架 | 阶段 2 **仅新建工程**：`pnpm dlx create-pactor-app@latest <project> -t next-app --values <values.json>` 创建工程（模板含 PRD 起点内容）；增量勿用 |
| `template-placeholders.json` | 阶段 2 **仅新建工程**：脚手架前据其准备 `--values` JSON；位于 `skills/pactor-prd/template-placeholders.json`，是 flat values 的唯一键清单与示例来源；脚手架后用 `skills/scripts/prd-template.mjs check <project> --rendered` 检查（必要时用同脚本 `render` 补渲染） |
| `references/incremental-wireframe-delta.md` | **已有工程**：线框图 add/update/deprecate、改 sitemap/数据接口/样式 |
| `references/project-structure.md` | 阶段 2：目录结构约定与 sitemap.yaml 骨架 |
| `references/ui-quality.md` | 阶段 1 页面清单 / delta 后、阶段 3 前：编写目标项目 `docs/prd/ui-plan.md`；阶段 3：核对计划与变体理由；阶段 5：执行 S1–S8、截图矩阵、V1–V9 及失败后的修复重验 |
| `references/component-mapping.md` | 阶段 3：把计划确定的区域与组件落为合法 Pactor DSL，不绕过 UI 计划重新选型 |
| `references/asset-library.md` | 阶段 3–4：查资产库组件详情（DSL 示例/whenToUse）、线框模板（可渲染 DSL）、业务组件真伪核对、主题令牌；线上 https://pactor.innospots.com 或源码 `doc/` |
| `references/page-templates.md` | 阶段 3：核对计划所选列表/详情/表单页 yaml 模板；数据列表页默认用「数据列表标准模型」（搜索 Form + 表格 + 抽屉新建/编辑） |
| `references/data-api.md` | 阶段 3：数据接口层约定（纯转发、路径即契约、空数据回退、路径命名） |
| `references/theme-and-style.md` | 阶段 4：主题令牌提取、皮肤、自定义 CSS、换肤 |
| `references/acceptance-checklist.md` | 阶段 5：浏览器功能验收、未改页回归与结果输出格式；与 `references/ui-quality.md` 的静态检查、截图目检共同执行 |
| `references/page-inventory-and-files.md` | 阶段 1–3：清单列 → 目录与文件批量创建、与 sitemap 对齐；创建 YAML 前必须先通过 UI 计划门禁 |

## Sibling skills

- **`pactor-dsl`** — 无线框图的单页/清单加页；**有线框图 + 数据接口/sitemap 联动**仍用本 skill 增量模式
- **`pactor-project`** — `pnpm create pactor-app` 空壳用法说明；本 skill 新建工程即经该脚手架（next-app 模板 + `--values` 渲染）创建，流程以本 skill 第 2 节为准
