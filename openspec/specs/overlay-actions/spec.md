# Spec: overlay-actions

## Purpose

Overlay 相关动作注册与命名动作结果作用域（`pactor-ui-antd` interaction 层 + core/runtime 扩展）。


## Requirements

### Requirement: ActionConfig.id 与 actions 作用域

@pactor-app/core 的 `ActionConfig` SHALL 支持可选 `id`。@pactor-app/runtime 的 Action 引擎 SHALL 把命名动作的结果数据记录到表达式作用域 `actions`：`actions.<id>` 为成功时动作的返回数据，失败时为 `{ ok: false, error }`；未命名动作行为不变。

#### Scenario: 命名动作结果可引用

- **WHEN** 执行 `{ id: 'editResult', action: 'overlay.open', ... }` 并以 `{ success: true }` 关闭
- **THEN** 后续动作中 `${actions.editResult.success}` 求值为 true

#### Scenario: 未命名动作无结果记录

- **WHEN** 执行无 id 动作
- **THEN** 作用域 actions 中无新增键，行为与此前一致

### Requirement: overlay.open / overlay.close 动作

SHALL 提供 `registerInteractionActions(actions, manager, ui)` 注册：`overlay.open` 以 params.overlay（表达式求值后）打开并以 close payload 作为动作 data 返回；`overlay.close` 按 params.id（缺省栈顶）与 params.payload 关闭。

#### Scenario: DSL 打开并分支

- **WHEN** DSL 依次执行 overlay.open（id 命名）与 if（condition 引用 actions.<id>.success）
- **THEN** close payload 为 `{ success: true }` 时 if 的 then 分支执行

#### Scenario: overlay.close 缺省关栈顶

- **WHEN** 执行 `{ action: 'overlay.close', params: { payload: { success: true } } }`
- **THEN** 栈顶 overlay 关闭且其 open Promise resolve 该 payload

### Requirement: confirm 动作

`confirm` SHALL 以 params.title/content 调用 antd Modal.confirm，确认返回 data 为 true，取消为 false。

#### Scenario: 确认与取消

- **WHEN** 用户在 confirm 弹窗点击确认
- **THEN** 动作返回 `{ ok: true, data: true }`；点击取消返回 data 为 false

### Requirement: message 动作

`message` SHALL 以 params.messageType（success/error/info/warning，缺省 info）与 params.text 调用 message 实现；params.type 保留为兼容别名（messageType 与 type 同时存在时 messageType 优先）。推荐 messageType：params 带 `type` 键会触发动作引擎 isOpaque 约定（视作内嵌 DslNode），导致 params 内的 `${...}` 表达式跳过求值。UiBridge 未注入 UI 实例时 MUST 返回受控失败而非抛出。

#### Scenario: 显示成功消息

- **WHEN** 执行 `{ action: 'message', params: { messageType: 'success', text: '保存成功' } }`
- **THEN** message.success 被以"保存成功"调用

#### Scenario: type 兼容别名

- **WHEN** 执行 `{ action: 'message', params: { type: 'success', text: '保存成功' } }`
- **THEN** message.success 被以"保存成功"调用（行为与 messageType 一致）

#### Scenario: 未挂载 Provider

- **WHEN** 未挂载 InteractionProvider 执行 message 动作
- **THEN** 返回 `{ ok: false }` 受控失败
