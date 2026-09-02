# @pactor/markdown

[Pactor](https://github.com/426-330/pactor) 的 Markdown 模块：安全的 Markdown 渲染器（`MarkdownRenderer`）与 DSL Markdown 组件适配（`type: Markdown`）。Chat 消息与 Page/Overlay DSL 共用同一渲染器。

## 安装

```bash
npm install @pactor/markdown react
# 或
pnpm add @pactor/markdown react
```

`react >= 18` 为 peer dependency。开发基准：react-markdown v10（^10.1.0）+ remark-gfm v4（^4.0.1）。

## 安全边界

- **不启用 raw HTML**：基于 react-markdown 的 AST 渲染，Markdown 文本中的原始 HTML（`<script>`、事件属性、任意标签）不会渲染为元素。**切勿引入 `rehype-raw`**——该约定由测试锁定（script / onerror 注入场景）。
- **协议白名单**：链接 href 仅允许 `http:` / `https:` / `mailto:` 与相对路径；图片 src 仅允许 `http:` / `https:` 与相对路径。`javascript:` 等危险协议的链接渲染为纯文本，图片不渲染。
- **外链安全属性**：http(s) 链接自动带 `target="_blank" rel="noreferrer"`。

## 独立使用

```tsx
import { MarkdownRenderer } from '@pactor/markdown';

<MarkdownRenderer content={'### 标题\n\n- 列表项\n\n| 表 | 格 |\n| - | - |\n| 1 | 2 |'} />;
```

支持：标题 / 段落 / 粗体 / 斜体 / 有序与无序列表 / GFM 表格与删除线 / 围栏代码块（`<pre><code class="language-xxx">`，供后续语法高亮扩展）与行内代码 / 引用 / 链接 / 图片。容器带基础 class `@pactor/markdown`，样式由宿主主题决定。

## DSL 使用

```tsx
import { createPageRuntime, PageRuntimeView } from '@pactor/runtime';
import { registerMarkdownComponents } from '@pactor/markdown';

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

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
