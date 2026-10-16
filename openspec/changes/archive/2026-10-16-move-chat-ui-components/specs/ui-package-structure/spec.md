# Delta: ui-package-structure

## MODIFIED Requirements

### Requirement: ui-* 单元整合

UI 相关包 SHALL 收敛为唯一单元 `@pactor-app/ui`（packages/ui），包含 components / interaction / layout 三层。12 组件 props 契约类型、交互核心（`OverlayManager` / `createUiBridge` / `registerInteractionActions` / `UiBridge` / `InteractionProviderProps` / `OverlayHostProps`）与布局类型、`resolveLayout` SHALL 归属 `@pactor-app/ui`。

Chat 展示组件（18 个，见 chat-ui-components）SHALL NOT 归属 `@pactor-app/ui`；其导出与 DSL 注册归属 `@pactor-app/chat`。`createComponentRegistry` 的 `builtinComponents` MUST NOT 内置 chat 展示组件类型；`@pactor-app/ui` MUST NOT 依赖 `@pactor-app/chat`（依赖方向保持 ui ← chat 单向）。

#### Scenario: 唯一单元

- **WHEN** 查看 packages/ 目录与 pnpm workspace
- **THEN** 仅存在 packages/ui 一个 UI 包，ui-antd / ui-radix 目录不存在，workspace 解析无残留引用

#### Scenario: ui 无 chat 组件残留

- **WHEN** 检索 `packages/ui/src` 下 `components/chat` 目录、对 `@pactor-app/chat` 的 import、以及 `builtinComponents` 中 ChatPage/Bubble/Composer 等 chat 类型注册
- **THEN** 均无匹配

### Requirement: 主子路径入口

`@pactor-app/ui` SHALL 提供主入口（导出三层全部公开 API）与子路径入口：`/components`、`/interaction`、`/layout`、`/ui`（vendored shadcn 原语组件——Button/Input/Card/Dialog/Popover/Select 等 `src/ui/` 公开导出符号，供宿主构建自定义槽位 UI 与业务组件，视觉随语义令牌皮肤；各子路径均含 types/import/require 条件），以及 `./styles.css` 样式导出（sideEffects 标记）。主入口与 `/components` MUST NOT 再导出 chat 展示组件（ChatPage/Bubble/Composer 等 18 个）；这些组件由 `@pactor-app/chat/components` 提供。

#### Scenario: 子路径导入

- **WHEN** 以 `@pactor-app/ui/components` 导入 createComponentRegistry、以 `@pactor-app/ui/interaction` 导入 OverlayManager、以 `@pactor-app/ui/layout` 导入 resolveLayout、以 `@pactor-app/ui/ui` 导入 Button 等原语组件
- **THEN** 均可正常导入使用

#### Scenario: chat 组件不再从 ui 导出

- **WHEN** 检索 `@pactor-app/ui` 主入口与 `/components` 的导出符号
- **THEN** 不含 ChatPage、Bubble、Composer、MessageList 等 18 个 chat 展示组件
