---
title: "@pactor-app/ui"
description: 唯一内置 UI kit（shadcn）——vendored shadcn/ui 组件源码（Base UI 原语 + cva + tailwind-merge + lucide-react），自持 components / interaction / layout 三层（props 契约类型、OverlayManager / createUiBridge 交互核心、布局类型与 resolveLayout 均在本包），shadcnUiKit 预设 + 构建期 Tailwind 预编译样式表；@pactor-app/app 的内置默认
---

`@pactor-app/ui` 是 Pactor 的**唯一内置 UI kit**（shadcn 风格）：组件源码 vendor 进包内（`src/ui/`，标准 shadcn 形态——Base UI 原语（`@base-ui/react`，shadcn 2026-07 起的官方默认原语层）+ cva 变体 + `cn()`），其上是 components / interaction / layout 三层实现。12 个组件 props 契约类型、交互核心（`OverlayManager` / `createUiBridge` / `registerInteractionActions` / `UiBridge`）与布局类型、`resolveLayout` 均为本包自有定义并导出。

- 三层实现基于 vendored shadcn 组件（Base UI 版）：`Select` / `Tabs` / modal / 菜单组折叠基于 `@base-ui/react` 的 Select / Tabs / Dialog / Accordion 原语；Form 为去原语化实现（原生 form/label + useId 关联，校验与受控状态自管）；
- **不依赖 antd**（源码与构建产物均无 `from 'antd'` 引用）；
- **消费方无需 Tailwind**：Tailwind v4 仅在包构建期运行，产出预建 `styles.css`。

```bash
pnpm add @pactor-app/ui @pactor-app/app react react-dom react-router-dom
```

`react >= 18`、`react-dom >= 18` 为 peer dependency。

## 包结构与子路径入口

| 入口 | 内容 |
| --- | --- |
| `@pactor-app/ui` | 三层全部导出 + `shadcnUiKit` |
| `@pactor-app/ui/components` | 组件层：12 组件与 props 契约类型 + `createShadcnComponentRegistry` 等 |
| `@pactor-app/ui/interaction` | 交互层：`OverlayManager` / `createUiBridge` / `registerInteractionActions` / `UiBridge` + `ShadcnInteractionProvider` / `ShadcnOverlayHost` |
| `@pactor-app/ui/layout` | 布局层：布局 props 类型 + `resolveLayout` + `ShadcnAdminLayout` 等 / `createShadcnLayoutRegistry` |
| `@pactor-app/ui/ui` | vendored shadcn 原语组件（Button / Input / Card / Dialog / Popover / Select 等），供宿主构建自定义槽位 UI 与业务组件，视觉随语义令牌皮肤 |
| `@pactor-app/ui/styles.css` | 预建样式表（Tailwind v4 构建期编译产物，单文件） |

**`/ui` 与 `/components` 的分工**：DSL 编排用 `/components` 的 12 组件适配器（DSL 契约）；宿主自写 React UI（槽位内容、自定义组件）用 `/ui` 原语。注意预建样式表只包含包内源码实际用到的 Tailwind 工具类——自定义 UI 排版优先用原语组件的结构（Card/Flex 布局容器等）与语义令牌，避免依赖未被包内使用过的零散工具类。

## 默认 UI kit

**shadcn（@pactor-app/ui）是 @pactor-app/app 的内置默认且为唯一内置实现**：不传任何 UI 选项时，组件、外壳布局、弹层与消息链路全部使用本包实现。

:::caution[样式表必须导入]
组件 class 为 Tailwind 工具类，无论是否显式传 `ui`，**都必须导入预建样式表**，否则界面无样式：

```ts
import '@pactor-app/ui/styles.css';
```
:::

```ts
import { createPactorApplication } from '@pactor-app/app';
import '@pactor-app/ui/styles.css';

createPactorApplication({
  appId: 'risk-admin',
  api: { baseURL: '/api/runtime' },
}).mount('#root');
```

## 自定义 UI kit（覆盖点保留）

`createPactorApplication` 的 `componentRegistry` / `layoutRegistry` / `interactionKit` 细粒度选项与 `ui` 预设槽位**仍然保留**：业务可注册自定义组件 / 布局 / 交互层实现（整体替换或逐槽位覆盖）。每个槽位独立合并，优先级为：**显式细粒度选项 > `ui` 预设 > 内置 shadcn 默认**。

## 预设对象 shadcnUiKit

`shadcnUiKit` 一次提供三个槽位（显式表达或局部覆盖场景使用）：

| 槽位 | 值 | 来源层 |
| --- | --- | --- |
| `componentRegistry` | `createShadcnComponentRegistry` | components |
| `layoutRegistry` | `createShadcnLayoutRegistry` | layout |
| `interactionKit` | `{ Provider: ShadcnInteractionProvider, OverlayHost: ShadcnOverlayHost }` | interaction |

## 样式表与主题

样式源文件（`src/styles.css`）经 Tailwind v4 CLI 在**包构建期**编译为包根 `styles.css`（内容扫描包内源码，只含用到的工具类）：

```ts
import '@pactor-app/ui/styles.css';
```

- **主题令牌**：shadcn 语义变量（`--background` / `--foreground` / `--card` / `--popover` / `--primary` / `--secondary` / `--muted` / `--accent` / `--destructive` / `--border` / `--input` / `--ring` / `--radius`，另补充 `--success` / `--warning` / `--info` 供 Alert 四态）定义在 `:root`，经 `@theme inline` 桥接为 `bg-primary` / `text-muted-foreground` 等工具类——工具类运行时读 `var()`，**覆盖变量即换肤，无需重新构建**；
- **暗色皮肤**：`<html data-pactor-theme="dark">`（可挂任意容器），与全仓约定一致；
- **preflight 开启（shadcn 官方基线）**：完整 `tailwindcss`（含 preflight）+ `tw-animate-css` 动画层 + 官方 base layer，与 [shadcn 官方主题脚手架](https://ui.shadcn.com/docs/theming)一致；导入 `styles.css` 即接受基线全局样式，宿主皮肤 CSS 须在其后导入；
- 结构钩子为 `data-slot` 属性（如 `[data-slot=admin-layout]` / `[data-slot=button]` / `[data-slot=toast]`），供结构性覆盖与测试定位。

换肤参考实现见 `examples/admin/src/theme.css`（token 覆盖 / data-slot 结构覆盖 / 主色预设）。

## components 层

12 个 DSL 组件的 shadcn 实现，props 契约类型由本包定义并导出：

| 维度 | 说明 |
| --- | --- |
| 类型名集合 | Page / Grid / Flex / Card / Button / Alert / Statistic / Tabs / Form / Input / Select / Table |
| props 类型 | 本包 `@pactor-app/ui/components` 自有定义（`ButtonProps` / `TableProps` 等） |
| 事件值语义 | `Input.onChange` 传 string、`Select.onChange` 传选中 value（JSON 编码保留 number/boolean 类型）、`Form.onSubmit` 传 values、`Button.onClick` 触发 |
| Form 协同 | Context 下发；Form 内声明 `name` 的 Input/Select 自动成为表单项（label + `rules.required/message`）；校验失败阻止提交并展示错误；提交成功写 runtime state 的 `form` 路径（`${form.<field>}` 可用） |
| Table 行模板 | `cell` 经 renderChildren 注入 `{ row, rowIndex }`；分页仅支持 `pageSize` |

在上述 12 个内置组件之外，组件层还注册了 shadcn 组件目录的 49 个扩展组件（如 Badge / Dialog / DataTable / Chart / Icon），全部 69 个组件按布局 / 展示 / 表单 / 数据 / 导航 / 反馈弹层 / 复合七类分页展示，逐组件 props 契约与 DSL 示例见[组件参考](/components/)。

## interaction 层

交互核心为零 React 的 `OverlayManager`（overlay 堆栈与 Promise 模型）+ `createUiBridge` / `registerInteractionActions`（`overlay.open` / `overlay.close` / `confirm` / `message` 动作注册）。

React 渲染层为 `ShadcnOverlayHost` 与 `ShadcnInteractionProvider`：modal / confirm 基于 vendored shadcn Dialog（`@base-ui/react` Dialog）；drawer 为自绘固定右侧面板；toast 为 shadcn 风格消息栈（固定右上角，类型色条读语义令牌，约 3s 自动消失）。取消语义（X / 遮罩 / Escape → resolve `{ success: false }`）、content 作用域（`{ params, parent }`）、page overlay（`resolvePage` + 子 PageRuntime）。

## layout 层

`ShadcnAdminLayout` 与 shadcn 版 Blank / Login / Landing 外壳：区域开关（`header` / `sidebar` 缺省开，`tabs` / `breadcrumb` / `footer` 缺省关）、`mode`（top-side / top-bottom / side-full / two-column）、`fixedHeader` / `fixedSider`（缺省 true）、`collapsible` / `collapsed` / `breakpoint` 响应式收起、访问页签（去重 / 点击导航 / 关闭当前回退最后一个 / 首页不可关）、breadcrumb 菜单链、权限过滤与 `activeMenu` 高亮。注册表类型名为 admin / blank / login / landing，未知类型经 `resolveLayout` 回退 BlankLayout 并告警。

## 聚合 re-export

三层公开 API 与预设均可直接从主入口导入：

```ts
import {
  createShadcnComponentRegistry,
  createShadcnLayoutRegistry,
  ShadcnInteractionProvider,
  ShadcnOverlayHost,
  OverlayManager,
  shadcnUiKit,
  // ...以及三层其余全部导出
} from '@pactor-app/ui';
```
