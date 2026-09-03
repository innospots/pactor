# Spec: dsl-core-protocol

DSL 核心协议模块（`@pactor-app/core`），提供与 React 无关的 DSL 类型定义与通用 Registry 实现，是框架所有上层包的契约基座。

### Requirement: DslNode 核心节点类型

模块 SHALL 定义 `DslNode` 接口作为 UI DSL 树的基础节点，包含可选 `id`、必填 `type`、可选 `props`、可选 `children`（递归 `DslNode[]`）、可选 `events`（映射到单个或多个 Action 配置）、可选 `permission`、可选 `when` 条件配置。

#### Scenario: 构造合法 UI 树

- **WHEN** 开发者使用 `DslNode` 类型描述包含嵌套 children、events 与 when 条件的组件树
- **THEN** TypeScript 编译通过，且所有字段类型与设计文档第 11 节定义一致

#### Scenario: 缺少 type 字段的节点被拒绝

- **WHEN** 开发者构造缺少 `type` 字段的节点对象并赋值给 `DslNode`
- **THEN** TypeScript 编译报错

### Requirement: DSL 文档结构类型

模块 SHALL 定义 Page DSL、Fragment DSL、Application DSL 的根结构类型。Page DSL MUST 包含 `dsl` 版本字段、`page` 元信息（`id`、`title`、`name`、`description`、`type`），并支持可选的 `requires`、`meta`（页面扩展元数据，自由键值）、`state`、`dataSources`、`actions`（页面级命名动作定义）、`components`（页面级命名组件子树，供 Fragment 引用）、`lifecycle`、`body` 字段，与设计文档第 10 节的标准根结构一致。

#### Scenario: 完整 Page DSL 类型检查

- **WHEN** 开发者声明包含 `dsl`、`requires`、`page`、`meta`、`state`、`dataSources`、`lifecycle`、`body` 的完整 Page DSL 对象
- **THEN** TypeScript 编译通过

#### Scenario: 缺少 dsl 版本字段被拒绝

- **WHEN** 开发者声明缺少 `dsl` 字段的 Page DSL 对象
- **THEN** TypeScript 编译报错

### Requirement: Action 与 Event 配置类型

模块 SHALL 定义 `ActionConfig` 类型，包含动作名 `action`、可选 `id`（命名动作，供结果引用）、可选 `params`、可选 `condition`、可选 `permission`，并支持以对象或对象数组形式挂载到 `DslNode.events` 的具名事件上。

#### Scenario: 事件挂载单个或多个动作

- **WHEN** 开发者为节点的 `events.onClick` 赋值为单个 ActionConfig 或 ActionConfig 数组
- **THEN** 两种赋值均通过 TypeScript 类型检查

#### Scenario: 命名动作声明 id

- **WHEN** 开发者为 ActionConfig 设置 `id: 'loadDetail'`
- **THEN** TypeScript 编译通过，该 id 可用于表达式作用域 `actions.loadDetail` 引用执行结果

### Requirement: Condition 与 Permission 配置类型

模块 SHALL 定义 `ConditionConfig`（支持表达式字符串）与 `PermissionConfig` 类型，用于节点的 `when` 与 `permission` 字段及 Action 配置。`PermissionConfig` MUST 支持三种形态：权限码字符串、权限码数组，或对象形式 `{ code: string | string[]; denied?: 'hidden' | 'disabled' | 'readonly' }`；模块 MUST 同时导出 `PermissionDeniedStrategy` 类型（`'hidden' | 'disabled' | 'readonly'`）。

#### Scenario: 节点级条件与权限声明

- **WHEN** 开发者为节点设置 `when: "${state.status == 'ACTIVE'}"` 与 `permission: "customer:edit"`
- **THEN** TypeScript 编译通过

#### Scenario: 对象形式权限声明

- **WHEN** 开发者为节点设置 `permission: { code: ['customer:edit', 'customer:view'], denied: 'disabled' }`
- **THEN** TypeScript 编译通过

### Requirement: 通用 Registry 实现

模块 SHALL 提供通用 `Registry<T>` 类，支持 `register`（名称 + 条目）、`get`、`has`、`unregister`、`list` 操作。重复注册同名条目 MUST 抛出错误；获取不存在的条目 MUST 返回 `undefined` 而非抛错。

#### Scenario: 注册并获取条目

- **WHEN** 调用方注册名称 `Button` 的条目后调用 `get('Button')`
- **THEN** 返回该条目，且 `has('Button')` 为 `true`

#### Scenario: 重复注册抛错

- **WHEN** 调用方对同一名称执行第二次 `register`
- **THEN** 抛出包含该名称的错误

#### Scenario: 获取未注册条目

- **WHEN** 调用方 `get` 一个从未注册的名称
- **THEN** 返回 `undefined`，不抛错

### Requirement: Runtime Scope 定义

模块 SHALL 定义运行时作用域层级类型/常量，覆盖 `global → app → page → overlay → form → component → row → event` 的作用域链（设计文档第 15 节）。

#### Scenario: 作用域层级可用

- **WHEN** 上层模块引用 core 导出的作用域定义
- **THEN** 可枚举到全部 8 个作用域层级，且顺序与文档定义一致

### Requirement: 零运行时依赖

`@pactor-app/core` MUST 不依赖任何第三方运行时包，也 MUST NOT 依赖 React。

#### Scenario: 依赖检查

- **WHEN** 检查 `packages/core/package.json`
- **THEN** `dependencies` 为空（或不存在），且不包含 `react`
