# Spec: ui-kit-shadcn-preset

## ADDED Requirements

### Requirement: pactor-ui 包结构

SHALL 新增 `packages/ui`（npm 名 `pactor-ui`）：shadcn 风格（vendored 组件源码 + Radix Primitives + cva + tailwind-merge + lucide-react）UI kit，包含 components / interaction / layout 三层；提供主入口（导出三层公开 API + `shadcnUiKit` 预设）与子路径入口 `/components`、`/interaction`、`/layout`（各含 types/import/require 条件），以及 `./styles.css` 预建样式导出（`sideEffects` 标记）。MUST NOT 依赖 antd。

#### Scenario: 子路径导入

- **WHEN** 以 `pactor-ui/components`、`pactor-ui/interaction`、`pactor-ui/layout` 分别导入注册表工厂、交互核心、布局
- **THEN** 均可正常导入使用

#### Scenario: 无 antd 引用

- **WHEN** 检查 pactor-ui 构建产物
- **THEN** 不含 `from 'antd'` 引用

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

SHALL 导出 `shadcnUiKit` 预设对象：`{ componentRegistry: createShadcnComponentRegistry, layoutRegistry: createShadcnLayoutRegistry, interactionKit: { Provider: ShadcnInteractionProvider, OverlayHost: ShadcnOverlayHost } }`，与 pactor-app 的 `UiKit` 类型兼容。

#### Scenario: 预设可用

- **WHEN** 以 `ui: shadcnUiKit` 启动 createPactorApplication
- **THEN** 三个槽位均为 shadcn 实现

### Requirement: 预建样式与主题

Tailwind SHALL 仅在包构建期运行：入口样式（含 shadcn 语义令牌 `--background/--foreground/--primary/--muted/--accent/--destructive/--border/--ring` 等）编译为预建 `styles.css` 随包发布，消费方 MUST NOT 需要自身 Tailwind 配置。暗色主题 SHALL 经 `[data-pactor-theme='dark']` 属性切换（与全仓约定一致）。Tailwind preflight MUST NOT 影响宿主全局样式（关闭或作用域限定）。

#### Scenario: 零配置消费

- **WHEN** 消费方仅 `import 'pactor-ui/styles.css'` 后渲染 DSL 页面
- **THEN** 组件样式完整，宿主全局样式不受影响

#### Scenario: 暗色切换

- **WHEN** 根元素设置 `data-pactor-theme="dark"`
- **THEN** 组件呈现暗色皮肤
