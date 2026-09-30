# Proposal: add-prd-to-yaml-app-skill

## Why

把 model-console → nexmux-ui 的迁移过程沉淀为可复用的 Agent Skill：输入是产品文档 + Markdown 线框图（如 product-design/nexmux/prd-diagram），输出是一个基于 pactor 的 Next.js 项目（如 nexmux-ui），页面全部用 YAML DSL 描述。当前这类迁移靠人工逐页翻译，耗时且口径不一致；固化为 skill 后任何产品都可以走同一条「PRD → YAML 页面 → 可运行原型」的路径。

## What Changes

- 在仓库新增 `packages/skills/prd-to-yaml-app/` 目录，包含 `SKILL.md`（技能说明与执行流程）及 `references/` 参考材料（页面模板、目录结构约定、数据源/服务约定、组件映射表、验收清单）
- Skill 覆盖端到端流程：解析 PRD/线框图（模块 → 页面清单）→ `pnpm create pactor-app` 脚手架 → 生成 `src/server/yaml/`（sitemap.yaml + 按模块分目录的页面 yaml，dataSources 一律 `type: http`）→ 生成 mock API 路由 → 布局/主题/换肤对齐 → 浏览器逐页验收
- 生成项目的样式与功能 SHALL 与原产品保持一致：主题令牌/换肤（主色、圆角、深浅色、皮肤包）与原产品对齐，原产品的自定义样式（如登录页 CSS）完整移植，线框图中描述的交互功能（筛选、跳转、弹窗、操作反馈等）全部实现可用，而非仅静态骨架
- 不改变任何现有包的行为；纯新增文档型资产（skill 本体）

## Capabilities

### New Capabilities

- `skill-prd-to-yaml-app`: PRD/线框图驱动的 YAML 页面应用生成技能——输入解析、项目脚手架、YAML 页面生成、mock 服务、主题对齐与验收的完整流程约定

### Modified Capabilities

（无）

## Impact

- 在既有 `@pactor-app/skills` 包内新增 `packages/skills/prd-to-yaml-app/`（SKILL.md + references/*），与 pactor skill 同包分发；README 的 Shipped skills 表同步登记；不影响 packages/ 其余包、starters/、docs/ 现有代码
- 使用方：Agent（Kimi Code / Claude Code 等）加载该 skill 后，在任意空目录或目标仓库中产出 nexmux-ui 同构项目
- 使用方式与 pactor skill 一致：拷贝/软链整个 skill 目录到 agent skills 目录（`~/.kimi-code/skills/`），本变更只负责仓内沉淀
