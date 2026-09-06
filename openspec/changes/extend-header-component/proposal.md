# Proposal: extend-header-component

## Why

`Header` 组件目前是纯语义容器（横向 flex + 下边框），只能经 children 自由拼装。应用头部最常见的五类元素——品牌区（logo/标题）、下拉选择、横向菜单、用户区（头像/用户名/菜单）、国际化切换——每次都要用 Flex + 若干组件手工组合，重复且难以对齐视觉规范。

## What Changes

为 DSL `Header` 组件新增五个可选结构区域 props，全部可选、可与 children 共存：

- **品牌区**：`logo`（图片地址，可含表达式）与 `title`（文本），可单独或同时声明；`brandPosition: 'left' | 'right'`（缺省 left）控制品牌区靠左或靠右。
- **通用下拉**：`dropdown: { label, items: [{ label, value, disabled? }], position?: 'left' | 'right' }`，选中触发 `onDropdownSelect`（传 value）。
- **横向菜单**：`menu: [{ key, label, children? }]`（复用 horizontal Menu 语义），选中触发 `onMenuSelect`（传 key）。
- **用户区**：`user: { name, avatar?, items?: [{ label, value }] }`，渲染头像 + 用户名 + 下拉菜单；`items` 缺省时退化为纯展示（头像+名字，无下拉）；选中触发 `onUserSelect`（传 value）。
- **国际化切换**：`locales: [{ label, value }]`，渲染当前 locale 的下拉切换器，切换触发 `onLocaleChange`（传 locale 值）；当前语言由 i18n 上下文决定，切换后的生效由应用层接线（DSL 事件 → setState → Provider locale）。

区域排布规则：左区 = 品牌（brandPosition 为 left 时）+ dropdown（position 为 left 时）+ menu；右区 = dropdown（right 时）+ 品牌（right 时）+ locales + user，中间以弹性空间分隔。children 仍渲染（置于左右区之间的弹性区）。

- **BREAKING（spec 层）**：`layout-components` 中"Header/Content/Footer MUST NOT 内置导航、品牌或业务逻辑"的要求对 Header 放宽 —— Header 变为"语义容器 + 可选结构区域"（Content/Footer 保持纯容器不变）。

## Capabilities

### New Capabilities

（无 —— 变更落在既有能力 layout-components 内）

### Modified Capabilities

- `layout-components`: 修改 "Header / Content / Footer 语义容器" requirement —— Header 放宽为可携带可选结构区域（品牌/下拉/菜单/用户区/国际化切换），Content 与 Footer 维持纯容器约束；新增 Header 结构区域的 props 与事件契约。

## Impact

- **代码**：`packages/ui/src/components/components/Header/index.tsx`（适配器扩展，内部复用既有 Menu / DropdownMenu / Avatar 能力）；样式沿用已有工具类，无新依赖。
- **测试**：`packages/ui/tests/components/` 新增 Header 结构区域契约测试（渲染位置、事件值、通用 props、与 children 共存）。
- **文档**：`docs/src/content/docs/components/layout.md` 的 Header 小节扩充。
- **兼容性**：纯增量 props，既有仅传 children 的用法不受影响。
