# add-chat-artifact-panel

## Why

目标形态（参考图）：左菜单 + header + 中间 Chat 对话区 + **右侧产出物预览面板（Inspector，可关闭/隐藏）** 的 AI 工作区页面，且左侧菜单可切换到非对话页（系统设置、我的智能体等）。现状盘点：左菜单/header/侧栏已由一等 DSL 组件 `Chat`（chat-dsl-component）覆盖；对话调大模型由 `ChatTransport` 接口注入覆盖；**但有两处缺失**——

1. **产出物预览面板**：LLM/Agent 产出的代码、文档、DSL 页面片段等结果物没有承载与预览的框架级机制；
2. **菜单切换非对话页**：`Chat` 组件把侧栏与 ChatView 绑定为一体，菜单只能做会话导航，无法让主区切换到设置页/列表页等普通 DSL 内容——缺少一个"侧栏外壳 + 可切换内容区"的组件。

## What Changes

- 新增产出物模型与状态：`ChatArtifact`（id/kind/title/content/language/meta）+ `ArtifactStore`（open/update/close + 订阅，与 ConversationStore 同模式，可注入可自持）。
- 新增 `ArtifactPanel` 视图：右侧面板（标题栏 + 关闭按钮 + 内容区），内建渲染器按 kind 分发——markdown 走 `pactor-markdown` 安全渲染、code 走代码块、text 纯文本、`dsl` 走 Safe Registry 守卫 + renderChildren 活预览。
- `Chat` DSL 组件扩展（受控优先）：`artifact` / `panelOpen` / `onPanelClose` props + `inspector` DslNode 槽（自定义面板内容）+ `events.onArtifact`（消息流出现 artifact part 时触发，DSL 经已有 setState 闭环开面板）；`createChatWorkspace` 同步透出。
- 新增 `ChatShell` 组件（React + DSL 双形态）：AppShell + 内建菜单侧栏 + `content` 槽（DslNode 或 ReactNode 路由出口）——菜单点击只发事件，切换方式由宿主决定（DSL setState 或路由导航）。
- 消息模型新增 `type: 'artifact'` part（携带 ChatArtifact 数据），reducer/PartRenderer 支持。
- 示例：examples/chat 路由化重构——HashRouter + MenuRegistry + DynamicDslRoute（pactor-router 既有件），菜单 对话 `/chat` / 我的智能体 `/agents` / 系统设置 `/settings` 三个独立 page.yaml，**菜单切换即 URL 变化、刷新按 URL 还原页面**；对话页演示 artifact 完整链路（建议词 → mock transport 输出 artifact part → 面板自动打开 → 可关闭）；智能体页点击经 DSL `navigate` 动作跳对话页并切换会话；设置页为表单 DSL。并在 admin 示例挂一个 AI 工作区页面验证 `createPactorApplication` 集成路径。

## Capabilities

### New Capabilities

- `chat-artifact-panel`: 产出物模型与 ArtifactStore、ArtifactPanel 视图与内建渲染器、artifact 消息 part、面板开关联动。

### Modified Capabilities

- `chat-dsl-component`: Chat 组件新增产出物面板配置面（受控 artifact/panelOpen/onPanelClose、inspector 槽、onArtifact 事件）；新增 ChatShell 外壳组件（菜单侧栏 + 可切换内容区）。

## Impact

- `packages/chat`：新增 `artifact.ts` / `view/ArtifactPanel.tsx` / `view/ChatShell.tsx`；改 `model.ts`（part 联合）、`chat-composition.tsx`、`view/Chat.tsx`、`chat-workspace.tsx`、`index.ts`、`styles.css`；新增测试。
- `examples/chat`：重构为多页 DSL（ChatShell + 三页面内容），mock 数据扩展；`examples/admin`：AI 工作区页面验证 app 集成。
- 文档：docs chat 相关页面与 framework-design（如提及 Chat 组件面）。
- 无破坏性变更：面板不配置时不渲染；ChatShell 为新增组件，既有 Chat 用法不变。
