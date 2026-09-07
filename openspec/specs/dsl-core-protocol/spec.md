# Spec: dsl-core-protocol

## Purpose

DSL 核心协议模块（`@pactor-app/core`），提供与 React 无关的 DSL 类型定义与通用 Registry 实现，是框架所有上层包的契约基座。


## Requirements

### Requirement: DslNode 核心节点类型

模块 SHALL 定义 `DslNode` 接口作为 UI DSL 树的基础节点，包含可选 `id`、必填 `type`、可选 `props`、可选 `children`、可选 `events`（映射到单个或多个 Action 配置）、可选 `permission`、可选 `when` 条件配置。`children` 为 `DslChildren`：内联节点数组（**元素可为 DslNode 或 DslSourceRef，允许混排**）或整体 `DslSourceRef`（远端加载 DslNode[] 子树）。

#### Scenario: 构造合法 UI 树

- **WHEN** 开发者使用 `DslNode` 类型描述包含嵌套 children、events 与 when 条件的组件树
- **THEN** TypeScript 编译通过，且所有字段类型与设计文档第 11 节定义一致

#### Scenario: 缺少 type 字段的节点被拒绝

- **WHEN** 开发者构造缺少 `type` 字段的节点对象并赋值给 `DslNode`
- **THEN** TypeScript 编译报错

#### Scenario: children 为动态引用形态

- **WHEN** 节点的 `children` 赋值为 `{ source: { type: 'http', request: { url: '/api/dsl/list' } } }`
- **THEN** TypeScript 编译通过

#### Scenario: children 数组混排内联节点与动态引用

- **WHEN** 节点的 `children` 为 `[{ type: 'Alert' }, { source: { type: 'service', service: 'dsl.x' } }, { type: 'Button' }]`
- **THEN** TypeScript 编译通过

### Requirement: DSL 文档结构类型

模块 SHALL 定义 Page DSL、Fragment DSL、Application DSL 的根结构类型。Page DSL MUST 包含 `dsl` 版本字段、`page` 元信息（`id`、`title`、`name`、`description`、`type`），并支持可选的 `requires`、`meta`（页面扩展元数据，自由键值）、`state`、`dataSources`、`actions`（页面级命名动作定义）、`components`（页面级命名组件子树，供 `component` 引用节点复用；值可为 `DslNode` 或 `DslSourceRef`——远端惰性加载子树）、`lifecycle`、`body`、`children` 字段。

`body`（单个 DslNode）与根级 `children`（`DslChildren`）为 UI 树的声明形态：`body` 存在时 MUST 优先使用 `body`；`body` 缺失且 `children` 存在时 MUST 以根级 `children` 作为 UI 树（隐式片段根，无需任何包装节点）；两者均缺失时按空树处理。根级 `children` 数组的元素与节点级 `children` 一致，可为 DslNode 或 DslSourceRef 混排。

模块 SHALL 导出 `resolveRootNodes(pageDsl)` 工具函数作为读取 UI 树根元素列表的官方入口：返回 `[body]`（body 存在时）；根级 `children` 为数组时返回该数组（元素可为引用）；根级 `children` 为整体 `DslSourceRef` 或缺失时返回空数组（整体引用形态由渲染入口解析）。

#### Scenario: 完整 Page DSL 类型检查

- **WHEN** 开发者声明包含 `dsl`、`requires`、`page`、`meta`、`state`、`dataSources`、`lifecycle`、`body` 的完整 Page DSL 对象
- **THEN** TypeScript 编译通过

#### Scenario: 缺少 dsl 版本字段被拒绝

- **WHEN** 开发者声明缺少 `dsl` 字段的 Page DSL 对象
- **THEN** TypeScript 编译报错

#### Scenario: 根级 children 形态类型检查

- **WHEN** 开发者声明不含 `body`、仅含根级 `children: DslNode[]` 的 Page DSL 对象
- **THEN** TypeScript 编译通过

#### Scenario: 根级 children 与 components 值的动态引用形态

- **WHEN** 根级 `children` 为 `DslSourceRef`，或 `components.banner` 为 `DslSourceRef`
- **THEN** TypeScript 编译通过

#### Scenario: 根级 children 数组混排引用元素

- **WHEN** 根级 `children` 为 `[{ type: 'Alert' }, { source: { type: 'http', request: { url: '/api/dsl/x' } } }]`
- **THEN** TypeScript 编译通过，且 `resolveRootNodes` 原样返回该数组

#### Scenario: resolveRootNodes 优先级

- **WHEN** 文档同时含 `body` 与根级 `children`
- **THEN** `resolveRootNodes` 返回 `[body]`，根级 `children` 被忽略

#### Scenario: resolveRootNodes 空树与整体动态形态

- **WHEN** 文档既无 `body` 也无根级 `children`，或根级 `children` 为整体 `DslSourceRef`
- **THEN** `resolveRootNodes` 返回空数组

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

### Requirement: DslSourceRef 动态引用类型

模块 SHALL 定义 `DslSourceRef` 类型：`{ source, placeholder? }`，其中 `source` 为二选一形态——`{ type: 'service', service: string, params?: Record<string, unknown> }`（经 ServiceRegistry 调用）或 `{ type: 'http', request: { method?, url, params?, headers? } }`（经 HttpAdapter 请求）；`placeholder` 为可选 DslNode，解析期间渲染。`params` 中值可含表达式字符串（按首次解析时作用域求值一次）。

#### Scenario: service 形态类型检查

- **WHEN** 声明 `{ source: { type: 'service', service: 'dsl.detailSection' } }`
- **THEN** TypeScript 编译通过

#### Scenario: http 形态类型检查

- **WHEN** 声明 `{ source: { type: 'http', request: { url: '/api/dsl/banner' } }, placeholder: { type: 'Alert' } }`
- **THEN** TypeScript 编译通过
