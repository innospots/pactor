# Delta: chat-view

## MODIFIED Requirements

### Requirement: Composer

SHALL 提供自适应高度输入框与发送：Enter 发送、Shift+Enter 换行；IME 合成进行中 Enter MUST NOT 发送；空文本 MUST NOT 发送；提供 onSend 回调或经 transport 驱动 turn。store 存在 pending/streaming 消息时，发送按钮 SHALL 变为停止按钮，点击 SHALL 取消当前 turn（assistant 消息以 cancelled 收尾）。附件、工具栏槽位与提及扩展点见 chat-composer-extensions。

Composer 的呈现层 SHALL 优先经 chat chrome DSL 渲染层以宿主 `ChatInput` 组件组合渲染（见 chat-chrome-dsl）：ChatInput 以非受控渲染（草稿自持、发送后自清空，用户文本不进入 DSL params），发送经 `chat.composerSubmit` 内建动作桥接回包内发送路径，输入值同步（发送钮禁用态）与 mention 检测经包裹容器的事件冒泡同步承接；附件 / chips 区与工具栏内容经 ambient registry 注册的 chat 内部组件供给。无 renderer 环境或类型缺失时回退 chat 手写呈现，两条路径的交互语义 MUST 一致。

#### Scenario: 发送消息

- **WHEN** 输入文本并按 Enter
- **THEN** onSend 被以该文本调用，输入框清空

#### Scenario: 空文本不发送

- **WHEN** 输入为空白按 Enter
- **THEN** onSend 不被调用

#### Scenario: 流式中停止

- **WHEN** assistant 消息流式进行中点击停止按钮
- **THEN** 当前 turn 被取消，该消息状态变为 cancelled
