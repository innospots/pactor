# Proposal: polish-chat-view

## Why

pactor-chat 视图层目前是最小可用实现：依赖 antd（Collapse/Alert/Button/Input）做少量 UI、内联样式、无流式平滑与自动滚动，视觉与交互都落后于主流 AI 对话产品。参考 [DeepTutor web](https://github.com/HKUDS/DeepTutor/tree/main/web)（Next.js + Tailwind/CSS 变量 + lucide-react + react-markdown 全栈）的聊天模块重做视图层与技术选型，同时顺手解除"chat 视图依赖 antd"的已知债务。

## What Changes

- **pactor-chat 视图重构**（参考 DeepTutor 技术选型）：
  - 视图层去除 antd 依赖，Collapse/Alert/Button/Input 全部自绘（语义 class + CSS 变量）；`antd` 从 peerDependencies 移除；
  - 新增 `pactor-chat/styles.css`：`--pactor-chat-*` CSS 变量皮肤（light/dark，dark 经 `data-pactor-theme="dark"`），与 pactor-ui-radix 皮肤约定一致；
  - 引入 `lucide-react` 图标（发送/停止/复制/折叠/工具状态等）；
  - MessageBubble 重设计：user 右侧圆角气泡、assistant 左侧通栏排版、hover 操作条（复制）；
  - Composer 重设计：自适应高度 textarea、流式中发送按钮变为停止按钮；
  - 新增 hooks：`useSmoothStreamText`（rAF 打字机平滑，移植 DeepTutor 通用实现）、`useChatAutoScroll`（贴底跟随、上翻 80px 释放、回到底部按钮）。
- **runChatTurn 支持 AbortSignal**：`RunChatTurnOptions.signal`，abort 时以 `cancelled` 状态收尾（停止按钮的协议基础）。
- **pactor-markdown 增强**（DeepTutor 同款栈）：代码块语法高亮（react-syntax-highlighter Light 注册常用语言）、数学公式（remark-math + rehype-katex）；保持禁 raw HTML 与链接协议白名单的安全约束不变。
- **example-chat 适配**：引入新皮肤样式表，kaTeX CSS，验证四条演示链路。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `chat-view`: 视图层视觉/交互重构（气泡、hover 操作条、停止按钮、平滑流、自动滚动、皮肤变量），去除 antd 依赖
- `chat-streaming`: runChatTurn 支持 AbortSignal 取消
- `markdown-renderer`: 新增代码高亮与 KaTeX 数学渲染

## Impact

- `packages/chat`：view 层全部重写、新增 hooks 与 styles.css；package.json 移除 antd peer、新增 lucide-react 依赖；新增 `./styles.css` export。
- `packages/markdown`：新增 react-syntax-highlighter / remark-math / rehype-katex / katex 依赖与渲染支持。
- `packages/runtime`：`MessageStatus` 已有 `cancelled`（无需改动）。
- `examples/chat`：引入样式表与 katex css。
- 文档站 `packages/chat`、`packages/markdown` 页面同步。
- **BREAKING（包内 API）**：ChatView 视觉 DOM 结构与 class 名变化；pactor-chat 不再要求 antd peer。对最终用户无迁移成本（example-chat 同步更新）。
