# Delta: ui-package-structure

## MODIFIED Requirements

### Requirement: 主子路径入口

`pactor-ui` SHALL 提供主入口（导出三层全部公开 API + `shadcnUiKit` 预设）与子路径入口：`/components`、`/interaction`、`/layout`、`/ui`（vendored shadcn 原语组件——Button/Input/Card/Dialog/Popover/Select 等 `src/ui/` 公开导出符号，供宿主构建自定义槽位 UI 与业务组件，视觉随语义令牌皮肤；各子路径均含 types/import/require 条件），以及 `./styles.css` 样式导出（sideEffects 标记）。

#### Scenario: 子路径导入

- **WHEN** 以 `pactor-ui/components` 导入 createShadcnComponentRegistry、以 `pactor-ui/interaction` 导入 OverlayManager、以 `pactor-ui/layout` 导入 resolveLayout、以 `pactor-ui/ui` 导入 Button 等原语组件
- **THEN** 均可正常导入使用
