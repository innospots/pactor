# Proposal: add-cli

## Why

设计文档第 84 节定义了 `pactor-cli`：本地 DSL 开发工具链（`npm install -g pactor-cli`）。vite-plugin 落地后，解析/校验能力已具备，但还缺命令行入口——DSL 作者需要脱离 Vite 工程的校验（validate）、结构查看（inspect）、静态检查（lint）、编译产物（build）、脚手架（create）与 Schema 导出（schema）。本变更落地 `pactor-cli`。

## What Changes

- 新增 `pactor-cli` 包（`packages/cli`），bin 名 `pactor`；dependencies：`pactor-core`、`pactor-schema`、`pactor-expression`、`yaml`；零 React 依赖，Node >= 18。
- **命令**（设计文档第 84 节清单，V1 裁剪 preview）：
  - `pactor validate <files...>`：校验 `.page.yaml` / `.fragment.yaml`（Schema 校验），输出结构化错误，退出码反映成败。
  - `pactor inspect <file>`：解析并输出 DSL 摘要——page id/title、组件类型树、dataSources、actions、permissions、表达式清单。
  - `pactor lint <paths...>`：静态检查（含 Schema 校验）+ 附加规则：表达式语法（用 pactor-expression 解析所有 `${...}`）、组件类型命名规范（PascalCase）、权限码格式（`resource:action`）。规则分级 error/warning。
  - `pactor schema`：输出 Page DSL 的 JSON Schema（来自 pactor-schema）到 stdout 或文件。
  - `pactor build <src> -o <dir>`：把 YAML DSL 编译为 Runtime JSON（page/fragment envelope 形态），输出目录。
  - `pactor create <name>`：脚手架生成业务工程模板（vite + react + pactor-app + 示例 page.yaml + vite 插件配置）。
- 手写极简参数解析（不引 commander/cac）。
- 测试：命令处理器为可注入 IO 的纯函数（单测覆盖各命令成功/失败/退出码）；create/build 用临时目录；一次 bin 冒烟（node dist/cli.js --help）。
- 文档站新增 pactor-cli 模块页。

## Capabilities

### New Capabilities

- `dsl-cli`: pactor CLI——validate / inspect / lint / schema / build / create 命令与退出码语义。

### Modified Capabilities

（无。）

## Impact

- **新增代码**：`packages/cli`（含 `templates/app` 模板）；不修改既有包。
- **V1 裁剪**：`preview` 不做（需 dev server 语义，后续结合 examples 工程评估）。
- **后续**：examples/admin 示例工程可直接用 `pactor create` 验证模板。
