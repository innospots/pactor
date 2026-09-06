# Delta: page-runtime

## MODIFIED Requirements

### Requirement: 渲染入口

PageRuntime SHALL 提供渲染入口（`render()` 或 `<PageRuntimeView />` 组件），把 UI 树根交给 Renderer 渲染。UI 树根由 `resolveRootNodes(pageDsl)` 决定：`body` 存在时渲染 `body`；`body` 缺失且根级 `children` 为数组时逐个渲染各元素（元素可为 DslNode 或 DslSourceRef——引用元素经 DslSourceBoundary 异步解析；各根共享同一 Renderer context 与 engine）；根级 `children` 为整体 `DslSourceRef` 时渲染动态引用边界；无 UI 树时 MUST 渲染空内容而非报错。不得引入合成包装节点类型。

#### Scenario: 渲染 body

- **WHEN** body 为含已注册组件的节点树
- **THEN** 渲染入口输出对应 React 树

#### Scenario: 渲染根级 children

- **WHEN** PageDsl 无 `body` 字段、根级 `children` 为多个组件节点
- **THEN** 渲染入口按序输出全部子节点的 React 树，且各节点共享同一 state/data 作用域

#### Scenario: 根级 children 数组混排引用元素

- **WHEN** 根级 `children` 为 `[内联节点, 引用元素]`
- **THEN** 内联节点同步渲染，引用元素异步解析渲染，两者共享同一作用域

#### Scenario: 根级 children 为动态引用

- **WHEN** PageDsl 无 `body`、根级 `children` 为 `{ source: { type: 'service', service: 'dsl.root' } }`
- **THEN** 渲染入口异步加载并渲染远端返回的节点数组

#### Scenario: 无 UI 树

- **WHEN** PageDsl 既无 `body` 也无根级 `children`
- **THEN** 渲染为空，不抛错
