# Spec: ui-package-structure

## Purpose

UI 包结构（唯一单元 `@pactor-app/ui`）。
## Requirements
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

`@pactor-app/ui` SHALL 提供主入口（导出三层全部公开 API）与子路径入口：`/components`、`/interaction`、`/layout`、`/ui`（vendored shadcn 原语组件——Button/Input/Card/Dialog/Popover/Select 等 `src/ui/` 公开导出符号，供宿主构建自定义槽位 UI 与业务组件，视觉随语义令牌皮肤；各子路径均含 types/import/require 条件），以及 `./styles.css` 样式导出（sideEffects 标记）与 `./theme-bridge.css` 样式片段出口（`@theme inline` 语义令牌桥的全仓单一定义，供 chat / blocks / chart 样式源在编译期 @import 内联，见 unified-styles-entry）。主入口与 `/components` MUST NOT 再导出 chat 展示组件（ChatPage/Bubble/Composer 等 18 个）；这些组件由 `@pactor-app/chat/components` 提供。

#### Scenario: 子路径导入

- **WHEN** 以 `@pactor-app/ui/components` 导入 createComponentRegistry、以 `@pactor-app/ui/interaction` 导入 OverlayManager、以 `@pactor-app/ui/layout` 导入 resolveLayout、以 `@pactor-app/ui/ui` 导入 Button 等原语组件
- **THEN** 均可正常导入使用

#### Scenario: 桥接片段出口

- **WHEN** 域包样式源以 `@import '@pactor-app/ui/theme-bridge.css'` 引用并执行 Tailwind 编译
- **THEN** 桥接映射内联进各域包产物，工具类（bg-background 等）可用

#### Scenario: chat 组件不再从 ui 导出

- **WHEN** 检索 `@pactor-app/ui` 主入口与 `/components` 的导出符号
- **THEN** 不含 ChatPage、Bubble、Composer、MessageList 等 18 个 chat 展示组件

### Requirement: 依赖方改接

@pactor-app/app MUST 依赖 `@pactor-app/ui` 并从中导入全部 UI 符号；@pactor-app/chat 的测试依赖为 `@pactor-app/ui`；examples 与 CLI 模板统一 `import 'pactor-app/styles.css'`（聚合单入口，见 unified-styles-entry；按需场景可引用各域包分表）；全仓 MUST NOT 存在 `from 'antd'`、`pactor-ui-antd`、`pactor-ui-radix` 引用（依赖清单与源码）。

#### Scenario: 无遗留引用

- **WHEN** 全仓 grep `pactor-ui-antd|pactor-ui-radix|from 'antd'`
- **THEN** 源码与 package.json 中均无匹配

#### Scenario: 模板单入口

- **WHEN** 查看 examples 与 CLI 模板的样式 import
- **THEN** pactor 相关样式仅经 `pactor-app/styles.css` 单次引入

### Requirement: 组件样式全令牌化

`@pactor-app/ui` 的全部组件样式（`src/ui/`、`src/components/`、`src/layout/`）SHALL 通过语义令牌或组件级令牌（`var()` 引用）解析颜色、阴影与圆角，MUST NOT 存在硬编码颜色值（oklch/rgba/十六进制）或 Tailwind 静态色工具类（如 `bg-gray-*`、`text-white`），使外部皮肤 CSS 可完整接管视觉；默认令牌值 SHALL 保持与现状视觉一致。

#### Scenario: 无硬编码颜色

- **WHEN** 对 `packages/ui/src` 检索硬编码颜色（oklch/rgba/十六进制色值、Tailwind 静态色类）
- **THEN** 除 `styles.css` 令牌定义本身外，组件源码中无匹配

#### Scenario: 默认视觉不回归

- **WHEN** 不加载任何皮肤 CSS 渲染组件
- **THEN** 各组件视觉与令牌化改造前一致

