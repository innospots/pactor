## Context

doc/ 是 Pactor UI 资产库（Astro 7 静态站点，构建期内嵌数据，`pnpm build` 时 `validate` + `astro build`）。「模板」分类当前状态：

- `site-nav.ts` 硬编码 12 个模板二级菜单（页面骨架/图表/列表/表单/详情/结果/个人/登录/Chat/支付/设置/文字）。
- 路由由 `pages/[category]/[section].astro` 统一生成，非 overview 一律渲染 `PendingSectionPanel`「待接入」。
- `assets-data/templates/index.ts` 为空数组，`TemplateEntry` 只有 `category` + `componentRefs` 字段，无内容模型。

内容来源：`product-design/skills/innos-diagram/references/*.md`（14 篇），结构为「结构模式说明 + ```text ASCII 线框 + 「DSL 配置（预留）」```yaml 骨架块（可多套 minimal/full）」。这些 yaml 是**语法骨架**（含 `<page-id>` 等占位），不可直接运行。

约束：doc 已依赖 `@pactor-app/core|runtime|ui`，但本期模板 yaml 为占位骨架，不具备可运行预览条件；站点为静态构建，内容变更走 Git + 重新构建。

## Goals / Non-Goals

**Goals:**

- 内容驱动：把模板 markdown 放入约定目录（`doc/src/content/wireframe-templates/*.md`），构建期自动收集，「模板」导航自动新增菜单项，无需改硬编码 nav。
- 模板页按 `##` 章节分节展示：每个布局「运行态预览（iframe 渲染落盘的提炼 DSL）+ 结构（DSL/yaml Tab）」同组呈现；ASCII 线框不展示。
- 首批接入 14 篇线框案例（总结整理，保持结构模式编号与 DSL 骨架完整）。
- 总览页如实反映接入状态：已接入板块显示真实计数与条目，未接入板块保持「待接入」。

**Non-Goals:**

- 预览只渲染**落盘的提炼 DSL**（`previews/NN.yaml`，人工提炼入库），构建期不做实时推导；源文档中的占位骨架 yaml 仅作「结构」展示，不运行。
- 不修改 innos-diagram/references 源文件；不改动 pactor-prd skill。
- 不动组件/主题/样式/素材分类的既有实现；原硬编码模板板块（图表/支付等）保持「待接入」占位。
- 不做模板条目的成熟度/变更标识等完整资产字段体系（沿用现有 `TemplateEntry` 最小扩展）。

## Decisions

### D1：内容载体 —— markdown + frontmatter，构建期 `import.meta.glob` 收集

新增目录 `doc/src/content/wireframe-templates/`，一个文件 = 一个模板。frontmatter 约定：

```yaml
---
title: 搜索列表页        # 菜单展示名
slug: search-list       # 路由段（缺省用文件名）
order: 2                # 菜单排序（缺省按文件名）
summary: 条件查询 + 结果表格 + 分页与行内操作
sourceRef: innos-diagram/references/02-搜索列表页.md  # 溯源
---
```

加载模块 `doc/src/assets-data/wireframe-templates/index.ts` 用 `import.meta.glob('.../*.md', { eager: true })`（Astro 原生支持，含 `rawContent`/`compiledContent` 或 `import.meta.glob(query: '?raw')` 取原文）构建条目数组。

- 备选：Astro Content Collections（`content.config.ts`）。文档站 docs/ 用了 collections，但 doc/ 现有数据体系是「TS 模块内嵌 + validate 脚本」，且需要从正文提取 yaml 代码块（glob raw 更直接）。选 glob 与 doc 现有「构建期内嵌」风格一致，且不引入 collection schema 维护成本。

### D2：导航 —— 动态分组「线框模板」挂在「模板」分类下，与硬编码项并存

`site-nav.ts` 的 templates 分类 `items` 改为「硬编码骨架项 + 动态项」合成：新增一个二级菜单项 `wireframe`（线框模板）指向集合页，集合页内列出全部已接入线框模板（卡片：名称/摘要/布局数）；每个模板有独立详情页 `/templates/wireframe/<slug>`。

- 备选：每个模板直接成为二级菜单项。14 项 + 12 骨架项会让左侧菜单过长且与「待接入」项混杂；二级菜单只放一个「线框模板」入口、三级用详情页路由，更贴合现有两级导航约定（site-nav 注释明确「只保留两级」）。

### D3：模板详情页 —— 复用组件详情页骨架，按 ## 章节分节、布局内「预览 + 结构」同组

`pages/templates/wireframe/[slug].astro`（`getStaticPaths` 来自目录收集结果）复用组件详情页的 `templates/AssetDetail.astro` 骨架（面包屑 + 页头 + 章节顺序），但章节按模板特点裁剪：

- **不渲染**组件详情页的「元信息」「变体」「API 属性」「Design Token 映射」等不适用模板的章节，右看板 `meta` 传空。
- **面包屑右端放「复制此页」按钮**（复用现有 `components/CopyButton.tsx` 岛，面包屑行 flex 两端对齐）：点击复制该模板的 markdown **源码原文**（加载器保存 rawSource，`appendSource=false` 不追加来源注释）。
- **章节按正文 `##` 分组生成**（导言归入「概述」，空章节自动省略），右侧页面目录随之可用；章节内保持文档顺序渲染。
- **不展示任何 ASCII 线框**：```text 等围栏块在加载器一律剔除（用户明确要求）。
- **预览**：markdown 正文中用 `{{preview:NN}}` 指令标记预览插入位置；预览 DSL **落盘保存**在 `previews/NN.yaml`（人工提炼入库——归一化/清洗/示例注入在提炼时完成，构建期只读取落盘结果、不重新推导）。预览经 **iframe 嵌入独立裸页面** `/templates/wireframe/preview/<slug>/<name>`（整视口渲染，外壳布局的 fixed 定位、100dvh、桌面断点在 iframe 内自然生效；iframe 内容视口放大 125% 再缩放 0.8，保证 <768px 内容列里也能呈现桌面外壳）。
- **结构**：正文 ```yaml 围栏块在其原位渲染为「DSL 结构 / yaml 结构」Tab（`TemplateStructureTabs` 单块岛），与所属布局的预览同组展示——
  - **DSL 结构**：构建期解析 yaml 为 JSON 结构视图（解析失败回退原文）；
  - **yaml 结构**：原始 yaml 代码块（只读、可复制）。
- 展示内容以源参考文档为限：提炼管线批注（如「套 1 · 提炼版/套 2 · 模板工程真实版」）不进入 index.md。

提取在构建期用正则/简单分段完成（围栏块 + 前置最近的标题），不引入 markdown AST 依赖；yaml 解析用 `yaml` 包（仅构建期）。

- 备选：预览展示 ASCII 线框。用户明确要求预览为 DSL 渲染的实际组件效果，且页面不展示线框。

### D3.1：pnpm 注入副本导致的运行时双实例（必须别名）

doc 直接依赖 `@pactor-app/runtime`（link:packages/runtime），而 `@pactor-app/ui` 经 pnpm peer 解析拿到 `.pnpm` 注入副本（同内容不同物理路径），rolldown 按路径判定模块 → 运行时被打包两份 → Renderer React Context 跨副本失效（dev 正常、prod 构建后 Form/Table 等容器组件 `useRenderer` 取 null）。修复：`astro.config.mjs` 中将 `@pactor-app/*` 统一 `resolve.alias` 到 `packages/*/dist` 源路径 + `resolve.dedupe: ['react','react-dom']`。此问题同时影响既有组件详情页的 Form/Table 预览，别名修复后一并恢复。

### D4：总览与「待接入」语义

`pages/[category]/[section].astro` 的 templates 分支：`wireframe` section 改由新集合页接管（从 SKELETON 渲染中排除）；其余硬编码板块维持 `PendingSectionPanel`。模板总览（overview）的 intro 更新为如实说明「线框模板已接入 N 篇，其余板块待接入」；`assets-data/templates/index.ts` 填充线框模板条目（`TemplateEntry` 扩展可选字段 `summary/order/slug/contentPath`，integration: 'integrated'），使计数与校验脚本（`scripts/validate.ts`）自然生效。

### D5：内容整理方式

14 篇 markdown 为人工总结后的「资产版」：保留结构模式编号、线框、说明表格与全部 yaml 骨架；删减 skill 导向的元信息（如「供 prd-diagram 编写时复用」类表述），补 frontmatter。放置即生效，验证方式：`pnpm build` 通过 + 页面可访问。

## Risks / Trade-offs

- [yaml 骨架含占位符，用户可能误以为可直接运行] → 模板页 yaml 区统一加说明「语法骨架，字段按业务补全」；frontmatter 标注 `kind: skeleton`。
- [markdown 源与 skill references 双写漂移] → frontmatter `sourceRef` 溯源；资产版以 doc 内容为准，skill 侧不反向同步。
- [glob eager 导入大 markdown 增加构建内存] → 14 篇总量 < 500KB，可忽略；后续量级增长再改 collections。
- [新增路由与 `[category]/[section].astro` 冲突] → Astro 静态路由优先级：`pages/templates/wireframe/*` 具体路由优先于动态段；并在 `[section].astro` 的 getStaticPaths 中排除 `wireframe`，双保险。
