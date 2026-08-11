# Proposal: add-foundation-modules

## Why

《Dynamic Application Runtime DSL Framework 设计规范》(docs/Dynamic_Application_Runtime_DSL_Framework_Design.md) 已完成架构设计，但仓库中尚无任何代码。所有上层能力（Runtime、Renderer、Router、Permission、Interaction、Chat）都依赖最底层的三个 React 无关基础包：`pactor-core`（核心协议与类型）、`pactor-schema`（Schema 与校验）、`pactor-expression`（受控表达式引擎）。按附录 A 的依赖关系（core ← schema ← expression ← runtime），必须先落地这三个基础模块，后续模块才有可依赖的契约。

## What Changes

- 初始化 pnpm workspace Monorepo 工程结构（`packages/*`、TypeScript、Vitest、构建配置）。框架命名为 **pactor**，各模块包名统一使用 `pactor-` 前缀（无 npm scope）。
- 新增 `pactor-core` 包：DSL 核心协议类型与接口，包括 `DslNode`、Page/Fragment/Application DSL 结构、Action/Event/Condition/Permission 配置类型、Registry 接口与通用 Registry 实现、Runtime Scope 定义、DSL 版本与 `requires` 声明类型。
- 新增 `pactor-schema` 包：DSL Version 常量、JSON Schema（Page DSL 根结构、DslNode、Action、DataSource、生命周期等）、基于 Ajv 的校验器与结构化校验错误。
- 新增 `pactor-expression` 包：受控表达式引擎——`${...}` 模板识别、表达式 Parse → AST → Evaluate、作用域解析（state/data/form/row/route/user 等上下文）、白名单 Function Registry；禁止 `eval`/`new Function`，禁止访问任意全局对象。

## Capabilities

### New Capabilities

- `dsl-core-protocol`: DSL 核心协议——DslNode、Page/Fragment/Application DSL 类型、Action/Event/Condition/Permission 配置、Registry 接口与实现、Runtime Scope、版本声明。
- `dsl-schema-validation`: DSL Schema 与校验——JSON Schema 定义、DSL 版本常量、Ajv 校验器与结构化错误报告。
- `dsl-expression-engine`: 受控表达式引擎——模板识别、解析、AST 求值、作用域解析、白名单函数注册与执行安全约束。

### Modified Capabilities

（无——仓库尚无既有 specs。）

## Impact

- **新增代码**：`packages/core`、`packages/schema`、`packages/expression`（包名分别为 `pactor-core`、`pactor-schema`、`pactor-expression`），以及根级 Monorepo 工程文件（`pnpm-workspace.yaml`、`package.json`、`tsconfig` 基础配置、Vitest 配置）。
- **依赖**：新增开发依赖 TypeScript、Vitest、Ajv、tsup（或 tsc 构建）；运行时依赖仅 Ajv（schema 包）。expression 包自研受控 AST 解析，不引入 eval 类能力。
- **后续模块**：`pactor-runtime` 及所有上层包将依赖本次产出的类型与引擎。
- **无破坏性变更**：仓库当前无既有代码。
