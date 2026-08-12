# Spec Delta: chat-view（视图重构）

## MODIFIED Requirements

### Requirement: 消息列表渲染

`<ChatView store>` SHALL 订阅 ConversationStore 渲染消息列表：user 消息渲染为右侧圆角气泡（最大宽度约 75%），assistant 消息渲染为左侧通栏排版；parts 按序逐个渲染。视图 MUST NOT 依赖 antd，颜色 MUST 经 `--pactor-chat-*` CSS 变量表达（`pactor-chat/styles.css`）。

#### Scenario: 渲染对话

- **WHEN** store 含一条 user 与一条 assistant markdown 消息
- **THEN** 两者均出现且按 role 区分呈现（user 右侧气泡 / assistant 左侧通栏），markdown 渲染为元素而非源码

#### Scenario: 流式更新

- **WHEN** reducer 推入 text.delta
- **THEN** 对应消息内容实时追加更新

### Requirement: PartRenderer

按 part 类型渲染：text → 文本段落；markdown → pactor-markdown；dsl → runtime Renderer（Safe Registry + chat 作用域）；tool-call / tool-result → 自绘可折叠状态卡（名称 + 状态图标：running 旋转、success/failed 对勾/叉）；thinking → 自绘折叠卡且默认折叠；error → 自绘错误警示条；status → 弱提示。折叠卡与警示条 MUST 为 chat 包自绘组件（不依赖 antd）。

#### Scenario: dsl part 渲染白名单组件

- **WHEN** dsl part 的 schema 为白名单内的 Statistic 类组件
- **THEN** 正常渲染；非白名单组件渲染受控占位

#### Scenario: tool 状态卡

- **WHEN** part 为 tool-call（status running）
- **THEN** 渲染含工具名与 running 状态的卡片，点击头部可展开/折叠

#### Scenario: thinking 折叠

- **WHEN** part 为 thinking
- **THEN** 默认折叠展示，与正文分离

### Requirement: Composer

SHALL 提供自适应高度输入框与发送：Enter 发送、Shift+Enter 换行；空文本 MUST NOT 发送；提供 onSend 回调或经 transport 驱动 turn。store 存在 pending/streaming 消息时，发送按钮 SHALL 变为停止按钮，点击 SHALL 取消当前 turn（assistant 消息以 cancelled 收尾）。

#### Scenario: 发送消息

- **WHEN** 输入文本并按 Enter
- **THEN** onSend 被以该文本调用，输入框清空

#### Scenario: 空文本不发送

- **WHEN** 输入为空白按 Enter
- **THEN** onSend 不被调用

#### Scenario: 流式中停止

- **WHEN** assistant 消息流式进行中点击停止按钮
- **THEN** 当前 turn 被取消，该消息状态变为 cancelled

## ADDED Requirements

### Requirement: 平滑流式渲染

chat 包 SHALL 提供 `useSmoothStreamText(content, isStreaming, options?)` hook：streaming 期间经 requestAnimationFrame 按 backlog 自适应速率逐步揭示文本（打字机效果）；流停止后立即对齐全文；内容回缩时立即回退；`enabled: false` 时直通原文。ChatView 的 text/markdown part 在消息 streaming 期间 SHALL 经该 hook 渲染。

#### Scenario: 打字机揭示

- **WHEN** streaming 消息的内容一次性追加 200 字符
- **THEN** 可见文本逐帧增长而非瞬时全量，最终与内容一致

#### Scenario: 流停止对齐

- **WHEN** isStreaming 由 true 变 false 时可见文本落后于内容
- **THEN** 下一帧内可见文本对齐全文

### Requirement: 自动滚动

chat 包 SHALL 提供 `useChatAutoScroll` hook 并接入 ChatView 消息区：跟随期间将 scrollTop 钉在底部；用户上翻超过约 80px SHALL 释放跟随，回到底部附近 SHALL 恢复；释放跟随且流式进行中 SHALL 显示"回到底部"浮动按钮，点击恢复跟随。

#### Scenario: 流式跟随

- **WHEN** 流式追加内容且用户未上翻
- **THEN** 消息区始终滚动到底部

#### Scenario: 上翻释放与恢复

- **WHEN** 用户向上滚动超过阈值
- **THEN** 停止跟随；点击"回到底部"后恢复跟随并滚到底部

### Requirement: 消息操作条

assistant 消息 hover 时 SHALL 显示操作条，至少提供复制（将消息全部 text/markdown part 文本写入剪贴板并给出已复制反馈）。

#### Scenario: 复制消息

- **WHEN** hover assistant 消息并点击复制按钮
- **THEN** 剪贴板收到该消息文本，按钮呈现已复制态
