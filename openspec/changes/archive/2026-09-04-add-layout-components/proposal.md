# Proposal: add-layout-components

## Why

当前页面布局是**应用外壳层的独立概念**（LayoutRegistry 按 bootstrap `layout.type` 解析 admin/blank/login/landing 四种整体布局），页面 DSL 无法声明自己的布局结构。业务想要「左侧导航 Sider + 顶部 Header + 中间 Content 自由组合」的页面（如：无 Sider 的沉浸式工作台、双栏工具页、嵌套布局）时，只能新增一整个布局类型，DSL 表达能力受限。把布局下沉为**普通视图组件**后，页面可以像搭积木一样在 DSL 里自由组合布局结构，「一切都是组件」。

## What Changes

- `@pactor-app/ui` 组件层新增 4 个布局组件：`Layout`（ flex 容器，按子内容自动横/纵向）、`Header`（顶部区域）、`Sider`（侧边区域，可折叠）、`Content`（主内容区）、`Footer`（底部区域），均可单独使用或自由嵌套组合
- 新增 `Menu` 导航菜单组件：可在 `Sider`（inline 模式）或 `Header`（horizontal 模式）中引用，`items` 经表达式注入，`selectedKey` 受控 + `onSelect` 事件（通常接 `navigate` 动作）
- 布局组件与普通组件同权：支持通用 props（`className` / `style` / `permission` / `when` / `events`）、`children` DSL 子树、页面级 `components` + `Fragment` 复用
- DSL 页面可以在 `body` 中直接声明布局结构，替代或包裹现有「页面在整体布局内渲染」的外壳模式
- 现有 LayoutRegistry / bootstrap `layout.type` 外壳机制**保持不变**（向后兼容）：DSL 布局组件是页面内的能力，与应用外壳布局正交

## Capabilities

### New Capabilities

- `layout-components`: DSL 布局组件（Layout / Header / Sider / Content / Footer）与导航菜单组件（Menu）的 props 契约、组合规则与渲染语义

### Modified Capabilities

- `builtin-components`: 内置组件目录从 12 个扩展为 16 个（+Layout / Header / Sider / Content）
- `basic-layouts`: 说明整体布局（LayoutRegistry 外壳）与 DSL 布局组件的关系与选用规则

## Impact

- `packages/ui`：新增 `src/components/components/{Layout,Header,Sider,Content,Footer,Menu}/`，注册进 shadcn 组件表；组件契约类型导出
- `docs/src/content/docs/reference/dsl.md`：组件目录新增 4 节
- `examples/`：可选新增一个自定义布局示例页
- 不涉及破坏性变更；现有页面与应用外壳布局行为不变
