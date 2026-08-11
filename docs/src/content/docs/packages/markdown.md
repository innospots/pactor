---
title: pactor-markdown
description: Markdown 模块——安全的 Markdown 渲染器（AST 渲染，不启用 raw HTML）与 DSL Markdown 组件适配
---

`pactor-markdown` 提供安全的 Markdown 渲染能力：独立 React 组件 `MarkdownRenderer` 与 DSL 组件适配（`type: Markdown`）。Chat 消息与 Page/Overlay DSL 共用同一渲染器。

```bash
pnpm add pactor-markdown react
```

`react >= 18` 为 peer dependency。开发基准：react-markdown v10 + remark-gfm v4。

## 安全边界

- **不启用 raw HTML**：基于 react-markdown 的 AST 渲染，Markdown 文本中的原始 HTML（`<script>`、事件属性、任意标签）不会渲染为元素。**切勿引入 `rehype-raw`**——该约定由测试锁定（script / onerror 注入场景）。
- **协议白名单**：链接 href 仅允许 `http:` / `https:` / `mailto:` 与相对路径；图片 src 仅允许 `http:` / `https:` 与相对路径。`javascript:` 等危险协议的链接渲染为纯文本，图片不渲染。
- **外链安全属性**：http(s) 链接自动带 `target="_blank" rel="noreferrer"`。

## 独立使用

```tsx
import { MarkdownRenderer } from 'pactor-markdown';

<MarkdownRenderer content={'### 标题\n\n- 列表项'} />;
```

支持的元素：

| 元素 | 说明 |
| --- | --- |
| 标题 / 段落 / 粗体 / 斜体 | 标准 Markdown |
| 有序 / 无序列表 | 标准 Markdown |
| 表格 / 删除线 / 任务列表 | 由 remark-gfm 提供 |
| 围栏代码块 / 行内代码 | 渲染为 `<pre><code class="language-xxx">`，供后续语法高亮扩展 |
| 引用 / 链接 / 图片 | 链接与图片受协议白名单约束 |

容器带基础 class `pactor-markdown`，样式由宿主主题决定；可通过 `className` 追加自定义 class。

## DSL 使用

```tsx
import { createPageRuntime, PageRuntimeView } from 'pactor-runtime';
import { registerMarkdownComponents } from 'pactor-markdown';

const runtime = createPageRuntime(pageDsl);
registerMarkdownComponents(runtime.context.components); // 注册 DSL 类型 'Markdown'

await runtime.initialized;
<PageRuntimeView runtime={runtime} />;
```

```yaml
type: Markdown
props:
  content: '当前筛选：**${state.keyword}**'
```

`props.content` 中的表达式（`${data.xxx}` 等）由 Renderer 在下发前解析，组件拿到的已是最终文本。Chat 的 Safe Registry 场景可复用同一 `registerMarkdownComponents`。

:::note
数学公式（KaTeX）、代码语法高亮、Mermaid 不在 V1 范围内，后续以可选插件方式评估；流式渲染（逐字追加）由 chat 侧处理，本组件对不完整 Markdown 天然容错。
:::
