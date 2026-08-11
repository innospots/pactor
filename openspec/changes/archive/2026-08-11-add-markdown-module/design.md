# Design: add-markdown-module

## Context

Markdown 是 Chat 消息与 DSL Markdown 组件的载体（第 60、61、81.3 节）。安全要求：必须 sanitize、禁止不受控 HTML/脚本/事件属性。Chat/Page/Overlay 共用 Renderer，故本包同时提供独立 React 组件与 DSL 组件适配。

约束：

- 不自研 Markdown 解析器——用 `react-markdown` + `remark-gfm`（业界标准，AST 渲染为 React 元素而非 HTML 字符串注入）。
- 安全边界：不启用 `rehype-raw`（原始 HTML 不进入渲染），链接协议白名单兜底。

## Goals / Non-Goals

**Goals:**

- `<MarkdownRenderer content>`：标题/列表/表格/代码块/引用/链接/图片。
- HTML 注入拒绝、链接协议白名单、外链安全属性。
- DSL 适配：`type: Markdown` + `registerMarkdownComponents(registry)`。
- 测试与文档。

**Non-Goals:**

- 数学公式（KaTeX）、代码高亮（语法主题）、Mermaid——V1 不做，后续以可选插件方式评估。
- 流式渲染优化（逐字追加由 chat 处理；本组件对不完整 Markdown 天然容错）。
- 主题样式体系——只提供基础 class（`pactor-markdown`），样式由宿主主题决定。

## Decisions

### D1: react-markdown AST 渲染，不启用 raw HTML

- react-markdown 默认就把 Markdown 编译为 React 元素树，Markdown 文本中的 HTML 标签默认被忽略/转义（不启用 `rehype-raw` 即天然满足"过滤 HTML"）。XSS 面主要在链接 href。
- 叠加 `components` 覆盖：自定义 `a` 渲染——href 经协议白名单检查（`http:`/`https:`/`mailto:`，相对路径放行），拒绝时渲染为纯文本；外链加 `target="_blank" rel="noreferrer"`。`img` 同样校验 src 协议。

### D2: GFM 表格与代码块

- `remark-gfm` 提供表格/删除线/任务列表。
- 代码块渲染为 `<pre><code>`（带 language class，供后续高亮扩展）。

### D3: DSL 适配与注册

- `MarkdownDslComponent({ content }: { content?: string })`——content 经 Renderer 表达式解析后传入（`${data.xxx}` 等已由 runtime 处理）。
- `registerMarkdownComponents(registry)`：注册 `'Markdown'`；Chat 的 Safe Registry 场景也可复用（pactor-chat 决定注册哪些）。

### D4: 依赖与结构

- dependencies：`pactor-core`（workspace:*）、`react-markdown`、`remark-gfm`；peerDependencies：`react >=18`。
- devDependencies：react 测试栈（jsdom + @testing-library/react）。
- 源码：`renderer.tsx`（MarkdownRenderer + 链接/图片安全组件）、`dsl-component.tsx`、`register.ts`、`index.ts`。

## Risks / Trade-offs

- [react-markdown 大版本 API 差异（v8→v9→v10）] → 以 pnpm 解析的最新版为准实现，README 注明基准版本；仅用稳定 props（children→content、remarkPlugins、components）。
- [安全依赖"不启用 rehype-raw"这一约定，后续维护者可能误开] → 测试锁定注入场景（script/onerror 不出现）；代码注释+文档强调禁止启用 raw HTML。
- [表格在窄容器溢出] → 样式归宿主主题，本包仅语义 class。

## Migration Plan

无（全新包）。顺序：包骨架 → MarkdownRenderer（含安全组件）→ DSL 适配 → 测试 → 文档。

## Open Questions

- 代码高亮与数学公式：作为后续可选增强（评估 react-syntax-highlighter / KaTeX 的体积成本）。
