## Why

`Card` 的圆角尺寸在 vendored 原语中硬编码为 `rounded-xl`，业务无法按页面风格调整（如紧凑后台用更小圆角、营销页用更大圆角）。

## What Changes

- vendored `ui/card.tsx` 的 `Card` 新增 `rounded` prop：`'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'`，缺省 `'lg'`（即 `--radius` 基准值，随皮肤令牌缩放）
- DSL 适配器 `components/Card` 同步暴露 `rounded` prop 并透传

## Capabilities

### New Capabilities
（无）

### Modified Capabilities
- `builtin-components`: 「展示与布局组件」需求中 Card 的 props 清单新增 `rounded`

## Impact

- `packages/ui`:`src/ui/card.tsx`、`src/components/components/Card/index.tsx`；测试与文档（`docs/src/content/docs/components/layout.md` Card 小节）
- 无破坏性结构变更；默认圆角从固定 `rounded-xl` 调整为 `rounded-lg`（= `--radius` 基准，0.625rem），卡片圆角随皮肤令牌变化
