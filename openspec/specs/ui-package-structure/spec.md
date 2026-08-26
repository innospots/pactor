# Spec: ui-package-structure

UI 包结构（唯一单元 `pactor-ui`）。

### Requirement: ui-* 单元整合

UI 相关包 SHALL 收敛为唯一单元 `pactor-ui`（packages/ui，shadcn 实现），包含 components / interaction / layout 三层。`pactor-ui-antd` 与 `pactor-ui-radix` 两个包 MUST 被删除；12 组件 props 契约类型、交互核心（`OverlayManager` / `createUiBridge` / `registerInteractionActions` / `UiBridge` / `InteractionProviderProps` / `OverlayHostProps`）与布局类型、`resolveLayout` SHALL 迁入 `pactor-ui`，符号名与语义不变。

#### Scenario: 唯一单元

- **WHEN** 查看 packages/ 目录与 pnpm workspace
- **THEN** 仅存在 packages/ui 一个 UI 包，ui-antd / ui-radix 目录不存在，workspace 解析无残留引用

### Requirement: 主子路径入口

`pactor-ui` SHALL 提供主入口（导出三层全部公开 API + `shadcnUiKit` 预设）与子路径入口：`/components`、`/interaction`、`/layout`（各含 types/import/require 条件），以及 `./styles.css` 样式导出（sideEffects 标记）。

#### Scenario: 子路径导入

- **WHEN** 以 `pactor-ui/components` 导入 createShadcnComponentRegistry、以 `pactor-ui/interaction` 导入 OverlayManager、以 `pactor-ui/layout` 导入 resolveLayout
- **THEN** 均可正常导入使用

### Requirement: 公开符号保留

收敛 MUST NOT 改变既有公开符号的名称与语义：12 个组件类型名与 props 契约、`createShadcnComponentRegistry` / `registerShadcnComponents`、`OverlayManager` / `createUiBridge` / `registerInteractionActions`、Admin 布局 / 基础布局 / `resolveLayout`、`shadcnUiKit` 等全部保留，仅归属包变为 `pactor-ui`。`antdUiKit` / `radixUiKit` 与 antd/radix 专属符号随包删除。

#### Scenario: 迁移后测试通过

- **WHEN** 运行全量测试（导入路径更新后）
- **THEN** 全部通过，无用例丢失

### Requirement: 依赖方改接

pactor-app MUST 依赖 `pactor-ui` 并从中导入全部 UI 符号（不再依赖 ui-antd/ui-radix）；pactor-chat 的测试依赖改为 `pactor-ui`；examples 与 CLI 模板统一 `import 'pactor-ui/styles.css'`；全仓 MUST NOT 存在 `from 'antd'`、`pactor-ui-antd`、`pactor-ui-radix` 引用（依赖清单与源码）。

#### Scenario: 无遗留引用

- **WHEN** 全仓 grep `pactor-ui-antd|pactor-ui-radix|from 'antd'`
- **THEN** 源码与 package.json 中均无匹配
