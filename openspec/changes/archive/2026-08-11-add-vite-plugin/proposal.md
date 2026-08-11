# Proposal: add-vite-plugin

## Why

设计文档第 34、85 节：YAML 是 DSL 的开发/编辑格式，构建期转换为 JSON 供 Runtime 消费；对于需要本地 DSL 的项目，通过 Vite 插件实现 `import page from './user-list.page.yaml'`——解析 → 校验 → 编译为 JS 模块。主推荐模式仍是 Runtime API 动态加载，本地 DSL 是补充路径（适合强类型联调、版本随代码管理的页面）。本变更落地 `pactor-vite-plugin`。

## What Changes

- 新增 `pactor-vite-plugin` 包（`packages/vite-plugin`），dependencies：`pactor-core`、`pactor-schema`、`yaml`；peerDependencies：`vite >=5`。
- **插件 `pactor()`**（默认导出 + 具名导出）：
  - `transform` 钩子处理 `*.page.yaml` / `*.page.yml`（PageDsl）与 `*.fragment.yaml` / `*.fragment.yml`（FragmentDsl）：YAML 解析 → pactor-schema 校验（page 类）→ 编译为 `export default {…}` 的 JS 模块（附 `dslVersion` 具名导出）。
  - 校验失败或 YAML 语法错误：构建期报错，信息含文件名与结构化校验错误（path/message）。
  - 选项：`include?`（自定义匹配规则）、`validate?: boolean`（默认 true，可关闭校验仅编译）。
  - HMR：`handleHotUpdate` 使 DSL 文件修改在 dev 时热更新（使模块失效并触发重载）。
- 单元测试（直接调用插件钩子）+ 一个 vite build 集成测试（临时 fixture 工程）。
- 文档站新增 pactor-vite-plugin 模块页（含与 StaticDslLoader 的组合用法）。

## Capabilities

### New Capabilities

- `vite-plugin-dsl`: YAML DSL 导入转换（page/fragment）、构建期校验、选项与 HMR。

### Modified Capabilities

（无。）

## Impact

- **新增代码**：`packages/vite-plugin`；不修改既有包。
- **新依赖**：`yaml`（运行时依赖）；`vite` 为 peer（devDep 用于集成测试）。
- **定位**：本地 DSL 补充路径；Runtime API 动态加载仍是主推荐模式（文档注明）。
