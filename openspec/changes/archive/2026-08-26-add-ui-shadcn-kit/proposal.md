# Proposal: add-ui-shadcn-kit

## Why

用户希望以 shadcn/ui（Radix Primitives + Tailwind 风格、源码自有、设计现代）作为 pactor 的默认 UI 组件库。仓库现有 `pactor-ui-antd` 与 `pactor-ui-radix` 两套实现、默认 Radix；新增 `packages/ui`（`pactor-ui`）作为基于 shadcn 的第三套实现并提升为默认，可借助 shadcn 生态的组件丰富度与社区熟悉度，同时保持 kit 槽位架构不变。

## What Changes

- **新增 `packages/ui`（npm `pactor-ui`）**：shadcn 风格 UI kit——vendored shadcn 组件源码（Radix Primitives + cva + tailwind-merge + lucide-react），Tailwind 在**构建期**编译为预建 `styles.css`（消费方只 import CSS，无需自身配置 Tailwind）。
- **实现 DSL 组件契约**：与两既有 kit 相同的 12 个类型名（Page/Grid/Flex/Card/Button/Alert/Statistic/Tabs/Table/Form/Input/Select）与 props 契约（类型 type-only 复用 `pactor-ui-antd/components`，同 ui-radix 先例）；4 个布局（admin/blank/login/landing）；交互层（Provider/OverlayHost，运行时复用 `pactor-ui-antd/interaction` 的 OverlayManager 核心）。
- **`shadcnUiKit` 预设**：三槽位预设对象 + 主子路径入口（`/components`、`/interaction`、`/layout`、`/styles.css`），结构与两既有 kit 同构。
- **提升为默认**：`createPactorApplication` 的 componentRegistry / layoutRegistry / interactionKit 三处缺省回退从 Radix 改为 shadcn 实现；`ui: antdUiKit` / `radixUiKit` 仍可显式切换。
- **主题契约**：shadcn 语义令牌（`--background`/`--foreground`/`--primary` 等）挂在 `.pcr-*` / `[data-pactor-theme='dark']` 约定下，暗色切换方式与全仓一致。
- **示例与模板**：examples/admin、examples/vite-starter、CLI 模板的默认样式导入切换到 `pactor-ui/styles.css`。

明确**不在本次范围**：删除或改动 `pactor-ui-antd` / `pactor-ui-radix`（两者保留为可选 kit）；shadcn 全部 50+ 组件（V1 只做契约要求的 12 组件 + 布局/交互所需底层件）。

## Capabilities

### New Capabilities
- `ui-kit-shadcn-preset`: `pactor-ui` 包——shadcn 实现的 12 组件契约、布局、交互层、预设对象与预建样式。

### Modified Capabilities
- `ui-package-structure`: ui-* 单元从两个扩展为三个（新增 pactor-ui）；pactor-app 默认实现依赖改为 pactor-ui。
- `ui-kit-selection`: componentRegistry 缺省从 Radix 改为 shadcn。
- `shell-ui-kit-selection`: layoutRegistry / interactionKit 缺省从 Radix 改为 shadcn。

## Impact

- **代码**：新增 `packages/ui`；`packages/app/src/application.ts` 三处默认回退；examples/admin、examples/vite-starter、packages/cli 模板引导代码。
- **依赖**：`packages/ui` 新增 tailwindcss（dev/build）、class-variance-authority、clsx、tailwind-merge、所需 @radix-ui/react-*、lucide-react；`pactor-app` 运行时依赖改接 pactor-ui。
- **风险**：与 `pactor-ui-radix` 定位有重叠（同为 Radix 系）——见 design.md Risks；本变更后 Radix 版降级为显式可选。
