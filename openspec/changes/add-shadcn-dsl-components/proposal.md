# Proposal: add-shadcn-dsl-components

## Why

`@pactor-app/ui` 的 shadcn kit 目前只注册了 20 个 DSL 类型（Page/Grid/Flex/Card/Button/Alert/Statistic/Tabs/Table/Form/Input/Select/Layout 系列/Link/Text），远低于 [shadcn/ui 组件目录](https://ui.shadcn.com/docs/components)（约 50+ 组件）。用 DSL 描述稍复杂的页面（导航、反馈、数据录入、弹层交互）时大量组件无法使用，只能退回少量基础组件拼装，限制了 DSL 的表达能力。

## What Changes

- 扩展 `packages/ui`：为 shadcn/ui 组件目录中的组件补齐 vendored 原语实现（`packages/ui/src/ui/`）与 DSL 适配器（`packages/ui/src/components/`），按框架级 props 协议（与 builtin-components 同一约定）接入 DSL。
- 扩展 `shadcnComponents` 注册表与 `createShadcnComponentRegistry()`，使全部新增组件可在 DSL 中按类型名使用。
- 组件分批纳入，按复杂度分组：
  - **展示类**：Badge、Avatar、Skeleton、Separator、Kbd、Spinner、Empty、AspectRatio、Tooltip、HoverCard、Progress。
  - **导航类**：Breadcrumb、Pagination、Menubar、NavigationMenu、DropdownMenu、ContextMenu。
  - **表单类**：Textarea、Checkbox、RadioGroup、Switch、Slider、Label、Field（form-item 容器）、Calendar、InputOTP、Combobox。
  - **反馈与弹层类**：Dialog、AlertDialog、Drawer、Sheet、Popover、Sonner（toast）、Accordion、Collapsible。
  - **复杂复合类**：Carousel、Command、Resizable、ScrollArea、Toggle、ToggleGroup、ButtonGroup、InputGroup、Item、Typography。
  - **页面级组合**：Sidebar、DataTable、Chart —— 以受限的框架级 props 形态纳入（不允许暴露底层自由组合 API）。
- 事件值规范化沿用既有约定（onChange 传语义值而非 DOM 事件）；容器类组件经 `renderChildren` 渲染 DSL 子树。
- 更新预建 `styles.css`（Tailwind 构建期覆盖新增组件的工具类与动画关键帧）。
- **BREAKING（spec 层）**：`ui-kit-shadcn-preset` 中"三个 kit 注册表同构"的要求不再成立 —— shadcn 注册表成为 builtin 集合的超集，契约断言改为"包含全部 builtin 类型名 + 新增扩展类型名"。

## Capabilities

### New Capabilities

- `shadcn-extended-components`: shadcn/ui 组件目录中新增 DSL 组件的目录、props 契约、事件值语义与容器 children 渲染约定（分展示/导航/表单/反馈弹层/复合/页面级组合六组）。

### Modified Capabilities

- `ui-kit-shadcn-preset`: 修改"组件契约实现"要求 —— 注册表不再与既有 kit 完全同构，而是 builtin 12 类型契约保持一致 + 注册扩展组件集；契约测试断言方向从"相等"改为"超集且 12 类型行为一致"。

## Impact

- **代码**：`packages/ui/src/ui/`（新增 vendored 原语）、`packages/ui/src/components/`（新增适配器）、`packages/ui/src/components/register.ts`、`packages/ui/src/index.ts` 导出、`packages/ui/src/styles.css` 源样式与构建产物。
- **依赖**：可能新增运行时依赖（如 embla-carousel-react、react-day-picker、cmdk、sonner、input-otp、react-resizable-panels、vaul、recharts 等），仍需遵守 MUST NOT 依赖 `@radix-ui/react-*` 与 antd 的约束。
- **测试**：`packages/ui/tests/components/` 新增组件契约测试与注册表契约测试调整。
- **文档/示例**：docs 站组件文档、examples 中补充 DSL 示例。
