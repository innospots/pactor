# Tasks

## 1. 内容目录与数据加载

- [x] 1.1 新建 `doc/src/content/wireframe-templates/` 目录；编写加载模块 `doc/src/assets-data/wireframe-templates/index.ts`：用 `import.meta.glob`（eager，取 frontmatter + 原文）构建条目数组，frontmatter 校验（缺 `title` 抛错并指出文件路径），按 `order`（缺省文件名）排序
- [x] 1.2 扩展 `TemplateEntry`（可选字段 `slug`/`summary`/`order`/`sourceRef`/`layoutCount`），将加载结果接入 `assets-data/templates/index.ts`（`integration: 'integrated'`），使 `scripts/validate.ts` 计数生效

## 2. 导航与路由

- [x] 2.1 `site-nav.ts` templates 分类新增二级菜单项 `{ slug: 'wireframe', name: '线框模板' }`（置于 overview 之后）
- [x] 2.2 `pages/[category]/[section].astro`：templates 分类的 `wireframe` section 从骨架渲染排除，改由专属路由接管；其余板块维持 `PendingSectionPanel`
- [x] 2.3 新建 `pages/templates/wireframe/index.astro` 集合页：模板卡片列表（名称、摘要、布局/结构模式数量、真实计数）
- [x] 2.4 新建 `pages/templates/wireframe/[slug].astro` 详情页（`getStaticPaths` 来自 glob 结果），复用组件详情页 `templates/AssetDetail.astro` 骨架：
  - 面包屑行 flex 两端对齐，右端放「复制此页」按钮（复用 `components/CopyButton.tsx`，复制 markdown 源码原文，`?raw` 构建期读取）
  - 不渲染「元信息」「变体」「API 属性」「Design Token 映射」章节，右看板 `meta` 传空
  - 「预览」章节：渲染 markdown 正文（剔除 ```yaml 块），```text 线框等宽 pre、横向滚动不换行
  - 「结构」章节：Tab 切换「DSL 结构」（构建期解析 yaml 骨架为结构视图，复用 `DslStructure`；解析失败回退纯文本）与「yaml 结构」（原始 yaml 块按布局/套分组、只读可复制、标注「DSL 语法骨架」）
  - 新建结构 Tab 组件（React 岛，如 `components/TemplateStructureTabs.tsx`）
- [x] 2.5 更新模板总览 intro：如实说明线框模板已接入 N 篇、其余板块待接入

## 3. 首批内容接入（14 篇）

- [ ] 3.1（已接入 01/02/03 三篇，待用户确认后补齐其余 11 篇）将 `product-design/skills/innos-diagram/references/01–14` 总结整理为资产版 markdown：补 frontmatter（title/slug/order/summary/sourceRef），保留结构模式编号、ASCII 线框、说明表格与全部 ```yaml 骨架块，删减 skill 导向元信息
- [ ] 3.2 校验每篇详情页 yaml 结构区代码块数量与源文档 ```yaml 块数量一致

## 4. 验证

- [x] 4.1 `cd doc && pnpm validate && pnpm build` 通过
- [ ] 4.2 `pnpm dev` 浏览器实测：模板总览计数、线框模板集合页、14 个详情页（线框预览 + yaml 分组 + 深链）、未接入板块仍为「待接入」、深色模式
- [ ] 4.3 新增一篇测试 markdown 验证「放入即出菜单」后删除
