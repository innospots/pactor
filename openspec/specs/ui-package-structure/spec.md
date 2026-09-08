# Spec: ui-package-structure

## Purpose

UI 包结构（唯一单元 `@pactor-app/ui`）。


## Requirements

### Requirement: ui-* 单元整合

UI 相关包 SHALL 收敛为唯一单元 `@pactor-app/ui`（packages/ui），包含 components / interaction / layout 三层。12 组件 props 契约类型、交互核心（`OverlayManager` / `createUiBridge` / `registerInteractionActions` / `UiBridge` / `InteractionProviderProps` / `OverlayHostProps`）与布局类型、`resolveLayout` SHALL 归属 `@pactor-app/ui`。

#### Scenario: 唯一单元

- **WHEN** 查看 packages/ 目录与 pnpm workspace
- **THEN** 仅存在 packages/ui 一个 UI 包，ui-antd / ui-radix 目录不存在，workspace 解析无残留引用

### Requirement: 主子路径入口

`@pactor-app/ui` SHALL 提供主入口（导出三层全部公开 API）与子路径入口：`/components`、`/interaction`、`/layout`、`/ui`（vendored shadcn 原语组件——Button/Input/Card/Dialog/Popover/Select 等 `src/ui/` 公开导出符号，供宿主构建自定义槽位 UI 与业务组件，视觉随语义令牌皮肤；各子路径均含 types/import/require 条件），以及 `./styles.css` 样式导出（sideEffects 标记）。

#### Scenario: 子路径导入

- **WHEN** 以 `@pactor-app/ui/components` 导入 createComponentRegistry、以 `@pactor-app/ui/interaction` 导入 OverlayManager、以 `@pactor-app/ui/layout` 导入 resolveLayout、以 `@pactor-app/ui/ui` 导入 Button 等原语组件
- **THEN** 均可正常导入使用

### Requirement: 依赖方改接

@pactor-app/app MUST 依赖 `@pactor-app/ui` 并从中导入全部 UI 符号；@pactor-app/chat 的测试依赖为 `@pactor-app/ui`；examples 与 CLI 模板统一 `import '@pactor-app/ui/styles.css'`；全仓 MUST NOT 存在 `from 'antd'`、`pactor-ui-antd`、`pactor-ui-radix` 引用（依赖清单与源码）。

#### Scenario: 无遗留引用

- **WHEN** 全仓 grep `pactor-ui-antd|pactor-ui-radix|from 'antd'`
- **THEN** 源码与 package.json 中均无匹配
