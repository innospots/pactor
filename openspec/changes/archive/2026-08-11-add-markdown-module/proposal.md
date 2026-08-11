# Proposal: add-markdown-module

## Why

V1 组件清单（第 98 节）包含 Markdown 组件；AI Chat 消息以 Markdown 为主要载体（第 60 节），且必须安全过滤 HTML（第 60、81.3 节）。Chat、Page、Modal、Drawer 共用同一套 UI DSL Renderer（第 61 节），所以 Markdown 需要一个既能作为独立 React 组件、又能注册进 ComponentRegistry 的模块。本变更落地 `pactor-markdown`，也是 pactor-chat 的前置。

## What Changes

- 新增 `pactor-markdown` 包（`packages/markdown`），dependencies：`pactor-core`（workspace:*）+ `react-markdown`、`remark-gfm`（运行时依赖）；peerDependencies：`react >=18`。
- **`<MarkdownRenderer>`**：渲染 Markdown 文本——标题、列表、表格（GFM）、代码块、引用、链接（第 60 节清单；数学公式 V1 不做，属"可选"）。
- **安全约束**（第 81.3 节）：不渲染原始 HTML（markdown 中的 `<script>`、事件属性、任意 HTML 一律按文本处理/剔除）；链接 URL 协议白名单（http/https/mailto，`javascript:` 等被拒绝）；外链 `target="_blank" rel="noreferrer"`。
- **DSL 组件适配**：`MarkdownDslComponent`（DSL `type: Markdown`，props `content: string`）+ `registerMarkdownComponents(registry)`，注册后即可在 Page / Overlay / Chat DSL 中使用。
- 组件测试（jsdom）：渲染元素、HTML 注入拒绝、链接协议过滤、DSL 注册渲染。
- 文档站新增 pactor-markdown 模块页。

## Capabilities

### New Capabilities

- `markdown-renderer`: Markdown 渲染组件（GFM）、HTML sanitize、链接协议白名单、DSL 组件注册。

### Modified Capabilities

（无。）

## Impact

- **新增代码**：`packages/markdown`；不修改既有包。
- **首批运行时第三方依赖**：`react-markdown`、`remark-gfm`（markdown 解析自研不现实，安全边界靠"不启用 raw HTML + 协议白名单"保证）。
- **后续模块**：pactor-chat（消息 Markdown Part 复用本模块）。
