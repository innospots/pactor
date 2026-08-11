# Tasks: add-foundation-modules

## 1. Monorepo 工程骨架

- [x] 1.1 初始化根 `package.json`（name `pactor`、private、`engines: node>=18 / pnpm>=9`）、`pnpm-workspace.yaml`（包含 `packages/*`）、`.gitignore`
- [x] 1.2 添加根级共享 `tsconfig.base.json`（strict、ES2020+、declaration）与各包继承约定
- [x] 1.3 安装根开发依赖：typescript、tsup、vitest
- [x] 1.4 在根 README 注明框架名 pactor、`pactor-*` 无 scope 包命名约定及构建/测试命令
- [x] 1.5 验证骨架：`pnpm install` 成功

## 2. pactor-core（packages/core）

- [x] 2.1 创建包骨架：`package.json`（`pactor-core`，零 dependencies）、`tsconfig.json`、tsup 配置、`src/index.ts`
- [x] 2.2 实现 `DslNode` 及配套类型：`ActionConfig`、`ConditionConfig`、`PermissionConfig`、`EventMap`（对应 spec dsl-core-protocol 的 DslNode/Action/Condition/Permission 需求）
- [x] 2.3 实现 DSL 文档结构类型：`PageDsl`（`dsl`/`requires`/`page`/`state`/`dataSources`/`lifecycle`/`body`）、`FragmentDsl`、`ApplicationDsl`、`DataSourceConfig`、生命周期事件名类型
- [x] 2.4 实现 Runtime Scope 定义（global→app→page→overlay→form→component→row→event 常量与类型）
- [x] 2.5 实现通用 `Registry<T>` 类：register/get/has/unregister/list，重复注册抛错、get 未注册返回 undefined
- [x] 2.6 编写单测：Registry 全部行为、关键类型编译期断言（可用 vitest + 类型测试样例）
- [x] 2.7 验证：`pnpm --filter pactor-core test` 与 `build` 通过，确认包无运行时依赖

## 3. pactor-schema（packages/schema）

- [x] 3.1 创建包骨架：`package.json`（依赖 `ajv`、`pactor-core: workspace:*`）、tsconfig、tsup 配置
- [x] 3.2 导出 DSL 版本常量 `DSL_VERSION = "1.0"`
- [x] 3.3 编写 DslNode JSON Schema（children 递归、events、permission、when、props）
- [x] 3.4 编写 Page DSL 根结构 JSON Schema（`dsl`/`requires`/`page`/`state`/`dataSources`/`lifecycle`/`body`，含 requires 版本范围字符串格式）
- [x] 3.5 实现基于 Ajv 的 `validatePageDsl` 校验器，输出结构化错误 `{ path, message, keyword }[]`，不暴露 Ajv 原始错误
- [x] 3.6 编写单测：合法文档通过、缺少 dsl/page.id 失败、节点缺 type 失败且路径正确、多错误聚合、requires 类型非法失败
- [x] 3.7 验证：`pnpm --filter pactor-schema test` 与 `build` 通过

## 4. pactor-expression（packages/expression）

- [x] 4.1 创建包骨架：`package.json`（零运行时依赖，仅 `pactor-core: workspace:*`）、tsconfig、tsup 配置
- [x] 4.2 实现 tokenizer 与 recursive descent parser，仅支持 Literal/Identifier/MemberExpression/BinaryExpression/LogicalExpression/UnaryExpression/ConditionalExpression/CallExpression，非法语法抛结构化错误（含位置）
- [x] 4.3 实现 AST 求值器：作用域对象解析、缺失路径返回 undefined、逻辑短路、三元分支
- [x] 4.4 实现 Function Registry 与白名单调用约束：仅直接 Identifier callee；拒绝 MemberExpression 方法调用；未注册函数受控失败
- [x] 4.5 实现 `${...}` 模板层：整体单表达式保留原始类型、混合模板拼接字符串、非表达式字符串原样返回
- [x] 4.6 编写单测：操作符优先级、短路求值、三元嵌套、模板三种形态、白名单函数、拒绝 `obj.method()`、全局对象不可达（window/fetch 解析为 undefined）、静态确认无 `eval(`/`new Function`
- [x] 4.7 验证：`pnpm --filter pactor-expression test` 与 `build` 通过

## 5. 整体验收

- [x] 5.1 `pnpm -r build` 全部包构建成功（ESM + CJS + d.ts）
- [x] 5.2 `pnpm -r test` 全部测试通过
- [x] 5.3 检查依赖方向：pactor-core 无依赖，pactor-schema 仅依赖 core，pactor-expression 仅依赖 core；无环形依赖
- [x] 5.4 用设计文档第 10 节的 Page DSL 示例做一次 schema 校验 + 表达式求值的跨包冒烟验证
