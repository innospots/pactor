# Spec Delta: application-shell（应用级槽位）

## ADDED Requirements

### Requirement: 应用级 providers 槽位

`createPactorApplication` SHALL 支持 `providers?: ComponentType<{ children?: ReactNode }>`：该组件在 Router 之内、InteractionKit 之外包装应用内容（业务 ConfigProvider / 全局 Context 由此进入应用树，message/modal/overlay 均消费其上下文）。缺省不包装。

#### Scenario: providers 包装应用

- **WHEN** 传入 providers 组件
- **THEN** 应用内容被该组件包装，其 Context 对页面 DSL 渲染树可见

#### Scenario: 缺省不包装

- **WHEN** 未传 providers
- **THEN** 应用结构与不传时一致，无额外包装层

### Requirement: headerExtra 头部插槽

`createPactorApplication` SHALL 支持 `headerExtra?: ReactNode`：admin 布局时透传为布局的 headerExtra（头部右侧插槽）。

#### Scenario: 头部插槽渲染

- **WHEN** 传入 headerExtra 且布局为 admin
- **THEN** 头部右侧渲染该内容
