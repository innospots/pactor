# Spec: markdown-renderer

Markdown 渲染组件与 DSL 注册（`pactor-markdown`，设计文档第 60、81.3 节）。

### Requirement: Markdown 元素渲染

`<MarkdownRenderer content>` SHALL 渲染：标题、段落、粗体/斜体、有序/无序列表、表格（GFM）、代码块与行内代码、引用、链接、图片。容器 MUST 带基础 class（`pactor-markdown`）供宿主样式挂接。

#### Scenario: 渲染标题与列表

- **WHEN** content 含 `### 标题` 与列表
- **THEN** 渲染对应 h3 与 ul/li 元素

#### Scenario: GFM 表格

- **WHEN** content 含 GFM 表格语法
- **THEN** 渲染 table 元素

#### Scenario: 代码块

- **WHEN** content 含 ``` 围栏代码块
- **THEN** 渲染 pre/code 元素且内容不被解析为 HTML

### Requirement: HTML 注入拒绝

Markdown 中的原始 HTML MUST NOT 被渲染为元素：`<script>`、事件属性（如 `onerror`）、任意 HTML 标签按忽略或纯文本处理。MUST NOT 启用 raw HTML 渲染。

#### Scenario: script 注入被拒绝

- **WHEN** content 含 `<script>alert(1)</script>` 或 `<img src=x onerror=alert(1)>`
- **THEN** 渲染结果中不存在 script 元素与 onerror 属性

### Requirement: 链接协议白名单

链接 href 仅允许 `http:` / `https:` / `mailto:` 与相对路径；`javascript:` 等危险协议 MUST 被拒绝（渲染为纯文本）。http(s) 外链 MUST 带 `target="_blank" rel="noreferrer"`。图片 src 同样受协议白名单约束。

#### Scenario: javascript 协议被拒绝

- **WHEN** content 含 `[点击](javascript:alert(1))`
- **THEN** 渲染结果中不存在该 href 的 a 元素（或 a 无该 href）

#### Scenario: 外链安全属性

- **WHEN** content 含 `https://example.com` 链接
- **THEN** a 元素带 target="_blank" 且 rel 含 noreferrer

### Requirement: DSL 组件注册

`registerMarkdownComponents(registry)` SHALL 注册 DSL 类型 `Markdown`（props `content: string`）；注册后 Page/Overlay DSL 中的 Markdown 节点 MUST 正常渲染。

#### Scenario: DSL 渲染 Markdown

- **WHEN** PageRuntime 注册后渲染 `{ type: 'Markdown', props: { content: '**加粗**' } }`
- **THEN** 出现渲染后的 strong 元素
