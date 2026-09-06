# Delta: chat-safe-registry

## MODIFIED Requirements

### Requirement: Safe Registry

`createSafeRegistry(source, allowed)` SHALL 返回白名单过滤的 Registry：仅同时存在于 `allowed` 与 source 的类型可 get/has；`list()` 返回交集。LLM 生成的 DSL MUST 经 Safe Registry 渲染，未命中类型渲染受控占位而非真实组件。DSL 守卫对动态引用（DslSourceRef）一律拒绝：children 为整体引用时该节点替换为受控占位；children **数组中混排的引用元素** MUST 替换为受控占位节点（内联元素照常递归守卫）——远端内容无法静态过白名单。

#### Scenario: 白名单过滤

- **WHEN** source 注册 Card/Table/Button，allowed 为 ['Card','Table']
- **THEN** get('Card') 命中，get('Button') 为 undefined，list() 为 ['Card','Table']

#### Scenario: Chat DSL 拦截

- **WHEN** 以 Safe Registry 渲染含非白名单组件的 dsl part
- **THEN** 该节点渲染受控"不允许"占位

#### Scenario: children 数组中的引用元素被替换为占位

- **WHEN** 白名单内节点的 children 数组为 `[内联节点, { source: {...} }]`
- **THEN** 内联节点保留，引用元素替换为受控"不允许"占位
