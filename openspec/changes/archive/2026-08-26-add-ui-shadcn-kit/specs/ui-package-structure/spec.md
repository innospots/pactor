# Delta: ui-package-structure

## RENAMED Requirements

- FROM: `### Requirement: 两个 ui-* 单元`
- TO: `### Requirement: ui-* 单元整合`

## MODIFIED Requirements

### Requirement: 主子路径入口

每个 ui-* 包（`pactor-ui-antd` / `pactor-ui-radix` / `pactor-ui`）SHALL 提供主入口（导出三层全部公开 API + 各自预设 `antdUiKit`/`radixUiKit`/`shadcnUiKit`）与子路径入口：`/components`、`/interaction`、`/layout`（各含 types/import/require 条件），以及 `./styles.css` 样式导出。

#### Scenario: 子路径导入

- **WHEN** 以 `pactor-ui-antd/components` 导入 createBuiltinComponentRegistry、以 `pactor-ui/components` 导入 createShadcnComponentRegistry（其余两包同构）
- **THEN** 均可正常导入使用

### Requirement: 依赖方改接

pactor-app MUST 改为依赖 `pactor-ui`（默认实现；`pactor-ui-antd` 保留运行时依赖供类型/交互核心复用，`pactor-ui-radix` 降为 devDep）；pactor-chat 的测试依赖保持 `pactor-ui-antd`；根 package.json 无已删包引用。

#### Scenario: 应用层行为不变

- **WHEN** 运行 pactor-app 全部测试（含 ui 预设切换）
- **THEN** 全部通过，显式指定 antd/radix kit 的行为与整合前一致

## ADDED Requirements

### Requirement: pactor-ui 默认单元

`pactor-ui`（packages/ui，shadcn 实现）SHALL 成为第三个 ui-* 单元与默认实现：三层结构（components/interaction/layout）与两既有包同构；MUST NOT 引入 antd 运行时引用；对组件契约类型与交互核心的引用 SHALL 指向 `pactor-ui-antd`（类型 type-only；OverlayManager 等交互核心为运行时依赖，同 radix 先例）。

#### Scenario: 三包并存

- **WHEN** 查看 packages/ 目录
- **THEN** ui、ui-antd、ui-radix 三包并存，workspace 解析正常

#### Scenario: 无 antd 引用

- **WHEN** 检查 pactor-ui 构建产物
- **THEN** 不含 `from 'antd'` 引用
