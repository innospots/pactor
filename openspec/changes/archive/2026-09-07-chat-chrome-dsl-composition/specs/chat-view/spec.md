# Delta: chat-view

## MODIFIED Requirements

### Requirement: 消息列表渲染

`<ChatView store>` SHALL 订阅 ConversationStore 渲染消息列表：user 消息渲染为右侧圆角气泡（最大宽度约 75%），assistant 消息渲染为左侧通栏排版；parts 按序逐个渲染。会话为空时 SHALL 渲染空状态区（见 chat-empty-state）。消息滚动区 SHALL 带上下边缘渐隐 mask。视图 MUST NOT 依赖 antd，颜色、圆角、字体 MUST 经 `--pactor-chat-*` CSS 变量表达（`@pactor-app/chat/styles.css`），暗色主题经 `[data-pactor-theme='dark']` 覆盖。

通用 chrome 区域（空态、操作条、error/status/占位、artifact 卡片等）优先经 chat chrome DSL 渲染层以宿主组件组合渲染（见 chat-chrome-dsl）时，其样式经 `pactor-chat-chrome` 容器的令牌映射承接 `--pactor-chat-*`（shadcn 语义令牌为映射目标），不放宽本条的令牌契约；chat-domain 核心呈现（气泡 / 流式 / 活动轨迹）保持 chat 自绘。

#### Scenario: 渲染对话

- **WHEN** store 含一条 user 与一条 assistant markdown 消息
- **THEN** 两者均出现且按 role 区分呈现（user 右侧气泡 / assistant 左侧通栏），markdown 渲染为元素而非源码

#### Scenario: 流式更新

- **WHEN** reducer 推入 text.delta
- **THEN** 对应消息内容实时追加更新

#### Scenario: 空会话

- **WHEN** store 无任何消息
- **THEN** 渲染空状态问候区而非空白列表

### Requirement: PartRenderer

按 part 类型渲染：text → 文本段落；markdown → @pactor-app/markdown；dsl → runtime Renderer（Safe Registry + chat 作用域）；tool-call / tool-result → 由活动轨迹配对渲染（见 chat-activity-trace），MUST NOT 再渲染为独立状态卡；thinking → 自绘折叠卡（流式期间展开并带进行中指示，进入答案阶段自动折叠，用户操作后固定，正文支持 markdown）；error → 错误警示条（error 状态消息附重试入口，见 chat-message-actions）；status → 弱提示。thinking 折叠卡 MUST 为 chat 包自绘组件（不依赖 antd）；error 警示条 / status 弱提示 / dsl-pending 占位 / artifact 卡片（标题 + kind 角标 + 打开按钮）SHALL 优先经 chat chrome DSL 渲染层以宿主组件（Alert / Text / Card / Badge / Button 等）组合渲染（见 chat-chrome-dsl），无 renderer 环境或类型缺失时回退 chat 自绘实现；artifact 卡片的打开交互在 DSL 路径下经 `chat.openArtifact` 内建动作触发同一 `onOpenArtifact` 回调。

#### Scenario: dsl part 渲染白名单组件

- **WHEN** dsl part 的 schema 为白名单内的 Statistic 类组件
- **THEN** 正常渲染；非白名单组件渲染受控占位

#### Scenario: tool 轨迹条目

- **WHEN** part 为 tool-call（status running）
- **THEN** 渲染为活动轨迹中的单行条目，含工具名与 running 状态，点击可展开

#### Scenario: thinking 流式展开与自动折叠

- **WHEN** thinking part 流式进行中
- **THEN** 折叠卡展开并带进行中指示；正文 text part 开始流式后自动折叠

### Requirement: 消息操作条

assistant 消息 hover 时 SHALL 显示操作条，至少提供复制（将消息全部 text/markdown part 文本写入剪贴板并给出已复制反馈）；末条 completed assistant 消息 SHALL 额外出示重新生成入口；error 消息 SHALL 出示重试入口；user 消息 hover 时 SHALL 出示编辑入口（见 chat-message-actions 的行为语义）。

操作条的按钮组 SHALL 优先经 chat chrome DSL 渲染层以宿主组件（Button / Tooltip / Icon 等）组合渲染（见 chat-chrome-dsl），内建动作经 `chat.*` 内建动作接回包内行为，自定义动作的 service 派发契约（chat-message-actions）不变；无 renderer 环境或类型缺失时回退 chat 自绘实现。hover 显现容器与可见性求值逻辑 MUST 保留在 chat 包内。

#### Scenario: 复制消息

- **WHEN** hover assistant 消息并点击复制按钮
- **THEN** 剪贴板收到该消息文本，按钮呈现已复制态

#### Scenario: 末轮重新生成入口

- **WHEN** hover 末条已完成的 assistant 消息
- **THEN** 操作条含重新生成按钮，点击触发重新生成流程
