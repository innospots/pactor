# Design: add-foundation-modules

## Context

仓库当前只有设计文档（docs/Dynamic_Application_Runtime_DSL_Framework_Design.md）和 OpenSpec 元数据，无任何代码。设计文档定义了多包 Monorepo 架构，其依赖底层为 `pactor-core ← pactor-schema ← pactor-expression`（对应附录 A 的 core ← schema ← expression）。本变更落地这三个 React 无关的基础包及 Monorepo 工程骨架，是后续所有模块的前置。

命名约定：框架名为 **pactor**，不使用 npm scope，各模块包名统一 `pactor-` 前缀（`pactor-core`、`pactor-schema`、`pactor-expression`，后续模块如 `pactor-runtime`、`pactor-router` 等以此类推）。设计文档中的 `@company/dsl-*` 为文档占位命名，实际落地以 pactor 命名为准。

约束（来自设计文档）：

- 技术栈：TypeScript、pnpm workspace、Vitest、Ajv、JSON Schema（第 8 节）。
- 表达式禁止 `eval` / `new Function`，必须基于受控 AST，只允许白名单 FunctionCall，禁止访问 window/document/fetch 等全局对象（第 16、81 节）。
- DSL 根节点强制 `dsl: "1.0"` 版本声明，支持 `requires.runtime` 等 capability 声明（第 10、37 节）。
- Registry 是核心模式：Component/Action/Service/Capability/Expression Function 均通过 Registry 管理（第 3.3、12、17、18 节）。

## Goals / Non-Goals

**Goals:**

- 建立可构建、可测试的 pnpm workspace Monorepo 骨架。
- `pactor-core`：完整的 DSL 协议 TypeScript 类型 + 通用 Registry 实现，零运行时依赖。
- `pactor-schema`：Page DSL 根结构的 JSON Schema + Ajv 校验器，输出结构化错误。
- `pactor-expression`：受控表达式引擎（parse/evaluate/白名单函数/作用域解析），覆盖第 16 节允许的 AST 节点类型。
- 三个包均有单元测试，CI 可跑 `pnpm -r test` / `pnpm -r build`。

**Non-Goals:**

- 不实现 React Renderer、RuntimeContext、DataSource 运行时、Action 执行引擎（属于 pactor-runtime）。
- 不实现 Component Schema 的逐组件 props 校验（等 pactor-components 落地后补充）。
- 不实现 YAML 解析（YAML 是开发格式，构建期由 vite-plugin/cli 转 JSON；Runtime 只消费 JSON）。
- 不发布 npm、不配置 CI/CD 流水线。

## Decisions

### D1: Monorepo 用 pnpm workspace + tsup 构建

- pnpm workspace 是设计文档第 7 节的明确推荐。
- 构建选 tsup（esbuild 封装）：每个包一行配置产出 ESM + CJS + d.ts，比手写 tsc 双产物简单。备选：纯 tsc（零额外依赖但双模块格式配置繁琐）、Rollup（配置更重）。
- 包名不使用 npm scope，统一 `pactor-` 前缀（`pactor-core` 等）；目录名保持简短（`packages/core`），包名与目录名分离。

### D2: pactor-core 纯类型 + 极小运行时，零依赖

- core 承载协议：`DslNode`、`PageDsl`、`FragmentDsl`、`ApplicationDsl`、`ActionConfig`、`ConditionConfig`、`PermissionConfig`、`DataSourceConfig`、生命周期事件名、Runtime Scope 枚举、DSL 版本类型。
- 唯一的运行时代码是通用 `Registry<T>` 类（register/get/has/unregister/list，重复注册抛错）——它是文档第 12/17/18 节所有具体 Registry 的基座，放在 core 避免各包重复实现。
- 备选：core 只放类型、Registry 放 runtime。否决理由：schema/expression 也需要 Registry（如 Function Registry 接口），放 core 可避免环形依赖。

### D3: pactor-schema 用 Ajv + 手写 JSON Schema

- 设计文档第 8 节已定 Ajv。Schema 以 JSON Schema（draft-07）手写维护，覆盖：根结构（`dsl` 版本必填、`requires`、`page`、`state`、`dataSources`、`lifecycle`、`body`）和 `DslNode` 递归结构。
- 校验器输出结构化错误：`{ path, message, keyword }` 列表，不直接抛 Ajv 原始错误对象，便于后续 CLI/DevTools 展示（对应第 94 节校验清单中的 1/2/3/4/10 项；组件存在性、Action 存在性等需要 Registry 的校验留给上层）。
- 备选：zod。否决理由：文档明确 JSON Schema + Ajv，且 JSON Schema 可随 DSL 分发供服务端/CLI 复用。

### D4: pactor-expression 自研受控 AST 解析器

- 解析流程：tokenizer → recursive descent parser → AST → interpreter。支持的 AST 节点严格限定为文档第 16.1 节白名单：Literal、Identifier、MemberExpression、BinaryExpression、LogicalExpression、UnaryExpression、ConditionalExpression、白名单 CallExpression。
- 备选：jsep（文档第 8 节列为可选）。选 自研的理由：语法子集很小（无赋值、无 new、无箭头函数），自研约几百行、零依赖，且安全边界（禁止的节点类型）由"根本不予解析"天然保证，而非解析后再黑名单过滤。
- `${...}` 处理：字符串整体恰好是一个 `${...}` 时返回表达式原始类型（保留 boolean/number/object）；字符串内嵌多个 `${...}` 时按模板拼接为字符串。这是 Server-Driven UI 的通行语义。
- 作用域：evaluate 接收普通对象作为 scope（`state`、`data`、`form`、`row`、`route`、`user` 等由调用方组装，见第 16 节上下文清单）；表达式引擎本身不认识 RuntimeContext，保持 React/运行时无关。
- FunctionCall：callee 必须是 scope 中存在的函数或经由 `FunctionRegistry` 注册的白名单函数；禁止通过 MemberExpression 链调用（如 `${obj.method()}` 不允许，避免逃逸到原型链）。Identifiers 解析不到时返回 `undefined` 而非抛错（渲染场景更宽容），语法错误在 parse 阶段抛出结构化异常。

### D5: 依赖方向严格单向

`pactor-core`（无依赖）← `pactor-schema`（依赖 core 类型）← `pactor-expression`（依赖 core 类型）。workspace 内用 `workspace:*` 协议引用。Vitest 每包独立配置，测试放各包 `tests/` 或 `src/**/*.test.ts`。

## Risks / Trade-offs

- [自研表达式解析器存在边界 bug 风险] → 用充分的单元测试覆盖操作符优先级、短路求值、三元嵌套、模板混合场景；语法子集刻意保持最小。
- [JSON Schema 与 TS 类型双份维护可能漂移] → Schema 只约束结构，TS 类型为准；在测试中用合法/非法样例双向校验，后续可由类型生成 Schema 的工具收敛。
- [`pactor-*` 为无 scope 公开包名，npm 上可能被占用] → 本变更不涉及发布；发布前先检查名称可用性，必要时再调整。
- [三个包先行但没有上层消费者，API 可能需调整] → 接受；类型设计严格对齐设计文档第 10/11/15/16/17 节的示例，减少返工。

## Migration Plan

无（全新代码）。落地顺序：工程骨架 → pactor-core → pactor-schema → pactor-expression，每个包完成后跑测试再进入下一个。

## Open Questions

- 包管理器/Node 版本基线：暂定 Node >= 18、pnpm >= 9，写入根 package.json `engines`。
- 是否需要 ESLint/Prettier 统一配置：本变更先不引入，保持骨架最小，后续单独变更补充。
