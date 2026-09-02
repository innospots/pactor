# Spec: ui-kit-shadcn-preset

`@pactor-app/ui` 包（packages/ui）：shadcn 实现的 12 组件契约、布局、交互层、预设对象与预建样式。

### Requirement: @pactor-app/ui 包结构

SHALL 存在 `packages/ui`（npm 名 `@pactor-app/ui`）：shadcn 风格（vendored 组件源码 + Base UI 原语（`@base-ui/react`）+ cva + tailwind-merge + lucide-react）UI kit，包含 components / interaction / layout 三层；提供主入口（导出三层公开 API + `shadcnUiKit` 预设）与子路径入口 `/components`、`/interaction`、`/layout`（各含 types/import/require 条件），以及 `./styles.css` 预建样式导出（`sideEffects` 标记）。MUST NOT 依赖 antd；MUST NOT 依赖 `@radix-ui/react-*`。

#### Scenario: 子路径导入

- **WHEN** 以 `@pactor-app/ui/components`、`@pactor-app/ui/interaction`、`@pactor-app/ui/layout` 分别导入注册表工厂、交互核心、布局
- **THEN** 均可正常导入使用

#### Scenario: 无 antd / radix 引用

- **WHEN** 检查 @pactor-app/ui 构建产物与依赖清单
- **THEN** 不含 `from 'antd'` 与 `@radix-ui/` 引用

### Requirement: 组件契约实现

`createShadcnComponentRegistry()` SHALL 注册与两既有 kit 完全一致的 12 个 DSL 类型名（Page/Grid/Flex/Card/Button/Alert/Statistic/Tabs/Table/Form/Input/Select）与 props 契约（契约类型 type-only 复用 `pactor-ui-antd/components`），事件值语义一致（Input.onChange → string、Select.onChange → value、Form.onSubmit → values 且写入 form 作用域、Table cell 经 renderChildren 带 row/rowIndex 作用域等）。契约测试 SHALL 断言 `createShadcnComponentRegistry().list()` 与 `createBuiltinComponentRegistry().list()`（及 Radix 版）相等。

#### Scenario: 注册表同构

- **WHEN** 对比三个 kit 注册表的 list()
- **THEN** 三者类型名集合完全相等

#### Scenario: 表单语义一致

- **WHEN** DSL 渲染 Form + Input（含 required rules）并提交
- **THEN** 校验拦截、onSubmit 携带 values、form 作用域写入与既有 kit 行为一致

### Requirement: 布局与交互层

SHALL 提供 `createRadixLayoutRegistry` 同构的 `createShadcnLayoutRegistry()`（注册 admin/blank/login/landing，`resolveLayout` 未命中回退 blank）与交互对 `ShadcnInteractionProvider` / `ShadcnOverlayHost`（props 类型复用 `InteractionProviderProps` / `OverlayHostProps`；OverlayManager 等交互核心运行时复用 `pactor-ui-antd/interaction`）。

#### Scenario: 布局注册与回退

- **WHEN** 注册后 resolveLayout('admin') 与 resolveLayout('未知类型')
- **THEN** 前者命中 shadcn Admin 布局，后者回退 blank 布局

#### Scenario: overlay 链路

- **WHEN** 经 OverlayHost 打开 modal overlay 并取消
- **THEN** overlay 以 shadcn Dialog 渲染，取消以 `{ success: false }` 收尾

### Requirement: 预设对象

SHALL 导出 `shadcnUiKit` 预设对象：`{ componentRegistry: createShadcnComponentRegistry, layoutRegistry: createShadcnLayoutRegistry, interactionKit: { Provider: ShadcnInteractionProvider, OverlayHost: ShadcnOverlayHost } }`，与 @pactor-app/app 的 `UiKit` 类型兼容。

#### Scenario: 预设可用

- **WHEN** 以 `ui: shadcnUiKit` 启动 createPactorApplication
- **THEN** 三个槽位均为 shadcn 实现

### Requirement: 预建样式与主题

Tailwind SHALL 仅在包构建期运行：入口样式（完整 `@import 'tailwindcss'`，含 preflight）编译为预建 `styles.css` 随包发布，消费方 MUST NOT 需要自身 Tailwind 配置。主题 SHALL 对齐 shadcn 官方默认主题脚手架：语义令牌（`--background/--foreground/--card/--popover/--primary/--secondary/--muted/--accent/--destructive/--border/--input/--ring` 及 `-foreground` 配对，另含 `chart-1..5` 与 `sidebar` 系列）定义于 `:root`，暗色覆盖 SHALL 经 `[data-pactor-theme='dark']` 属性切换（全仓约定，不用官方 `.dark` class）；radius 派生 SHALL 为基于 `--radius` 的乘法比例（sm 0.6 / md 0.8 / lg 基准 / xl 1.4 / 2xl 1.8 / 3xl 2.2 / 4xl 2.6）；`@theme inline` SHALL 将全部语义令牌桥接为 Tailwind 工具类。样式表 SHALL 含官方 base layer（`* { border-border outline-ring/50 }`、`body { bg-background text-foreground }`）与动画层（tw-animate-css 及 accordion 关键帧），使弹层/折叠组件具备进退场动画。preflight SHALL 开启（与 shadcn 官方应用基线一致）；导入 `styles.css` 即接受该基线全局样式。

#### Scenario: 零配置消费

- **WHEN** 消费方仅 `import '@pactor-app/ui/styles.css'` 后渲染 DSL 页面
- **THEN** 组件样式完整（含 preflight 基线：原生 button 无 UA 默认边框、字体为 sans 系统栈）

#### Scenario: 暗色切换

- **WHEN** 根元素设置 `data-pactor-theme="dark"`
- **THEN** 组件呈现暗色皮肤

#### Scenario: 弹层进退场动画

- **WHEN** 打开 Dialog 或 Select 弹层
- **THEN** `animate-in` / `fade-in-0` / `zoom-in-95` 等动画工具类在预建样式表中有对应定义
