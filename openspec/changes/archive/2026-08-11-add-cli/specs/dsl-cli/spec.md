# Spec: dsl-cli

pactor CLI（`pactor-cli`）：本地 DSL 开发工具链，设计文档第 84 节。

## ADDED Requirements

### Requirement: validate 命令

`pactor validate <files...>` SHALL 逐文件解析并校验（page 走 Schema 校验，fragment 宽松检查 dsl+body）：全部通过输出汇总并退出码 0；任一失败输出 `<file>: path: message` 明细并退出码 1；无参数或文件不存在退出码 2。

#### Scenario: 合法文件通过

- **WHEN** validate 一个合法 page.yaml
- **THEN** 退出码 0，输出包含通过信息

#### Scenario: 非法文件报错

- **WHEN** validate 缺少 page.id 的文件
- **THEN** 退出码 1，输出含文件名与 `/page/id`

### Requirement: inspect 命令

`pactor inspect <file>` SHALL 输出 DSL 摘要：page id/title/type、state 键、dataSources（type/service）、组件类型计数（递归 body）、事件动作清单、permission 引用、表达式清单（收集的 `${...}`）。

#### Scenario: 输出结构摘要

- **WHEN** inspect 含两个组件与一个 dataSource 的 page.yaml
- **THEN** 输出含 page id、组件类型与计数、dataSource 名、动作与表达式条目

### Requirement: lint 命令

`pactor lint <paths...>` SHALL 对文件/目录（递归）执行：Schema 校验 + 规则 `expression-syntax`（error，解析所有 `${...}`）、`component-naming`（warning，PascalCase）、`permission-format`（warning，`resource:action` 形态）。有 error 退出码 1；仅 warning 退出码 0；输出按文件分组分级。

#### Scenario: 表达式语法错误

- **WHEN** DSL 中某 props 值为 `${state.x = }`
- **THEN** lint 报 expression-syntax error，退出码 1

#### Scenario: 仅 warning 通过

- **WHEN** 组件 type 为 `myButton`（非 PascalCase）
- **THEN** 报 component-naming warning，退出码 0

### Requirement: schema 命令

`pactor schema` SHALL 输出 Page DSL JSON Schema 到 stdout；`-o <file>` 写文件。

#### Scenario: 输出 schema

- **WHEN** 执行 pactor schema
- **THEN** 输出合法 JSON 且含 page/dsl 等关键定义

### Requirement: build 命令

`pactor build <src> -o <dir>` SHALL 递归编译 src 下 DSL 文件为 Runtime JSON（Envelope 形态：`id` / `resourceType` / `version: 1` / `dslVersion` / `schema`），写入 `<dir>/<id>.json`；校验失败的文件 MUST 报告并以退出码 1 中止。

#### Scenario: 编译输出 envelope

- **WHEN** build 含一个 page.yaml 的目录
- **THEN** 输出目录生成 `<pageId>.json`，内容含 resourceType: 'page' 与 schema 字段

### Requirement: create 命令

`pactor create <name>` SHALL 从模板生成业务工程（vite + react + pactor-app + pactor-ui-radix + pactor-vite-plugin + 示例 page.yaml + 样式导入）；目标目录已存在且非空 MUST 报错（退出码 2），不覆盖。

#### Scenario: 生成工程骨架

- **WHEN** create my-app 到空目录
- **THEN** 生成 package.json / vite.config.ts / src/main.tsx / src/pages/*.page.yaml，模板占位被替换为 my-app

#### Scenario: 非空目录拒绝

- **WHEN** 目标目录已存在且含文件
- **THEN** 报错，退出码 2，目录内容不变

### Requirement: CLI 入口与帮助

bin `pactor` SHALL 支持 `--help`（命令清单，退出码 0）与未知命令报错（退出码 2）。

#### Scenario: help

- **WHEN** 执行 `pactor --help`
- **THEN** 输出六个命令的用法，退出码 0
