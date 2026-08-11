# Spec: ui-package-structure

UI 包整合结构（`pactor-ui-antd` / `pactor-ui-radix` 两个单元）。

## ADDED Requirements

### Requirement: 两个 ui-* 单元

UI 相关包 SHALL 整合为 `pactor-ui-antd` 与 `pactor-ui-radix` 两个包：各自包含 components / interaction / layout 三层实现；旧包 `pactor-components`、`pactor-interaction`、`pactor-layout`、`pactor-components-radix`、`pactor-interaction-radix`、`pactor-layout-radix` MUST 被删除。

#### Scenario: 旧包不存在

- **WHEN** 查看 packages/ 目录与 pnpm workspace
- **THEN** 六个旧包目录不存在，workspace 解析无残留引用

### Requirement: 主子路径入口

每个 ui-* 包 SHALL 提供主入口（导出三层全部公开 API + `antdUiKit`/`radixUiKit` 预设）与子路径入口：`/components`、`/interaction`、`/layout`（各含 types/import/require 条件）。

#### Scenario: 子路径导入

- **WHEN** 以 `pactor-ui-antd/components` 导入 createBuiltinComponentRegistry、以 `pactor-ui-antd/interaction` 导入 OverlayManager、以 `pactor-ui-antd/layout` 导入 AdminLayout
- **THEN** 均可正常导入使用（radix 侧同构）

### Requirement: 公开符号保留

整合 MUST NOT 改变任何公开符号的名称与语义：12 个组件类型名与 props 契约、`create*Registry` / `register*`、`OverlayManager` / `createUiBridge` / `registerInteractionActions`、`AdminLayout` / 基础布局 / `resolveLayout`、`antdUiKit` / `radixUiKit` 等全部保留，仅导入路径变化。

#### Scenario: 既有测试全部保留通过

- **WHEN** 迁移后运行全量测试
- **THEN** 原六个包的全部测试用例（更新导入后）通过，无用例删除

### Requirement: radix 侧契约引用

pactor-ui-radix 对组件契约类型与交互核心的引用 SHALL 指向 `pactor-ui-antd`（类型 type-only；OverlayManager 等交互核心为运行时依赖），且 MUST NOT 引入 antd 运行时引用（无 `from 'antd'`）。

#### Scenario: 无 antd 引用

- **WHEN** 检查 pactor-ui-radix 构建产物
- **THEN** 不含 `from 'antd'` 引用

### Requirement: 依赖方改接

pactor-app MUST 改为依赖 `pactor-ui-antd`（devDep `pactor-ui-radix`）；pactor-chat 的测试依赖改为 `pactor-ui-antd`；根 package.json 无已删包引用。

#### Scenario: 应用层行为不变

- **WHEN** 运行 pactor-app 全部测试（含 ui 预设切换）
- **THEN** 全部通过，行为与整合前一致
