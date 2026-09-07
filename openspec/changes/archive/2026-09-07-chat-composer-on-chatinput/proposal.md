# Proposal: chat-composer-on-chatinput

## Why

`@pactor-app/ui` 已提供 `ChatInput` 聊天输入组件（ui-chat-input-component 变更：容器 + textarea + 工具栏行 + 底部区的两层嵌套结构），而 `@pactor-app/chat` 的 Composer 仍手写同款结构（textarea + 发送钮 + 工具栏），形成第三处重复实现。延续 chat-chrome-dsl-composition 确立的方向——chat 通用 chrome 优先以 DSL 组合 ui 组件——Composer 的呈现层应改用 `ChatInput`，chat 包只保留对话领域行为（提及检测、附件、模型选择、发送/停止状态机）。

## What Changes

- `packages/chat` 的 Composer 呈现层经 chrome DSL 渲染层以 `ChatInput` 组合（DSL 环境）；无 renderer / 类型缺失时回退现有手写呈现（现有 markup 即 fallback，DOM 契约仅在该环境保留）
- `ChatInput` 增加 `header` 顶部槽（textarea 上方区域，与 footer 对称）——承载 chat 的附件卡片与上下文 chips（spec 要求渲染在输入区上方）
- chat 新增 chrome 内建动作 `chat.composerChange` / `chat.composerSubmit`：ChatInput 的受控 value / onChange / onSubmit 桥接回 Composer 状态与发送路径
- 工具栏与附件/chips 区经 ambient registry 注册的 chat 内部组件（`ChatComposerToolbarStart` / `ChatComposerToolbarEnd` / `ChatComposerHeader`，不覆盖宿主同名）供给——+/附件按钮、模型 chip、发送/停止钮、toolbarStart/toolbarEnd 槽的全部既有行为原样保留
- 行为层全部留在 chat 侧：mention 检测、附件粘贴/拖拽经包裹容器的事件冒泡承接，**不扩展 ChatInput 行为契约**
- 视觉对齐 ChatInput 结构（即参考形态）：发送/停止钮移至工具栏右端、+/附件按钮移至工具栏左端；200px 输入高度上限经 chat 样式覆盖保留
- 行为契约零变化：IME 守卫、Enter/Shift+Enter、空白禁发、发送后清空、提及回调优先、附件受控、模型 chip 位置（toolbarEnd 槽内容之前）

## Capabilities

### New Capabilities

（无——chrome DSL 渲染层机制由 chat-chrome-dsl 承载）

### Modified Capabilities

- `chat-view`: 「Composer」需求——呈现层在 DSL 环境优先经 ChatInput 组合渲染（chrome DSL 渲染层），行为语义（自适应高度 / Enter / IME / 空文本 / 停止钮）不变；无 renderer 环境回退手写呈现
- `shadcn-extended-components`: 新增「ChatInput 顶部槽」——`header` 槽（DslNode，渲染在 textarea 上方），与 footer 对称

## Impact

- **代码**：`packages/chat/src/view/Composer.tsx`（呈现层重构为行为壳 + ChromeSlot）、`packages/chat/src/view/chrome/`（composer 片段 + 槽位内部组件 + 两个内建动作）、`packages/chat/styles.css`（chrome 容器内输入高度上限等覆盖）、`packages/ui/src/components/components/ChatInput/`（header 槽）
- **规格**：`chat-view`、`shadcn-extended-components` 增量
- **测试**：既有测试全走 fallback（零回归）；新增 DSL 路径测试（受控桥接、提及检测、附件冒泡、发送/停止状态机）
- **不影响**：Composer props 契约、ChatServices、页面 DSL、ChatInput 既有 props（header 为新增可选槽）
