# Delta: chat-view

## MODIFIED Requirements

### Requirement: 消息列表渲染

`<ChatView store>` SHALL 订阅 ConversationStore 渲染消息列表：user 消息渲染为右侧圆角气泡（最大宽度约 75%），assistant 消息渲染为左侧通栏排版；parts 按序逐个渲染。会话为空时 SHALL 渲染空状态区（见 chat-empty-state）。消息滚动区 SHALL 带上下边缘渐隐 mask。视图 MUST NOT 依赖 antd，颜色、圆角、字体 MUST 经 `--pactor-chat-*` CSS 变量表达（`pactor-chat/styles.css`），暗色主题经 `[data-pactor-theme='dark']` 覆盖。

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

按 part 类型渲染：text → 文本段落；markdown → pactor-markdown；dsl → runtime Renderer（Safe Registry + chat 作用域）；tool-call / tool-result → 由活动轨迹配对渲染（见 chat-activity-trace），MUST NOT 再渲染为独立状态卡；thinking → 自绘折叠卡（流式期间展开并带进行中指示，进入答案阶段自动折叠，用户操作后固定，正文支持 markdown）；error → 自绘错误警示条（error 状态消息附重试入口，见 chat-message-actions）；status → 弱提示。折叠卡与警示条 MUST 为 chat 包自绘组件（不依赖 antd）。

#### Scenario: dsl part 渲染白名单组件

- **WHEN** dsl part 的 schema 为白名单内的 Statistic 类组件
- **THEN** 正常渲染；非白名单组件渲染受控占位

#### Scenario: tool 轨迹条目

- **WHEN** part 为 tool-call（status running）
- **THEN** 渲染为活动轨迹中的单行条目，含工具名与 running 状态，点击可展开

#### Scenario: thinking 流式展开与自动折叠

- **WHEN** thinking part 流式进行中
- **THEN** 折叠卡展开并带进行中指示；正文 text part 开始流式后自动折叠

### Requirement: Composer

SHALL 提供自适应高度输入框与发送：Enter 发送、Shift+Enter 换行；IME 合成进行中 Enter MUST NOT 发送；空文本 MUST NOT 发送；提供 onSend 回调或经 transport 驱动 turn。store 存在 pending/streaming 消息时，发送按钮 SHALL 变为停止按钮，点击 SHALL 取消当前 turn（assistant 消息以 cancelled 收尾）。附件、工具栏槽位与提及扩展点见 chat-composer-extensions。

#### Scenario: 发送消息

- **WHEN** 输入文本并按 Enter
- **THEN** onSend 被以该文本调用，输入框清空

#### Scenario: 空文本不发送

- **WHEN** 输入为空白按 Enter
- **THEN** onSend 不被调用

#### Scenario: 流式中停止

- **WHEN** assistant 消息流式进行中点击停止按钮
- **THEN** 当前 turn 被取消，该消息状态变为 cancelled

### Requirement: 消息操作条

assistant 消息 hover 时 SHALL 显示操作条，至少提供复制（将消息全部 text/markdown part 文本写入剪贴板并给出已复制反馈）；末条 completed assistant 消息 SHALL 额外出示重新生成入口；error 消息 SHALL 出示重试入口；user 消息 hover 时 SHALL 出示编辑入口（见 chat-message-actions 的行为语义）。

#### Scenario: 复制消息

- **WHEN** hover assistant 消息并点击复制按钮
- **THEN** 剪贴板收到该消息文本，按钮呈现已复制态

#### Scenario: 末轮重新生成入口

- **WHEN** hover 末条已完成的 assistant 消息
- **THEN** 操作条含重新生成按钮，点击触发重新生成流程
