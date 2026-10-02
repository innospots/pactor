# Design: add-ui-asset-library

## Context

Pactor monorepo 的 `docs/` 是基于 Astro + Starlight 的文档站（部署 Cloudflare Workers，`wrangler deploy`）。设计资产（样式 Token、137 个组件、主题、模板、素材）目前散落在 `packages/ui`、`design/*.md` 与源码中。`product-design/ui/` 六份设计文档定义了「UI 资产库」站点的信息架构、页面类型、交互契约与数据规则；`design/DesignSystem.html`（586 行交互原型）是版式与视觉基准：顶部导航 58px、三栏（左 240px / 中自适应 / 右 280px）、右侧双态看板、底部构建信息栏。

约束：

- 首期纯静态：内容经 Git 手动维护，构建期内嵌；无在线编辑、审核、权限、历史版本。
- 未接入真实数据的资产必须标「待资产接入」，禁止展示模拟值。
- 废弃资产保留并给替代项入口；外链按可用性（可用/需复核/受限/失效）标注。
- 视觉以 DesignSystem.html 为基准（其色板/字号/圆角/间距即样式资产的初始 Token 来源）。

## Goals / Non-Goals

**Goals:**

- 资产库落地为仓库根目录新建的独立 `doc/` 应用（Astro），**不修改现有 `docs/` 文档站的任何内容**。
- 实现三栏框架、右侧双态看板、五类分类导航（Tab + 二级菜单）、三种通用页面类型与通用异常状态。
- 建立资产数据层：结构化数据文件 + 稳定 ID + 三轨状态字段 + 构建期校验（ID 唯一、引用可达、废弃有替代项）。
- 首批真实内容：样式 Token 全量接入（来自 @pactor-app/ui 令牌与 DesignSystem.html 色板）；组件目录接入验收矩阵清单（137 组件元数据）；主题接入 16 色系入口与数据契约；模板/素材接入导航与总览，条目如实标注接入状态。

**Non-Goals:**

- 主题生成器与案例模块（标记「待设计」，仅保留导航入口）。
- 对现有 `docs/` 文档站的任何修改（顶部导航的「文档」入口仅为指向该站的外链）。
- 137 个组件逐一的详情页 15 章节、80 个主题逐一详情、43 个模板逐一详情——数据结构预留，内容按接入状态逐步补齐。
- 在线编辑、审核、权限、发布流、历史版本切换。
- 样式页全部高级交互（对比度检查、动效播放器、字体临时预览等）中的重交互项本期只做 Token 表与复制；其余在数据结构中预留。

## Decisions

### D1：资产库作为根目录新建的独立 `doc/` 应用，不改动 docs/

新建 `doc/`（Astro 应用，加入 pnpm workspace），承载资产库全部页面；自带构建与 `wrangler.jsonc`，独立部署。**现有 `docs/` 文档站一行不改**：顶部导航的「文档」入口是指向现有 docs 站地址的外链，两站通过链接互联而非同站整合。

备选：在 `docs/` 内加自定义板块。否决理由（按本次决策）：保持文档站零风险、两站独立演进与部署；资产库版式（三栏壳）与 Starlight 版式差异大，独立应用无需与 Starlight 的 header/路由机制周旋。代价是放弃同站内链（文档 ↔ 资产的跳转走绝对地址）。

### D2：Astro 静态页 + React 交互岛，不引入 SPA 框架

页面骨架（导航、总览、卡片、详情排版）由 Astro 组件在构建期渲染，零 JS 直出；交互点（搜索筛选、URL 同步、复制、右看板切换、主题预览）做成小型 React 岛（`@astrojs/react`）。理由：内容为静态数据，构建期渲染 SEO/性能最优；交互面小且离散，岛模式成本最低。备选「全 React SPA」否决：静态内容优先，且岛模式无需引入路由/状态框架。

### D3：资产数据 = `doc/src/assets-data/` 下的类型化 TS/JSON 文件，构建期校验

每类资产一个数据模块（`tokens.ts`、`components.ts`、`themes.ts`、`templates.ts`、`materials.ts`），导出带 TS 类型的资产条目数组；`validate.ts` 在 `astro build` 前置执行（prebuild 脚本 + Astro integration hook 双保险）：

- ID 唯一性与命名规范（`token.*` path、`component.*`、`template.*`、`family.*`/`theme.*` 前缀、素材 ID）；
- 跨文件引用可达（组件→Token、模板→component_id、主题→色系 family）；
- `maturity: 'deprecated'` 必须有 `replacedBy` 且指向存在条目；
- 外链条目必须有 `availability` 字段；
- 数量统计（卡片上的条目数、覆盖矩阵）由构建期从数据计算，不手写。

校验失败阻断构建（exit non-zero）。备选「Astro Content Collections（zod schema）」：可行但跨文件引用校验与自定义规则（废弃替代项、前缀规范）仍要自写，TS 模块 + 单校验脚本更直接，且数据可被交互岛直接 import 复用类型。

### D4：三轨状态与稳定 ID 作为数据模型基座

所有资产条目共享基座字段：`id`（规范 ID）、`name`（展示名，可本地化，不作引用键）、`maturity`（stable/experimental/deprecated）、`change`（new/updated/undefined）、`integration`（integrated/pending）、`replacedBy?`、`description`。外链类条目（素材站点等）扩展 `availability`（available/needs-review/restricted/broken）。展示组件（Badge）统一映射三轨字段，分类菜单不显示标识，仅卡片与详情显示——与设计文档第 5 节一致。

### D5：版式实现对齐 DesignSystem.html 原型，抽为 Astro 布局 + CSS 自定义属性

`AssetLibraryLayout.astro` 实现 58px 顶栏 / 左 240px / 右 280px / 30px 底栏的网格壳；样式直接迁移原型的 CSS 变量（--brand、--bg、--line 等）为站点级样式表，后续由样式资产的 Token 数据反向生成（数据先行、生成器后置）。小屏幕（<1024px）左右栏转抽屉（React 岛控制开合）。

### D6：右侧双态看板用单一 React 岛 + 事件委托

中间内容区可点击对象（卡片/Token 行/色板）带 `data-inspect` 属性，一个常驻 `Inspector` 岛监听点击、按 id 从内嵌数据索引（构建期生成 JSON）取属性渲染看板；关闭或无选中时回到目录/元信息态。理由：避免每卡片一个岛的水合成本。

### D7：搜索与筛选状态写 URL（query string），构建期渲染默认态、客户端水合后恢复

筛选控件为 React 岛，初始化时读 `location.search`，变更时 `history.replaceState` 写回；无 JS 时页面仍可浏览完整列表（渐进增强）。

## Risks / Trade-offs

- [资产库（doc/）与文档站（docs/）分离后互链依赖绝对地址，任一站换域名需同步] → 文档站地址收敛为 `doc/` 内单一配置常量（环境变量可覆盖），不散落在内容中。
- [137 组件/80 主题/43 模板的内容量大，一次做全会失控] → 数据契约先行，条目允许 `integration: 'pending'` 如实标注；集合页/总览页框架完整，详情深度按数据就绪度渐进补齐。
- [TS 数据文件随内容增长变大，import 全量影响水合体积] → 交互岛只取构建期生成的精简 JSON 索引（id/名称/状态/摘要），详情字段保留在静态 HTML 中。
- [DesignSystem.html 是桌面原型，移动端行为只定义了「抽屉」] → 抽屉交互按通用模式实现，视觉细节以桌面为验收基准，移动端保证可用不逐像素对齐。
- [prebuild 校验被跳过（直接 astro build）] → 同时挂 Astro integration 的 `astro:build:start` hook 重复校验。

## Migration Plan

纯新增应用，无存量迁移；`docs/`、`packages/*` 均不触碰。`doc/` 未部署前不影响任何线上站点；如需下线，删除对应 Workers 部署即可。

## Open Questions

- 构建版本号的取数方式：构建期读取 git describe/CI 环境变量，本地构建回退 `git rev-parse --short HEAD` + 构建时间——实现时确认 Cloudflare Workers 构建环境可用变量。
- 全局搜索（顶部搜索框）首期范围：建议先接入资产数据索引的客户端搜索（数据量小），是否上 Pagefind 留待实现期按数据量决定。
