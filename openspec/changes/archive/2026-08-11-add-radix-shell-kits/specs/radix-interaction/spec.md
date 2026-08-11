# Spec: radix-interaction

OverlayHost 与 InteractionProvider 的 Radix 实现（`pactor-interaction-radix`），与 pactor-interaction（antd 版）契约一致。

## ADDED Requirements

### Requirement: RadixOverlayHost

SHALL 提供 `RadixOverlayHost`，props 契约复用 pactor-interaction 的 `OverlayHostProps`（`manager` / `resolvePage?`）：订阅 OverlayManager 堆栈；type 为 modal 用 Radix Dialog 渲染、drawer 用自绘侧边面板渲染；应用 title/width；UI 取消（X/遮罩/Escape）MUST 触发取消语义 close（`{ success: false }`）。content DSL 经 runtime 渲染上下文渲染并注入 `{ params, parent }` 作用域；page 类型经 `resolvePage` 加载渲染；未注入 resolvePage 时渲染受控错误提示。

#### Scenario: 渲染 modal 与取消语义

- **WHEN** manager.open({ type: 'modal', title: '用户详情', content }) 后点击关闭
- **THEN** 出现标题为"用户详情"的对话框；关闭后 open Promise resolve `{ success: false }`

#### Scenario: drawer 渲染

- **WHEN** open type 为 drawer 的条目
- **THEN** 渲染侧边面板（`.pcr-drawer-*` 语义 class）

#### Scenario: content params 作用域

- **WHEN** content 引用 `${params.id}` 且 open params.id 为 7
- **THEN** 渲染结果中该表达式求值为 7

#### Scenario: 未注入 resolvePage

- **WHEN** 未注入 resolvePage 打开 page 类型 overlay
- **THEN** 渲染受控错误提示，不抛未捕获异常

### Requirement: RadixInteractionProvider

SHALL 提供 `RadixInteractionProvider`，props 契约复用 `InteractionProviderProps`：mount 时向 UiBridge 注入自绘的 `modal.confirm`（门户确认对话框，onOk/onCancel 回调后关闭）与 `message.{success,error,info,warning}`（toast 栈，自动消失）；unmount 清空。

#### Scenario: confirm 动作经 Radix 确认框

- **WHEN** 挂载 Provider 后执行 confirm 动作并点击确定
- **THEN** 出现确认对话框，动作返回 `{ ok: true, data: true }`

#### Scenario: message 动作经 toast

- **WHEN** 执行 `{ action: 'message', params: { type: 'success', text: '保存成功' } }`
- **THEN** 出现含"保存成功"的 toast

### Requirement: 不依赖 antd

包 MUST NOT 依赖 antd；构建产物 MUST NOT 引用 `antd`；样式经 `styles.css`（`.pcr-*` class）提供且 exports 暴露 `./styles.css`。

#### Scenario: 依赖检查

- **WHEN** 检查 package.json 与构建产物
- **THEN** dependencies 无 antd，产物无 `from 'antd'` 引用
