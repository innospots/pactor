# Delta: ui-kit-shadcn-preset

## MODIFIED Requirements

### Requirement: pactor-ui 包结构

SHALL 存在 `packages/ui`（npm 名 `pactor-ui`）：shadcn 风格（vendored 组件源码 + Base UI 原语（`@base-ui/react`）+ cva + tailwind-merge + lucide-react）UI kit，包含 components / interaction / layout 三层；提供主入口（导出三层公开 API + `shadcnUiKit` 预设）与子路径入口 `/components`、`/interaction`、`/layout`（各含 types/import/require 条件），以及 `./styles.css` 预建样式导出（`sideEffects` 标记）。MUST NOT 依赖 antd；MUST NOT 依赖 `@radix-ui/react-*`。

#### Scenario: 子路径导入

- **WHEN** 以 `pactor-ui/components`、`pactor-ui/interaction`、`pactor-ui/layout` 分别导入注册表工厂、交互核心、布局
- **THEN** 均可正常导入使用

#### Scenario: 无 antd / radix 引用

- **WHEN** 检查 pactor-ui 构建产物与依赖清单
- **THEN** 不含 `from 'antd'` 与 `@radix-ui/` 引用
