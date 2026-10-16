# Delta: ui-package-structure

## MODIFIED Requirements

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
