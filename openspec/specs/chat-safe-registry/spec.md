# Spec: chat-safe-registry

Chat DSL 白名单与 capability 动作（`@pactor/chat`，设计文档第 63、64、73、81.4、81.5 节）。

### Requirement: Safe Registry

`createSafeRegistry(source, allowed)` SHALL 返回白名单过滤的 Registry：仅同时存在于 `allowed` 与 source 的类型可 get/has；`list()` 返回交集。LLM 生成的 DSL MUST 经 Safe Registry 渲染，未命中类型渲染受控占位而非真实组件。

#### Scenario: 白名单过滤

- **WHEN** source 注册 Card/Table/Button，allowed 为 ['Card','Table']
- **THEN** get('Card') 命中，get('Button') 为 undefined，list() 为 ['Card','Table']

#### Scenario: Chat DSL 拦截

- **WHEN** 以 Safe Registry 渲染含非白名单组件的 dsl part
- **THEN** 该节点渲染受控"不允许"占位

### Requirement: capability 动作

SHALL 提供 `registerCapabilityAction(actions, { capabilities, permission, confirm? })` 注册 `capability` 动作，执行链 MUST 为：查 CapabilityRegistry（未注册受控失败）→ capability.permission 经 PermissionAdapter 检查（拒绝受控失败）→ capability.risk 为 'high' 且有 confirm 时先确认（取消返回 skipped）→ 执行并返回结果。

#### Scenario: 正常执行

- **WHEN** 注册 capability `strategy.applySuggestion` 并执行 `{ action: 'capability', params: { name: 'strategy.applySuggestion', params: {...} } }`
- **THEN** capability.execute 被以 params 调用，返回值作为动作 data

#### Scenario: 权限拒绝

- **WHEN** capability 声明 permission 且 PermissionAdapter 拒绝
- **THEN** execute 不被调用，返回 `{ ok: false }`

#### Scenario: 高风险确认

- **WHEN** capability 声明 `risk: 'high'`，confirm 回调取消
- **THEN** execute 不被调用，返回 skipped；confirm 确认则执行

### Requirement: Chat 作用域

DSL part 渲染的作用域 MUST 注入 `conversation`（`{ id }`）、`message`（`{ id }`）、`user`、`params`；MUST NOT 暴露浏览器全局对象（沿用表达式引擎约束）。

#### Scenario: DSL 访问 message.id

- **WHEN** dsl part 表达式引用 `${message.id}`
- **THEN** 求值为当前消息 id
