## ADDED Requirements

### Requirement: 组件样式全令牌化

`@pactor-app/ui` 的全部组件样式（`src/ui/`、`src/components/`、`src/layout/`）SHALL 通过语义令牌或组件级令牌（`var()` 引用）解析颜色、阴影与圆角，MUST NOT 存在硬编码颜色值（oklch/rgba/十六进制）或 Tailwind 静态色工具类（如 `bg-gray-*`、`text-white`），使外部皮肤 CSS 可完整接管视觉；默认令牌值 SHALL 保持与现状视觉一致。

#### Scenario: 无硬编码颜色

- **WHEN** 对 `packages/ui/src` 检索硬编码颜色（oklch/rgba/十六进制色值、Tailwind 静态色类）
- **THEN** 除 `styles.css` 令牌定义本身外，组件源码中无匹配

#### Scenario: 默认视觉不回归

- **WHEN** 不加载任何皮肤 CSS 渲染组件
- **THEN** 各组件视觉与令牌化改造前一致
