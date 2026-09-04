# Tasks: add-dynamic-dsl-loading

## 1. 核心类型（@pactor-app/core）

- [x] 1.1 `node.ts` 新增 `DslSourceRef` 类型；`DslNodeBase.children` 拓宽为 `DslNode[] | DslSourceRef`
- [x] 1.2 `document.ts`：PageDsl 根级 `children` 拓宽为 `DslNode[] | DslSourceRef`；`components` 值拓宽为 `DslNode | DslSourceRef`；`resolveRootNodes` 对引用形态返回 `[]`；新增 `isDslSourceRef` 类型守卫
- [x] 1.3 单测：类型形态 + resolveRootNodes 对引用形态的行为

## 2. Schema（@pactor-app/schema）

- [x] 2.1 新增 `DslSourceRef` JSON Schema；节点 children / 根级 children / components 值接入二选一校验
- [x] 2.2 导出 `validateDslNode` / `validateDslNodes` 便利函数
- [x] 2.3 单测：各位置引用形态通过与拒绝、validateDslNode(s) 行为

## 3. 运行时解析与渲染（@pactor-app/runtime）

- [x] 3.1 `RuntimeContext` 新增 `dslSources` 解析器（service/http 分派、首次作用域求值、Promise 级缓存去重、结果经 schema 校验）
- [x] 3.2 renderer 内部 `DslSourceBoundary`：loading 渲染 placeholder（缺省空）、成功按位置语义渲染、失败 warn + 空；`renderChildrenOf` 与命名组件引用接入
- [x] 3.3 渲染入口（`render()` / `PageRuntimeView`）：根级 children 为引用时渲染边界
- [x] 3.4 单测：缓存去重、占位/成功/失败三态、作用域求值一次、循环引用守卫不受影响

## 4. PactorPage（@pactor-app/app）

- [x] 4.1 `PactorPageProps.page` 拓宽为 `PageDsl | DslSourceRef`；EmbeddedPage 先解析+校验再创建运行时，失败走既有 error 态 / onError / 重试
- [x] 4.2 单测：引用形态加载渲染、失败重试重新请求

## 5. CLI 与工具链

- [x] 5.1 `walkDslTree` / `walkPageTrees` 跳过引用形态 children 的递归；lint 表达式检查覆盖 ref 内 params 字符串；inspect 输出标记 `source(service|http)`
- [x] 5.2 单测/手工验证：含引用形态的示例 DSL 经 validate/lint 无误报

## 6. 文档与示例

- [x] 6.1 `docs/reference/dsl.md`：新增"动态 DSL 引用（DslSourceRef）"章节——四个支持位置、两种 source 形态、placeholder、一次性求值语义与缓存、与 dataSources 的分工
- [x] 6.2 嵌入模式文档补充 `page` 引用形态示例
- [x] 6.3（可选）next-app-example 或 admin 示例加一个远端加载区块演示

## 7. 全量验证

- [x] 7.1 `pnpm build && pnpm typecheck && pnpm test` 全绿
- [x] 7.2 `pnpm docs:build` 通过
