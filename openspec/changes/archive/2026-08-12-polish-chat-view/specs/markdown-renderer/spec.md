# Spec Delta: markdown-renderer（高亮与数学）

## ADDED Requirements

### Requirement: 代码语法高亮

 fenced 代码块 SHALL 经语法高亮渲染（react-syntax-highlighter Light 构建，注册常用语言）；未识别语言降级为普通代码块；行内 code 保持原样。`MarkdownRenderer` SHALL 提供 `codeHighlight?: boolean`（默认 true）开关。

#### Scenario: 已知语言高亮

- **WHEN** markdown 含 ```ts 代码块
- **THEN** 输出带语言标识的高亮代码结构

#### Scenario: 关闭高亮

- **WHEN** `codeHighlight={false}`
- **THEN** 代码块以普通 pre/code 渲染

### Requirement: 数学公式渲染

SHALL 支持 remark-math + rehype-katex：行内 `$...$` 与块级 `$$...$$` 渲染为 KaTeX 结构。`MarkdownRenderer` SHALL 提供 `math?: boolean`（默认 true）开关。禁 raw HTML 与链接协议白名单的安全约束 MUST NOT 因此削弱。

#### Scenario: 块级公式

- **WHEN** markdown 含 `$$E=mc^2$$`
- **THEN** 输出 KaTeX 渲染结构而非源码文本

#### Scenario: 安全约束不变

- **WHEN** markdown 含 `<script>` 或 `javascript:` 链接
- **THEN** 仍被拒绝（不渲染 / 链接失效化）
