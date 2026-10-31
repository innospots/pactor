# @pactor-app/markdown

[Pactor](https://github.com/innospots/pactor) 的 Markdown 模块：安全的 Markdown 渲染器（`MarkdownRenderer`）、Markdown 富文本编辑器（`MarkdownEditor`，基于 [@mdxeditor/editor](https://github.com/mdx-editor/editor)）与 DSL Markdown 组件适配（`type: Markdown`）。Chat 消息与 Page/Overlay DSL 共用同一渲染器。

## 安装

```bash
npm install @pactor-app/markdown react
# 或
pnpm add @pactor-app/markdown react
```

`react >= 18` 为 peer dependency。开发基准：react-markdown v10（^10.1.0）+ remark-gfm v4（^4.0.1）。

## 安全边界

- **不启用 raw HTML**：基于 react-markdown 的 AST 渲染，Markdown 文本中的原始 HTML（`<script>`、事件属性、任意标签）不会渲染为元素。**切勿引入 `rehype-raw`**——该约定由测试锁定（script / onerror 注入场景）。
- **协议白名单**：链接 href 仅允许 `http:` / `https:` / `mailto:` 与相对路径；图片 src 仅允许 `http:` / `https:` 与相对路径。`javascript:` 等危险协议的链接渲染为纯文本，图片不渲染。
- **外链安全属性**：http(s) 链接自动带 `target="_blank" rel="noreferrer"`。

## 独立使用

```tsx
import { MarkdownRenderer } from '@pactor-app/markdown';

<MarkdownRenderer content={'### 标题\n\n- 列表项\n\n| 表 | 格 |\n| - | - |\n| 1 | 2 |'} />;
```

支持：标题 / 段落 / 粗体 / 斜体 / 有序与无序列表 / GFM 表格与删除线 / 围栏代码块（`<pre><code class="language-xxx">`，供后续语法高亮扩展）与行内代码 / 引用 / 链接 / 图片。容器带基础 class `pactor-markdown`。

## 内置样式

包内置一套可读性优先的排版样式（标题层级、表格斑马纹、代码块、引用、任务列表、KaTeX 溢出动滚等），引入即可生效：

```ts
import '@pactor-app/markdown/styles.css';
```

样式全部作用域在 `.pactor-markdown` 容器内：颜色 / 圆角经 `--pactor-markdown-*` 令牌解析，优先跟随 shadcn 语义令牌（`--foreground` / `--border` / `--primary` 等，暗色主题自动适配），无宿主主题时回退 GitHub 风格配色（跟随系统明暗）。宿主可重定义令牌或以更高优先级规则覆盖（如 `@pactor-app/chat` 的消息流主题）。启用 `math` 时仍需自行引入 `katex/dist/katex.min.css`。

## 编辑器（MarkdownEditor）

受控 Markdown 富文本编辑器，基于 `@mdxeditor/editor`（Lexical 内核），默认带标题 / 列表 / 引用 / 链接 / 表格 / 代码块（CodeMirror）插件与工具栏：

```tsx
import { useState } from 'react';
import { MarkdownEditor } from '@pactor-app/markdown';
import '@mdxeditor/editor/style.css'; // 编辑器自身样式（必需）
import '@pactor-app/markdown/styles.css'; // 容器边框 / 圆角等令牌化样式（可选）

function Demo() {
  const [value, setValue] = useState('# 标题\n\n开始编辑……');
  return <MarkdownEditor value={value} onChange={setValue} />;
}
```

常用 props：`readOnly`（隐藏工具栏）、`toolbar={false}`、`placeholder`、`renderToolbar`（自定义工具栏内容）、`plugins`（追加 MDXEditor 插件）、`editorProps`（透传底层 props）。容器带基础 class `pactor-markdown-editor`。注意：编辑器体积较大且依赖浏览器 DOM API，SSR 场景请动态导入（如 `next/dynamic` 的 `ssr: false`）。

`value` 为受控语义：用户输入经 `onChange` 回流不重复导入（光标不跳动）；外部变更（如 DSL state 回写）经 `setMarkdown` 同步进编辑器。

## DSL 使用

```tsx
import { createPageRuntime, PageRuntimeView } from '@pactor-app/runtime';
import { registerMarkdownComponents } from '@pactor-app/markdown';

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

`registerMarkdownComponents` 同时注册 `MarkdownEditor`（编辑器 DSL 类型）。`props.value` 支持表达式，`events.onChange` 的事件对象为新的 Markdown 字符串（`${event}`），典型写法是写回同一 state 形成受控回路：

```yaml
type: MarkdownEditor
props:
  value: '${state.draft}'
events:
  onChange:
    - action: setState
      params:
        draft: '${event}'
```

支持 props：`value` / `placeholder` / `readOnly` / `toolbar` / `autoFocus` / `className` / `style`。注意：编辑器依赖浏览器 DOM API 与 `@mdxeditor/editor/style.css`，仅适合 Page DSL（浏览器页面），不要注册进 Chat 的 Safe Registry。

## 文档

完整文档见 <https://github.com/innospots/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
