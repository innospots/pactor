# chat-self-contained-styles

## Why

pactor-chat 的组件应当是完整自持的组件：不引用调用端 CSS 即可正确渲染。现状不成立——`examples/chat/src/app.css` 里混着大量组件结构样式（shell 高度适配、对话列限宽居中、面板贴右布局），不引入它就页面错乱；`.pactor-chat-shell` 硬编码 `height: 100dvh`，嵌在顶栏之下必然溢出；examples/admin 也要靠 theme.css 里 `.ai-workspace-chat` 定高规则兜底。结构布局是组件职责，不是调用端职责。

## What Changes

- **高度策略**：shell / layout 从硬编码 `100dvh`/`100vh` 改为填满父容器（`height: 100%`，父级无定高时退化为内容高度）；standalone 顶层挂载时宿主容器定高属宿主职责（文档写清）。
- **结构样式下沉到 `packages/chat/styles.css`**：
  - shell content 区缺省布局（flex 列 + 内边距）；
  - 对话列缺省限宽居中（`--pactor-chat-content-width` 令牌，缺省 768px，可调/可关）；
  - 产出物面板打开时：host 全宽、对话列在剩余空间居中、面板贴视口右缘（content 区 `:has` 去右侧内边距）——上一轮的 app.css 修复下沉为组件缺省。
- 示例瘦身：`examples/chat/src/app.css` 只保留演示自有 UI（demo 顶栏/品牌区/chip/弹层/modal）；`examples/admin` 的 `.ai-workspace-chat` 定高规则保留（宿主布局职责）但注释更新。
- 文档：嵌入契约（容器定高 + 样式导入 + 可调令牌）写入 docs/packages/chat.md 与包 README。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `chat-app-shell`: 外壳高度策略与 content 区缺省布局（填满父容器、对话列限宽居中令牌化）。
- `chat-artifact-panel`: 面板桌面布局补"贴视口右缘、对话列在剩余空间居中"的缺省行为。

## Impact

- `packages/chat/styles.css`（主体）、`docs/src/content/docs/packages/chat.md`、`packages/chat/README.md`（如有）。
- `examples/chat/src/app.css`（瘦身）、`examples/admin/src/theme.css`（注释）。
- 行为变化：不引用调用端 CSS 时组件布局即正确；已有覆盖（app.css 旧规则）删除后以包内缺省为准——视觉经截图回归确认。
