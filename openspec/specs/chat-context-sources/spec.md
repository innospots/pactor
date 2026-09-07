# Spec: chat-context-sources

## Purpose

Chat 内建上下文弹层与声明式数据源（`@pactor-app/chat`）：contexts 配置驱动 +/＠ 内建弹层，选中项成 chips 并进入 transport 输入。


## Requirements

### Requirement: contexts 声明式配置

`Chat` / `ChatWorkspace` SHALL 支持 `contexts?: ChatContextSource[]` 配置：`ChatContextSource = { trigger: '@' | '+'; label: string; items?: ChatContextItem[]; service?: string; params?: Record<string, unknown> }`。`items` 为静态候选数组；`service` 为声明式服务引用，经注入的 `ChatServices.callService(name, params)` 解析为 `ChatContextItem[]`（结果按 source 键做会话级缓存）。`ChatContextItem = { id: string; label: string; data?: unknown }`。`contexts` 缺省时 MUST NOT 渲染 "+" 入口、MUST NOT 启用内建 @ 弹层。`callService` 未注入而 source 引用 service 时，弹层 SHALL 渲染内联错误提示，不抛错。

#### Scenario: 静态数据弹层

- **WHEN** 配置 `contexts: [{ trigger: '@', label: '智能体', items: [{ id: 'a1', label: '报表助手' }] }]`，输入 `@`
- **THEN** 出现锚定弹层，列出「报表助手」

#### Scenario: service 引用经服务桥解析

- **WHEN** 配置 `source.service: 'agents'` 且宿主注入 `callService`，打开对应弹层
- **THEN** callService 以 `('agents', params)` 被调用，返回项渲染为候选列表

#### Scenario: 服务桥缺失受控降级

- **WHEN** source 引用 service 但未注入 callService，打开弹层
- **THEN** 弹层内显示错误提示，不抛错、不击穿组件树

### Requirement: 内建弹层交互与 chips 闭环

内建弹层 SHALL 为锚定弹层：按触发锚点定位，Escape / 外部点击关闭。"+" 入口仅在存在 `trigger: '+'` 的 source 时渲染；词边界 `@` 检测沿用 Composer 既有规则，命中且存在 `trigger: '@'` 的 source 时打开内建提及弹层（按 query 过滤候选）。选中候选项 SHALL 追加为 Composer 上方的上下文 chip（同 trigger 同 id 去重），chip 可单独移除；chips 状态变更 SHALL 触发 `onContextsChange(chips)` 通知。`ChatServices.onPlusMenu` / `onMentionTrigger` 提供时 MUST 优先于内建弹层（对应内建入口/弹层不启用）。

#### Scenario: 选中成 chip

- **WHEN** 在 @ 弹层中选中「报表助手」
- **THEN** Composer 上方出现对应 chip，onContextsChange 以含该项的数组被调用

#### Scenario: 调用方回调优先

- **WHEN** 同时配置 contexts 与注入 onMentionTrigger，输入 `@abc`
- **THEN** onMentionTrigger 被调用，内建提及弹层不出现

#### Scenario: 无 + 配置无入口

- **WHEN** contexts 仅含 trigger '@' 的 source
- **THEN** Composer 不渲染 "+" 按钮

### Requirement: chips 进入 transport 输入

发送消息时，当前 chips SHALL 作为 `ChatInput.contexts`（含 `id` / `label` / `trigger` / `data`）传入 `transport.send(input)`；chips 不拼接进 `input.text`。发送完成后 chips 清空（附件同款语义）并触发 `onContextsChange([])`。

#### Scenario: transport 收到上下文

- **WHEN** 选中一个 chip 后发送消息
- **THEN** transport.send 收到的 input.contexts 含该 chip（含 data），input.text 为用户原始输入

#### Scenario: 发送后清空

- **WHEN** 发送完成
- **THEN** Composer 上方 chips 清空
